---
name: motion-graphic-3d
description: "Video motion graphic 3D dari SATU file HTML dengan Three.js tertanam (offline, tanpa aset luar) yang MENGIKUTI STORYBOARD/TOPIK saya adegan demi adegan: dunia 3D sungguhan (cahaya + eksposur otomatis, bayangan asli, kabut jarak), bidikan kamera otomatis ala film (dua tokoh, atas bahu, close-up, sisipan; wajah yang bicara selalu terlihat), tokoh 3D ber-rig beragam (gemuk/kurus/tua/anak, batik/kebaya, 60+ pose, 11 ekspresi, mulut bicara, akting otomatis, anti-tembus) hanya bila disebut, benda khas cerita (warung, gudang, karung, timbangan, pintu, HP/TV, papan), grafik 3D. Warna ala RicksClips3000 berganti per keadaan adegan. Gaya bahan: kartun (bawaan), clay, mainan, lowpoly. Lapisan 2D (teks, label, subtitle), SFX + musik, cek kualitas, ekspor MP4. Alur 5 tahap dua klik sampai unggah YouTube. Pakai saat saya memanggil /motion-graphic-3d, minta motion graphic 3D, animasi 3D dari HTML/Three.js, atau membalas proyek ini (lanjut, revisi scene X, render). Versi 2D tetap /motion-graphic."
---

# Motion Graphic 3D: dunia Three.js dari satu file HTML

Permintaan saya 26 Nov 2026: "buat skill baru pakai skill motion-graphic tapi pakai Three.js agar hasilnya lebih bagus … motion-graphic tetap dipakai, hanya buat skill baru supaya versi 3D-nya bagus". Jadi skill ini **turunan motion-graphic** dengan alur, storyboard, keadaan warna, subtitle, suara, cek, dan ekspor yang sama, tetapi isi adegannya **dunia 3D sungguhan**: tempat, benda, dan tokoh 3D dengan cahaya + bayangan asli, kamera 3D, kabut jarak, garis tepi kartun. Skill `motion-graphic` (2D) **tidak diubah** dan tetap dipakai untuk versi 2D.

**Letak skill:** sumber utama di project Video AI `D:\automation\Video AI\.claude\skills\motion-graphic-3d\` (repo Automation-youtube; dipasang `_skills\pasang_skill.ps1` seperti skill lain). Salinan rapi untuk dibagikan dan dipasang di PC lain: repo [Rizkymema/Skill-Motion-Graphic-3D-Rizky](https://github.com/Rizkymema/Skill-Motion-Graphic-3D-Rizky) (klon `D:\automation\Skill-Motion-Graphic-3D-Rizky\`, `pasang.ps1`), diperbarui dengan `_skills\sinkron_repo_skill.ps1` lalu commit + push di repo itu. Ubah skill hanya di sumber utama; jangan menyunting salinan terpasang di `~/.claude/skills`. Skill ini memakai bagian project Video AI: `_elevenlabs`, `_youtube`, `_thumbnail/otomatis.py`, skill `unggah-youtube`, folder `Hasil Video`.

Semua ada di dalam satu HTML: Three.js r147 (MIT), mesin 3D, mesin 2D (lapisan teks/label, subtitle, musik/SFX, transisi), pemutar (▶, scrubber, Cek, Kontak, Thumbnail), dan **encoder MP4** (WebCodecs). Saya cukup membuka file di Chrome/Edge lalu menekan **Ekspor MP4** (butuh akselerasi grafis/WebGL, aktif di Chrome/Edge biasa). `scripts/jalankan.py` hanya alat bantu Claude: merakit HTML lalu "menekan tombol" yang sama di browser tanpa layar.

## Isi folder
| Berkas | Isi |
|---|---|
| `assets/templat.html` | mesin 2D + pemutar + cek + ekspor (turunan templat motion-graphic) dengan tempat `three-js` dan `inti3d`; per video **hanya blok `konfig`** yang diganti |
| `assets/three.min.js` | Three.js r147 (MIT), ditanam utuh oleh `rakit` |
| `assets/mesin3d/01-inti.js … 07-bidikan.js` | mesin 3D: renderer, bahan + garis tepi, cahaya + eksposur per keadaan, kamera, dunia `d.*` (ruang tertutup 4 sisi), tokoh 3D, benda, partikel, efek, **anti-tembus** (kaki menapak, lengan tak tembus, cek clipping), **bidikan otomatis** + cek wajah/mulut/latar kosong; digabung urut nama oleh `rakit` |
| `contoh/kartun-bakso-motor-3d.konfig.js` | **acuan tampilan cerita**: storyboard 5 adegan yang sama dengan contoh motion-graphic 2D (jalan oranye + naik motor, warung sorot + duduk makan, mangkuk beruap tanpa tokoh, wajah di ubin hijau, malam mendorong motor), 21,6 dtk 9:16; cek BERES, ekspor 19,4 MB |
| `contoh/cerita-timbangan-daging.konfig.js` + `.naskah.txt` | **acuan cerita berdialog** (horor fiksi 4 tokoh + makhluk, 15 adegan, ±2:45 dengan suara asli / 97 dtk tanpa suara): bidikan otomatis per baris dialog (`dua`, `atasBahu`, `bidik`, `benda`), tokoh v2 (gemuk/kurus/nenek berkebaya + jarik batik/makhluk berjubah bermata menyala dengan `hiasKepala`), pose bercerita, `tunjukKe`, katalog benda (karung, dacin, timbangan digital, rolling door, lampu gantung, rak); cek BERES. Dibuat ulang dari uji pengguna 26 Nov 2026 |
| `contoh/infografis-uang-3d.konfig.js` | **acuan explainer/infografis**: studio berganti keadaan, HP 3D berlayar grafik 2D, papan harga, grafik batang 3D, pai 3D, celengan buatan sendiri (`d.grup`), konfeti, ajakan; 20,8 dtk; cek BERES |
| `references/mesin.md` | **API dunia 3D** (`d.*`): kamera, cahaya/keadaan, latar, bentuk, katalog benda, layar 2D di benda 3D, data, partikel, tokoh 3D (pose, ekspresi, jalan, naik, pegang, efek), lapisan 2D di atas 3D, kecepatan |
| `references/mesin-2d.md` | API lapisan 2D `g.*`, KONFIG umum, waktu/rujukan narasi, subtitle, musik, SFX (sintesis + berkas), transisi, ekspor |
| `references/gaya.md` | 4 gaya bahan, tata kamera 3D, tata gerak, lapisan 2D, penerapan per jenis video |
| `references/palet.md` | warna mengikuti keadaan tiap adegan (8 suasana), memilih keadaan dari tempat/waktu/perasaan |
| `references/dunia-topik.md` | storyboard → adegan 3D (tokoh hanya bila disebut, aksi → pose/benda), paket visual 8 baris, peta kategori topik |
| `references/storyboard.md` | naskah, hook 3 detik, tabel storyboard, checklist kualitas (termasuk 3D) |
| `references/kemasan.md` | judul, deskripsi, hashtag, thumbnail, unggah |
| `scripts/musik_epidemic.py` | musik latar per babak dari Epidemic: `cari`, `edit` (potong resmi sepanjang babak), `ukur` (kurva energi), `latar` (rakit + crossfade + samakan LUFS), `cek` (kejelasan dialog vs musik, render audio saja) |
| `scripts/jalankan.py` | `rakit`, `cek`, `kontak`, `lembar` (lembar kontak per detik), `bingkai`, `thumbnail`, `ekspor` (Python + Playwright; hanya untuk Claude). Di PC ini `python` rusak: pakai `C:\Users\ASUS\AppData\Local\Programs\Python\Python312\python.exe` |

## 1. Alur (5 tahap, dua klik) — sama dengan motion-graphic
| Tahap | Isi | Saya |
|---|---|---|
| 1 Brief + konsep | topik dari saya (atau 4 ide), **3 konsep** berbeda dunia/keadaan, masing-masing dengan hook 3 detik, lalu satu dialog setup | **1 klik** |
| 2 Storyboard + build + cek | naskah, tabel storyboard per scene, build HTML, cek sendiri (`cek` + lembar kontak) sampai BERES, pratinjau (HTML + MP4 tanpa narasi), persetujuan + channel | **1 klik** |
| 3 Suara | voice over (atau tanpa narasi, subtitle teks), musik; waktu adegan ikut suara | — |
| 4 Render | rakit final, cek BERES, ekspor MP4 H.264 30/60 fps, lihat bingkai, thumbnail | — |
| 5 Paket unggah | judul, deskripsi, hashtag, thumbnail, unggah lewat `unggah-youtube`; kirim **MP4 final + file HTML** | — |

Baris status di awal setiap jawaban: `Tahap 2/5 · Storyboard + build — [JUDUL] · 3D [gaya] · suasana [keadaan tiap babak] · topik [kategori] · [durasi] · [rasio]`.
Balasan singkat: `gas`/`lanjut` = semua Rekomendasi; `revisi scene 3 …` = ubah adegan itu, cek, pratinjau lagi; `render` = langsung Tahap 4; `9:16`/`16:9` = ganti rasio (kamera dan tata letak disusun ulang); `full` = semua tahap tersisa tanpa berhenti.
Pilihan selalu lewat AskUserQuestion (maks. 4 pertanyaan, opsi pertama "(Rekomendasi)"). Bahasa Indonesia santai dan singkat.

## Topik, storyboard, dan warna
- Topik bebas. Di Tahap 1 tentukan kategori dari `topik/README.md` lalu baca `topik/<kategori>.md` (sumber data, batas klaim, nada, pola hook, kategori + tag YouTube); di luar daftar → `topik/umum.md`. Aturan sumber dan keamanan dari topik menang; tampilan ikut skill ini. Folder `topik/` = salinan `_bersama/topik/` (dibuat `_skills/sinkron_topik.ps1`); jangan diubah di sini.
- **Storyboard saya diikuti baris demi baris** (`references/dunia-topik.md` §1): satu baris = satu adegan, tokoh hanya ada bila disebut, aksi digambar sebagai aksinya (naik motor → `d.motor` + `naik`, makan → `naik: d.kursi` + `dudukMakan` + `d.mangkuk`), subtitle kecil di bawah, teks atas hanya untuk hal penting, info dunia lewat benda bertulisan (`d.papan`, layar HP/TV).
- **Warna mengikuti keadaan tiap adegan** (`references/palet.md`, permintaan 24 Nov 2026): tiap adegan punya `suasana` (`siang malam kobalt oranye hijau sorot aula senja`) → palet + cahaya 3D + kabut berganti; satu warna dominan jenuh per adegan; tanpa pastel seragam dan tanpa neon.
- Tiap topik baru: **paket visual 8 baris** (dunia, benda utama, tokoh, diagram, hook, keadaan, kamera, suara) di kartu konsep dan sebagai komentar kepala `konfig.js`. Video tentang topik berbeda tidak boleh terlihat sama dengan warna ditukar.

## 2. Tahap 1 — Brief + konsep (klik 1)
1. **Tanpa topik**: tawarkan 4 ide topik + konsep sekaligus di dialog. **Dengan topik**: langsung konsep.
2. **3 konsep** di chat (`references/gaya.md`, `dunia-topik.md`, `palet.md`): **A = gaya `kartun`** (Rekomendasi; acuan RicksClips3000) dengan keadaan terkuat; B dan C beda **dunia dan keadaan/warna** (boleh `clay`/`mainan`/`lowpoly` bila cocok). Tiap konsep: nama · gaya + keadaan tiap babak (suasana + warna dominan) · dunia 3D (tempat, benda utama, tokoh bila ada) · **gerak kamera khas** · **hook 3 detik** (apa yang terlihat dan terbaca di 0–3 dtk) · alur singkat · kenapa cocok. Bila storyboard sudah dikirim, konsep hanya memilih gaya + keadaan + kamera.
3. **Dialog setup** (maks. 4 pertanyaan): **Konsep** (A/B/C) · **Durasi & rasio** (`9:16 · 60 detik` Rekomendasi · `9:16 · 30 detik` · `9:16 · 15 detik` · `16:9 · 90 detik`) · **Suara** (`Tanpa narasi, subtitle teks + musik` Rekomendasi bila tidak ada kunci ElevenLabs · `Narasi ElevenLabs` · `Rekaman suara sendiri`) · **Warna** (`Mengikuti keadaan tiap adegan (Rekomendasi)` · `Satu suasana untuk semua` · `Palet sendiri`). FPS 30 kecuali saya minta 60. Jangan menanyakan yang sudah saya sebut.
4. **Folder proyek** begitu setup selesai: `D:\automation\Video AI\Hasil Video\Motion Graphic 3D\Umum\<tanggal> <TOPIK>\_kerja\` (cloud: `Hasil Video/Motion Graphic 3D/Umum/…`). Isi: `konfig.js`, `naskah.txt`, `audio\`, `film.html`, `kontak.jpg`, `pratinjau.mp4`.
5. **Masuk di tengah** ("lanjut <topik>"): tanpa `konfig.js` → Tahap 2; ada `konfig.js` tanpa persetujuan → pratinjau + dialog Tahap 2; disetujui tanpa `ekspor\` → Tahap 3/4; ada MP4 final → Tahap 5.

## 3. Tahap 2 — Storyboard + build + cek (klik 2)
Baca `references/storyboard.md`, `gaya.md`, `palet.md`, `dunia-topik.md`, `mesin.md` (3D) dan bila perlu `mesin-2d.md` (teks/label/suara); contoh `contoh/kartun-bakso-motor-3d.konfig.js` (cerita) dan `contoh/infografis-uang-3d.konfig.js` (explainer).
1. **Riset**: setiap fakta/angka dicek lewat web, sumber dicatat di `_kerja\naskah.txt` (`# sumber: …`); tanpa sumber → kalimat umum atau hitungan yang bisa dibuktikan.
2. **Naskah**: hook 3 detik → isi → penutup + ajakan; satu baris = satu ide; ±2,3 kata/dtk.
3. **Storyboard** (tabel): `# · waktu · keadaan · dunia 3D + tokoh/aksi · kamera 3D · teks atas (bila penting) · subtitle · SFX · transisi`. Perubahan visual tiap 1,5–3 dtk; transisi bervariasi.
4. **Build**: tulis `_kerja\konfig.js` (komentar kepala = paket visual; `KONFIG` dengan `gaya`, `suasana`, `tokoh` (pakai `tubuh`, `motif`, `kerah` supaya tiap tokoh berbeda); `ADEGAN` dengan `suasana`, **kamera = daftar BIDIKAN otomatis** (`mesin.md` §4a: satu entri per baris dialog, yang bicara selalu terlihat; koordinat manual hanya untuk adegan tanpa tokoh), `dunia(d)` (benda dari katalog dulu: karung, timbangan, pintu, lampu gantung …; pose bercerita + `tunjukKe`/`raih` sebelum pose sendiri) dan bila perlu `gambar(g)` untuk teks/label 2D), lalu `python3 scripts/jalankan.py rakit _kerja/konfig.js _kerja/film.html`. Warna benda dari palet (`P.utama`, `campur(P.latar, P.gelap, .3)`); benda khas cerita yang belum ada dibangun dari bentuk dasar di `d.grup`.
5. **Cek kualitas sendiri (wajib, berulang sampai beres)**:
   - `python3 scripts/jalankan.py cek _kerja/film.html` sampai **BERES** (teks keluar layar/zona tombol, teks bertabrakan, subtitle menutupi wajah tokoh 3D, bingkai kosong, galat JavaScript/3D, WebGL, **clipping 3D**: tokoh menembus benda/tokoh lain, benda saling tembus, kamera di dalam benda; **wajah tokoh yang bicara**: di luar bingkai, membelakangi kamera, tertutup benda/tokoh, terlalu kecil, **mulut tertutup tangan/properti sendiri**; **latar kosong** (kamera melihat ke luar ruang), kamera di bawah lantai, **teks menutupi wajah**; cara memperbaiki di `references/mesin.md` §4a, §9b, §9c). Saran juga dibaca (tokoh berpose sama > 3 dtk, teks atas terlalu lama, ritme).
   - `python3 scripts/jalankan.py kontak _kerja/film.html _kerja/kontak.jpg --n 24`, lalu **lihat sendiri** dan nilai jujur dengan checklist `storyboard.md` §5 + §5b: subjek tidak terpotong (9:16 sempit: lebar terlihat ±0,45 × jarak kamera), tidak ada benda menutupi wajah, bayangan menapak, tokoh duduk tepat di jok, warna mengikuti keadaan, aksi sesuai storyboard, kamera bergerak. Bingkai tertentu: `--t 0.5,1.2,3.0`.
   - **WAJIB, setelah `cek` BERES**: `python3 scripts/jalankan.py lembar _kerja/film.html _kerja/lembar` lalu **buka dan lihat SETIAP lembar** (8×3 bingkai per detik, seluruh durasi). Cari: wajah yang bicara tertutup atau terlalu dekat/jauh, tangan/kepala tokoh lain menyusup ke bingkai, pose yang tidak terbaca dari sudut kamera (lengan menunjuk tersembunyi di balik badan, kepala menunduk terlalu dalam), benda yang tidak terbaca (bentuk salah), teks yang tertinggal, latar kosong, kamera melompat. Uji Timbangan Daging v2 lolos `cek` tetapi pengguna masih menemukan bug — semuanya terlihat di lembar per detik. Catat nomor detik tiap masalah, perbaiki, rakit, cek, lembar lagi.
   - Perbaiki, rakit, cek lagi. Jangan mengirim pratinjau sebelum `cek` BERES **dan** semua lembar per detik sudah dilihat tanpa temuan.
6. **Pratinjau**: `python3 scripts/jalankan.py ekspor _kerja/film.html _kerja/pratinjau.mp4` (±5–6× durasi di laptop saya; jalankan di latar dan sebut perkiraannya), lalu kirim **pratinjau.mp4 + film.html**.
7. Di chat: baris status, hook + logline, **tabel storyboard**, keadaan + warna dominan tiap adegan, sumber, teks voice over siap tempel (bila narasi), musik.
8. **Dialog persetujuan** (satu dialog, dua pertanyaan): (1) **Setujui & render (Rekomendasi)** · **Revisi scene/tampilan** · **Revisi naskah/fakta** · **Ganti konsep/durasi**; (2) **Unggah ke channel mana?** (satu opsi per channel di `_youtube/config.json`, `default_channel` = Rekomendasi; di cloud hanya `posting_accounts` Balasin) + `Jangan unggah, simpan MP4 saja`. Ini satu-satunya titik sebelum kredit dipakai.

## 4. Tahap 3 — Suara (tanpa berhenti)
Sama persis dengan motion-graphic (`references/mesin-2d.md` §7 + §9): tanpa narasi → subtitle dari `KONFIG.teks`; narasi ElevenLabs (PC `D:\automation\Video AI\_elevenlabs\`, cloud konektor, Ricky `2VMRgGhWXuHXWN2xNHM8`, `estimate_only` dulu) atau rekaman saya → `rakit … --naskah _kerja/naskah.txt --narasi _kerja/audio/narasi.mp3` (atau `--baris DIR`). Waktu adegan sebaiknya rujukan baris (`mulai: 'L04'`), kejadian di kata (`muncul: 'L05.w3'`, `pose: [['L05.w2', 'tunjuk']]`), tokoh `bicara: 'L03'` (mulut + angguk + gestur ikut kata). Narasi lebih pendek/panjang dari storyboard → durasi ikut narasi (rujukan baris + `--mulai 0.3`). Musik sintesis dinaikkan ±2,5× saat ada narasi; musik/SFX berkas Epidemic lewat `--musik` / `--sfx DIR` (tanya dulu sebelum mengunduh). **Musik Epidemic = musik latar per babak** (`references/mesin-2d.md` §7b, `scripts/musik_epidemic.py`): bagi cerita jadi 3–5 babak emosi, satu lagu tanpa vokal per babak dipotong resmi sepanjang babaknya (EditRecording), dirakit dengan kekerasan sama + crossfade, ditanam `--musik … --vol-musik 1.15 --redam-musik .2 --musik-utuh`, lalu `musik_epidemic.py cek` sampai BERES (dialog tetap jelas, musik terasa di sela dialog). Jangan satu lagu datar sepanjang video.

## 5. Tahap 4 — Render (tanpa berhenti)
1. Rakit final, `cek` BERES, `lembar` per detik dilihat lagi SEMUA (setelah waktu ikut suara: mulut, pose, bidikan per kalimat, SFX tepat di kata).
2. `python3 scripts/jalankan.py ekspor _kerja/film.html _kerja/ekspor/<Judul>.mp4` → H.264 High 1080×1920 (atau 1920×1080), 30/60 fps, 10/14 Mbps (tanpa batas ukuran: unggah YouTube dari PC), AAC (Chrome/Edge Windows) atau Opus (Chromium Linux). Unggah lewat Balasin (cloud, ≤ 50 MB): tambah `--batas-mb 46`. Laptop saya (Vega 8): ±5,7× durasi video (22 dtk ≈ 2 menit); jalankan di latar.
3. Lihat 4–6 bingkai MP4-nya sendiri (ffmpeg/ffprobe hanya untuk memeriksa).
4. **Thumbnail (wajib, tanpa bertanya)**: bingkai bersih `jalankan.py thumbnail` (`KONFIG.thumbnail.t`) → `<folder video>/_kerja/thumbnail/bingkai/`, lalu `_thumbnail/otomatis.py "<folder video>" --teks "…" --judul "…" --gaya motion-graphic-3d --subjek-desk "…" --latar-desk "…"` → `thumbnail.png` 16:9 + `thumbnail_short.png` 9:16 + `prompt-thumbnail.md` (`references/kemasan.md` §3).
5. **Tanpa browser tanpa layar / tanpa WebGL**: kirim `film.html`, minta saya membuka di Chrome/Edge dan menekan **Ekspor MP4**.

## 6. Tahap 5 — Paket unggah
`references/kemasan.md`: 3 judul (terkuat dipakai otomatis), deskripsi pendek **tanpa menyebut alat atau cara video dibuat** (HTML, kode, Three.js, AI, Claude, ElevenLabs), 3–5 hashtag, thumbnail + prompt, tag, komentar sematan. Unggah lewat skill `unggah-youtube` ke `D:\automation\Video AI\Hasil Video\Motion Graphic 3D\Umum\<tanggal> <Judul>\` (`categoryId` sesuai topik, bawaan 27); di cloud lewat Balasin AI sesuai CLAUDE.md. Salin `film.html` ke akar folder video sebagai `<Judul>.html`.
**Kiriman file**: **MP4 final + file HTML**, tidak lebih. Laporan satu pesan: link/jadwal tayang, judul + 2 cadangan, thumbnail 16:9 + 9:16 (dilihat sendiri) + prompt A, deskripsi, hashtag.
Menu penutup: **Video berikutnya (Rekomendasi)** · **Versi rasio lain** · **Revisi scene** · **Versi 2D (motion-graphic)**.

## 7. Standar wajib (rinci di references)
- **Deterministik**: dunia dibangun sekali per adegan (`dunia(d)`), gerak fungsi dari `t` (`anim`, `muncul`, `jalan`, `gerak(d, t)`); tanpa `Math.random()`, `Date`, `setTimeout`, animasi CSS (pakai `acak(n)`/`derau(x)`).
- **Tanpa aset luar, tanpa internet, tanpa Google Fonts**: semua benda dibangun dari bentuk dasar + tekstur kanvas; file jalan offline.
- **Kamera 3D bergerak di setiap adegan** (dolly, orbit, ikut, geser; `gaya.md` §2), ada kedalaman (benda depan + subjek + latar + kabut), satu gerak utama per adegan, sudut bervariasi antar-adegan.
- **Tokoh hidup** (permintaan 24 Nov 2026: tidak kaku): pose/ekspresi baru tiap 1,5–2,5 dtk, `bicara` saat dialog, `jalan`/`lari` untuk masuk-keluar, `lihat` ke lawan bicara, efek emosi di momen kunci; akting otomatis (napas, berat badan, mata, gestur saat bicara) jangan dimatikan tanpa alasan.
- Warna kaya mengikuti keadaan adegan; garis tepi kartun bernuansa (otomatis); bayangan berwarna; lampu menyala (`d.lampu`, `d.sorot`); subtitle kecil gaya film; teks atas hanya hal penting; hook kuat 3 dtk dengan **benda utama topik**; SFX di setiap kejadian; ≥ 4 jenis transisi.
- **Tanpa clipping** (permintaan 26 Nov 2026, `mesin.md` §9b): kaki menapak dan lengan/tangan tak tembus diurus mesin otomatis; tokoh menembus benda, benda saling tembus, dan kamera di dalam benda harus 0 di `cek` (geser posisi/lintasan, bukan `padat: false`).
- **Tetap cepat** (`mesin.md` §9): ≤ 16 gedung, ≤ 250 partikel, ≤ 5 tokoh, lampu berbayang ≤ 2 per adegan; ukur md/bingkai bila adegan terasa berat (> 45 md → sederhanakan).
- Checklist sebelum kirim: durasi pas, tidak ada bingkai kosong, tidak ada subjek/teks terpotong, teks terbaca ≥ 2 dtk, **tidak ada karakter/logo/merek pihak lain** (uang, kendaraan, gedung generik), fakta hanya dari sumber yang dicek.

## 8. Jangan
- Jangan mengubah skill `motion-graphic` (2D) dari skill ini; fitur baru 3D masuk `assets/mesin3d/` skill ini.
- Jangan membuat "slide 3D": satu benda berputar di latar polos tanpa dunia, tokoh, atau perubahan. Setiap adegan punya tempat/latar, subjek, kamera bergerak, dan detail sekunder (partikel, lampu, benda kecil).
- Jangan menaruh tokoh di adegan yang storyboardnya tidak menyebut tokoh, atau mengganti aksi dengan pose generik; jangan membiarkan tokoh berpose sama > 3 dtk.
- Jangan mengubah rupa tokoh bawaan (hanya kulit, rambut, baju, aksesori lewat `KONFIG.tokoh`).
- Jangan berjajar lebar di 9:16 (subjek terpotong); jangan benda di antara kamera dan wajah; jangan teks penting di bawah 76% tinggi atau di kanan bawah.
- Jangan memakai satu palet untuk seluruh video, pastel seragam, atau neon; warna ikut keadaan tiap adegan.
- Jangan mengubah blok `inti` templat atau `assets/mesin3d/` per video. Butuh fitur mesin baru → ubah mesin, uji ulang kedua contoh (`cek` BERES + `kontak` dilihat + ukur md/bingkai + `ekspor` sekali), catat di `references/mesin.md`.
- Jangan membiarkan teks atas tampil sampai adegan habis: beri `keluar` (kalimat yang sedang diucapkan saja, 2–4 dtk).
- Jangan memakai pose yang tangannya dekat wajah (`lapKeringat`, `peganKepala`, `menangis`, `tolak`) saat tokoh itu sedang bicara di close-up; `cek` menolaknya.
- Jangan menulis kamera manual (koordinat) untuk adegan dialog; pakai bidikan otomatis. Jangan memotong ke sisipan benda di tengah kalimat tokoh tanpa wajahnya terlihat (taruh sisipan di sela kalimat atau beri `suaraLuar`).
- Jangan memakai pose buatan sendiri bila ada pose bawaan yang mendekati; jangan memakai `pegang` fungsi Three.js mentah bila properti ada di daftar.
- Jangan memuat apa pun dari internet di dalam HTML (CDN Three.js, font, gambar).
- Jangan menyembunyikan clipping dengan `padat: false`, kamera yang memotong, atau benda penutup; perbaiki penempatannya. `padat: false` hanya untuk yang memang menembus (hantu, cahaya).
- Jangan mengirim lebih dari MP4 final + HTML setelah video jadi.
