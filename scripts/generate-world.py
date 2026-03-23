import json
from datetime import datetime

with open("tmp-data/world.json","r",encoding="utf-8") as f:
    raw = json.load(f)

zones = []
for z in (raw if isinstance(raw, list) else []):
    zid = z.get("Id") or z.get("UniqueName","")
    if not zid: continue
    zones.append({
        "id": zid,
        "name": z.get("DisplayName") or zid,
        "type": z.get("Type",""),
        "color": z.get("ReputationAreaType") or z.get("ZoneColor",""),
        "exits": [e.get("TargetZoneId","") for e in (z.get("Exits") or []) if e.get("TargetZoneId")],
    })

out = f"// AoT-PNASF World Data — {datetime.utcnow().isoformat()} — {len(zones)} zone\n"
out += "window.AO_ZONES = " + json.dumps(zones, ensure_ascii=False) + ";\n"

with open("src/data/world-data.js","w",encoding="utf-8") as f:
    f.write(out)
print(f"world-data.js yazildi: {len(zones)} zone")
