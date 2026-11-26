# Naskah, storyboard, dan checklist kualitas

Dibaca di Tahap 2. Urutannya: riset → naskah → storyboard (tabel) → konfig → cek → pratinjau.

## 1. Naskah
- **Hook (0–3 dtk)**: satu kalimat tanya atau kejut yang langsung masuk ke inti ("Kenapa judol bikin kamu pasti kalah?"), tanpa salam dan tanpa memperkenalkan diri.
- **Isi**: 3–6 poin; tiap poin = satu kejadian visual. Pakai angka, perbandingan rumahan, atau hitungan sederhana. Satu baris narasi = satu ide, 4–10 kata.
- **Twist/pengungkapan** di ±60–75% durasi (jawaban judul), disiapkan dengan `riser`.
- **Penutup**: kesimpulan satu kalimat + ajakan (follow, bagikan, komentar). Ajakan bisa berupa label di layar.
- Kecepatan ±2,3 kata/dtk. Durasi → jumlah baris: 15 dtk ≈ 5–6 baris · 30 dtk ≈ 10–12 · 60 dtk ≈ 20–25 · 90 dtk ≈ 30–36.
- **Fakta**: setiap angka/klaim dicek lewat pencarian web, sumbernya dicatat (`# sumber:` di `naskah.txt`, lalu di deskripsi bila perlu). Kalau tidak ada sumber: ganti jadi permisalan yang jelas ("misalnya 96%") atau hitungan yang bisa dibuktikan.
- Tidak menyebut atau meniru merek, tokoh, logo, atau kanal lain.

## 2. Tabel storyboard (dikirim di chat Tahap 2)
Satu baris per scene, ringkas:

| # | Waktu | Visual | Kamera | Teks / subtitle | SFX | Masuk |
|---|---|---|---|---|---|---|
| 1 | 0:00–0:03 | HP 3D raksasa, saldo Rp1.000.000 → Rp0 di layar, koin berjatuhan | dolly keluar 2,6 → 3,4 m, guncang saat nol | "KENAPA KAMU PASTI KALAH?" · sub: Kenapa judol bikin kamu *pasti kalah?* | sub, ketik, riser, impact, glitch | — |
| 2 | 0:03–0:06 | ruang malam, tokoh di sofa main HP (`naik: sofa`, `dudukHp`), notifikasi di layar HP | dolly masuk ke setengah badan | sub: Semua berawal dari satu notifikasi. | notif, pop | glitch |
| … | | | | | | |

Tulis juga di bawah tabel: hook + logline, sumber, **keadaan + warna dominan tiap adegan** (mis. oranye → sorot → hijau → malam; `references/palet.md`), **terjemahan storyboard** (tempat, tokoh ada/tidak, aksi, benda bertulisan, teks atas; `references/dunia-topik.md` §1), musik. Kolom tabel di atas ditambah **Keadaan** (suasana adegan) dan **Tokoh/aksi**.

## 3. Dari storyboard ke konfig
- Satu baris tabel = satu objek di `ADEGAN` (`id` pendek, `durasi` atau `mulai`/`akhir`, `masuk`, `suasana`, `kamera` 3D, `sfx`, `dunia(d)`, opsional `gambar(g)` untuk teks atas/label 2D).
- Tanpa narasi: subtitle di `KONFIG.teks` dengan `mulai`/`akhir` tiap kalimat (≥ 1,3 dtk per 3 kata). Dengan narasi: waktu adegan pakai rujukan baris (`mulai: 'L05'`), SFX pakai `'L05.w3'`.
- Waktu kejadian di dalam adegan (masuknya teks, angka mendarat, pose berganti) diselaraskan dengan kata yang diucapkan/ditampilkan subtitle; SFX tepat di kejadian itu.
- Durasi adegan 1,5–6 dtk; adegan lebih dari 4 dtk punya 2–3 kejadian (pose, elemen baru, angka, kamera berbalik).

## 4. Pratinjau
- `jalankan.py rakit` → `cek` (BERES) → `kontak --n 24` (dilihat sendiri) → `ekspor` pratinjau.
- Kirim `pratinjau.mp4` + `film.html`. Di chat sebut cara memutar HTML: buka di Chrome/Edge (PC atau HP), spasi = putar/jeda, panah = per bingkai, tombol Cek/Kontak/Thumbnail/Ekspor MP4.

## 5. Checklist kualitas (diperiksa sendiri dari lembar kontak + `hasilCek`)
**Wajib (gagal = perbaiki sebelum kirim)**
- [ ] `cek` BERES: tidak ada teks keluar layar, teks di zona tombol/keterangan, teks saling menimpa, subtitle menutupi teks/wajah, bingkai kosong, galat JavaScript.
- [ ] Durasi sesuai pilihan (±1 dtk); akhir video tidak terpotong (adegan terakhir ≥ 2 dtk setelah kalimat terakhir).
- [ ] Hook: detik 0 sudah bergerak, inti video terbaca sebelum detik 3.
- [ ] Setiap teks di layar tampil ≥ 2 dtk (kecuali angka yang sedang menghitung).
- [ ] Tidak ada karakter, logo, atau merek milik pihak lain; tiruan dibuat generik.
- [ ] Fakta hanya dari sumber yang dicek (atau permisalan yang ditandai).

**Kualitas (bandingkan dengan motion graphic kanal besar, bukan dengan slide)**
- [ ] Setiap bingkai punya latar berlapis + subjek + detail bergerak; tidak ada area kosong besar di 10–66% tinggi.
- [ ] Kamera 3D bergerak di setiap adegan (dolly/orbit/ikut/geser, `references/gaya.md` §2); ada kedalaman (benda depan + subjek + latar + kabut); tidak ada benda menutupi wajah.
- [ ] ≥ 4 jenis transisi, dipilih menurut makna; fade paling banyak sekali.
- [ ] Tokoh berganti pose/ekspresi mengikuti cerita; mulut bergerak saat bicara.
- [ ] Perubahan visual tiap 1,5–3 dtk (cek "hampir tidak ada perubahan visual" di saran).
- [ ] Palet konsisten 4–5 warna; warna aksen hanya untuk hal penting.
- [ ] SFX di setiap kejadian penting; musik berganti suasana di babak emosional.
- [ ] Subtitle rapi: kecil gaya film, maks. 2 baris, tidak menutupi wajah tokoh.
- [ ] 3D: bayangan jatuh di lantai (benda tidak melayang), tokoh duduk tepat di jok (`naik`), tidak ada benda tembus satu sama lain, subjek tidak terpotong tepi (9:16 sempit: lebar terlihat ±0,45 × jarak kamera).

**5b. Warna dan topik (lihat `references/palet.md`, `references/dunia-topik.md`)**
- [ ] Warna kaya dan berani seperti acuan (RicksClips3000) dan **berganti mengikuti keadaan tiap adegan** (satu warna dominan jenuh per adegan); tidak ada neon, pastel seragam, hitam murni di tepi/bayangan; bayangan berwarna, lampu bercahaya.
- [ ] Keadaan tiap adegan cocok dengan tempat/waktu/perasaannya (malam = kobalt gelap + lampu amber, warung = sorot hangat, siang luar = biru + hijau).
- [ ] **Storyboard diikuti**: tiap adegan sesuai barisnya (tempat, aksi, ada/tidaknya tokoh); tokoh tidak muncul di adegan yang tidak menyebutnya; aksi (naik motor, makan, mendorong, …) digambar sebagai aksinya, bukan pose generik.
- [ ] **Teks**: subtitle kecil biasa gaya film di bawah (tidak besar, tidak per kata); teks atas hanya pada hal penting (angka, nama, istilah, peringatan); info dunia lewat benda bertulisan.
- [ ] Benda jauh memudar oleh kabut (otomatis), benda dekat jenuh; teks terbaca (tepi `gelap`), aksen hanya pada hal penting.
- [ ] Hook menampilkan **benda utama topik ini**; tempat, tokoh, dan diagram spesifik topik (bukan yang bisa dipakai di video topik lain).
- [ ] Tokoh, tempat pembuka, dan bentuk data berbeda dari video sebelumnya bila ada.

## 6. Kelemahan umum yang harus dihindari (dari contoh lama saya, "kekalahan-judol.html")
| Kelemahan | Ganti dengan |
|---|---|
| kartu statis di latar gelap polos, area kosong besar | latar berlapis (ruang, kota, sinar, kisi) + cahaya + partikel |
| tokoh dengan pose yang sama berulang | pose dan ekspresi berganti per kalimat, jalan, duduk, pegang HP |
| tanpa kamera, tanpa kedalaman | keyframe kamera + 3 lapis parallax + guncang di hentakan |
| subtitle 84 px yang memenuhi layar | subtitle 66 px, maks. 3 kata, kata aktif tersorot |
| transisi hanya fade/zoom/glitch/hitam | 9 jenis transisi bermakna (whip, iris match cut, wipe berpita, kilat, …) |
| grain acak (`Math.random`) dan rekam layar | grain deterministik + ekspor MP4 bingkai demi bingkai dari HTML |
