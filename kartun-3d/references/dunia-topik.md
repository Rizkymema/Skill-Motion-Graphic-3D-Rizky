# Isi gambar mengikuti storyboard dan topik

Dibaca di Tahap 1 (membuat 3 konsep) dan Tahap 2 (storyboard + build). Gaya bahan 3D (`kartun`, `clay`, `mainan`, `lowpoly`) menentukan **cara menggambar**; storyboard dan topik menentukan **apa yang digambar**. Tidak ada tokoh, tempat, atau benda "bawaan": video tentang motor, pajak, dan hantu tidak boleh terlihat seperti video yang sama dengan warna ditukar. Aturan sumber dan batas klaim tetap dari `topik/<kategori>.md`.

## 1. Bila saya mengirim storyboard: ikuti baris demi baris
Permintaan pengguna 24 Nov 2026: "karakternya jangan selalu ada, **mengikuti storyboard atau topik cerita saya**; kalau ada adegan karakternya bawa motor, atau makan dan lain-lain, ikuti yang ada di storyboard, subtitle dan teks atas menyesuaikan".
1. Satu baris storyboard = satu adegan (atau lebih bila isinya beberapa kejadian). **Jangan menambah, membuang, atau menyusun ulang adegan** kecuali saya minta; boleh menambah detail kecil yang mendukung.
2. Terjemahkan dulu ke tabel (di chat, sebelum build) lalu tulis apa adanya ke konfig:

| # | Tempat + keadaan (`suasana`) | Tokoh? | Aksi (pose / properti) | Benda bertulisan | Teks atas? | Subtitle |
|---|---|---|---|---|---|---|
| 1 | jalan sore (`oranye`) | Pak Joko | naik motor (`d.motor` + `naik` + `naikMotor`) | — | tidak | "Sore itu, …" |
| 2 | warung bakso (`sorot`) | Pak Joko | duduk makan (`naik: kursi` + `dudukMakan` + `sendok`, `d.mangkuk` + `d.uap`) | `d.papan` BAKSO | tidak | "Perutnya …" |
| 3 | close-up mangkuk (`oranye`) | **tidak ada** | — | — | tidak | "Kuahnya …" |
| 5 | malam, jalan (`malam`) | Pak Joko | mendorong motor (`dorong` + `jalan`) | — | **BENSIN HABIS** | "Pas mau pulang, …" |

3. **Tokoh hanya ada bila storyboard menyebutnya** di adegan itu. Adegan boleh tanpa tokoh: benda utama, tempat, close-up benda, diagram, peta, kamera menyusuri dunia. Tokoh yang sama dipakai konsisten di seluruh video (nama, wajah, kostum; ganti kostum hanya bila ceritanya). **Rupa tokoh 3D bawaan skill tidak diubah** (`KONFIG.tokoh`: kulit, rambut, baju, … saja).
4. **Aksi dari storyboard → pose dan properti** (tokoh 3D: `references/mesin.md` §7). Jika aksinya belum ada, buat sendiri; jangan mengganti aksi dengan pose generik:

| Aksi di storyboard | Pose / cara | Properti |
|---|---|---|
| berdiri, bicara, menunjuk, lambai | `berdiri` `tunjuk` `lambai` `presentasi` + `bicara` | `papan`, `kartu` |
| berjalan, berlari, pergi | `jalan: { dari: [x, z], ke: [x, z], mulai, lama, lari }` | — |
| naik motor | `const m = d.motor({ nama, anim })` lalu tokoh `naik: m, pose: 'naikMotor'` (ikut melaju), kamera `ikuti` | helm: `topi: 'helm'` |
| mendorong motor/gerobak | `dorong` + `jalan` di belakang kendaraan yang ber-`anim` sama | `d.motor` |
| duduk makan | `naik: d.kursi(…)` + `dudukMakan` + `d.meja` | `pegang: 'sendok'`, `d.mangkuk` di meja |
| makan sambil berdiri | `makan` / `makanKiri` | `mangkuk` `roti` |
| minum | `minumBerdiri` atau `minum` (duduk) | `gelas` `cangkir` |
| membaca | `baca` | `koran` `buku` |
| memakai HP | `pegangHp` / `dudukHp` | `hp` |
| mengemudi, menyetir | `naik: d.mobil(…)` + `setir` | `d.mobil` |
| tidur, berbaring | `tidur` (rebah) di atas `d.kasur` / lantai | `d.kasur`, `efek: 'zzz'` |
| takut, kaget, sedih, marah | `takut` `kaget` `sedih` `marah` + `ekspresi` | — |
| mengetik, menelepon, bertepuk, mengangkat | `ketik` `telepon` `tepuk` `angkat` `joget` | `d.laptop`, `pegang: 'hp'` |
| aksi lain (memasak, menanam, …) | `KONFIG.pose3d = { nama: { lKi, lKa, kKi, kKa, badan, kepala, … } }` | `pegang: (grup, d, tokoh) => …` membuat benda sendiri di tangan |

   Benda khas cerita yang belum ada di katalog dibangun dari bentuk dasar 3D (`kotak` `bola` `silinder` `kapsul` `kerucut` `donat` `ekstrusi`) di dalam `d.grup` lewat fungsi di blok konfig, seperti `celengan` di `contoh/infografis-uang-3d.konfig.js`.
5. **Teks mengikuti storyboard juga**:
   - **Subtitle** selalu kecil dan biasa di bawah (gaya film, `references/mesin.md` §7), mengikuti narasi/teks cerita; jangan besar dan jangan per kata kecuali saya minta.
   - **Teks atas hanya bila penting**: angka kunci, nama, istilah baru, peringatan ("BENSIN HABIS"), judul bab bila storyboard memintanya. Kebanyakan adegan **tanpa teks atas**. Ukuran sedang (±70–90 px di 9:16), satu atau dua baris.
   - Informasi dunia cerita lewat **benda bertulisan** (`d.papan`, layar `d.hp`/`d.tv`/`d.laptop` berisi grafik 2D, `d.teks` 3D) daripada teks melayang.

## 2. Bila saya hanya memberi topik: susun storyboard sendiri (paket visual)
Isi satu paket per konsep, 8 baris, lalu jadikan storyboard:
1. **Inti topik** (satu kalimat). 2. **Keadaan tiap babak** (tempat + waktu + perasaan → suasana, `references/palet.md`). 3. **Dunia/tempat**. 4. **Benda utama** yang tampil besar di hook. 5. **Tokoh** (hanya bila ceritanya butuh orang; kalau bendanya cukup kuat, tanpa tokoh). 6. **Diagram/data** 3D (`d.batang`, `d.pai`, `d.panah`, `d.koin`/`d.uang` bertumpuk, `d.teks` angka raksasa) atau 2D di layar HP/TV (`grafikGaris`, `donat`). 7. **Hook 3 detik** yang spesifik ke topik ini. 8. **Suara** (musik + 3–4 SFX khas).

Titik awal per kategori (ambil, gabung, atau ganti):

| Kategori | Tempat | Benda utama (contoh) | Diagram | Suara |
|---|---|---|---|---|
| sains-alam | langit, bukit, laut, hutan, laboratorium sederhana | matahari, air, molekul, es, gunung | diagram sebab-akibat, molekul bulat, garis suhu | `pad`, `ding` saat penemuan |
| kesehatan | kamar, dapur, kamar mandi, klinik terang | gigi, tulang, lambung, gelas, kasur (disederhanakan) | `batang` perbandingan, `donat`, garis waktu | `pad`, `napas`, `jantung` |
| kebiasaan | kamar, kantor kecil, jalan, kafe | HP, kasur, kopi, jam alarm | `batang`, siklus panah, centang/silang | `pulsa`/`ceria`, `notif`, `jam` |
| tips-rumah | dapur, kebun, teras, bengkel kecil | alat, galon, kabel, pipa, tanaman | langkah 1-2-3 bernomor, sebelum/sesudah | `ceria`, `klik`, `pop` |
| otomotif | jalan, bengkel, SPBU | motor/mobil (disederhanakan), busi, oli, ban, rem | `batang` biaya, penampang bagian + panah aliran | `pulsa`, `dengung`, `impact` |
| keuangan | kantor, kasir, toko, ruang keluarga, layar HP | koin, uang, dompet, HP, nota | `grafikGaris` (bunga), `donat` (alokasi), `batang` KAMU vs LAWAN | `pulsa`, `kaching`, `ding` |
| teknologi | meja kerja, kota malam, layar | HP, chip, awan data, gembok | alur panah, kartu fitur, `batang` kecepatan | `pulsa` sedang, `klik`, `data` |
| sejarah | desa, pelabuhan, benteng, peta | peta, kapal, dokumen, benda era itu | garis waktu, peta berpanah, kartu tanggal | `pad` rendah, `murmur`, `jam` |
| berita-politik | gedung generik, ruang sidang, jalan, layar berita | dokumen, palu, kotak suara (tanpa lambang resmi/merek) | `batang`/`donat` hasil, garis waktu kebijakan | `pad` datar, `klik`, `data` |
| misteri-horor | rumah tua, hutan, jalan sepi, lorong | pintu, lampu minyak, jendela, bayangan | peta lokasi, garis waktu kejadian | `tegang`, `dengung`, `jantung` |
| cerita-hiburan | tempat cerita (kantor, pasar, sekolah, rumah) | benda lelucon cerita | jarang | `ceria`, `pop`, `tawa` |

Topik di luar daftar: tanya 5 hal: **di mana** paling mudah dibayangkan, **benda apa** yang paling dikenal, **siapa** yang terdampak (kalau tidak ada orangnya, jangan memaksa tokoh), **apa yang bisa diukur**, dan **bagaimana rasanya**. Benda yang belum bisa dibangun dari bentuk dasar diganti `d.ikon` 3D atau perbandingan angka; jangan menunda.

## 3. Variasi supaya tiap video terasa baru
- Tokoh berbeda (nama, rambut, baju, warna kulit) tiap video, kecuali serial.
- Tempat pembuka berbeda; warna dominan pembuka berbeda dari video sebelumnya.
- Benda utama dan bentuk data berbeda; jangan tiga video berturut-turut dengan diagram batang sebagai klimaks.
- Tata kamera bergantian (dolly, orbit, ikut, low/high angle; `references/gaya.md` §2); transisi menurut makna (`references/mesin-2d.md` §8).

## 4. Cek akhir (tambahan di `references/storyboard.md` §5b)
- [ ] Tiap adegan sesuai baris storyboard (tempat, aksi, ada/tidaknya tokoh); tidak ada tokoh yang muncul "karena biasanya ada".
- [ ] Hook menampilkan **benda utama topik ini**, bukan latar generik.
- [ ] Subtitle kecil gaya film; teks atas hanya di adegan yang butuh penekanan.
- [ ] Tidak ada elemen yang bisa dipakai di video topik lain tanpa diubah.
