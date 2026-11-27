# Kamus teknik pengambilan + gerak tokoh

Dibaca di Tahap 2, waktu menulis kolom **Bidikan** storyboard dan `kamera`/`pose` di konfig. Sumbernya bedah teknik 27 Nov 2026:
- 6 Shorts RicksClips3000, 9:16, hampir tanpa potong keras, kamera selalu bergerak;
- satu reel animasi 3D 16:9 berdurasi 9,8 menit, 237 shot, gaya film dengan potong keras ±2,1–2,5 dtk.

Ditambah riset sumber terbuka (§9). Yang diambil hanya teknik umum, bukan tokoh, gambar, narasi, urutan adegan, atau identitas akun. Bedah lengkapnya ada di `Video Refrensi\_teknik-kamera-gerak\` (PC, tidak di repo).

Prinsip: **tiap bidikan punya satu fungsi; kamera dan tokoh menunjuk ke hal yang penting, pada detik yang penting.**

## 1. Pilih gaya pengambilan per video
| Gaya | Kapan | Ciri |
|---|---|---|
| **Satu tarikan** (bawaan, acuan RicksClips) | Shorts edukasi/cerita bernarasi | Kamera tidak pernah diam (diam ≤ 7 % durasi, diam beruntun ≤ 0,7 dtk), push-in 40–65 % waktu, potong keras ≤ 1 per video. Pindah ruang lewat gerak kamera atau lebur 0,5 dtk. |
| **Film** (acuan reel) | Skit/dialog bertokoh, cerita panjang | Potong keras tiap 1,7–3 dtk. Kamera hampir diam atau push sangat pelan (±3,5 %/dtk), tokohnya yang bergerak. Pola WS → MCU → punch-in CU → OTS → sisipan → reaksi. |

Kedua gaya boleh dicampur per babak (mis. dialog bergaya film, penjelasan bergaya satu tarikan).

## 2. Fungsi cerita → bidikan
| Fungsi | Ukuran (`jenis`) | Sudut (`tinggi`/`sudut`) | Gerak kamera | Durasi | Pose / ekspresi |
|---|---|---|---|---|---|
| **Hook** (bingkai 0) | `setengah`/`dekat`: tokoh + benda kunci di bingkai pertama; atau `benda` di depan dengan tokoh di belakang | setara mata / `rendah` | `dorong` pelan; komposisi ganti tiap 1,0–1,5 dtk selama 5 dtk pertama | 1–1,5 dtk per komposisi | **Aksi sudah berjalan** (menuang, memukul) atau pose antisipasi yang terbaca |
| **Setup / tempat** | `lebar`/`penuh` | setara, `sudut` 15–35 | `tarik` 0,5 dtk lalu `dorong` pelan | 2–3 dtk | santai, napas, kontrapposto |
| **Penjelasan** | `setengah` → `dekat` | setara | `dorong` panjang pelan 3–6 dtk (5–10 %/dtk) | 3–6 dtk | gestur bicara, ekspresi tiap frasa |
| **Kata kunci / istilah** | `wajah` atau `benda` (ECU) + teks dunia | setara | `dorong` + `tiba: 'Lxx.wN'` (mulai 1–2,5 dtk sebelumnya) | tahan 0,5–1,5 dtk sesudah tiba | ekspresi berganti tepat di kata |
| **Sisipan benda** | `benda` | `tinggi: 'rendah'` atau dari atas | `dorong` kecil | 0,5–1,0 dtk (layar/tulisan dibaca 1,0–2,0) | — |
| **Eskalasi** | makin rapat tiap ketukan: `penuh` → `setengah` → `dekat` | `rendah` untuk pihak dominan | `dorong` bertahap | 1,5–2,5 dtk | pose aksi (antisipasi otomatis) |
| **Kejutan / aksi** | `setengah`/`lutut` (aksi harus utuh di bingkai) | setara / Dutch 10–15° (`guling`) untuk ancaman | `dorong` dengan `tiba` = detik aksi; `guncang` 0,3 dtk di hantaman | ≤ 1,5 dtk | pose aksi dengan `poseTiba: true` → puncak di kata |
| **Reaksi** | `wajah`/`dekat` pihak yang bereaksi | setara | diam/`dorong` sangat pelan | **tahan 1,2–2,0 dtk** | `reaksi: [[t, 'kaget']]` → muncul +0,35 dtk; tahap kedua (`lalu`) +1,3–1,5 dtk |
| **Reaksi kelompok** | `dua`/`lebar` | setara | `tarik` supaya semua masuk | 1,5–2 dtk | — |
| **Klimaks** | **`lebar`** (skala kejadian), tokoh di latar depan atau langsung dipotong ke reaksinya | setara / dari atas | tahan/menggelap 1–3 dtk sebelumnya, lalu `dorong` pelan atau diam | 1,5–3 dtk | — |
| **Analogi** | `benda` makro → potong/lebur ke dunia analogi | atas | `dorong` 2 dtk | 2–4 dtk | — |
| **Penutup / jembatan** | `atasBahu`/`setengah`: tokoh di depan, hasil kejadian di belakang | setara | diam | 1–2 dtk | tokoh menoleh ke kamera (`lirik: 'kamera'`, `lihat: 'kamera'`) 0,5 dtk sebelum akhir; atau komposisi = bingkai pertama (loop) |
| **Dialog** | `atasBahu: [pendengar, pembicara]` bergantian, `dua` hanya pembuka ≤ 2 dtk | setara | `dorong` (OTS ikut dorong) | per kalimat 1,5–3 dtk | yang bicara gestur; pendengar bereaksi |

## 3. Aturan berangka
1. **Hook bingkai 0**: tokoh + aksi atau benda kunci sudah ada di bingkai pertama. Komposisi ganti tiap 1,0–1,5 dtk di 5 dtk pertama.
2. **Kamera hidup**: di gaya satu tarikan, diam ≤ 7 % durasi dan diam beruntun ≤ 0,7 dtk. Laju push 8–24 %/dtk (penjelasan 5–10, penegasan 15–25), pull-out ±20 % waktu.
3. **Push mendarat**: mulai 1,0–2,5 dtk sebelum kata kunci, melambat, tiba tepat di kata (±0,2 dtk), lalu tahan 0,5–1,5 dtk.
4. **Reaksi**: wajah berubah 0,3–0,6 dtk sesudah aksi, naik bertahap tiap ±0,5 dtk, bidikan reaksi ditahan 1,2–2,0 dtk.
5. **Ekspresi** berganti tiap 0,5–1,0 dtk saat bicara, maks. 3 bentuk per 2 dtk.
6. **Sisipan**: benda 0,5–1,0 dtk tepat saat disebut; layar atau tulisan 1,0–2,0 dtk.
7. **Klimaks = lebar**, 1,5–3 dtk, dengan tahan/menggelap 1–3 dtk sebelumnya.
8. **Penutup**: tokoh di depan dengan hasil di belakang lalu menatap kamera, atau bookend (loop).
9. **Kamera mengikuti sebab-akibat** (benda jatuh/mengalir/meluncur) dengan kecepatan benda itu, dan **tiba sebelum** benda sampai di titik penting (≥ 0,2 dtk).
10. **Transisi bermotivasi**: lewat benda depan, pintu, jendela, layar HP (push masuk layar), atau tilt mengikuti benda. Lompatan waktu = lebur 0,5 dtk. Ganti tokoh/era = match cut wajah (ukuran dan posisi sama).
11. **Arah layar & garis 180°**: kemajuan bergerak ke kanan layar. Dua tokoh berdialog tetap di sisi layar yang sama sepanjang adegan; mesin menjaganya otomatis (§4).
12. **Komposisi 9:16**: mata di 33–40 % tinggi dari atas (`wajah` .40, `dekat` .38, `setengah` .36, OTS .35; ruang teks atas tetap ada). Tokoh di sepertiga bila ada benda kunci, di tengah bila simetris. Benda depan membingkai 10–25 % tepi. Mulut close-up harus di atas zona subtitle (≤ 62 %).
13. **Ruang pandang**: tokoh yang menatap/menunjuk ke samping ditaruh di sisi belakang tatapan (±12 % lebar). Tangan yang menunjuk harus utuh di bingkai.
14. **Subjek mendatangi kamera** (berjalan/berlari ke CU) sebagai pengganti push-in.
15. **Sudut bercerita**: rendah = dominan/marah/sombong; Dutch 10–15° = ancaman; atas/POV = rencana, benda, ketegangan menuju sesuatu (POV maju 4–5 dtk sebelum klimaks).
16. **Gerak tokoh**: aksi besar dimulai dari antisipasi yang terbaca. Emosi memuncak bertahap bersama kamera yang mendekat. Reaksi kontras (satu meledak, satu tenang) dalam satu bingkai.

## 4. Menulisnya di konfig (opsi sejak 27 Nov 2026)
```js
// kamera: push yang TIBA di kata kunci (mulai lama dtk sebelumnya, ease-out, lalu hanyut ±1 %/dtk)
kamera: [[0, { bidik: 'ari', jenis: 'setengah', gerak: 'dorong', tiba: 'L04.w5', kuat: .18, lama: 1.2 }],
         ['L04.w5+0.4', { bidik: 'bu', jenis: 'wajah' }],                 // potong ke reaksi sesudah aksi
         ['L05', { atasBahu: ['bu', 'ari'] }], ['L06', { atasBahu: ['ari', 'bu'] }]],   // OTS bergantian: garis 180° dijaga otomatis
// tokoh: puncak aksi TEPAT di kata (antisipasi dimulai ±0,36 dtk lebih awal) + reaksi yang ditunda
d.tokoh('ari', { pose: [[0, 'santai'], ['L04.w5', 'tunjuk']], poseTiba: true, tunjukKe: [[0, null], ['L04.w5', 'bu']] });
d.tokoh('bu', { pose: 'santai', ekspresi: 'datar', reaksi: [['L04.w5', { ekspresi: 'kaget', pose: 'kaget', lalu: { ekspresi: 'marah', pose: 'kacakPinggang' }, tahan: 1.3 }]] });
```
| Opsi | Di mana | Arti |
|---|---|---|
| `tiba`, `kuat` (.15), `lama` (1,4) | bidikan dengan `gerak: 'dorong'/'tarik'` | push/pull selesai tepat di waktu `tiba` |
| `mata` | bidikan | garis mata (0 = atas bingkai), timpa bawaan; `mata: false` = cara lama |
| `ruang: false` | bidikan | matikan ruang pandang + jaga tangan di bingkai |
| `komposisi: 'lama'` | bidikan `atasBahu` | komposisi OTS lama (wajah B di tengah) |
| `sisiGaris: -1` | adegan | pindahkan semua OTS/`dua` ke seberang garis tokoh |
| `reaksi: [[t, 'kaget'] \| [t, { ekspresi, pose, lalu, tahan }]]`, `tundaReaksi` (.35) | tokoh | reaksi tertunda + tahap kedua |
| `poseTiba: true` | tokoh / KONFIG | waktu kunci pose (dan `tunjukKe`/`raih`) = PUNCAK aksi (bukan awal gerak) |
| `antisipasi: false` | tokoh | tanpa tarik balik (gerak mekanis, robot) |
| `tangan: 'kepal' \| { ka, ki } \| [[t, …]]` | tokoh | bentuk tangan: `santai buka kepal genggam tunjuk jempol` (bawaan otomatis per pose) |
| `kontrapposto: false` | tokoh | berdiri tegak simetris (prajurit, robot) |
| `gerakLama: true` | KONFIG / tokoh | perilaku gerak sebelum 27 Nov 2026 |
| `rig: 'ruas'` | KONFIG / `KONFIG.tokoh.id` | rupa rig lama (ruas kapsul + bola sendi) |

## 5. Gerak tokoh (otomatis, `03-tokoh.js`)
- **Antisipasi → aksi → lewat sasaran → mengendap**:
  - Pose aksi (`tunjuk`, `kaget`, `hore`, `dorong`, `tolak`, `angkatAtas`, `membungkuk`, `marah`, …) mulai dengan tarik balik 8–16 % dari arah gerak selama 0,14 dtk.
  - Lalu aksi cepat dengan pegas bentuk-tertutup: lengan lewat sasaran ±9–16 % lalu mengendap ±0,4 dtk.
  - Pose tenang (`santai`, `duduk`, `sedih`) tanpa tarik balik dan tanpa pantul.
- **Bertumpuk**: badan mulai dulu, lalu kepala +0,04, bahu +0,05, siku +0,09 dtk. Pergelangan **tertinggal** sesuai kecepatan lengan (melambai = tangan mengibas), maks. ±26°.
- **Squash & stretch**: badan memampat 5 % saat antisipasi dan memanjang 4,5 % saat aksi; kaget = satu lompatan lalu mampat saat mendarat; volume tetap.
- **Kontrapposto**: berat pindah kaki tiap 4–7 dtk (peralihan 0,7 dtk), panggul miring 3°, lutut kaki bebas menekuk 11°, bahu miring berlawanan. Lutut tidak pernah terkunci lurus.
- **Mata & kedip**:
  - Saat `lihat` berganti, mata langsung ke sasaran, kepala menyusul (jeda 0,06 dtk + pegas), badan ikut 25 %.
  - Kedip berjeda acak 2–6 dtk (16 % kedip ganda), juga saat menoleh > 30° dan saat bentuk mata berganti.
- **Rambut susulan**: kuncir dan rambut panjang berayun mengikuti perpindahan pose, langkah, dan lompatan.
- Semua murni fungsi waktu (tanpa state), jadi bingkai mana pun sama di pratinjau, cek, dan ekspor.

## 6. Rig lentur (bawaan)
- Lengan bahu→pergelangan, kaki pinggul→pergelangan kaki, dan badan (badan↔dada) adalah **satu permukaan ber-skin** (`SkinnedMesh` Three r147).
- Bobot kulit halus ±5,5–6 cm di siku/lutut dan 0,2–0,38 m di punggung. Hasilnya siku/lutut melengkung tanpa bola sendi, dan punggung melengkung saat membungkuk (tekuk badan 55 % + dada 45 %).
- Leher ikut menoleh 35 %. Bahu (klavikula) naik ±3,5 cm saat lengan > 70°.
- Kapsul paha/betis dan badan lama tetap ada sebagai bayangan tabrak tak terlihat, jadi anti-tembus, IK `raih`/`tunjukKe`, dan cek wajah tidak berubah.
- Tangan: 6 bentuk 3D yang ditukar di tengah transisi pose (teknik *swap hands*).
- Kerah, kancing atas, dan dasi menempel di dada.

## 7. Cek teknik otomatis (`cek` → saran)
| Pesan | Artinya / perbaikan |
|---|---|
| garis mata "x" di ±N % | close-up terlalu turun/naik → hapus `mata` manual atau pakai bidikan otomatis |
| bidikan ke-n hanya x dtk | < 0,6 dtk tidak terbaca (kecuali sisipan benda) |
| kamera hampir diam > 1 dtk | beri `gerak` (gaya satu tarikan); di gaya film boleh bila tokohnya bergerak |
| garis 180° — a dan b bertukar sisi layar | pakai `atasBahu`/`dua` otomatis tanpa `sisi` manual, atau `sisiGaris` |
| reaksi … di detik yang sama dengan aksi | pakai `reaksi: [[t, …]]` atau geser 0,3–0,6 dtk |
| ganti pose … hanya x dtk | jarak antar-pose ≥ 0,45 dtk |
| tangan … keluar bingkai / kepala terpotong tepi | lebarkan `jenis` atau biarkan ruang pandang otomatis |

## 8. Kesalahan umum dan cara mengecek di foto (`jalankan.py lembar` / `kontak --t`)
- **Push telat**: lihat 3 bingkai di sekitar kata kunci. Ukuran subjek harus sudah berhenti membesar di bingkai kata itu.
- **Reaksi serentak**: bingkai di detik aksi tidak boleh sudah memuat wajah reaksi pihak lain.
- **Klimaks close-up**: bingkai klimaks harus memperlihatkan skala kejadian (lebar), bukan wajah.
- **Mata turun**: garis mata close-up di bawah 46 % = mulut tertutup subtitle.
- **Tangan terpotong**: pose `tunjuk`/`presentasi` harus utuh sampai ujung jari.
- **Tokoh bertukar sisi**: di dua bidikan berurutan, tokoh kiri tetap di kiri.
- **Kaku**: dalam 3 bingkai berurutan saat ganti pose, harus terlihat tarik balik, lalu lengan lewat sasaran, lalu mengendap; siku melengkung, bukan engsel boneka.
- **Kamera di dalam benda / latar kosong**: sudah diperiksa `cek` (SALAH).

## 9. Sumber (teknik, bukan salinan kode)
- Pegas teredam bentuk-tertutup: Daniel Holden, "Spring-It-On" (theorangeduck.com); cth9191/animate (MIT).
- Antisipasi/overshoot orde-2: t3ssel8r, "Giving Personality to Procedural Animations using Math" (2022).
- Kurva Back: rumus Penner (ditulis ulang; kode easings.net GPL tidak disalin).
- Determinisme render (seek murni, simulasi dipanggang, cek hash): heygen-com/hyperframes (Apache-2.0), Moh4696/open-3d-skills (MIT), tungs/timesnap (BSD-3).
- `SkinnedMesh`/`Bone`/`Skeleton`: dokumentasi resmi three.js (MIT).
- Ruang pandang/lookahead: Unity Cinemachine (dokumentasi). Aturan 30°/180°: John Nesky, "50 Camera Mistakes" (GDC 2014). Headroom, lead room, cutting on action: Wikipedia (CC BY-SA). Two-shot: Lino & Christie, Toric Space (2015).
- Tukar bentuk tangan + FK/IK: tutorial rigging ChitChad (acuan pengguna).
- Rincian dan tabel lisensi: `Video Refrensi\_teknik-kamera-gerak\riset_sumber.md` (PC).
