# Gaya 3D, tata kamera, dan tata gerak

Dibaca di Tahap 1 (3 konsep) dan Tahap 2 (build). Gaya menentukan **bahan dan cara menyala**; storyboard dan topik menentukan **apa yang ada di dunia** (`references/dunia-topik.md`); keadaan adegan menentukan **warna dan cahaya** (`references/palet.md`).

## 1. Gaya bahan (`KONFIG.gaya`) — bawaan **`sinematik`** (sejak 27 Nov 2026)
**`sinematik`** (bawaan, Rekomendasi): tokoh dan benda tetap kartun, tetapi dirender seperti film — cahaya HDR, bayangan lembut, relief bahan, latar kabur menurut jarak ke subjek, bloom lampu, warna film (sorot hangat, bayang dingin), vignet, butir halus, garis tepi tipis (`mesin.md` §5b). Empat gaya di bawah tetap tersedia; `KONFIG.sinema: true` menambahkan pasca-proses sinematik ke gaya mana pun. Video yang seluruhnya 2D datar: skill `motion-graphic` (terpisah, gaya berbeda).

| | Kartun (bawaan) | Clay | Mainan | Lowpoly |
|---|---|---|---|---|
| `gaya` | `kartun` | `clay` | `mainan` | `lowpoly` |
| Rasa | kartun 3D seperti RicksClips3000: plastik lembut, **garis tepi gelap bernuansa** (3,4 px tetap di layar), bayangan lembut berwarna, warna palet jenuh | tanah liat/stop-motion: doff, tanpa garis, hangat | figur mainan plastik mengilap: pantulan studio jelas | sisi rata bersudut (flat shading), geometri lebih sederhana |
| Cocok untuk | cerita orang, sebab-akibat, edukasi bercerita, horor ringan, keuangan, apa pun (Rekomendasi) | anak/keluarga, tips rumah, makanan, cerita hangat | produk, teknologi, gaya hidup, iklan | sains, peta, data, dunia luas yang banyak bendanya |
| Latar khas | dunia cerita (`langit` + `tanah` + `kota`/`ruang`/`warung`) atau `studio` | `studio` dengan `pola` (`karpet`, `kayu`) | `studio` polos terang, benda besar di tengah | `langit` + `bukit` + `pohon` cemara, `studio` |
| Tokoh | tokoh 3D bawaan (§ mesin.md 7) | sama, tanpa garis | sama, mengilap | sama, bersisi |

Konsep A di Tahap 1 selalu **`sinematik`** dengan keadaan terkuat untuk ceritanya; B dan C beda **dunia dan keadaan/warna** (boleh beda gaya bila cocok). `KONFIG.bahan` menimpa per video (mis. `{ tepi: 5 }` garis lebih tebal, `{ env: .8 }` lebih mengilap).

## 2. Tata kamera 3D (pengganti parallax 2D)
- **Adegan bertokoh: pakai BIDIKAN OTOMATIS** (`mesin.md` §4a), bukan koordinat manual. Satu entri bidikan per baris dialog atau tiap 1,5–3 dtk; yang bicara selalu `bidik`/`b` di `atasBahu`; `dua` untuk pembuka dan reaksi; `benda` untuk sisipan (timbangan, layar, barang bukti) di sela kalimat; `wajah` di kalimat puncak/emosi; `tinggi: 'rendah'` untuk tokoh yang menakutkan/berkuasa.
- **Setiap adegan kamera bergerak**: dolly masuk pelan (bawaan perasaan), dolly keluar (pengungkapan), geser sejajar (perjalanan), orbit (benda utama, data), ikut (kendaraan/tokoh berjalan: `ikuti`), crane naik (penutup), low angle (hal besar/mengancam), high angle (peta, meja, kesepian).
- Satu gerak utama per adegan, ease `inOutSine`/`outCubic`; hentakan pakai `guncang` sesaat atau transisi `kilat`/`zoom`.
- **Komposisi 9:16**: lebar terlihat ≈ **0,45 × jarak kamera** (fov 40–42). Susun benda **bertingkat ke dalam** (depan-tengah-belakang) dan bertumpuk vertikal, bukan berjajar lebar. Subjek di 20–66% tinggi; bagian bawah 26% sering tertutup subtitle/keterangan aplikasi.
- Kedalaman selalu ada: benda depan (meja, tiang, daun) + subjek + latar (kota, bukit, dinding) + kabut jarak; jangan menaruh benda tepat di antara kamera dan wajah.
- Ukuran bidikan tokoh: seluruh badan 4,5–5,5 m · setengah badan 2,3–2,8 m · wajah 1,1–1,4 m (`ke` y ±1,55) · close-up benda ±1–1,5 m dengan orbit.
- Variasikan antar-adegan: jangan dua adegan berturut-turut dengan sudut dan gerak sama.

## 3. Tata gerak (wajib)
- Perubahan visual tiap 1,5–3 dtk: benda `muncul` bergiliran (stagger 0,1–0,3 dtk, `masuk` pop/naik/jatuh/tumbuh), pose/ekspresi tokoh berganti, angka/grafik tumbuh, partikel, efek emosi.
- Benda penting masuk dengan `pop` (membal) atau `jatuh` (memantul); keluar dengan `hilang`. Benda melayang (ikon, koin) pakai `ayun` + `putarTerus` pelan.
- Tokoh: pose baru tiap 1,5–2,5 dtk, `bicara` saat dialog/narasi tokoh, `jalan` untuk masuk/keluar bingkai, `lihat` ke tokoh lain saat bercakap, `efek` emosi di momen kunci. Jangan biarkan tokoh berdiri sama > 3 dtk.
- Kendaraan bergerak lewat `anim`/`ikutJalur` (roda ikut berputar) dan kamera `ikuti`.
- Transisi menurut makna (mesin-2d.md §8): `whip` pindah tempat, `zoom` masuk detail, `iris` match cut bentuk bulat, `kilat` hentakan/angka, `gelap` ganti suasana emosional, `glitch` fakta mengejutkan, `wipe`/`geser` daftar. ≥ 4 jenis per video.

## 4. Lapisan 2D di atas 3D
- **Subtitle** kecil gaya film (otomatis). **Teks atas** 2D (`g.teksMasuk`) hanya untuk hal penting: angka kunci, peringatan, judul bab; 70–92 px di 9:16, tepi `P.gelap`, aksen `P.aksen`/`P.kedua`.
- Info dunia cerita lewat benda 3D bertulisan (`d.papan`, layar `tv`/`hp`/`laptop` berisi grafik 2D, `d.teks` 3D di dinding/lantai) lebih baik daripada teks melayang.
- Label yang menunjuk benda: `g.labelDi(ref, 'TEKS')` (ikut benda saat kamera bergerak). Balon bicara: `g.balon(…, { ke: g.mulut('id') })`.
- Teks 3D (`d.teks`) untuk judul besar di dunia (pembuka, nama tempat, angka raksasa); jangan dipakai untuk kalimat panjang.

## 5. Penerapan cepat per jenis video
| Jenis | Susunan adegan khas |
|---|---|
| cerita orang (storyboard) | dunia cerita per tempat (jalan, warung, kamar, kantor), tokoh beraksi, kamera ikut/dolly, keadaan berganti per tempat — `contoh/kartun-bakso-motor-3d.konfig.js` |
| explainer/infografis | `studio` per babak berganti keadaan, benda utama raksasa (HP, koin, organ disederhanakan), `batang`/`pai`/`panah` 3D, tokoh presenter di samping data — `contoh/infografis-uang-3d.konfig.js` |
| daftar/top-N | satu `studio`, tiap poin benda baru `jatuh` + angka 3D besar + `kilat`/`wipe` |
| sebab-akibat/sains | close-up benda + orbit, `panah` 3D aliran, `partikel` (hujan, gelembung, debu), sebelum/sesudah dengan `whip` |
| horor/misteri | keadaan `malam`/`sorot`, `kabut` dekat (6–25 m), `lampu` berkedip (`kedip`), low angle, `glitch` |
