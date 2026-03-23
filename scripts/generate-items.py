import json, re
from datetime import datetime

print("items.json isleniyor...")
with open("tmp-data/items.json", "r", encoding="utf-8") as f:
    raw = json.load(f)

CAT_MAP = {
    "sword":"sword","axe":"axe","bow":"bow","warbow":"bow","crossbow":"bow",
    "hammer":"hammer","spear":"spear","dagger":"dagger","quarterstaff":"qstaff",
    "mace":"mace","knuckles":"knuckles","shapeshifter":"shape",
    "firestaff":"fire","froststaff":"frost","arcanestaff":"arcane",
    "holystaff":"holy","naturestaff":"nature","cursedstaff":"curse",
    "platearmor":"parmor","plateshoes":"pshoes","platehelmet":"phelmet",
    "leatherarmor":"larmor","leathershoes":"lshoes","leatherhelmet":"lhelmet",
    "clotharmor":"carmor","clothshoes":"cshoes","clothhelmet":"chelmet",
    "bag":"bag","cape":"cape","mount":"mount",
    "meal":"food","fish":"food","potion":"potion",
    "wood":"raw","rock":"raw","hide":"raw","fiber":"raw","ore":"raw",
    "planks":"refined","stoneblock":"refined","leather":"refined",
    "cloth":"refined","metalbar":"refined","journal":"journal",
}

def get_cat(uid):
    u = uid.lower()
    for k,v in CAT_MAP.items():
        if k in u: return v
    return "misc"

SKIP = ["TEST","UNIQUE","QUESTITEM","TOKEN","RANDOMDUNGEON","SILVERBAG","EMOTE_","SKIN_","DECORATION_","FURNITURE_"]

items_list = raw if isinstance(raw, list) else []
uid_set = set(x.get("UniqueName","") or x.get("@uniquename","") for x in items_list)

seen = set()
result = []

for item in items_list:
    u = item.get("UniqueName","") or item.get("@uniquename","")
    if not u: continue
    if any(s in u for s in SKIP): continue
    base = re.sub(r'^T\d_','',u)
    base = re.sub(r'@\d$','',base)
    if base in seen: continue
    seen.add(base)

    names = item.get("LocalizedNames") or {}
    en = names.get("EN-US") or names.get("EN-GB") or ""
    if not en: continue

    tr = names.get("TR-TR") or en
    ru = names.get("RU-RU") or en
    de = names.get("DE-DE") or en
    fr = names.get("FR-FR") or en
    pl = names.get("PL-PL") or en
    pt = names.get("PT-BR") or en
    es = names.get("ES-ES") or en
    kr = names.get("KO-KR") or en

    tiers = [t for t in range(1,9) if f"T{t}_{base}" in uid_set]
    if not tiers:
        m = re.match(r'^T(\d)_', u)
        tiers = [int(m.group(1))] if m else [4]

    result.append({"id":base,"en":en,"tr":tr,"ru":ru,"de":de,"fr":fr,"pl":pl,"pt":pt,"es":es,"kr":kr,"cat":get_cat(base),"tiers":tiers})

print(f"Islendi: {len(result)} esya")

header = f"// AoT-PNASF Items Data — {datetime.utcnow().isoformat()} — {len(result)} esya\n"
body = "window.AO_ITEMS = " + json.dumps(result, ensure_ascii=False) + ";\n"

search_fn = """
window.AO_SEARCH = function(q, opts) {
  opts = opts || {};
  if (!q) return [];
  var ql = q.toLowerCase();
  var lang = localStorage.getItem('aot-lang') || 'tr';
  return window.AO_ITEMS.filter(function(i) {
    var n = (i[lang]||i.en||'').toLowerCase();
    if (!n.includes(ql) && !(i.en||'').toLowerCase().includes(ql) && !i.id.toLowerCase().includes(ql)) return false;
    if (opts.cat && i.cat !== opts.cat) return false;
    if (opts.tier && !i.tiers.includes(Number(opts.tier))) return false;
    return true;
  }).slice(0, opts.limit||20);
};
window.AO_ICON = function(id, tier, enc) {
  return 'https://render.albiononline.com/v1/item/T'+(tier||4)+'_'+id+(enc>0?'@'+enc:'')+'.png';
};
window.AO_NAME = function(id, lang) {
  var l = lang || localStorage.getItem('aot-lang') || 'tr';
  var item = window.AO_ITEMS.find(function(i){return i.id===id;});
  return item ? (item[l]||item.en||id) : id;
};
"""

with open("src/data/items-data.js","w",encoding="utf-8") as f:
    f.write(header + body + search_fn)
print(f"items-data.js yazildi: {round((len(header)+len(body)+len(search_fn))/1024)} KB")
