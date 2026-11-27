---
name: kartun-3d
description: "SATU skill untuk semua video kartun saya, topik dan seri apa pun (horor, kebiasaan, fabel, presiden, orang dalam, dari nol, edukasi, explainer), dari SATU file HTML (Three.js tertanam, offline) yang mengikuti storyboard adegan demi adegan. Bawaan 3D render sinematik: cahaya + bayangan lembut, bahan bertekstur, latar kabur sesuai jarak, bloom, warna film; tokoh kartun 3D (gemuk/kurus/tua/anak, batik/kebaya, 60+ pose, mulut bicara, akting otomatis, anti-tembus); bidikan kamera otomatis ala film; ruang tertutup; warna ikut keadaan adegan. Gaya lain: kartun/clay/mainan/lowpoly. Suara Edge TTS gratis/ElevenLabs/rekaman, musik Epidemic per babak, ajakan follow/like/komen wajib, cek otomatis + lembar per detik, ekspor MP4 di browser. Alur 5 tahap dua klik sampai unggah YouTube. Pakai saat saya memanggil /kartun-3d (atau nama lama /motion-graphic-3d dan /kartun-stickman-3d), mengirim storyboard kartun, atau membalas proyek ini."
---

# Kartun 3D: satu skill untuk semua video kartun

**Sejak 27 Nov 2026** (permintaan saya: "kartun-stickman-3d dan motion-graphic saya jadikan 1 skill saja dengan versi update tapi karakter tetap seperti yang di skill motion-graphic", lalu "upgrade versi 100% realistis" → dipilih **render sinematik, tokoh tetap kartun**, lalu "yang 3D karena sama jadi cukup 1; motion-graphic (2D) jangan dihapus, beda gaya") skill ini menggantikan **dua skill 3D**:
| Skill lama | Sekarang |
|---|---|
| `motion-graphic-3d` | skill ini (berganti nama; mesin, contoh, dan semua perbaikannya ikut) |
| `kartun-stickman-3d` | skill ini, **preset seri** (§Seri); tokoh = tokoh motion-graphic 3D, bukan stickman; seri lama **dilanjutkan dengan tokoh baru** |

Folder kedua skill lama **dihapus** (27 Nov 2026, keputusan saya: yang 3D cukup satu); bila saya menyebut nama lamanya, pakai skill ini. Isi lama: tag git `arsip/skill-sebelum-kartun-3d-2026-11-27`; cadangan pasangan di `~/.claude/skills-cadangan`. Mesin lama `_mesin-kartun\` (React/Remotion, stickman) tidak dihapus, hanya untuk proyek lama. **`motion-graphic` (2D) tetap skill sendiri** (gaya berbeda): video 2D datar → `/motion-graphic`; skill lain yang tetap terpisah karena gayanya beda: `teks-kinetik-3d`, `mekanisme-3d`, `cerita-kartun`, `film-ai`.

**Letak skill:** sumber utama `D:\automation\Video AI\.claude\skills\kartun-3d\` (repo Automation-youtube; dipasang `_skills\pasang_skill.ps1`). Salinan rapi: repo [Rizkymema/Skill-Motion-Graphic-3D-Rizky](https://github.com/Rizkymema/Skill-Motion-Graphic-3D-Rizky) (klon `D:\automation\Skill-Motion-Graphic-3D-Rizky\`, folder `kartun-3d\`, `pasang.ps1`), diperbarui `_skills\sinkron_repo_skill.ps1`. Ubah hanya di sumber utama. Skill ini memakai `_elevenlabs`, `_youtube`, `_thumbnail/otomatis.py`, skill `unggah-youtube`, folder `Hasil Video`.

Semua ada di dalam satu HTML: Three.js r147 (MIT), mesin 3D + pasca-proses sinematik, mesin 2D (teks/label, subtitle, musik/SFX, transisi), pemutar (▶, scrubber, Cek, Kontak, Thumbnail), dan **encoder MP4** (WebCodecs). Saya cukup membuka file di Chrome/Edge lalu menekan **Ekspor MP4**. `scripts/jalankan.py` hanya alat bantu Claude (merakit HTML, lalu "menekan tombol" yang sama di browser tanpa layar).

## Isi folder
| Berkas | Isi |
|---|---|
| `assets/templat.html` | mesin 2D + pemutar + cek + ekspor; per video **hanya blok `konfig`** yang diganti |
| `assets/three.min.js` | Three.js r147 (MIT), ditanam utuh oleh `rakit` |
| `assets/mesin3d/01-inti.js … 08-sinema.js` | mesin 3D: renderer, bahan + garis tepi, cahaya + eksposur per keadaan, kamera, dunia `d.*` (ruang tertutup 4 sisi), tokoh 3D, benda, partikel, efek, **anti-tembus**, **bidikan otomatis** + cek wajah/mulut/latar, **render sinematik** (`08-sinema.js`); digabung urut nama oleh `rakit` |
| `contoh/cerita-timbangan-daging.konfig.js` + `.naskah.txt` | **acuan cerita berdialog** (horor 4 tokoh + makhluk, ±2:45 dengan suara): bidikan per baris dialog, tokoh beragam, pose bercerita, katalog benda, teks atas yang keluar tepat waktu; sinematik; cek BERES. Hasil versi bersuara + musik Epidemic: `Hasil Video\Motion Graphic 3D\_contoh\2026-11-27 Timbangan Daging v4 musik\` |
| `contoh/kartun-bakso-motor-3d.konfig.js` | **acuan cerita pendek** (5 adegan, 21,6 dtk): jalan + naik motor, warung + duduk makan, mangkuk beruap, wajah, malam mendorong motor; ajakan di akhir |
| `contoh/infografis-uang-3d.konfig.js` | **acuan explainer**: studio berganti keadaan, HP 3D berlayar grafik, grafik batang/pai 3D, celengan `d.grup`, ajakan |
| `references/mesin.md` | **API dunia 3D** (`d.*`): kamera + bidikan, cahaya/keadaan, **sinematik** (§5b), latar, benda, tokoh 3D, lapisan 2D di atas 3D, kecepatan, anti-tembus, cek |
| `references/mesin-2d.md` | API lapisan 2D `g.*`, KONFIG umum, waktu/rujukan narasi, subtitle (film / satu kata), musik (§7b Epidemic per babak), SFX, transisi, ekspor |
| `references/gaya.md` | gaya 3D (sinematik bawaan, kartun, clay, mainan, lowpoly), tata kamera, tata gerak |
| `references/palet.md` · `dunia-topik.md` · `storyboard.md` | warna per keadaan (8 suasana) · storyboard → adegan 3D, paket visual 8 baris · naskah, hook 3 dtk, tabel storyboard, checklist |
| `references/hook.md` · `penyampaian.md` · `kemasan-seri.md` | dari kartun-stickman-3d: pola hook, cara bercerita/narasi seri, kemasan seri (judul, episode, komentar sematan) |
| `references/kemasan.md` | judul, deskripsi, hashtag, thumbnail, unggah |
| `scripts/jalankan.py` | `rakit` (`--naskah --narasi/--baris/--suara-edge`, `--musik --vol-musik --redam-musik --musik-utuh`, `--sfx`), `cek`, `kontak`, `lembar` (per detik), `bingkai`, `thumbnail`, `ekspor`. Python di PC ini: `C:\Users\ASUS\AppData\Local\Programs\Python\Python312\python.exe` |
| `scripts/suara_edge.py` | narasi **Edge TTS gratis** per baris (Ardi/Gadis) + waktu kata persis → `rakit --suara-edge` |
| `scripts/musik_epidemic.py` | musik latar per babak dari Epidemic: `cari`, `edit`, `ukur`, `latar`, `cek` |

## Mode dan gaya
| Mode | Kapan | Cara |
|---|---|---|
| **3D sinematik** (bawaan, Rekomendasi) | cerita, seri, dialog, explainer bertokoh | `KONFIG.gaya: 'sinematik'` (atau tanpa `gaya`): render HDR, latar kabur menurut jarak ke subjek (close-up kuat, lebar tipis), bloom lampu/mata menyala, warna film (sorot hangat, bayang dingin), vignet, butir film, relief bahan; garis tepi tipis. Tokoh tetap kartun. `mesin.md` §5b |
| 3D kartun klasik | tampilan RicksClips polos (garis tebal, tanpa kabur latar) | `gaya: 'kartun'` (juga `clay`, `mainan`, `lowpoly`); `KONFIG.sinema: true` menambah pasca-proses ke gaya apa pun |

Satu video boleh menyisipkan adegan 2D pendek (kartu judul, grafik, kartu ajakan; adegan tanpa `dunia`). Video yang seluruhnya 2D datar → skill `motion-graphic`. Render sinematik ±1,8× lebih lambat dari kartun klasik (Vega 8: ±140 md/bingkai 1080p → video 2:45 ±20–25 menit ekspor); pratinjau otomatis pindah ke mode Cepat.

## Seri (dari kartun-stickman-3d)
- **Folder seri** (subfolder `Hasil Video\Kartun 3D\`): horor → `Horor Bersambung` · kebiasaan → `Film Kebiasaan Buruk` · fabel → `Fabel Garis` · mindset → `Metafora Mindset` · presiden → `Day 1 Jadi Presiden` · orang dalam → `Orang Dalam` · dari nol → `Dari Nol` · bikin sendiri → `Bikin Sendiri` · skit kantor → `Skit Kantor` · tanpa seri → `Umum`. Episode: `<tanggal> <Judul> Ep 2` (huruf biasa). Episode lama (stickman) tetap di `Hasil Video\Kartun Stickman 3D\<seri>\`; episode baru memakai tokoh kartun 3D (tulis di deskripsi bila perlu "visual baru").
- **Ajakan FOLLOW / LIKE / KOMEN wajib di akhir setiap video** (termasuk horor): kartu penutup, label, atau kalimat narasi di 8 dtk terakhir. `cek` menolak video tanpa ajakan; `KONFIG.tanpaAjakan: true` hanya bila saya minta.
- **Caption satu kata** ala RicksClips (pilihan, terutama seri horor/fabel): `subtitle: { gaya: 'kotak', maksKata: 1 }` (bawaan tetap subtitle film kecil).
- **Hook dan penyampaian**: `references/hook.md`, `references/penyampaian.md`; kemasan seri (judul seri, episode, komentar sematan, CTA): `references/kemasan-seri.md` bersama `kemasan.md`.
- **Channel**: `_youtube/config.json` `saran_channel` kunci `kartun-3d/<kategori>` (mis. `kartun-3d/horor` → Jejak Misteri); kunci lama `kartun-stickman-3d/<kategori>` tetap dibaca.

## Tim agen (sejak 27 Nov 2026)
Permintaan saya: "di setiap skill kasih agent masing-masing, ada yang bertugas susun video, urusan musik, SFX, dan lain-lain; musik selalu dari Epidemic pilihan utama tapi bisa dari saya juga, tinggal disesuaikan agar rapi". Agen bersama ada di `D:\automation\Video AI\.claude\agents\` (Agent tool, `subagent_type` = nama agen); alat audionya di `_bersama/audio/` (`musik.py`, `sfx.py`). Sesi utama = sutradara: memegang dialog dengan saya, memberi brief lengkap ke tiap agen (skill `kartun-3d`, folder `_kerja`, durasi, daftar adegan/babak, keputusan setup), menggabungkan hasil, dan memutuskan. Agen yang tidak saling bergantung dijalankan **paralel**. Tanpa folder agen (mis. dipasang dari repo publik): kerjakan langkah yang sama sendiri.
| Tahap | Agen | Tugas di kartun-3d | Serahan |
|---|---|---|---|
| 2 | `penulis-naskah` | riset + sumber, hook, `naskah.txt`, tabel storyboard (format §3), daftar babak emosi + daftar kejadian bunyi, ajakan di akhir | `_kerja/naskah.txt`, `_kerja/storyboard.md` |
| 2 | `penyusun-video` | `konfig.js` (bidikan otomatis, gaya sinematik, katalog benda, teks `keluar`), `rakit`, `cek` sampai BERES | `_kerja/film.html` |
| 2, 4 | `pemeriksa-video` | `cek` + **lembar per detik dilihat semua** + campuran audio; laporan per detik | daftar temuan → `penyusun-video` memperbaiki |
| 3 | `pengisi-suara` | Edge TTS (bawaan) / ElevenLabs (sesudah klik 2) / rekaman saya | `_kerja/audio/edge/` → `rakit --suara-edge … --naskah …` |
| 3 | `penata-musik` | **Epidemic per babak (utama)** atau musik saya (`D:\Sound\Backsound` / berkas kiriman, dirapikan `musik.py sendiri`), `musik.py latar`, `musik.py cek` BERES | `_kerja/audio/musik_latar.mp3` → `rakit --musik … --vol-musik 1.15 --redam-musik .2 --musik-utuh` + kredit |
| 3 | `penata-sfx` | efek tiap kejadian dari `D:\Sound\Sound Effect` lalu Epidemic, dipotong + disamakan | `_kerja/audio/sfx/` → `rakit --sfx …` + potongan `sfx: [...]` per adegan |
Urutan khas: Tahap 2 `penulis-naskah` → `penyusun-video` → `pemeriksa-video` (ulang sampai bersih) → pratinjau + klik 2 → Tahap 3 `pengisi-suara` ‖ `penata-musik` ‖ `penata-sfx` (paralel; musik butuh waktu suara final untuk mengukur, jadi `musik.py cek` dijalankan setelah rakit ulang) → `penyusun-video` rakit final → `pemeriksa-video` → ekspor + unggah oleh sesi utama.

## 1. Alur (5 tahap, dua klik)
| Tahap | Isi | Saya |
|---|---|---|
| 1 Brief + konsep | topik/storyboard dari saya (atau 4 ide), **3 konsep** (dunia, keadaan, kamera, hook 3 dtk), lalu satu dialog setup | **1 klik** |
| 2 Storyboard + build + cek | naskah, tabel storyboard, build HTML, `cek` BERES + **lembar per detik dilihat semua**, pratinjau, persetujuan + channel | **1 klik** |
| 3 Suara | Edge TTS / ElevenLabs / rekaman / tanpa narasi; musik Epidemic per babak; waktu adegan ikut suara | — |
| 4 Render | rakit final, cek, lembar, ekspor MP4, thumbnail | — |
| 5 Paket unggah | judul, deskripsi, hashtag, thumbnail, unggah lewat `unggah-youtube`; kirim **MP4 final + file HTML** | — |

Baris status di awal setiap jawaban: `Tahap 2/5 · Storyboard + build — [JUDUL] · [mode/gaya] · seri [seri/Umum] · suasana [keadaan tiap babak] · topik [kategori] · [durasi] · [rasio]`.
Balasan singkat: `gas`/`lanjut` = semua Rekomendasi; `revisi scene 3 …`; `render` = langsung Tahap 4; `9:16`/`16:9`; `full` = semua tahap tanpa berhenti. Pilihan lewat AskUserQuestion (maks. 4 pertanyaan, opsi pertama "(Rekomendasi)"). Bahasa Indonesia santai dan singkat.

## Topik, storyboard, dan warna
- Topik bebas. Di Tahap 1 tentukan kategori dari `topik/README.md` lalu baca `topik/<kategori>.md` (sumber data, batas klaim, nada, pola hook, kategori + tag); di luar daftar → `topik/umum.md`. Aturan sumber dan keamanan dari topik menang; tampilan ikut skill ini. `topik/` = salinan `_bersama/topik/` (`_skills/sinkron_topik.ps1`); jangan diubah di sini.
- **Storyboard saya = sumber kebenaran, diikuti baris demi baris** (`references/dunia-topik.md` §1, `storyboard.md`): satu baris = satu adegan, tidak diringkas/diganti; tokoh hanya ada bila disebut; aksi digambar sebagai aksinya; info dunia lewat benda bertulisan. Hanya topik → Claude menulis storyboard dalam format yang sama.
- **Warna mengikuti keadaan tiap adegan** (`palet.md`): `suasana` `siang malam kobalt oranye hijau sorot aula senja`; satu warna dominan jenuh per adegan; tanpa pastel seragam dan tanpa neon.
- Tiap topik baru: **paket visual 8 baris** (dunia, benda utama, tokoh, diagram, hook, keadaan, kamera, suara) di kartu konsep dan sebagai komentar kepala `konfig.js`.

## 2. Tahap 1 — Brief + konsep (klik 1)
1. **Tanpa topik**: 4 ide topik + konsep di dialog (hook ≤ 12 kata, `hook.md`). **Dengan topik/storyboard**: langsung konsep. Tentukan **seri** dari topik (§Seri).
2. **3 konsep** (`gaya.md`, `dunia-topik.md`, `palet.md`): **A = 3D sinematik** (Rekomendasi) dengan keadaan terkuat; B dan C beda dunia dan keadaan (boleh kartun klasik/clay/mainan/lowpoly; explainer yang seluruhnya 2D datar → sarankan `/motion-graphic`). Tiap konsep: nama · mode/gaya + keadaan tiap babak · dunia 3D (tempat, benda utama, tokoh) · gerak kamera khas · hook 3 dtk · alur singkat · kenapa cocok. Storyboard sudah dikirim → konsep hanya memilih gaya + keadaan + kamera.
3. **Dialog setup** (maks. 4 pertanyaan): **Konsep** (A/B/C) · **Durasi & rasio** (`9:16 · ikuti storyboard / 60 dtk` Rekomendasi · `9:16 · 30 dtk` · `9:16 · 45–75 dtk` · `16:9 · 2–3 menit`) · **Suara** (`Edge TTS gratis: Ardi narator, Gadis perempuan` Rekomendasi · `ElevenLabs (kredit)` · `Rekaman suara sendiri` · `Tanpa narasi, subtitle teks + musik`) · **Warna** (`Mengikuti keadaan tiap adegan` Rekomendasi · `Satu suasana` · `Palet sendiri`). FPS 30 kecuali saya minta 60. Jangan menanyakan yang sudah saya sebut.
4. **Folder proyek**: `D:\automation\Video AI\Hasil Video\Kartun 3D\<seri atau Umum>\<tanggal> <Judul>\_kerja\` (cloud: `Hasil Video/Kartun 3D/…`). Isi: `konfig.js`, `naskah.txt`, `audio\`, `film.html`, `lembar\`, `pratinjau.mp4`.
5. **Masuk di tengah** ("lanjut <topik>"): tanpa `konfig.js` → Tahap 2; ada `konfig.js` tanpa persetujuan → pratinjau + dialog Tahap 2; disetujui tanpa `ekspor\` → Tahap 3/4; ada MP4 final → Tahap 5.

## 3. Tahap 2 — Storyboard + build + cek (klik 2)
Baca `references/storyboard.md`, `gaya.md`, `palet.md`, `dunia-topik.md`, `mesin.md` (3D) dan bila perlu `mesin-2d.md`; contoh terdekat di `contoh/`.
1. **Riset**: setiap fakta/angka dicek lewat web, sumber di `_kerja\naskah.txt` (`# sumber: …`); tanpa sumber → kalimat umum atau hitungan yang bisa dibuktikan.
2. **Naskah**: hook 3 dtk → isi → penutup + **ajakan follow/like/komen**; satu baris = satu ide; ±2,3 kata/dtk; cara bercerita seri: `penyampaian.md`.
3. **Storyboard** (tabel): `# · waktu · keadaan · dunia 3D + tokoh/aksi · bidikan (siapa · jenis) · teks atas · subtitle · SFX · transisi`. Perubahan visual tiap 1,5–3 dtk; transisi bervariasi.
4. **Build**: `_kerja\konfig.js` (komentar kepala = paket visual; `KONFIG` dengan `gaya: 'sinematik'`, `suasana`, `tokoh` (pakai `tubuh`, `motif`, `kerah` supaya tiap tokoh berbeda); `ADEGAN` dengan `suasana`, **kamera = daftar BIDIKAN otomatis** (`mesin.md` §4a; koordinat manual hanya untuk adegan tanpa tokoh), `dunia(d)` (benda dari katalog dulu; pose bercerita + `tunjukKe`/`raih` sebelum pose sendiri), `gambar(g)` untuk teks/label 2D dengan `keluar`), lalu `jalankan.py rakit _kerja/konfig.js _kerja/film.html`.
5. **Cek kualitas sendiri (wajib, berulang sampai beres)**:
   - `jalankan.py cek _kerja/film.html` sampai **BERES** (teks keluar layar/zona tombol, teks bertabrakan, subtitle/teks menutupi wajah, bingkai kosong, galat, WebGL, **clipping 3D**, **wajah/mulut tokoh yang bicara** terlihat, **latar kosong**, kamera di bawah lantai, **ajakan di akhir**; cara memperbaiki: `mesin.md` §4a, §9b, §9c). Saran juga dibaca.
   - **WAJIB setelah `cek` BERES**: `jalankan.py lembar _kerja/film.html _kerja/lembar` lalu **lihat SETIAP lembar** (8×3 bingkai per detik). Cari: wajah yang bicara tertutup/terlalu dekat/jauh, tangan/kepala tokoh lain menyusup, pose tak terbaca dari sudut kamera, benda tak terbaca, teks tertinggal, latar kosong, kamera melompat, **subjek kabur** (fokus sinematik salah → `fokus` adegan). Catat detik tiap masalah, perbaiki, rakit, cek, lembar lagi.
   - Jangan mengirim pratinjau sebelum `cek` BERES **dan** semua lembar per detik dilihat tanpa temuan.
6. **Pratinjau**: `jalankan.py ekspor _kerja/film.html _kerja/pratinjau.mp4` (sinematik ±8–9× durasi di laptop saya; jalankan di latar dan sebut perkiraannya), kirim **pratinjau.mp4 + film.html**.
7. Di chat: baris status, hook + logline, **tabel storyboard**, keadaan + warna tiap adegan, sumber, teks narasi siap tempel, rencana musik per babak.
8. **Dialog persetujuan** (satu dialog, dua pertanyaan): (1) **Setujui & render (Rekomendasi)** · **Revisi scene/tampilan** · **Revisi naskah/fakta** · **Ganti konsep/durasi/suara**; (2) **Unggah ke channel mana?** (satu opsi per channel di `_youtube/config.json`; `saran_channel` `kartun-3d/<kategori>` atau `default_channel` = Rekomendasi; cloud: `posting_accounts` Balasin) + `Jangan unggah, simpan MP4 saja`. Ini satu-satunya titik sebelum kredit dipakai.

## 4. Tahap 3 — Suara (tanpa berhenti)
- **Edge TTS gratis** (bawaan): tulis `_kerja/baris.json` (`[{"id": "L01", "teks": "…", "suara": "ardi"|"gadis", "rate": "-5%", "jeda": .3}]`), `python -X utf8 -I scripts/suara_edge.py _kerja/baris.json _kerja/audio/edge`, lalu `rakit … --suara-edge _kerja/audio/edge --naskah _kerja/naskah.txt` (waktu tiap kata persis → mulut, pose, subtitle tepat).
- **ElevenLabs** (kredit, sesudah klik 2): PC `D:\automation\Video AI\_elevenlabs\` (Ricky `2VMRgGhWXuHXWN2xNHM8`, `estimate_only` dulu), cloud konektor → `rakit … --naskah … --baris DIR` (satu berkas per baris) atau `--narasi narasi.mp3`. **Rekaman saya**: sama.
- Waktu adegan rujukan baris (`mulai: 'L04'`), kejadian di kata (`'L05.w3'`), tokoh `bicara: 'L03'`. Narasi lebih pendek/panjang → durasi ikut narasi.
- **Musik: Epidemic pilihan utama, musik saya juga boleh** (agen `penata-musik`; `mesin-2d.md` §7b, `scripts/musik_epidemic.py` = salinan `_bersama/audio/musik.py`): bila saya mengirim musik atau menyebut "musik saya"/suasana di `D:\Sound\Backsound`, pakai itu dan rapikan dengan `musik.py sendiri` (pas babak, loop crossfade, fade, LUFS sama). Epidemic: tanya dulu sebelum mengunduh bila belum disetujui di klik 2. 3–5 babak emosi, satu lagu tanpa vokal per babak dipotong resmi sepanjang babaknya, dirakit dengan kekerasan sama + crossfade, `rakit … --musik … --vol-musik 1.15 --redam-musik .2 --musik-utuh`, lalu `musik_epidemic.py cek` sampai BERES. Jangan satu lagu datar sepanjang video. SFX berkas: `--sfx DIR`.

## 5. Tahap 4 — Render (tanpa berhenti)
1. Rakit final, `cek` BERES, `lembar` per detik dilihat lagi SEMUA (mulut, pose, bidikan per kalimat, fokus, SFX tepat di kata).
2. `jalankan.py ekspor _kerja/film.html "<folder video>/_kerja/ekspor/<Judul>.mp4"` → H.264 1080×1920 (atau 1920×1080), 30/60 fps, 10/14 Mbps, AAC (Chrome/Edge Windows) atau Opus (Chromium Linux). Lewat Balasin (≤ 50 MB): `--batas-mb 46`. Jalankan di latar.
3. Lihat 4–6 bingkai MP4-nya sendiri.
4. **Thumbnail (wajib, tanpa bertanya)**: `jalankan.py thumbnail` → `<folder video>/_kerja/thumbnail/bingkai/`, lalu `_thumbnail/otomatis.py "<folder video>" --teks "…" --judul "…" --gaya kartun-3d --subjek-desk "…" --latar-desk "…"` → `thumbnail.png` 16:9 + `thumbnail_short.png` 9:16 + `prompt-thumbnail.md`.
5. **Tanpa browser tanpa layar / tanpa WebGL**: kirim `film.html`, minta saya membuka di Chrome/Edge dan menekan **Ekspor MP4**.

## 6. Tahap 5 — Paket unggah
`references/kemasan.md` (+ `kemasan-seri.md` untuk seri): 3 judul (terkuat dipakai otomatis), deskripsi pendek **tanpa menyebut alat/cara pembuatan** (HTML, kode, Three.js, AI, Claude, ElevenLabs), kredit musik Epidemic bila perlu, 3–5 hashtag, thumbnail + prompt, tag, komentar sematan. Unggah lewat `unggah-youtube` ke `Hasil Video\Kartun 3D\<seri atau Umum>\<tanggal> <Judul>\` (`categoryId` sesuai topik); cloud lewat Balasin. Salin `film.html` ke akar folder video sebagai `<Judul>.html`.
**Kiriman file**: **MP4 final + file HTML**, tidak lebih. Laporan satu pesan: link/jadwal tayang, judul + 2 cadangan, thumbnail (dilihat sendiri) + prompt, deskripsi, hashtag, komentar sematan.
Menu penutup: **Video/episode berikutnya (Rekomendasi)** · **Versi rasio lain** · **Revisi scene** · **Versi 2D (`/motion-graphic`)**.

## 7. Standar wajib (rinci di references)
- **Deterministik**: dunia dibangun sekali per adegan, gerak fungsi dari `t`; tanpa `Math.random()`, `Date`, `setTimeout`, animasi CSS (pakai `acak(n)`/`derau(x)`). Butir film dan pasca-proses juga deterministik (pratinjau = ekspor).
- **Tanpa aset luar, tanpa internet**: benda dari bentuk dasar + tekstur kanvas; file jalan offline.
- **Kamera bergerak di setiap adegan**, bidikan otomatis untuk adegan bertokoh, kedalaman (benda depan + subjek + latar + kabut/kabur), sudut bervariasi antar-adegan.
- **Tokoh hidup**: pose/ekspresi baru tiap 1,5–2,5 dtk, `bicara` saat dialog, `jalan`/`lari`, `lihat` lawan bicara, efek emosi; akting otomatis jangan dimatikan tanpa alasan.
- Warna ikut keadaan adegan; lampu menyala (`d.lampu`, `d.sorot`, `d.lampuGantung`); subtitle kecil gaya film (atau satu kata untuk seri); teks atas hanya hal penting dan keluar tepat waktu; hook kuat 3 dtk dengan benda utama topik; SFX di setiap kejadian; ≥ 4 jenis transisi; **ajakan di akhir**.
- **Tanpa clipping** (`mesin.md` §9b): tokoh/benda saling tembus dan kamera di dalam benda = 0 di `cek`.
- **Tetap cepat** (`mesin.md` §9): ≤ 16 gedung, ≤ 250 partikel, ≤ 5 tokoh, lampu berbayang ≤ 2 per adegan.
- Checklist sebelum kirim: durasi pas, tidak ada bingkai kosong, subjek/teks tidak terpotong, teks terbaca ≥ 2 dtk, **tidak ada karakter/logo/merek pihak lain**, fakta hanya dari sumber yang dicek.

## 8. Jangan
- Jangan membuat "slide 3D": setiap adegan punya tempat/latar, subjek, kamera bergerak, dan detail sekunder.
- Jangan menaruh tokoh di adegan yang storyboardnya tidak menyebut tokoh, atau mengganti aksi dengan pose generik; jangan tokoh berpose sama > 3 dtk.
- Jangan mengubah rupa tokoh bawaan (hanya kulit, rambut, baju, aksesori, tubuh lewat `KONFIG.tokoh`); jangan kembali ke stickman.
- Jangan berjajar lebar di 9:16; jangan benda di antara kamera dan wajah; jangan teks penting di bawah 76% tinggi atau di kanan bawah.
- Jangan satu palet untuk seluruh video, pastel seragam, atau neon.
- Jangan mengubah blok `inti` templat atau `assets/mesin3d/` per video. Fitur mesin baru → ubah mesin, uji ulang **semua contoh** (`cek` BERES + `lembar`/`kontak` dilihat + ukur md/bingkai), catat di `references/mesin.md`.
- Jangan membiarkan teks atas tampil sampai adegan habis; jangan pose tangan-dekat-wajah saat tokoh bicara di close-up; jangan kamera manual untuk dialog; jangan pose buatan sendiri bila ada pose bawaan yang mendekati.
- Jangan mematikan sinematik hanya karena render lebih lama; pakai mode Cepat untuk pratinjau.
- Jangan memuat apa pun dari internet di dalam HTML; jangan menyembunyikan clipping dengan `padat: false`.
- Jangan mengirim lebih dari MP4 final + HTML setelah video jadi.
