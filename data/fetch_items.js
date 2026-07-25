const fs = require('fs');
const https = require('https');

const URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json';

https.get(URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const items = JSON.parse(data);
        const out = [];

        items.forEach(i => {
            if(!i.UniqueName || i.UniqueName.includes('NONTRADABLE') || i.UniqueName.includes('SKILLBOOK') || i.UniqueName.includes('TRASH')) return;
            
            // Basic filtering
            let cat = 'misc';
            if (i.UniqueName.includes('KNUCKLES')) cat = 'knuckles';
            else if (i.UniqueName.includes('SHAPESHIFTER')) cat = 'shape';
            else if (i.UniqueName.includes('SWORD')) cat = 'sword';
            else if (i.UniqueName.includes('AXE')) cat = 'axe';
            else if (i.UniqueName.includes('MACE')) cat = 'mace';
            else if (i.UniqueName.includes('HAMMER')) cat = 'hammer';
            else if (i.UniqueName.includes('SPEAR')) cat = 'spear';
            else if (i.UniqueName.includes('BOW')) cat = 'bow';
            else if (i.UniqueName.includes('CROSSBOW')) cat = 'bow';
            else if (i.UniqueName.includes('NATURESTAFF')) cat = 'nature';
            else if (i.UniqueName.includes('HOLYSTAFF')) cat = 'holy';
            else if (i.UniqueName.includes('FIRESTAFF')) cat = 'fire';
            else if (i.UniqueName.includes('FROSTSTAFF')) cat = 'frost';
            else if (i.UniqueName.includes('ARCANESTAFF')) cat = 'arcane';
            else if (i.UniqueName.includes('CURSEDSTAFF')) cat = 'curse';
            else if (i.UniqueName.includes('DAGGER')) cat = 'dagger';
            else if (i.UniqueName.includes('QUARTERSTAFF')) cat = 'qstaff';
            else if (i.UniqueName.includes('ARMOR_LEATHER')) cat = 'larmor';
            else if (i.UniqueName.includes('HEAD_LEATHER')) cat = 'lhelmet';
            else if (i.UniqueName.includes('SHOES_LEATHER')) cat = 'lshoes';
            else if (i.UniqueName.includes('ARMOR_PLATE')) cat = 'parmor';
            else if (i.UniqueName.includes('HEAD_PLATE')) cat = 'phelmet';
            else if (i.UniqueName.includes('SHOES_PLATE')) cat = 'pshoes';
            else if (i.UniqueName.includes('ARMOR_CLOTH')) cat = 'carmor';
            else if (i.UniqueName.includes('HEAD_CLOTH')) cat = 'chelmet';
            else if (i.UniqueName.includes('SHOES_CLOTH')) cat = 'cshoes';
            else if (i.UniqueName.includes('BAG') && !i.UniqueName.includes('CABBAGE')) cat = 'bag';
            else if (i.UniqueName.includes('CAPE')) cat = 'cape';
            else if (i.UniqueName.includes('OFF_')) cat = 'offhand';
            else if (i.UniqueName.match(/T\d+_MEAL/)) cat = 'food';
            else if (i.UniqueName.match(/T\d+_POTION/)) cat = 'potion';
            else if (i.UniqueName.match(/T\d+_(PLANKS|METALBAR|CLOTH|LEATHER|STONEBLOCK)/)) cat = 'refined';
            else if (i.UniqueName.match(/T\d+_(WOOD|ORE|FIBER|HIDE|ROCK)/)) cat = 'raw';
            
            // Extract base ID and Tier
            let tierMatches = i.UniqueName.match(/^T(\d+)_/);
            let tier = tierMatches ? parseInt(tierMatches[1]) : 0;
            let baseId = i.UniqueName.replace(/^T\d+_/, '').replace(/@\d+$/, '');

            let localizedEN = i.LocalizedNames ? i.LocalizedNames['EN-US'] : baseId;
            let localizedTR = i.LocalizedNames ? i.LocalizedNames['TR-TR'] || localizedEN : baseId;

            let existing = out.find(x => x.id === baseId);
            if (existing) {
                if (tier > 0 && !existing.tiers.includes(tier)) {
                    existing.tiers.push(tier);
                    existing.tiers.sort();
                }
            } else {
                out.push({
                    id: baseId,
                    en: localizedEN,
                    tr: localizedTR,
                    cat: cat,
                    tiers: tier > 0 ? [tier] : [1,2,3,4,5,6,7,8]
                });
            }
        });

        const outputStr = `// AoT-PNASF Items Data — ${new Date().toISOString()} — ${out.length} eşya\nwindow.AO_ITEMS = ${JSON.stringify(out)};`;
        fs.writeFileSync('c:\\Users\\cerrahi1.doktor\\Downloads\\AoTPNASF-main\\data\\items-data.js', outputStr);
        console.log(`Successfully generated items-data.js with ${out.length} items`);
    });
});
