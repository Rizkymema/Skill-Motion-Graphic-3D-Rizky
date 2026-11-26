# Mesin motion-graphic-3d: dunia 3D (API `d.*`)

Dibaca di Tahap 2 (build) dan setiap revisi. Satu file HTML berisi tiga mesin: **Three.js r147** (`assets/three.min.js`, MIT), **mesin 3D** (`assets/mesin3d/01-inti.js … 06-tabrak.js`) dan **mesin 2D** (blok `inti` di `assets/templat.html`: lapisan 2D, subtitle, suara, transisi, cek, ekspor; API di `references/mesin-2d.md`). `jalankan.py rakit` menanam ketiganya + blok `konfig` jadi satu `film.html` yang jalan offline. Per video hanya `konfig.js` (KONFIG + ADEGAN) yang ditulis.

## 1. Prinsip
- **Adegan ber-`dunia`** digambar Three.js: `dunia(d)` dipanggil **sekali** (membangun tempat, benda, tokoh), lalu tiap bingkai mesin memperbarui animasi dari waktu `t` (anim, tokoh, partikel) dan `gerak(d, t, dur, T)` bila ada. Hasil 3D ditaruh di kanvas, lalu `gambar(g, t, d, T)` (lapisan 2D: teks atas, label, notif, balon, garis cepat) dan subtitle ditumpuk di atasnya. Adegan tanpa `dunia` = adegan 2D penuh (mesin-2d.md).
- **Deterministik**: semua gerak fungsi dari `t`; dilarang `Math.random()`, `Date`, `setTimeout`; acak pakai `acak(n)` / `derau(x)`. `dunia(d)` tidak boleh bergantung pada urutan bingkai (pemutar bisa melompat).
- **Satuan meter**. Sumbu: x ke kanan, y ke atas, z ke arah kamera bawaan. Tanah di y = 0. Tokoh ±1,86 m, menghadap +z (ke kamera bawaan).
- **`posisi` benda = titik tengah ALAS** (benda menapak di y yang ditulis); `pusat: true` = posisi titik tengah. Teks 3D dan ikon: posisi = titik tengah. `putar` = derajat: angka (sumbu y) atau `[x, y, z]`.
- Waktu di dalam adegan = detik adegan (`muncul: 1.2`) atau rujukan narasi (`muncul: 'L04.w3'`, `mulai: 'L05'`), sama dengan mesin 2D.
- Warna diturunkan dari palet keadaan adegan `P` (`P.utama`, `P.aksen`, `campur(P.latar, P.gelap, .3)`), hex hanya untuk warna tetap (kulit, baju, lampu, kayu).
- Garis tepi kartun, bayangan, pantulan lembut, kabut jarak, cahaya per keadaan: otomatis.
- **Anti-tembus (clipping) otomatis** (§9b): kaki selalu menapak, tangan/lengan/properti tidak pernah masuk ke badan, kepala, tokoh lain, atau benda; benda saling tembus, tokoh menembus benda, dan kamera di dalam benda membuat `cek` SALAH.

## 2. KONFIG (tambahan untuk 3D; sisanya = mesin-2d.md §2)
```js
const KONFIG = {
  judul, rasio: '9:16' | '16:9', fps: 30,
  gaya: 'kartun',          // bahan 3D: kartun (plastik lembut + garis tepi gelap bernuansa, bawaan, acuan RicksClips3000) | clay (doff, tanpa garis)
                           //   | mainan (plastik mengilap) | lowpoly (sisi rata bersudut)
  suasana: 'siang',        // palet dasar; tiap adegan sebaiknya punya suasana sendiri (8 keadaan, references/palet.md)
  bahan: { kasar, env, tepi },          // opsional: menimpa gaya (tepi = tebal garis px di 1080p, 0 = tanpa garis)
  cahaya3d: { matahari, hemi, tepi, isi, tinggi, ekspos },   // opsional: menimpa kekuatan cahaya semua adegan (§5)
  tonemap: 'lembut' | 'aces',          // bawaan lembut (warna palet tetap jenuh); aces = film (lebih pudar)
  tokoh: { joko: { … } },               // §7
  pose3d: { nama: { lKi, lKa, kKi, kKa, badan, kepala, turun, … } },   // pose 3D sendiri (§7)
  teks, musik, sfx, subtitle, thumbnail, durasi, kameraHidup, …        // sama dengan mesin-2d.md
};
```

## 3. ADEGAN 3D
```js
{ id: 'warung', durasi: 4.8, masuk: 'whip', suasana: 'sorot',
  luas: 6,                        // lingkup bayangan matahari (m, ± dari pusat); kecil = bayangan tajam. Bawaan 9
  pusatBayang: [0, 1, 0],         // opsional; bawaan = sasaran kamera di t = 0
  ikuti: 'motor',                 // opsional: kamera ikut benda bernama / tokoh; dari/ke kamera RELATIF ke benda itu
  kamera: [[0, { dari: [x,y,z], ke: [x,y,z], fov: 40, guling: 0 }], [4.8, { dari: […] }, 'inOutSine']],
  // atau kamera: { orbit: true, ke: [0,1,0], jarak: 5, tinggi: 1.6, sudut: [-25, 20], fov, ease } · atau fungsi (t, d) => ({ dari, ke, fov })
  kamera2d: [[0, { zoom: 1 }]],   // opsional: kamera lapisan 2D (bawaan diam)
  guncang: t => (t > 1 && t < 1.3 ? 1 : 0),   // 1 = ±6 cm
  cahaya: { sudut: 30 },          // arah cahaya (2D: 0 atas, −90 kiri, 90 kanan) + warna (warna, bayang, tepi, kabut); bawaan dari suasana
  cahaya3d: { matahari: 1.1 },    // kekuatan cahaya adegan ini (§5)
  sfx: [{ t: .2, jenis: 'whoosh' }],
  dunia(d) { … },                 // sekali
  gerak(d, t, dur, T) { … },      // opsional, tiap bingkai (pakai d.nama.x / d.para.id)
  gambar(g, t, dur, T) { … } }    // opsional, lapisan 2D di atas dunia
```
Transisi `masuk` sama dengan mesin 2D (`potong lebur gelap whip zoom wipe iris glitch geser kilat`, ≥ 4 jenis per video).

## 4. Kamera 3D
- Keyframe `[detik | rujukan, { dari, ke, fov, guling }, ease]`; nilai yang tidak ditulis mengikuti keyframe sebelumnya. `ke` boleh rujukan titik: `'joko.kepala'`.
- Bawaan: `dari [0, 1.45, 5]`, `ke [0, 1.15, 0]`, `fov` 40 (9:16, vertikal) / 30 (16:9). **9:16 sempit**: lebar terlihat ≈ 0,45 × jarak kamera (5 m → ±1,1 m kiri-kanan); susun benda bertingkat ke dalam, bukan berjajar lebar. Satu tokoh seluruh badan di 9:16: jarak ±4,5–5,5 m; setengah badan ±2,5 m; wajah ±1,1–1,4 m dengan `ke` setinggi mata (1,55).
- **Kamera selalu bergerak** (dolly masuk/keluar, geser, orbit, ikut); `kameraHidup` menambah goyang genggam halus. Variasikan: dolly pelan, orbit, low angle (`dari` y 0,5) untuk hal besar, high angle (y 3–5) untuk peta/meja, close-up benda dengan orbit.
- `ikuti: 'nama'|'idTokoh'`: `dari`/`ke` ditulis relatif ke posisi benda (benda bergerak dengan `anim`/`jalan`, kamera ikut).
- Hindari benda di antara kamera dan subjek (pohon, tiang di depan wajah); cek di lembar kontak.

## 5. Cahaya, keadaan, latar
- Keadaan (`adegan.suasana`) mengganti palet `P` + warna cahaya (2D SUASANA) + kekuatan 3D (`CAHAYA3D`): matahari (bayangan lembut, arah dari `cahaya.sudut` dan `tinggi`), langit/hemisfer (sisi bayang berwarna `bayang`), cahaya tepi dari belakang, cahaya pengisi lembut dari arah kamera (wajah tidak gelap), peta pantulan lembut. `sorot` = lampu sorot hangat dari atas + sekeliling gelap. `senja`/`oranye` = matahari rendah, bayangan panjang.
- Tone mapping "lembut": linier sampai 80% lalu ditekan halus, jadi warna palet tetap jenuh (ACES memudarkan jadi pastel).
- `cahaya3d` (adegan atau KONFIG): `matahari` (±.55–1.0), `hemi` (±.16–.45), `tepi`, `isi` (pengisi), `tinggi` (derajat matahari), `sorot` (kekuatan lampu sorot), `ekspos`.
- Latar: bawaan gradien warna `P.latar` (layar). `d.studio()` = lantai + dinding melengkung tanpa sambungan (latar motion graphic klasik untuk diagram/benda). `d.langit()` = kubah langit + kabut horizon. `d.ruang()` = ruangan. `d.latar(atas, bawah)` gradien sendiri.

## 6. Fungsi dunia `d.*`
Opsi umum semua benda: `posisi`, `putar`, `skala`, `nama` (dipakai `d.nama.x`, kamera `ikuti`, `g.layar('x')`, dan pesan `cek`), `pijak: true` (permukaan tempat kaki menapak: panggung, tangga, peti yang dinaiki), `padat: false` (boleh ditembus, mis. hantu, cahaya, kabut buatan; tidak diperiksa), `warna`, bahan (`kasar`, `logam`, `pancar` warna menyala + `pancarKuat`, `tembus` 0..1, `dasar: true` tanpa cahaya, `tepi: false | '#warna'`, `bayang: false`), dan **animasi**:
| Opsi | Isi |
|---|---|
| `muncul: t`, `masuk` | `pop` (bawaan, membal) · `naik` · `jatuh` (memantul) · `tumbuh` (dari bawah) · `geser` · `putar`; `lamaMuncul`, `jarakMasuk` |
| `hilang: t` | mengecil lalu hilang |
| `anim: [[t, { posisi, putar, skala }, ease], …]` | keyframe; nilai tak ditulis ikut sebelumnya |
| `ayun: true \| { tinggi, laju, miring }` | melayang naik-turun |
| `putarTerus: [x, y, z]` | derajat per detik |
| `denyut: { laju, kuat }` | membesar-mengecil |
| `ikutJalur: { titik: [[x,y,z],…], mulai, lama, ease, hadap }` | bergerak di kurva halus (kendaraan, burung, panah) |
| `gerak(obj, t, T)` | fungsi sendiri tiap bingkai |

**Susunan**: `d.grup(o, () => { … })` (benda di dalam ikut posisi/putar/skala/anim grup; untuk benda khas cerita buatan sendiri) · `d.tiapBingkai((t, T) => …)` · `d.titik(ref)` → `[x,y,z]` (`'nama'`, `'joko'`, `'joko.kepala'`, `.mulut`, `.atas`, `.tanganKa`, `.tanganKi`, `.kaki`) · `d.nama.x` (objek Three.js) · `d.para.joko` (tokoh) · `d.scene`, `d.kamera`, `d.P`.

**Bentuk dasar** (alas di `posisi`): `kotak({ ukuran: [l, t, d], r })` (sudut bulat, bawaan 12% sisi terkecil) · `bola({ r })` · `silinder({ r | [rAtas, rBawah], tinggi })` · `kapsul({ r, tinggi })` · `kerucut({ r, tinggi })` · `donat({ R, r })` · `bidang({ lebar, tinggi, lantai, peta })` · `ekstrusi({ titik: [[x,y],…] | shape, tebal, bevel })` (bentuk 2D jadi 3D: logo generik, panah, peta pulau).

**Latar & alam**: `studio({ warna, pola, lengkung, z })` · `langit({ waktu, atas, tengah, bawah, matahari, bintang, awan })` · `tanah({ jenis: polos|rumput|aspal|ubin|kayu|pasir|beton|karpet, warna, ukuran, ulang })` · `kabut(dekat, jauh, warna)` · `latar(atas, bawah)` · `awan({ n, x, y, z, ukuran, laju, warna })` · `bukit({ lebar, tinggi, warna, salju })` · `pohon({ jenis: bulat|cemara|kelapa, tinggi, warna })` · `semak` · `batu`.

**Kota & tempat**: `rumah({ lebar, tinggi, warna, warnaAtap })` (jendela menyala di malam) · `gedung({ lebar, tinggi, warna })` · `kota({ n, x: [kiri, kanan], z, tinggi: [min, maks], warna, benih })` · `jalan({ panjang, lebar, arah: 'x'|'z', trotoar })` · `lampuJalan({ tinggi, nyala, bayang })` · `warung({ lebar, warna, tulisan })` · `ruang({ lebar, dalam, tinggi, dinding, lantai, motif: 'garis', jendela: true | [x,y,l,t], lampu, foto, dindingSamping })`.

**Perabot & layar**: `meja({ lebar, tinggi, dalam })` · `kursi()` · `sofa({ lebar })` · `kasur()` (ketiganya punya jok untuk `naik`) · `rak()` · `jam({ jam: 7.5, laju })` · `kardus` · `mangkuk({ r, isi })` · `gelas` · `buku` · `tv({ lebar, kaki, layar, warnaLayar })` · `laptop({ lebar, buka, layar })` · `hp({ tinggi, layar })`.
**Layar berisi motion graphic 2D**: `layar(g2, w, h, t, T)` menggambar isi layar tiap bingkai dengan API 2D (`g2.batang`, `g2.angka`, `g2.teks`, `g2.notif`, `g2.kotak` …; koordinat piksel layar 0..w, 0..h). Tanpa `lapis` di dalamnya.

**Kendaraan**: `motor({ warna, laju, lampu, getar })` (skuter matik) · `mobil({ warna, laju, lampu })`. Roda berputar sendiri saat kendaraan bergerak lewat `anim`/`ikutJalur`; `laju` (rad/dtk) memutar roda walau diam di tempat. Keduanya punya jok: `d.tokoh('joko', { naik: motor, pose: 'naikMotor' })` → tokoh ikut kendaraan. Kendaraan menghadap +z; `putar: 90` = menghadap +x (ke kanan layar).

**Tulisan & ikon**: `teks(s, { ukuran (tinggi huruf m), warna, sisi, tebal, lapis, font, berat, latar, hadapKamera: true | 'y' })` (huruf 3D bervolume, posisi = tengah) · `papan(s, { lebar, tinggi, warna, warnaTeks, tiang, lampu })` (papan nama/spanduk: info cerita lewat benda bertulisan) · `ikon(nama, { ukuran, warna, tebal })`: `bintang hati petir cek silang panah plus tetes pin peringatan`.

**Data**: `batang([{ nilai, label, warna }], { tinggi, lebar, jarak, mulai, jeda, akhiran, desimal, angka })` (batang tumbuh + angka 3D + label) · `pai([{ nilai, warna }], { r, tebal, mulai, lepas })` · `panah({ dari, ke, tebal, warna, mulai, lama })` (tumbuh) · `koin({ r, tulisan })` · `uang({ nilai, tumpuk })` (generik, bukan uang asli).

**Cahaya tambahan**: `lampu({ posisi, warna, kuat, jarak, ukuran, pendar, bayang, kedip })` (lampu titik + bohlam menyala + pendar) · `sorot({ posisi, ke, warna, kuat, sudut, kerucut })` (lampu sorot + kerucut cahaya tampak).

**Partikel & efek**: `partikel(jenis, o)`: `konfeti koin uang daun salju hujan debu bintang gelembung`; jatuh di `area: [l, t, d]` sekitar `pusat`, atau semburan `dari: [x,y,z]` + `kuat` (meledak lalu jatuh ke lantai); `n`, `mulai`, `warna`, `ukuran`, `laju` · `uap({ posisi, n, ukuran, tinggi })` (kepulan uap/asap).

## 7. Tokoh 3D
Definisi di `KONFIG.tokoh.<id>`: `kulit`, `rambut` (`pendek poni jabrik cepak panjang kuncir ikal botak jilbab`), `warnaRambut`, `warnaJilbab`, `baju`, `celana`, `celanaPendek`, `rok` (warna rok), `sepatu`, `sol`, `lengan: 'pendek'`, `kerah` (`kaos` bawaan · `kemeja` · `hoodie` · `jas` + `warnaKemeja`, `dasi: '#warna'`), `celemek`, `topi` (`pet helm peci caping koki`) + `warnaTopi`, `kacamata` (+ `warnaKacamata`), `kumis`, `warnaMata`, `warnaAlis`, `bulu` (bulu mata), `pipi: false`, `mata: 'titik'`, `tubuh: 'anak'`, `gemuk`, `tinggi` (pengali), `kepalaSkala`.
`d.tokoh(id, o)`:
| Opsi | Isi |
|---|---|
| `posisi: [x, y, z]`, `skala` | kaki di posisi |
| `hadap` | derajat (0 = +z/kamera bawaan, 90 = kanan) · `'kamera'` · id tokoh / nama benda · `[[t, nilai], …]`; bawaan = menghadap kamera awal |
| `pose`, `ekspresi` | nama atau `[[t, 'nama'], …]` (perpindahan halus 0,4 dtk, sedikit lewat sasaran) |
| `bicara` | `true` · `[mulai, akhir]` · `'L03'` · `['L03','L04']`: mulut ikut kata, angguk per kata, gestur tangan bergantian (pose bertanda gestur) |
| `jalan: { dari: [x, z], ke: [x, z], lewat: [[x, z],…], mulai, lama, lari, ease, akhirHadap }` | langkah kaki + ayun lengan + hadap otomatis; `lari: true` |
| `lihat` | kepala menoleh ke `'kamera'` / id / nama / `[x,y,z]` (± 60°) |
| `lirik` | `[x, y]` arah mata, `'kamera'`; bawaan mata melirik halus sendiri |
| `pegang`, `pegangKiri` | `hp tablet cangkir gelas mangkuk sendok roti buku koran koin uang amplop kardus senter payung pensil stylus kuas mik tas kunci` · fungsi `(grup, d, tokoh) => Object3D` · `[[t, 'hp'], [2, null]]` |
| `naik` | benda ber-jok (`motor mobil kursi sofa kasur`): tokoh duduk dan ikut bergerak |
| `muncul`, `hilang` | pop masuk/keluar |
| `efek: [[t, 'jenis', lama]]` atau `'jenis'` | `keringat uap tanya seru hati bintang zzz ide marah kilau` di sekitar kepala |
| `hidup: false`, `gestur: false`, `kedip: false` | matikan akting otomatis |
| `anim: [[t, { posisi }]]` | memindah tokoh tanpa langkah (meluncur, didorong) |
| `padat: false` | tokoh boleh menembus (hantu); anti-tembus dan cek dimatikan untuk tokoh ini |

**Pose** (nama sama dengan motion-graphic 2D): `berdiri santai lambai tunjuk tunjukAtas presentasi pikir sedekap kaget hore angkatBahu sedih marah bingung pegangHp telepon duduk dudukHp dudukTegang dudukLesu dudukMakan menggambar ketik minum jongkok jongkokBimbing takut bawaKardus serahkan bimbing peganKepala makan makanKiri minumBerdiri naikMotor setir dorong baca tepuk angkat joget tidur lari`. Pose duduk: pinggul 0,52 m (pas di `kursi`); pakai `naik: kursi` supaya tepat di jok.
**Pose sendiri** `KONFIG.pose3d.nama`: `lKi`/`lKa` = lengan kiri/kanan `[maju, samping, putar ke dalam, tekuk siku]` (maju 90 = lurus ke depan, samping 90 = mendatar ke samping, 180 = ke atas; putar −90 membuat siku menekuk ke atas seperti melambai), `kKi`/`kKa` = kaki `[maju, samping, tekuk lutut]`, `badan [condong, miring, putar]`, `kepala [angguk, miring, toleh]`, `turun` (m), penanda `duduk gestur goyang gores ketik tepuk joget gemetar loncat rebah bahu depan`. Uji pose baru di lembar kontak dari dua sudut sebelum dipakai.
**Ekspresi**: `netral datar senang gembira kaget sedih marah bingung licik takut ngantuk` (wajah digambar: alis, mata beriris + kilau, kedip, mulut bicara 9 bentuk, pipi merona).
**Akting otomatis (jangan kaku, permintaan 24 Nov 2026)**: napas, berat badan berpindah, kepala dan mata hidup, kedip; saat bicara angguk per kata + gestur tangan. Tetap tulis pose/ekspresi baru tiap 1,5–2,5 dtk; `cek` memberi saran bila tokoh berpose dan berekspresi sama > 3,2 dtk.

## 8. Lapisan 2D di adegan 3D (`gambar(g, …)`)
- Semua fungsi `g.*` mesin 2D (teks atas, `teksMasuk`, `label`, `notif`, `balon`, `kartu`, `angka`, grafik 2D, `garis`, `partikel`, `cahaya`, `bokeh`) digambar di atas dunia 3D tanpa ikut kamera 3D (kecuali `kamera2d`).
- Menempel ke titik 3D: `g.layar(ref)` → `[x, y]` piksel (`'joko.mulut'`, `'nama'`, `[x,y,z]`) · `g.mulut('joko')` · `g.atasKepala('joko')` · `g.labelDi(ref, 'TEKS', { dy, … })`. Contoh balon bicara: `g.balon('Halo!', CX, H * .2, t, { ke: g.mulut('joko'), mulai: .3 })`.
- Teks atas tetap di zona aman 9:16 (9–66% tinggi, tidak di kanan bawah); subtitle otomatis di bawah. `cek` memeriksa teks 2D dan wajah tokoh 3D (subtitle menutupi wajah).

## 9. Kecepatan (PC pengguna: laptop AMD Vega 8, Chrome)
Diukur 26 Nov 2026 (contoh bakso, 1080×1920, GPU lewat ANGLE juga di browser tanpa layar): close-up benda 3 md/bingkai, ruangan 8 md, close-up wajah 21 md, jalan malam 28 md, jalan kota + 14 gedung + 6 pohon + 4 lampu 37 md. Ekspor 21,6 dtk = 123 dtk (±5,7× durasi), 19,4 MB.
- Dunia dibangun sekali per adegan dan disimpan (4 adegan terakhir); geometri dan bahan sama dipakai bersama.
- Bayangan: hanya matahari/lampu sorot utama; `lampu({ bayang: true })` paling banyak 1–2 per adegan.
- `kota` ≤ 16 gedung, partikel ≤ 250, tokoh ≤ 5 per adegan; benda jauh di balik kabut boleh sederhana.
- Pemutar pindah ke mode Cepat (setengah resolusi) bila < ±22 bingkai/dtk; ekspor tetap 1080p.
- Butuh WebGL (akselerasi grafis). Tanpa WebGL, `cek` menulis SALAH "WebGL tidak tersedia".

## 9b. Anti-tembus / clipping (`assets/mesin3d/06-tabrak.js`, sejak 26 Nov 2026)
Permintaan saya: "masih ada clipping 3D objek … agar bug itu hilang di setiap video". Tiga lapis, berlaku untuk semua video tanpa ditulis di konfig:
1. **Kaki menapak** tiap bingkai: telapak terendah diletakkan tepat di lantai (`posisi` y tokoh) atau permukaan `pijak` di bawahnya (trotoar `d.jalan`, benda ber-`pijak: true`). Jalan, jongkok, angkat tidak melayang atau tenggelam. Pose duduk/naik/tidur tidak diubah; pose loncat (kaget, hore) boleh di udara tetapi tidak di bawah lantai.
2. **Lengan tak tembus** tiap bingkai: siku, lengan bawah, pergelangan, telapak, ujung jari, dan properti di tangan dijauhkan dari badan, pinggul, kepala, paha/betis sendiri, badan/kepala tokoh lain, dan benda padat dalam jangkauan, dengan IK kecil (Levenberg–Marquardt atas 4 sudut lengan; bahu lebih dulu, siku belakangan; maks. ±85° dari pose). Hasil: tangan berhenti TEPAT di permukaan (sedekap di depan dada, pegang kepala, tangan bertumpu di meja, mendorong motor, menyentuh stang). Uji 26 Nov 2026: tembus 3–6 cm (sedekap, pikir, makan, pegang kepala, takut) jadi 0 cm; biaya 0,1–4 md/bingkai.
3. **`cek` SALAH** (wajib diperbaiki di konfig, karena ini soal penempatan): `tokoh "x" menembus <benda>`, `tokoh "x" dan "y" saling menembus`, `<benda A> dan <benda B> saling menembus` (benda tipis seperti koin pun), `kamera di dalam/terlalu dekat <benda>`, `kamera menembus tokoh`. Toleransi 2,5 cm; kamera 12 cm. Nama di pesan = `nama` benda, atau jenisnya (`meja`, `motor`, `ruang` …).
- Bentuk jarak (SDF) tiap benda padat: kotak bulat, bola, silinder/kerucut, kapsul, torus, benda bubut; lainnya kotak batas. Bagian-bagian satu benda (satu panggilan `d.*` atau satu `d.grup`) tidak dibandingkan satu sama lain.
- Dikecualikan otomatis: tokoh dengan benda yang ia `naik`-i; tokoh berpose duduk di atas benda berjok (kursi, sofa, kasur) walau tanpa `naik`; langit, tanah, studio, bukit, awan, partikel, uap, teks 3D, layar; permukaan `pijak`.
- Cara memperbaiki SALAH: geser `posisi` tokoh/benda (ingat lebar tokoh ±0,45 m, kendaraan ±0,4 × 1,5 m), ubah `jalan`/`anim` supaya lintasan tidak memotong benda, beri benda yang dinaiki `pijak: true`, hadapkan laptop/meja ke tokoh, hentikan benda jatuh di atas permukaan lalu menyusut/`hilang` (contoh koin masuk celengan), mundurkan kamera. `padat: false` hanya untuk yang memang menembus (hantu, cahaya).

## 10. Menambah fitur mesin
Benda/pose/efek baru yang akan dipakai lagi: tulis di `assets/mesin3d/*.js` (benda di `04-benda.js` lewat `Object.assign(DP, {…})` dan tambahkan namanya ke daftar jenis di akhir `06-tabrak.js`, pose di `POSE3D` `03-tokoh.js`, efek di `05-efek.js`; bagian benda dibuat lewat `this._b`/`mesh3` supaya ikut anti-tembus, `new THREE.Mesh` hanya untuk layar/kaca/teks atau beri `userData.padat = true`); khusus satu video boleh di konfig lewat `d.grup` + bentuk dasar. Setelah mengubah mesin: rakit `contoh/kartun-bakso-motor-3d.konfig.js` dan `contoh/infografis-uang-3d.konfig.js`, `cek` BERES, `kontak` dilihat, ukur md/bingkai (`seek` 30 bingkai), `ekspor` sekali, catat di dokumen ini. `assets/templat.html` (mesin 2D + pemutar) hanya diubah bila memang perlu; skill `motion-graphic` (2D) tidak ikut diubah.
