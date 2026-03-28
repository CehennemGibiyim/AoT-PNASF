import json, re
from datetime import datetime

print("world.json isleniyor...")

with open("tmp-data/world.json", "r", encoding="utf-8") as f:
    raw = json.load(f)

# world.json farkli formatlarda gelebilir
# Format 1: direkt liste
# Format 2: {"zones": [...]}
# Format 3: {"world": {"zones": {"zone": [...]}}}

def extract_zones(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        # Olasi anahtarlar
        for key in ["zones", "Zones", "zone", "Zone", "clusters", "world"]:
            if key in data:
                sub = data[key]
                if isinstance(sub, list):
                    return sub
                if isinstance(sub, dict):
                    return extract_zones(sub)
    return []

zones_raw = extract_zones(raw)
print(f"Ham zone sayisi: {len(zones_raw)}")

# Zone tip renk eslestirme
def get_color(zone):
    uid = (zone.get("@id") or zone.get("Id") or zone.get("UniqueName") or "").upper()
    typ = (zone.get("@type") or zone.get("Type") or "").upper()
    rep = (zone.get("@reputationAreaType") or zone.get("ReputationAreaType") or "").upper()
    col = (zone.get("@zoneColor") or zone.get("ZoneColor") or "").upper()

    combined = uid + typ + rep + col

    if "SAFEAREA" in combined or "STARTINGCITY" in combined: return "SAFEAREA"
    if "BRECILIEN" in combined: return "MIST"
    if "MIST" in combined: return "MIST"
    if "ROAD" in combined or "OPENPVP_YELLOW" in combined: return "ROAD"
    if "BLACK" in combined or "OUTLANDS" in combined: return "BLACK"
    if "RED" in combined or "OPENPVP_RED" in combined: return "RED"
    if "YELLOW" in combined or "OPENPVP_YELLOW" in combined: return "YELLOW"
    if "CITY" in combined: return "SAFEAREA"
    return "DEFAULT"

def get_exits(zone):
    exits = []
    # Farkli exit formatlari
    for key in ["exits", "Exits", "portals", "Portals", "connections"]:
        val = zone.get(key)
        if not val: continue
        if isinstance(val, list):
            for e in val:
                if isinstance(e, dict):
                    eid = e.get("@targetZone") or e.get("TargetZoneId") or e.get("targetZone") or e.get("Id") or ""
                    if eid: exits.append(eid)
                elif isinstance(e, str):
                    exits.append(e)
        elif isinstance(val, dict):
            for e in val.values():
                if isinstance(e, dict):
                    eid = e.get("@targetZone") or e.get("Id") or ""
                    if eid: exits.append(eid)
    return list(set(exits))

zones = []
seen = set()

for z in zones_raw:
    if not isinstance(z, dict): continue
    
    uid = z.get("@id") or z.get("Id") or z.get("UniqueName") or z.get("@uniquename") or ""
    if not uid or uid in seen: continue
    seen.add(uid)

    name = (z.get("@displayname") or z.get("DisplayName") or 
            z.get("@name") or z.get("Name") or uid)
    
    # Turkce karakter temizle (JSON icin)
    color = get_color(z)
    exits = get_exits(z)
    ztype = (z.get("@type") or z.get("Type") or "").upper()
    
    # Avalon Roads icin ozel isaretleme
    is_road   = "ROAD" in uid.upper() or "ROAD" in ztype
    is_avalon = "AVALON" in uid.upper() or "AVALON" in name.upper()
    
    zones.append({
        "id":     uid,
        "name":   name,
        "color":  color,
        "type":   ztype or color,
        "exits":  exits,
        "road":   is_road or is_avalon,
    })

print(f"Islendi: {len(zones)} zone")

# Kategori istatistikleri
cats = {}
for z in zones:
    c = z["color"]
    cats[c] = cats.get(c, 0) + 1
for c, n in sorted(cats.items(), key=lambda x:-x[1]):
    print(f"  {c}: {n}")

out = f"// AoT-PNASF World Data — {datetime.utcnow().isoformat()} — {len(zones)} zone\n"
out += "window.AO_ZONES = " + json.dumps(zones, ensure_ascii=False) + ";\n"

with open("src/data/world-data.js","w",encoding="utf-8") as f:
    f.write(out)
print(f"world-data.js yazildi: {round(len(out)/1024)} KB")
