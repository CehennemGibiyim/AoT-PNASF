#!/usr/bin/env node
'use strict';

/**
 * js/ ve lib/ klasik (global) betiklerini ES modülü TypeScript dosyalarına dönüştürür.
 *
 *  1. js/*.js ve lib/*.js dosyalarını AST ile analiz eder, üst düzey bildirimleri toplar.
 *  2. Üst düzey `const` bildirimlerini `let` yapar (window erişimi yazılabilir olsun diye).
 *  3. Dosyanın sonuna ekler:
 *       - declare global { var <ad>: any } -> çapraz dosya tip erişimi
 *       - window getter/setter             -> klasik global davranışın korunması
 *       - export {}                        -> dosyanın modül olmasını garantiler
 *  4. Dosyayı .ts olarak yeniden adlandırır.
 *  5. HTML'deki <script src="js/...|lib/..."> etiketlerini type="module" + .ts yapar.
 *      data/*.js dosyaları bilinçli olarak klasik kalır (oyun verisi).
 *
 * İkinci kez çalıştırıldığında daha dönüştürülmüş dosyaları atlar (idempotent).
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['js', 'lib'];

const converted = [];
const warnings = [];
const globalNames = new Set();

function collectBindingNames(node, out) {
  if (ts.isIdentifier(node)) {
    out.push(node.text);
  } else if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
    for (const element of node.elements) {
      if (ts.isBindingElement(element)) collectBindingNames(element.name, out);
    }
  }
}

function convertFile(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  const source = fs.readFileSync(absolute, 'utf8');
  const sf = ts.createSourceFile(absolute, source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);

  const decls = [];
  const constToLet = [];
  const seen = new Set();
  const add = (name, kind) => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    decls.push({ name, kind });
    globalNames.add(name);
  };

  for (const statement of sf.statements) {
    switch (statement.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
        add(statement.name && statement.name.text, 'function');
        break;
      case ts.SyntaxKind.ClassDeclaration:
        add(statement.name && statement.name.text, 'class');
        break;
      case ts.SyntaxKind.EnumDeclaration:
        add(statement.name && statement.name.text, 'enum');
        break;
      case ts.SyntaxKind.VariableStatement: {
        const list = statement.declarationList;
        const names = [];
        for (const declaration of list.declarations) collectBindingNames(declaration.name, names);
        const kind = list.flags & ts.NodeFlags.Const
          ? 'const'
          : list.flags & ts.NodeFlags.Let ? 'let' : 'var';
        for (const name of names) add(name, kind);
        if (list.flags & ts.NodeFlags.Const) {
          const start = list.getStart(sf);
          const keyword = source.slice(start, start + 5);
          if (keyword === 'const') constToLet.push({ start, end: start + 5, text: 'let' });
        }
        break;
      }
      case ts.SyntaxKind.ImportDeclaration:
      case ts.SyntaxKind.ExportDeclaration:
        warnings.push(`${relativePath}: dosyada zaten import/export ifadesi var`);
        break;
      case ts.SyntaxKind.InterfaceDeclaration:
      case ts.SyntaxKind.TypeAliasDeclaration:
      case ts.SyntaxKind.ExpressionStatement:
        break;
      default:
        warnings.push(`${relativePath}: beklenmeyen üst düzey ifade -> ${ts.SyntaxKind[statement.kind]}`);
    }
  }

  // const -> let düzeltmelerini sondan başa uygula ki ofsetler kaymasın
  let output = source;
  constToLet
    .sort((a, b) => b.start - a.start)
    .forEach((edit) => {
      output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
    });

  const trailer = [];
  // function/class/enum bildirimlerine doğrudan atama TypeScript tarafından
  // reddedilir; window üzerinden gelen yazımlar ayrı bir saklayıcıda tutulur.
  const overridden = decls.filter(
    (declaration) => declaration.kind === 'function' || declaration.kind === 'class' || declaration.kind === 'enum'
  );

  if (decls.length) {
    trailer.push('// --- Modül dönüşümü: üst düzey semboller window üzerinden paylaşılır ---');
    trailer.push('declare global {');
    for (const declaration of decls) trailer.push(`  var ${declaration.name}: any;`);
    trailer.push('}');
    trailer.push('');
    for (const declaration of overridden) trailer.push(`let ${declaration.name}_windowOverride: any;`);
    if (overridden.length) trailer.push('');
    for (const declaration of decls) {
      trailer.push(`Object.defineProperty(window, '${declaration.name}', {`);
      if (overridden.includes(declaration)) {
        trailer.push(
          `  get: () => (${declaration.name}_windowOverride !== undefined` +
            ` ? ${declaration.name}_windowOverride : ${declaration.name}),`
        );
        trailer.push(`  set: (value) => { ${declaration.name}_windowOverride = value; },`);
      } else {
        trailer.push(`  get: () => ${declaration.name},`);
        trailer.push(`  set: (value) => { ${declaration.name} = value; },`);
      }
      trailer.push('  configurable: true, enumerable: true });');
    }
    trailer.push('');
  }

  trailer.push('export {};');
  output = `${output.replace(/\s*$/, '')}\n\n${trailer.join('\n')}\n`;

  const target = absolute.replace(/\.js$/, '.ts');
  fs.writeFileSync(target, output, 'utf8');
  fs.unlinkSync(absolute);
  converted.push(relativePath);
}

function rewriteHtml(absolute) {
  const before = fs.readFileSync(absolute, 'utf8');
  const after = before.replace(
    /<script\b([^>]*?)\ssrc\s*=\s*(["'])([^"']+)\2([^>]*)>/g,
    (match, pre, quote, src, post) => {
      const clean = src.split('?')[0].split('#')[0];
      if (!clean.endsWith('.js')) return match;
      const normalized = clean.replace(/^\.\.\//, '');
      if (!/^(?:js|lib)\//.test(normalized)) return match;
      const attrs = `${pre} src="${src.replace(/\.js$/, '.ts')}"${post}`;
      if (/\stype\s*=/.test(attrs)) return match;
      return `<script type="module"${attrs}>`;
    }
  );
  if (after !== before) {
    fs.writeFileSync(absolute, after, 'utf8');
    return true;
  }
  return false;
}

function main() {
  for (const directory of DIRS) {
    const absoluteDirectory = path.join(ROOT, directory);
    if (!fs.existsSync(absoluteDirectory)) continue;
    for (const entry of fs.readdirSync(absoluteDirectory).sort()) {
      if (!entry.endsWith('.js')) continue;
      convertFile(path.join(directory, entry));
    }
  }

  const htmlFiles = [
    ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
    ...fs.readdirSync(path.join(ROOT, 'pages')).filter((f) => f.endsWith('.html')).map((f) => path.join('pages', f)),
  ];
  const rewritten = htmlFiles.filter((file) => rewriteHtml(path.join(ROOT, file)));

  console.log(`Dönüştürülen dosya: ${converted.length}`);
  console.log(`Güncellenen HTML: ${rewritten.length}`);
  console.log(`Benzersiz global sembol: ${globalNames.size}`);
  if (warnings.length) {
    console.log('\nUyarılar:');
    for (const warning of warnings) console.log(`  - ${warning}`);
  }
}

main();
