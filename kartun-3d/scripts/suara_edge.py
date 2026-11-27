#!/usr/bin/env python3
"""Narasi Edge TTS (gratis) per baris + waktu tiap kata (salinan dari _mesin-kartun, sejak 27 Nov 2026 dipakai skill kartun-3d:
   hasilnya ditanam dengan `jalankan.py rakit konfig.js film.html --suara-edge <folder_keluar> --naskah naskah.txt`).

Pakai: python -X utf8 -I scripts/suara_edge.py <baris.json> <folder_keluar>
baris.json: [{"id": "L01", "teks": "...", "suara": "ardi"|"gadis", "rate": "-5%", "pitch": "-2Hz", "jeda": 0.3, "efek": "<filter ffmpeg>"}]
Teks boleh berisi *kata kunci* (caption berwarna); tanda * dibuang untuk suara.
Hasil di <folder_keluar>: <id>.mp3 per baris + suara.json:
  {"baris": [{"id","src","mulai","durasi"}], "kata": [[mulai, akhir, "kata"], ...], "akhir": detik}
(waktu absolut dari awal film; baris berikutnya mulai sesudah baris sebelumnya + jeda).
"""
import asyncio
import json
import os
import re
import subprocess
import sys

import edge_tts
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
SUARA = {"ardi": "id-ID-ArdiNeural", "gadis": "id-ID-GadisNeural"}


def durasi(p):
    r = subprocess.run([FF, "-i", p], capture_output=True, text=True, errors="ignore").stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])


async def satu(b, keluar):
    teks_suara = b["teks"].replace("*", "")
    c = edge_tts.Communicate(teks_suara, SUARA.get(b.get("suara", "ardi"), b.get("suara")), rate=b.get("rate", "-4%"), pitch=b.get("pitch", "-2Hz"), boundary="WordBoundary")
    mentah, batas = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio":
            mentah.extend(ch["data"])
        elif ch["type"] == "WordBoundary":
            batas.append((ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]))
    p0 = os.path.join(keluar, b["id"] + "_mentah.mp3"); open(p0, "wb").write(mentah)
    p1 = os.path.join(keluar, b["id"] + ".mp3")
    f = "aresample=44100" + ("," + b["efek"] if b.get("efek") else "")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", p0, "-af", f, "-b:a", "160k", p1], check=True)
    os.remove(p0)
    # kata di layar (dengan tanda *) dipasangkan berurutan dengan batas kata suara
    layar = [w for w in b["teks"].split() if re.search(r"\w", w)]
    kata = []
    for i, (a, z, w) in enumerate(batas):
        kata.append([a, z, layar[i] if i < len(layar) else w])
    return p1, durasi(p1), kata


async def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    baris = json.load(open(sys.argv[1], encoding="utf-8"))
    keluar = sys.argv[2]; os.makedirs(keluar, exist_ok=True)
    t, hasil, semua = 0.0, [], []
    for b in baris:
        t += b.get("jeda", 0.3)
        p, d, kata = await satu(b, keluar)
        hasil.append({"id": b["id"], "src": os.path.basename(p), "mulai": round(t, 3), "durasi": round(d, 3)})
        semua += [[round(t + a, 3), round(t + z, 3), w] for a, z, w in kata]
        print(f'{b["id"]} mulai {t:.2f} dur {d:.2f} · {len(kata)} kata')
        t += d
    json.dump({"baris": hasil, "kata": semua, "akhir": round(t, 3)}, open(os.path.join(keluar, "suara.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("akhir", round(t, 2))


asyncio.run(main())
