# Hook: tiga detik pertama yang menentukan FYP

Dibaca di Tahap 1 (topik) dan Tahap 2 (naskah + storyboard) skill `kartun-stickman-3d` (semua topik), juga `film-ai` (gaya realistis dan pixar) dengan penyesuaian. Di mesin kartun 3D: judul hook = `layar` gaya `judul`, bunyi khas = `bunyi` di t 0. Algoritma Shorts/Reels/TikTok menilai video dari **berapa banyak orang yang bertahan lewat detik ke-3** dan berapa yang menonton sampai habis; yang kalah di tiga detik pertama tidak pernah sampai ke FYP, sebagus apa pun isinya. Jadi hook bukan pembuka, hook adalah alasan orang tidak menggeser.

## 1. Hukum tiga detik
| Detik | Yang harus terjadi | Alasan |
|---|---|---|
| 0,0 | Bingkai pertama sudah bermuatan: wajah dengan emosi, benda yang aneh, atau akibat (dipinjam dari akhir cerita). Kamera **sudah bergerak** (zoom/geser), bukan diam. Bunyi khas film terdengar. | Jempol memutuskan sebelum otak membaca. |
| 0,0–0,4 | Kata pembuka seri (`Tahukah kamu,` / `Alkisah,` / `Bayangkan,` / `Selamat pagi, Presiden.` / `Kalau kamu …`) dengan lencananya. Pendek, jangan diulur. | Ciri seri, tapi bukan hook-nya. |
| 0,4–2,5 | **Kalimat hook**: ≤ 12 kata, berisi satu pemicu (§2), ditampilkan besar di layar (`besar: true`), kata kuncinya berwarna. | Ini yang menahan jempol. |
| ≤ 3,0 | **Satu kejutan visual**: potongan ke gambar lain, ikon/angka muncul, kamera menyentak, atau tokoh berubah ekspresi. | Pola terputus = otak tetap menonton. |
| 3–6 | **Rehook**: kalimat kedua membuka celah baru atau menjanjikan sesuatu ("yang terakhir paling parah", "dan ini baru hari pertama"). | Orang yang lolos detik 3 butuh alasan untuk detik 10. |

Tanpa salam, tanpa "di video ini", tanpa judul dibaca, tanpa logo/intro, tanpa musik dulu baru bicara. Narasi mulai ≤ 0,3 dtk.

## 2. Pemicu (satu kalimat hook minimal punya satu)
| Pemicu | Bentuk | Contoh (sesudah kata pembuka seri) |
|---|---|---|
| **Angka spesifik** | angka yang tidak bulat, dengan satuan nyata | "dua puluh enam malam hilang karena satu korek." |
| **Kontradiksi** | dua hal yang seharusnya tidak bersanding: *tapi / justru / malah / bukan … tapi* | "petani yang paling ditertawakan justru paling tenang saat kemarau." |
| **Akibat dulu** (in medias res) | mulai dari kejatuhan/hasil, baru ceritanya | "ibunya tidak pernah tidur sebelum lampu kamar itu padam." |
| **Tanya langsung ke kamu** | pertanyaan yang jawabannya "aku banget" | "jam berapa biasanya kamu kalah?" |
| **Larangan / peringatan** | *jangan … sebelum …*, *kalau kamu …, berhenti dulu* | "jangan pasang knalpot baru sebelum cek satu baut ini." |
| **Rahasia / yang tidak dibilang** | *yang tidak pernah dibilang*, *diam-diam* | "ada satu hal yang bengkel tidak pernah bilang ke kamu." |
| **Kesalahan umum** | *kesalahan yang hampir semua orang …* | "sembilan dari sepuluh orang salah di langkah kedua." |
| **Kalimat terpotong** (open loop) | kalimat yang sengaja belum selesai sampai beat berikutnya | "hari pertama jadi presiden, dan masalah pertamamu… sudah antre di SPBU." |
| **Dua orang, satu beda** | kontras dua kubu dalam satu kalimat | "dua orang menggali sumur yang sama, cuma satu yang masih punya air." |
| **Taruhan / konsekuensi** | *kalau … maka …*, *sekali salah …* | "sekali kamu pilih A, dua juta orang antre lebih lama." |
| **Pengakuan jujur** | *aku dulu …*, *jujur, …* (untuk UGC/talking head) | "jujur, aku ragu sama yang harganya segini." |
| **Konon / ternyata** | fakta yang terasa tidak masuk akal | "ternyata cara tercepat belajar merokok adalah melihat orang yang kamu sayangi." |

Pemicu yang **tidak** menahan jempol: "kebiasaan buruk itu berbahaya", "ini penting untuk kamu", "yuk simak", "pernah nggak sih" tanpa lanjutan spesifik, kalimat umum yang bisa dipakai untuk video apa saja.

## 3. Cara menulis hook (Tahap 1 dan Tahap 2)
1. Tulis **tiga varian** hook dengan pemicu berbeda untuk ide yang dipilih; beri skor §5; pakai yang tertinggi, simpan satu lagi sebagai cadangan (untuk versi lain/A-B).
2. Hook harus **spesifik ke film ini** (ada nama benda, jam, angka, tempat): kalau hook-nya bisa dipakai untuk video lain, ganti.
3. Jawaban hook **ditahan sampai akhir** (bookend): twist atau kalimat pulang menjawabnya. Jangan menjawab di kalimat kedua.
4. Kata kunci hook = kata yang punya ikon atau angka, diberi `*…*` supaya berwarna; 1–2 kata saja.
5. Bingkai pertama dipilih dari adegan paling bermuatan (twist/akibat), bukan dari awal cerita: boleh "meminjam" adegan belakang sebagai adegan 0 selama ≤ 2,5 dtk, lalu kembali ke awal cerita dengan potongan/`iris`.
6. Rehook di baris 2–3: janji ("… dan yang ketiga yang paling sering kejadian"), atau pertanyaan baru.
7. Judul video dan thumbnail memakai kalimat hook yang sama rasa tapi beda kata (judul = penasaran, thumbnail = emosi 1–2 kata, `kemasan.md`).
8. Untuk seri bersuara tokoh (UGC, 3D): kalimat pertama diucapkan tokoh sambil **sudah melakukan sesuatu** (memegang benda, menoleh), bukan diam menatap kamera.

## 4. Hook visual (data film)
- Adegan pertama: `kamera` berupa keyframe dengan zoom berubah (mis. 1,3 → 1,0 "mundur" atau 1,0 → 1,25 "mendekat") atau kode `KEJUT`/`DEKAT`; jangan `DIAM`.
- Sesuatu muncul ≤ 1,5 dtk: ikon/angka pertama (`mulai` ≤ 1,5) atau potongan adegan ≤ 2,5 dtk.
- Ekspresi tokoh di bingkai pertama bukan `biasa`: `cemas`, `kaget`, `ngantuk`, `marah`, `senyum` sesuai muatan.
- Caption hook `besar: true`; kalau hook berupa pertanyaan, tanda tanya ikut besar.
- Bunyi khas film di 0,0–0,3 dtk (`bunyi`), musik masuk bersamaan narasi (bukan intro musik).

## 5. Skor hook (pilih yang ≥ 7 dari 10)
| Kriteria | Nilai |
|---|---|
| Ada pemicu §2 yang jelas | 3 |
| Spesifik (angka/benda/jam/tempat yang hanya milik film ini) | 2 |
| ≤ 12 kata sesudah kata pembuka, bisa dibaca dalam 2 dtk | 1 |
| Membuka pertanyaan yang baru dijawab di akhir | 2 |
| Bingkai pertama + kejutan visual ≤ 3 dtk sudah direncanakan | 1 |
| Rehook di baris 2–3 | 1 |

`cek_film.py` mengukur yang bisa diukur (panjang, pemicu kata, waktu mulai, kamera dan kejutan visual di 3 dtk pertama, baris besar) dan memberi saran; skor penuh tetap dinilai saat menulis.

## 6. Uji terakhir (sebelum render)
- **Uji geser**: tonton 3 detik pertama tanpa suara. Kalau kamu sendiri akan menggeser, ganti hook-nya.
- **Uji "video apa saja"**: kalau kalimat hook bisa ditempel ke video lain, belum spesifik.
- **Uji janji**: apakah akhir film benar-benar menjawab hook? Kalau tidak, penonton merasa ditipu dan tidak kembali.
