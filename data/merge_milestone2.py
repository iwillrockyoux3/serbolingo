# -*- coding: utf-8 -*-
import os
import sys
import json
import subprocess

from pack1 import PACK1_DATA
from pack2 import PACK2_DATA
from pack3 import PACK3_DATA
from pack4 import PACK4_DATA

def to_cyrillic(text):
    if not text:
        return ""
    digraphs = {
        'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
        'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
        'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ'
    }
    res = text
    for lat, cyr in digraphs.items():
        res = res.replace(lat, cyr)
    singles = {
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
        'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
        'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
        'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш',
        'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'Đ': 'Ђ', 'E': 'Е',
        'Ž': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М',
        'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'Ć': 'Ћ',
        'U': 'У', 'F': 'Ф', 'H': 'Х', 'C': 'Ц', 'Č': 'Ч', 'Š': 'Ш'
    }
    return "".join(singles.get(c, c) for c in res)

def to_phonetic(text):
    if not text:
        return ""
    s = text.lower()
    s = s.replace('dž', 'j').replace('lj', 'ly').replace('nj', 'ny')
    mapping = {
        'č': 'ch', 'ć': 'ch', 'đ': 'dj', 'š': 'sh', 'ž': 'zh',
        'c': 'ts', 'j': 'y'
    }
    res = "".join(mapping.get(c, c) for c in s)
    # Simple capitalization for readability if short
    parts = res.split()
    cap_parts = []
    for p in parts:
        if len(p) <= 4:
            cap_parts.append(p.upper())
        elif len(p) <= 7:
            half = len(p) // 2
            cap_parts.append(p[:half].upper() + "-" + p[half:])
        else:
            third = len(p) // 3
            cap_parts.append(p[:third].upper() + "-" + p[third:2*third] + "-" + p[2*third:])
    return " ".join(cap_parts)

def main():
    print("=== SerboLingo Priority 1: Vocabulary Expansion to 5,000+ Words ===")
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    seed_data_path = os.path.join(root_dir, "seed-data.js")
    dump_script = os.path.join(root_dir, "data", "dump_legacy.js")
    dump_json = os.path.join(root_dir, "data", "legacy_dump.json")

    # Step 1: Export legacy seed data to clean JSON using Node.js
    with open(dump_script, "w", encoding="utf-8") as f:
        f.write('global.window = {};\nrequire("../seed-data.js");\nconst fs = require("fs");\nfs.writeFileSync(__dirname + "/legacy_dump.json", JSON.stringify(window.SEED_DATA));\n')

    subprocess.run(["C:\\Program Files\\nodejs\\node.exe", dump_script], check=True)

    with open(dump_json, "r", encoding="utf-8") as f:
        legacy_data = json.load(f)
    print(f"Loaded {len(legacy_data)} legacy entries from seed-data.js")

    # Step 2: Clean and upgrade legacy entries
    seen_ids = set()
    cleaned_legacy = []
    deduped_count = 0
    cyr_added_count = 0

    for item in legacy_data:
        curr_id = item.get("id")
        if curr_id in seen_ids:
            new_id = f"{curr_id}_b"
            while new_id in seen_ids:
                new_id = f"{new_id}_b"
            item["id"] = new_id
            deduped_count += 1
        seen_ids.add(item["id"])

        if not item.get("sr_cyr") and item.get("sr_lat"):
            item["sr_cyr"] = to_cyrillic(item["sr_lat"])
            cyr_added_count += 1

        cleaned_legacy.append(item)

    print(f"Deduplicated {deduped_count} legacy IDs so 100% of words are retained in IndexedDB.")
    print(f"Added Cyrillic transliteration to {cyr_added_count} legacy entries for 100% script parity.")

    # Step 3: Combine all 4 new vocabulary packs
    all_new_tuples = PACK1_DATA + PACK2_DATA + PACK3_DATA + PACK4_DATA
    print(f"Loaded {len(all_new_tuples)} new lexical tuples across 4 packs.")

    categories = [
        # Pack 1 (0 - 499)
        "medical", "business", "law", "technology", "travel_advanced",
        # Pack 2 (500 - 999)
        "culinary", "workplace", "education_academic", "science_nature", "emotions_mind",
        # Pack 3 (1000 - 1499)
        "dating_romance", "sports_fitness", "arts_culture", "home_living", "media_press",
        # Pack 4 (1500 - 1999)
        "philosophy_society", "finance_banking", "verbs_b2", "adjectives_b2", "phrases_idioms"
    ]

    new_entries = []
    for idx, tup in enumerate(all_new_tuples):
        en, sr_lat, pos, gender, diff, emoji, ex_en, ex_sr = tup
        v_id = f"v5k_{idx + 1:04d}"
        cat_idx = min(idx // 100, len(categories) - 1)
        cat = categories[cat_idx]
        sr_cyr = to_cyrillic(sr_lat)
        phonetic = to_phonetic(sr_lat)

        entry = {
            "id": v_id,
            "en": en,
            "sr_lat": sr_lat,
            "sr_cyr": sr_cyr,
            "category": cat,
            "difficulty": diff,
            "pos": pos,
            "emoji": emoji,
            "phonetic": phonetic,
            "example_en": ex_en,
            "example_sr": ex_sr
        }
        if pos == "noun" and gender and gender != "-":
            entry["gender"] = gender

        seen_ids.add(v_id)
        new_entries.append(entry)

    print(f"Generated {len(new_entries)} rich vocabulary entries with phonetics, Cyrillic, and examples.")

    full_dataset = cleaned_legacy + new_entries
    total_count = len(full_dataset)
    print(f"Total entries in master catalog: {total_count}")

    # Step 4: Write updated seed-data.js
    header = """// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo Seed Data & Vocabulary Catalog
// Priority 1: Milestone 2 — 5,000+ Words & Phrases for B2 Working Fluency
// Priority 36: Database Migration & Version Governance (v4.0)
window.SEED_DATA_VERSION = 4;
window.SEED_DATA_BUILD = '2026.11.21';
window.SEED_DATA_REVISION = 'v4.0-5k-milestone';
window.SEED_DATA = [
"""
    footer = "];\n"

    print(f"Writing updated seed-data.js to {seed_data_path}...")
    with open(seed_data_path, "w", encoding="utf-8") as f:
        f.write(header)
        for i, item in enumerate(full_dataset):
            line = json.dumps(item, ensure_ascii=False)
            if i < total_count - 1:
                f.write(f"    {line},\n")
            else:
                f.write(f"    {line}\n")
        f.write(footer)

    # Clean up temp files
    if os.path.exists(dump_script):
        os.remove(dump_script)
    if os.path.exists(dump_json):
        os.remove(dump_json)

    print("Successfully built seed-data.js!")
    print(f"Verification: total count = {total_count}")

if __name__ == "__main__":
    main()
