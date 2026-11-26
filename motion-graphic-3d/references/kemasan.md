# Paket unggah (Tahap 5)

Semua ditulis ke `info YouTube.md` di folder video; `youtube.json` dibuat oleh skill `unggah-youtube`. Isi yang perlu disalin juga ditulis di laporan.

## 1. Judul (tulis 3, yang terkuat dipakai otomatis)
Maks. ±60 karakter, sama janji dengan hook dan thumbnail:
- pertanyaan yang dijawab video: "Kenapa Judol Bikin Kamu Pasti Kalah?"
- angka kejut: "Rp1 Juta Diputar 50 Kali, Sisa Berapa?"
- akibat/peringatan: "Satu Notifikasi Ini Bisa Bikin Hidupmu Berantakan"
Tanpa huruf kapital semua, tanpa umpan klik palsu, tanpa merek. Dua judul lain jadi cadangan di laporan.

## 2. Deskripsi (pendek, gaya caption)
Maks. ±5 baris (±400 karakter) sebelum sumber dan hashtag:
1. Jawaban/inti dalam satu–dua kalimat.
2. Satu pertanyaan ke penonton yang memancing komentar.
3. `Komen <KATA>` + hadiah nyata yang bisa dikirim lewat balasan komentar (checklist, tabel, hitungan).
4. `Sumber:` maks. 3 baris bila ada angka bersumber (permisalan/hitungan tidak perlu).
5. Ajakan follow satu baris.
6. 3–5 hashtag spesifik topik (`#judol #judionline #keuangan`), plus `#shorts` untuk 9:16.
**Jangan ditulis**: alat atau cara video dibuat (HTML, kode, JavaScript, AI, Claude, ElevenLabs, "animasi buatan …"), ringkasan panjang, daftar bab untuk Shorts. `synthetic: false` (animasi, bukan konten realistis).

## 3. Thumbnail
- **Bingkai bersih** → `_kerja/thumbnail/bingkai/`: `KONFIG.thumbnail = { t }` **tanpa `teks`** → `jalankan.py thumbnail _kerja/film.html "<folder video>/_kerja/thumbnail/bingkai/bingkai-1.png"` (subtitle disembunyikan); ganti `t` lalu ulangi untuk 2–3 bingkai (subjek besar dan jelas).
- **Subjek (hasil terbaik)**: tokoh bergaya film ini dari Flow dengan prompt B → `_kerja/thumbnail/potong/`; atau gambar dari saya.
- **Tata letak** (`--tata`, bawaan auto): judol/uang/isu → `label`, cerita/kebiasaan → `sorot`, data/sejarah → `kertas`, kejahatan/misteri → `dosir`.
- **Wajib di setiap video, tanpa bertanya** (aturan semua skill sejak 25 Nov 2026, `_thumbnail/PANDUAN.md` §0 + §5). Hasilnya selalu bergambar: kalau bingkai bersih kurang dari 4, mesin memotret sisanya dari MP4 final.
- Jalankan: `<py> <repo>/_thumbnail/otomatis.py "<folder video>" --teks "<2–5 kata, satu *kata*, beda dari judul>" --judul "<judul terpilih>" --gaya motion-graphic-3d --subjek-desk "<subjek, bahasa Inggris, tanpa tempat>" --latar-desk "<tempat/suasana, bahasa Inggris>"` → `thumbnail.png` (16:9) + `thumbnail_short.png` (9:16) + `prompt-thumbnail.md` di akar folder video.
- Lihat kedua hasil di ±160 px (teks terbaca, subjek tidak tertutup, tanpa sisa caption). Laporan menyertakan judul terpilih + 2 cadangan dan **prompt A** dari `prompt-thumbnail.md` (siap ditempel ke Gemini/ChatGPT/Flow).

## 4. Lainnya
- **Caption IG/TikTok**: 1 kalimat inti + 1 pertanyaan + `Komen <KATA>` + 3–5 hashtag.
- **Balasan komentar <KATA>**: isi hadiahnya langsung.
- **Komentar sematan**: satu pertanyaan pengalaman.
- **Tag**: 15–20 (topik, istilah, pertanyaan yang dicari orang).
- **Kategori**: bawaan `categoryId` 27 (Pendidikan); 24 (Hiburan) untuk cerita/komedi, 22 untuk opini/gaya hidup.

## 5. Unggah
Lewat skill `unggah-youtube`, folder **`Hasil Video\Motion Graphic 3D\Umum\<tanggal> <Judul>\`** (`D:\automation\Video AI\Hasil Video\Motion Graphic 3D\Umum\…`; cloud relatif ke root repo): MP4 final + `thumbnail.png` + `youtube.json` + `info YouTube.md` + `<Judul>.html` (file animasi, permintaan saya), lalu `_kerja\` dibuang setelah terunggah (kecuali mau revisi). Channel = pilihan di dialog persetujuan Tahap 2. Di cloud ikuti bagian "Sesi cloud" CLAUDE.md (Balasin AI, MP4 ≤ 50 MB; ekspor bawaan sudah dibatasi ±46 MB).
**Kiriman file ke saya**: MP4 final + file HTML. Laporan satu pesan: link/jadwal tayang, judul + 2 cadangan, deskripsi, hashtag, ide thumbnail.

## 6. Evaluasi hari ke-7
Bandingkan retensi 3 detik pertama, rata-rata durasi tonton, share, dan komentar <KATA> antar gaya (flat, neon, kertas). Gaya dengan retensi tertinggi jadi konsep A (Rekomendasi) di proyek berikutnya.
