# Mesin lapisan 2D (API `g.*`, suara, subtitle, transisi, SFX, ekspor)

Salinan API mesin motion-graphic yang ikut tertanam di skill ini. Di motion-graphic-3d dipakai untuk: **lapisan 2D di atas dunia 3D** (`gambar(g, t, d, T)` di adegan ber-`dunia`), adegan 2D penuh (adegan tanpa `dunia`), subtitle, musik/SFX/narasi, transisi, cek, dan ekspor. Dunia 3D: `references/mesin.md`.
Perbedaan di skill ini: `KONFIG.gaya` bernilai `kartun | clay | mainan | lowpoly` (gaya bahan 3D; lapisan 2D memakai efek gaya kartun), di adegan ber-`dunia` `kamera` = kamera 3D dan lapisan 2D memakai `kamera2d` (bawaan diam), dan `g.layar/g.mulut/g.atasKepala/g.labelDi` menempelkan elemen 2D ke titik 3D (`mesin.md` §8). Tokoh 2D (`g.tokoh`) tetap ada untuk adegan 2D, tetapi tokoh video ini sebaiknya tokoh 3D (`d.tokoh`).

## 1. Prinsip
- Satu-satunya sumber waktu: `seek(T)` menggambar bingkai di detik film `T`. Pemutar, cek, lembar kontak, thumbnail, dan ekspor memanggil fungsi yang sama, jadi hasilnya identik dan deterministik.
- Di dalam adegan: `gambar(g, t, d, T)`: `t` = detik sejak adegan mulai, `d` = lama adegan, `T` = detik film. Gerak = fungsi dari `t` (pakai `maju`, `antara`, `kunci`, `E.*`). **Dilarang** `Math.random()`, `Date`, `setTimeout`, animasi CSS; acak pakai `acak(n)` (0..1 tetap) dan `derau(x)` (−1..1 halus).
- Koordinat piksel kanvas: 9:16 = 1080×1920, 16:9 = 1920×1080. Global siap pakai: `W`, `H`, `CX`, `CY`, `POTRET`, `ZONA` (`atas`, `bawah`, `kiri`, `kanan`, `sub`), `P` (palet), `FONT`.
- Zona aman 9:16: lapisan penting di 9–66% tinggi; kanan > 87% lebar tertutup tombol mulai ±42% tinggi; bawah > 76% tertutup keterangan. Subtitle otomatis di ±70,5%.

## 2. KONFIG
```js
const KONFIG = {
  judul: 'Judul video',            // nama file ekspor + <title>
  rasio: '9:16',                   // '9:16' | '16:9'
  fps: 30,                         // 30 | 60
  gaya: 'kartun',                  // 'kartun' (acuan RicksClips3000: cahaya sinema + garis tepi tebal bernuansa; tokoh tetap tokoh sinema) | 'sinema' | 'flat' | 'neon' | 'kertas' (gaya.md)
  suasana: 'siang',                // KEADAAN = paket warna + cahaya + efek: siang | malam | kobalt | oranye | hijau | sorot | aula | senja (references/palet.md).
                                   //   Ini palet dasar video; tiap ADEGAN boleh punya suasana sendiri (adegan.suasana) supaya warna mengikuti keadaan adegan.
                                   //   Tanpa suasana: palet bawaan = siang. palet/cahaya/efek di bawah menimpa suasana satu per satu.
  efek: { grain: .05, vinyet: .4 },// opsional, menimpa suasana/gaya: grain, vinyet, glow, grade (0..1 warna hangat/dingin, sinema),
                                   //   mekar (bloom 0..1, mati bawaan, +±12 md/bingkai), detil (paksa detail tokoh 0|1|2)
  cahaya: { sudut: -45, warna: '#FFD8A8', bayang: '#556B93', tepi: '#FFFFFF', kuat: 1, kabut: '#CFE6F2' },
                                   // gaya sinema: sudut = arah DATANG cahaya (0 atas, −90 kiri, 90 kanan); warna = cahaya kunci;
                                   //   bayang = warna sisi gelap (berwarna, bukan hitam); tepi = cahaya tepi (rim); kabut = warna jarak jauh. Adegan boleh menimpa.
  palet: { latar, utama, aksen, kedua, teks, gelap, terang },   // 4–5 warna inti + gelap/terang; hanya yang ditulis yang menimpa suasana
  font: { judul: '…', teks: '…' }, // opsional; tumpukan font SISTEM (tanpa Google Fonts)
  tokoh: { raka: { … } },          // §6
  subtitle: { tampil: true, ukuran: 1, posisi: .735 },   // bawaan = gaya FILM: kecil (44 px di 9:16), putih bertepi tipis, kalimat utuh maks. 2 baris di bagian bawah (§7)
                                   //   gaya: 'garis' | 'kotak' = gaya lama besar per kata (maksKata: 3, warnaAksen, sorotAktif) untuk caption pendek ala Shorts
  teks: [{ mulai, akhir, teks: 'kata *aksen*' }],   // subtitle tanpa narasi (kata dibagi rata menurut panjangnya)
  musik: { sintesis: 'pulsa', bpm: 104, kunci: 110, vol: .5 }  // atau daftar segmen [{sintesis, mulai, akhir, …}, …]
  sfx: [{ t: 'L03.w2', jenis: 'pop' }],   // SFX di luar adegan (opsional)
  sfxTransisi: true,               // SFX otomatis untuk transisi (whoosh/swish/pop/glitch/impact)
  kameraHidup: true,               // goyang kamera halus di semua adegan (napas kamera)
  volume: .9, volumeSfx: 1, volumeSuara: 1.1, normalisasi: true, targetDb: -17,
  bitrate: 7,                      // Mbps; kosong = otomatis 7 (30 fps) / 9 (60 fps), dibatasi ≤ ±46 MB
  thumbnail: { t: 2.5, teks: 'JUDUL\n*AKSEN*', y: .2 },
  durasi: 60                       // opsional; bawaan = akhir adegan terakhir atau akhir narasi
};
```

## 3. ADEGAN
```js
const ADEGAN = [
  { id: 'hook', durasi: 3.0,                 // atau mulai/akhir (angka atau rujukan waktu)
    masuk: 'whip',                           // transisi dari adegan sebelumnya (§8); kosong = potong
    arahMasuk: -1, titikMasuk: [540, 640],   // arah whip; pusat iris (match cut bentuk)
    lamaMasuk: .4,                           // opsional, menimpa lama bawaan transisi
    kamera: [[0, { zoom: 1.2, x: 0, y: 0, putar: 0 }], [3, { zoom: 1 }, 'outCubic']],
    guncang: t => (t > 1 && t < 1.4 ? 1 : 0),// atau angka/keyframe; 1 = ±20 px
    kameraHidup: true,
    suasana: 'oranye',                       // KEADAAN adegan ini: palet P + cahaya + efek (grain/vinyet/grade) berganti selama adegan; tanpa itu = suasana video
    palet: { aksen: '#FFC25A' },             // opsional: menimpa warna suasana adegan satu per satu (adegan.efek menimpa efek)
    cahaya: { sudut: 30, warna: '#9EC1FF' }, // gaya sinema/kartun: cahaya adegan ini (menimpa KONFIG.cahaya dan cahaya suasana)
    sfx: [{ t: .2, jenis: 'whoosh', vol: 1, lama: .5, nada: 1320 }],   // t = detik adegan atau rujukan 'L03.w2'
    gambar(g, t, d, T) { … } }
];
```
- **Rujukan waktu** (`w()`): `'L03'` (awal baris narasi), `'L03.akhir'`, `'L03.w4'` (kata ke-4), `'hook'`/`'hook.akhir'` (adegan), plus geseran `'L03+0.4'`. Di dalam `gambar`: `g.w('L03.w4')` = detik adegan untuk rujukan itu.
- Kamera: keyframe `[detik, {x, y, zoom, putar}, easing]`; nilai yang tidak ditulis = 0/1. Lapis jauh bergerak lebih sedikit (parallax).

## 4. Waktu dan easing
| Fungsi | Isi |
|---|---|
| `maju(t, mulai, lama, ease)` | 0..1 dengan easing (bawaan `outCubic`) |
| `antara(t, a, b, f=.25)` | 1 selama a ≤ t < b, masuk/keluar halus selebar f |
| `kunci(t, [[0, v0], [1, v1, 'outBack'], …])` | keyframe angka, larik, warna `#hex`, atau objek |
| `E.<nama>(x)` | `linear inQuad outQuad inOutQuad inCubic outCubic inOutCubic inQuart outQuart inOutQuart outQuint inOutSine inExpo outExpo inOutExpo outBack inBack outElastic pegas outBounce` |
| `lerp`, `jepit`, `acak(n)`, `derau(x)` | bantu |
| `campur(a, b, k)`, `alfa(warna, a)` | warna (menerima `#hex` dan `rgb()`) |
| `rupiah(n)`, `ribuan(n, des)` | `Rp1.250.000`, `1.250,5` |
| `paletSuasana('senja')` | palet lengkap suatu suasana (`latar utama aksen kedua teks gelap terang`) untuk warna satu benda tanpa mengganti `P`; `P` = palet adegan yang sedang digambar (suasana adegan, lalu `adegan.palet`) |

## 5. Fungsi gambar `g.*`
Opsi umum bentuk: `isi`/`warna`, `garis`, `tebal`, `alfa`, `putar` (derajat), `skala` (angka atau `[sx, sy]`), `r` (sudut bulat, angka atau `[kiriAtas, kananAtas, kananBawah, kiriBawah]`), `bayang` (`true`/objek `{x, y, blur, warna}`/`false`), `glow` (angka; aktif di gaya neon), `putus` (garis putus `[20, 12]`). Semua x, y = **titik tengah**.

**Susunan & kamera**
- `g.lapis(d, () => {…}, opsi)`: kedalaman parallax. `0` latar jauh (gerak 30%), `1` tengah, `2` depan (170%); angka lain boleh (0.6, 1.3, …). **Setiap adegan minimal 3 lapis.**
  `opsi` untuk lapis yang isinya **tidak berubah selama adegan** (hanya ikut kamera): `{tetap: true}` digambar sekali lalu dipakai ulang (jauh lebih cepat; `ruang`, `kota`, `bukit`, `langit` cocok), `blur: px` dikaburkan sekali (kedalaman ruang / fokus kamera; otomatis tetap, setengah resolusi), `kabut: 0..1` diwarnai `cahaya.kabut` (makin jauh makin pucat), `kunci` nama cache, `pad` sisa tepi (bawaan 320). Isi lapis tetap = keadaan awal adegan (`t` = 0), jadi jangan taruh gerak, teks, atau tokoh di dalamnya.
- `g.simpan(c => {…})`: save/restore konteks canvas mentah `g.c` untuk efek khusus (mis. `globalCompositeOperation = 'saturation'` untuk desaturasi).

**Latar**: `g.latar(jenis, o)` digambar lebih lebar dari kanvas (aman untuk gerak kamera).
`'polos'` {warna} · `'gradien'` {atas, bawah, sudut} · `'radial'` {tengah, tepi, titik:[x,y], jari} · `'sinar'` {warna:[a,b], n, putar (°/dtk), tengah, titik} · `'kisi'` {warna, jarak, tebal, lantai:true, horizon, laju} · `'titik'` {warna, jarak, r} · `'kertas'` {warna, kuat} · `'langit'` {waktu: `siang|senja|fajar|malam|mendung`, atas, tengah, bawah, horizon, matahari:[x,y,r] | false (malam = bulan), bintang (jumlah)}. Warna langit bawaan kaya ala RicksClips3000 (siang biru jenuh → biru muda; senja ungu → mawar → jingga; fajar; malam kobalt, bukan hitam; mendung abu-biru, beri `matahari: false`); `atas/tengah/bawah` menimpa (langit oranye/ngarai: tulis sendiri, lihat `contoh/kartun-bakso-motor.konfig.js`). `horizon` besar (mis. `H * .95`) membuat gradien biru memanjang sampai bawah (cocok untuk latar diagram yang dikaburkan).

**Cahaya dan kedalaman** (semua murah: gradien atau sprite yang dibuat sekali, tanpa filter per bingkai; berlaku di semua gaya, paling serasi di `sinema`)
- `g.bayangan(x, y, w, {alfa, tinggi})`: bayangan kontak lembut di lantai (di sinema bergeser menjauhi cahaya). Tokoh sudah punya sendiri; pakai untuk sofa, meja, benda.
- `g.cahaya(x, y, r, {warna, alfa, denyut, kilau})`: sumber cahaya bercahaya (dijumlahkan): inti putih + pendar; `kilau: true` = garis lensa melintang. Untuk matahari, lampu, layar HP di wajah, ledakan angka.
- `g.bokeh(t, {n, area, warna:[…], ukuran:[min,max], alfa, laju})`: lingkaran cahaya tak fokus melayang; taruh di `lapis(2)` (depan) atau `lapis(0)`.
- `g.berkas(x, y, {sudut, sebar, panjang, lebar, n, warna, alfa, goyang})`: berkas cahaya volumetrik (god rays) dari titik; `sudut` 0 = lurus ke bawah, + miring ke kanan.
- `g.kabut({y, tinggi, warna, alfa, laju, benih})`: pita kabut bergerak; taruh di antara dua lapis untuk kedalaman.
- `g.awan(t, {n, y:[min,maks], ukuran:[min,maks], warna, bayang, alfa, laju, benih})`: awan kumulus lembut (gumpalan bulat, dasar rata, sisi bawah berbayang) yang melayang pelan dan berulang; bawaan 5 awan di H×.08–.38. Taruh di `lapis(0.1–0.3)` di atas `langit` dan di bawah bukit; `warna` bawaan = cahaya adegan diputihkan, `bayang` = kabut+bayang cahaya (senja: `warna: '#FFE3CF', bayang: '#C98AA0'`). Sprite dibuat sekali per warna (murah).
- `g.bukit({y, tinggi, warna, benih, kasar, pohon})`: siluet bukit/gunung berlapis (di sinema bertepi cahaya); panggil 2–3× di lapis berbeda, makin jauh makin pucat (`kabut`).
- **Volume otomatis** (gaya sinema): `kotak`, `bulat`, `elips`, `poligon`, `jalur`, `ikon`, dan `batang` diberi sisi terang, bayang berlapis, dan garis tepi bercahaya mengikuti `cahaya`. `datar: true` mematikan per bentuk (lantai, panel, latar); `volume: .5` melemahkan. `kartu`, `label`, `notif`, `balon`, `hp` tetap datar.
- `g.ruang` di gaya sinema otomatis mendapat bayang sudut dinding-lantai, cahaya jendela jatuh di lantai + berkas cahaya, dan kerucut cahaya lampu (`lampu`).

**Bentuk**: `kotak(x,y,w,h,o)` · `bulat(x,y,r,o)` · `elips(x,y,rx,ry,o)` · `poligon([[x,y],…],o)` · `garis(x1,y1,x2,y2,{progres,panah,warna,tebal})` · `kurva(titik,{progres,panah,…})` (Catmull-Rom, mengembalikan ujung) · `panah(x1,y1,x2,y2,{lengkung,progres})` · `jalur(d, x, y, ukuran, {vb:24,…})` (path SVG apa pun) · `ikon(nama, x, y, ukuran, {warna, garis, tebal})`.
Ikon: `bintang hati cek silang panah petir tetes rumah orang awan lampu jam api mata grafik pesan gembok koin peringatan plus hp uang target`.

**Teks** (`*kata*` = aksen, `\n` = baris baru)
- `g.teks(s, x, y, o)`: `ukuran`, `warna`, `aksen`, `font` (`'judul'|'teks'|'mono'`), `berat`, `rata` (`tengah|kiri|kanan`; x = tepi kiri/kanan), `garis` + `tebalGaris` (tepi), `maks` (lebar maks, huruf mengecil otomatis), `jarak` (spasi huruf), `latarAksen` (kotak di belakang kata aksen), `bayang:false`, `cek:false` (tidak ikut cek).
- `g.teksMasuk(s, x, y, t, o)`: kata demi kata; `gaya` `naik|pop|geser|blur|jatuh|ketik`, `mulai`, `jeda` (stagger, bawaan .075), `lama`, `keluar` (detik keluar), `cps` (ketik). `blur` = fokus ditarik: kata kabur menjadi tajam (sprite kecil yang diperbesar, tanpa filter).
- `g.angka(nilai, x, y, t, o)`: hitung naik; `dari`, `mulai`, `lama`, `desimal`, `awalan`, `akhiran`, `rupiah:true`, + opsi teks.
- `g.label(s, x, y, o)`: pil; `warna`, `warnaTeks`, `ukuran`, `ikon`.
- `g.balon(s, x, y, t, o)`: balon bicara/pikir/teriak; `ke:[x,y]` ujung ekor (mulut penutur), `gaya` `bicara|pikir|teriak`, `mulai` (pop), `keluar`, `ukuran`, `lebarMaks`, `warna`, `warnaTeks`.

**Elemen motion graphic**
- `g.kartu(x,y,w,h,{warna, r, bayang, garis})` · `g.cincin(x,y,r,p,{warna,tebal,jejak})` (progres 0..1) · `g.sorot(x,y,r,t,{warna})` (cahaya berdenyut) · `g.garisCepat(x,y,t,{n,warna,laju,dalam,luar})` · `g.kertasSobek(x,y,w,h,{warna,kasar})`.
- `g.batang(x,y,w,h,[{nilai,label,warna}],t,{mulai,jeda,akhiran,maks})` · `g.grafikGaris(x,y,w,h,[angka],t,{mulai,lama,warna,min,maks,kisi,isi,ease})` → `{x, y, nilai}` ujung garis (untuk label yang mengikuti) · `g.donat(x,y,r,[{nilai,warna,label}],t,{tebal,mulai,jeda})`.
- `g.partikel(jenis, t, o)`: `debu bintang konfeti koin gelembung hujan`; `n`, `warna`, `area:[x,y,w,h]`, `mulai`, `dari:[x,y]` (konfeti/koin menyembur dari titik).

**Properti siap pakai**
- `g.hp(x, y, {tinggi, putar, skala, layar(g2, w, h){…}})`: HP; isi layar digambar dengan `g2` berkoordinat layar (0,0 = kiri atas). Jangan memanggil `lapis` di dalam `layar`.
- `g.notif(x, y, t, {judul, teks, ikon, warnaIkon, waktu, mulai, keluar, lebar, tinggi})`: notifikasi turun dari atas.
- `g.ruang({malam, dinding, lantai, horizon, jendela:[x,y,w,h]|false, foto, motif:'garis', lampu:true|x})`: ruangan rumah (panggil di `lapis(0)`).
- `g.kota({y, tinggi:[min,max], lebar:[min,max], warna, jendela, benih})`: deretan gedung; panggil 2× di lapis berbeda untuk parallax.
- `g.sofa(x, y, {lebar, warna})` · `g.meja(x, y, {lebar, tinggi, warna})`: `y` = lantai; tokoh pose `duduk` di `y` yang sama tampak duduk di sofa.
- `g.mesinSlot(x, y, t, {mulai, berhenti, hasil:[i,j,k], simbol, lebar, layar, tulisan})`: tanpa merek; tuas ditarik di `mulai`, gulungan berhenti bergiliran mulai `berhenti`.
- `g.motor(x, y, {skala, hadap, warna, laju, getar, lampu})`: motor tampak samping (`y` = tanah; `hadap` 1 = menghadap kanan, −1 kiri; `laju` = putaran roda rad/dtk, bawaan 9, 0 = diam; `getar` px; `lampu: true` lampu depan menyala). **Mengembalikan titik jok `{x, y}`**: tokoh pose `naikMotor` ditaruh di `x = jok.x`, `y = jok.y + 138 × skalaTokoh`, `hadap` sama dengan motor (lihat contoh). Untuk mendorong motor: tokoh pose `dorong` + `jalan`, di belakang motor.
- `g.papan(teks, x, y, w, h, {warna, warnaTeks, ukuran, tiang, putar})`: papan tulisan (benda bertulisan di dunia cerita: papan nama warung, spanduk, poster); `tiang` = panjang tiang ke tanah. Info cerita lewat benda seperti ini lebih baik daripada teks melayang.
- Kendaraan/benda khas cerita lain (mobil, sepeda, kapal, gerobak): tulis fungsi khusus di blok konfig dari `kotak` `bulat` `poligon` `garis` seperti `motor`.

## 6. Tokoh 2D ber-rig
Dua cara gambar dengan rig yang sama (pose, ekspresi, jalan, sofa, dan properti cocok di keduanya):
- **Sinema** (otomatis di `gaya: 'sinema'`, atau `gaya: 'sinema'` per tokoh): bayang berlapis + cahaya tepi per bagian mengikuti `cahaya`, garis tepi berwarna, lengan/kaki meruncing, tangan berjempol, sepatu bersol, wajah detail (bentuk rahang, iris berwarna + kilau, kelopak, bulu mata, alis meruncing, hidung, bibir, gigi, lidah), rambut berlapis dengan kilau dan ujung yang berayun, bayangan kontak lembut.
- **Klasik** (gaya `flat`/`neon`/`kertas`, atau `gaya: 'klasik'` per tokoh): flat bergaris tinta (v1).
- **Gaya `kartun` memakai tokoh sinema yang sama** (rupa tokoh tidak diubah; permintaan 24 Nov 2026). Mode **stickman** (kepala bulat besar krem, wajah sederhana, badan kecil, tungkai tipis; `tokohStickman`) **tidak aktif kecuali** definisi tokoh bertulis `gaya: 'stickman'`; opsinya: `kepalaSkala` (1.45), `tebalGaris` (7), `warnaGaris`, `kerah` `jas|kemeja`, `overall`, `celemek`, `topi` `pet|helm|koki|peci|caping|kupluk`, `kumis`, `kacamata`.

Definisi di `KONFIG.tokoh.<id>`: `kulit`, `rambut` (`pendek|poni|jabrik|cepak|panjang|kuncir|ikal|botak|jilbab`; klasik: `pendek|panjang|kuncir|cepak|jabrik|jilbab`), `warnaRambut`, `warnaJilbab`, `baju`, `celana`, `sepatu`, `lengan:'panjang'|'pendek'`, `motif:'garis'`, `topi:'pet'|'helm'` + `warnaTopi`, `kacamata:true` (+ `warnaKacamata`), `mata:'titik'`, `pipi:false`, `garis:false` (tanpa tinta), `warnaGaris`, `kepalaSkala`.
Khusus sinema: `kerah` (`kaos` bawaan · `kemeja` (kerah + kancing) · `hoodie` (tudung, tali, kantong; `tudung:false`) · `jas` (kerah jas, kemeja `warnaKemeja`, `dasi: '#warna'`)), `wajah` (`bulat|oval|kotak|lancip`), `warnaMata`, `bulu:true` (bulu mata lentik), `sol` (warna sol sepatu), `warnaKerah`, `warnaBibir`, `warnaAlis`, `tebalGaris`, `detil` (0|1|2, paksa tingkat detail).
**Detail otomatis menurut ukuran di layar** (supaya adegan ramai tetap cepat): tokoh ≥ 1,12× (dekat) = bayang penuh + cahaya tepi; 0,5–1,12× = bayang satu tingkat; < 0,5× = warna datar + garis tepi. `efek.detil` atau `detil` per tokoh/panggilan memaksa.
Panggil `g.tokoh(id, o)`:
| Opsi | Isi |
|---|---|
| `x`, `y` | posisi telapak kaki (tinggi tokoh ±640 px × skala) |
| `skala`, `hadap` (1 / −1) | ukuran, arah |
| `pose` | nama atau `[[detik, 'nama'], …]` (perpindahan halus 0,35 dtk) |
| `ekspresi` | nama atau `[[detik, 'nama'], …]` |
| `bicara` | `true`, `[mulai, akhir]` detik adegan, `'L03'` atau `['L03','L04']`: mulut mengikuti waktu kata |
| `lirik` | `[x, y]` arah bola mata (−1..1) |
| `jalan` | `{dari, ke, mulai, lama}`: siklus jalan + arah hadap otomatis |
| `pegang`, `pegangKiri` | tangan kanan / kiri memegang: `'hp'` `'koin'` `'uang'` `'cangkir'` (kopi + uap) `'stylus'` `'pensil'` `'kuas'` `'kardus'` (menutupi badan) `'amplop'` `'tablet'` · makanan/benda: `'mangkuk'` (bakso, beruap) `'roti'` `'ayam'` `'sendok'` `'gelas'` `'koran'` `'buku'` `'senter'` `'payung'` · **fungsi sendiri** `(c, T, sisi) => { … }` menggambar benda di telapak tangan (0,0), menjulur ke atas |
| `putar` | derajat; memutar seluruh tokoh di telapak kaki (tidur `90`, jatuh) |
| `muncul` | detik adegan saat tokoh pop masuk |

Otomatis: kedip acak per tokoh, napas, ayun kepala dan lengan halus, bayangan lantai.
Pose aksi cerita (sejak 24 Nov 2026): `makan` `makanKiri` (tangan ke mulut) · `dudukMakan` (duduk + makan; taruh `g.meja` setelah tokoh) · `minumBerdiri` · `naikMotor` `setir` (duduk menyamping, lengan ke depan) · `dorong` (lengan ke depan; dengan `jalan` hanya kaki yang melangkah) · `baca`. Penanda pose: `samping` (duduk menyamping), `depan` (kedua lengan menjulur ke arah hadap). Pose sendiri: `KONFIG.pose = { nama: { bKi, sKi, bKa, sKa, badan, kepala, turun, duduk, samping, depan, … } }` (sudut lengan `b` = bahu, `s` = siku, derajat; 0 = ke bawah, 90 = mendatar, 180 = ke atas).
Pose: `berdiri santai lambai tunjuk tunjukAtas presentasi pikir sedekap kaget hore angkatBahu sedih marah bingung pegangHp duduk dudukHp dudukTegang dudukLesu menggambar minum bawaKardus serahkan bimbing jongkok jongkokBimbing peganKepala takut` (`menggambar` = tangan kanan bergores di atas tablet; `minum` = tangan kiri membawa cangkir ke dagu; `peganKepala` = kedua tangan di kepala). Pose duduk dipadukan dengan meja yang digambar setelah tokoh (menutupi kaki).
Ekspresi: `netral datar senang gembira kaget sedih marah bingung licik takut ngantuk`.
Proporsi anak: `KONFIG.tokoh.<id>.kepalaSkala` (mis. 1,24) memperbesar kepala; dipakai bersama `skala` kecil (0,5–0,7).
Cek mesin menandai subtitle yang menutupi wajah tokoh. Bingkai polos di dalam transisi (mis. `gelap`, fade ke hitam) tidak dihitung sebagai bingkai kosong.

## 6a. Kecepatan (penting: pengguna memutar dan mengekspor di PC sendiri)
Patokan CPU cloud (1080×1920, ms per bingkai termasuk raster): adegan biasa flat 15–30, sinema 25–45; ekspor 22 dtk: flat 32 dtk, sinema 36 dtk. Lintasan akhir (vinyet + grain + grading) dipanggang sekali, ±2 md per bingkai di semua gaya.
- **Jangan** memakai `c.filter` (blur/drop-shadow) per bingkai di blok konfig: ±100–400 md per bingkai. Kabur = `lapis(…, {blur})` (sekali per adegan) atau sprite.
- Latar yang diam → `lapis(0, …, {tetap: true})`; latar yang dikaburkan → `{blur}`. Bokeh 8–16 buah cukup; `berkas` 3–6.
- Adegan dengan > 4 tokoh: biarkan detail otomatis (tokoh kecil = lebih ringan); hindari `skala` > 1,2 untuk banyak tokoh sekaligus.
- `efek.mekar` (bloom) hanya bila perlu; +±12 md per bingkai.
- Pemutar: bila pratinjau HD < ±22 bingkai/dtk, otomatis pindah ke **Cepat** (setengah resolusi) dengan pesan; ekspor tetap 1080p. `?hd=1` memaksa HD, `?hd=0` mulai di Cepat.

## 7. Suara, subtitle, musik
- **Tanpa narasi**: `KONFIG.teks` bertanda waktu → subtitle per kata.
- **Dengan narasi**: blok `data-suara` (ditulis `jalankan.py rakit --naskah --narasi|--baris`):
  `{"mulai": .3, "baris": [{"id": "L01", "teks": "…"}], "narasi": {"src": "data:audio/mpeg;base64,…", "mulai": .3}, "musik": {"src": "…", "vol": .3}, "kata": [[mulai, akhir, "kata"], …]}`.
  Satu rekaman narasi dipotong otomatis di jeda hening (≥ 0,1 dtk; N−1 jeda dipilih dengan pemrograman dinamis supaya panjang suara tiap baris sebanding dengan suku kata teksnya, jadi jeda koma di tengah kalimat dilewati); berkas per baris (`src` per baris) dipakai apa adanya. `kata` opsional (waktu kata asli, mis. ElevenLabs with-timestamps); tanpa itu waktu kata diperkirakan dari panjang kata.
  Tombol **Muat suara** di pemutar: satu berkas = narasi; `L01.mp3…` = per baris; nama berisi `musik` = musik.
- `naskah.txt` untuk `rakit --naskah`: satu baris narasi per baris (`L01 | teks`), urut seperti rekaman; baris berawalan `#` = catatan (sumber, arahan), tidak ikut.
- Dengan narasi, naikkan `vol` musik sintesis ±2,5× (1,0–1,6) karena audio akhir dinormalisasi mengikuti suara narasi.
- **Subtitle bawaan = gaya film** (permintaan 24 Nov 2026: kecil dan biasa seperti film): putih `600`, 44 px di 9:16 (38 px di 16:9) × `subtitle.ukuran`, tepi hitam tipis + bayangan lembut, satu kalimat utuh sekaligus (maks. ±8 kata / 40 huruf per potongan di 9:16, pecah di titik/tanya/seru dan jeda > 0,7 dtk), maks. 2 baris, di ±73,5% tinggi (9:16) / 89,5% (16:9), tanpa sorot kata dan tanpa warna aksen (`*` diabaikan). `subtitle.gaya: 'garis' | 'kotak'` mengembalikan gaya lama (66 px, tebal, 3 kata, kata aktif disorot) untuk caption pendek ala Shorts. **Teks atas** (`g.teks`/`g.teksMasuk`) hanya untuk hal penting, bukan pengganti subtitle.
- **Musik sintesis** `sintesis`: `pulsa` (kick + hi-hat + bass + pad), `ceria` (pulsa + arpeggio), `tegang` (detak jantung + pad gelap), `pad` (akord panjang). Opsi `bpm`, `kunci` (Hz nada dasar), `akord` (semitone, mis. mayor `[[0,4,7],[5,9,12],[7,11,14],[0,4,7]]`), `vol`, `mulai`, `akhir`. Diredam otomatis saat narasi.
  Opsi segmen musik tambahan: `fadeMasuk` (dtk), `fadeKeluar` (dtk, memudar sampai hening di `akhir`), `potong: true` (terpotong tiba-tiba di `akhir`, untuk efek "musik terputus"). Beberapa segmen boleh bertumpuk (mis. `pad` + `ceria`) supaya instrumen terasa makin kaya.
- Akhir audio dinormalisasi ±−17 dBFS RMS (±−14 LUFS) dengan pembatas lembut ±−2 dBFS (`normalisasi: false` untuk mematikan).
- **Musik berkas** (`data-suara.musik` = `{src, vol, redam, ulang}`; `rakit --musik f.mp3 --vol-musik 1.15 --redam-musik .2 --musik-utuh`): diputar sekali (`ulang: false`) atau di-loop; saat tiap kalimat dialog/narasi turun ke `vol × redam` (bawaan .3), **lebih dalam untuk kalimat yang diucapkan pelan** (bisikan, nada dingin: redam × RMS kalimat / median, min. ×.35) supaya suara tetap jelas; memudar di 1,2 dtk terakhir.

### 7b. Musik latar per babak dari Epidemic (sejak 27 Nov 2026: "tambahkan musik pengiring yang bagus dan cocok dari Epidemic")
Satu lagu datar sepanjang video terasa kosong (uji Timbangan Daging: "Dead Silence" datar + hampir hening ±20 dtk tepat saat konfrontasi). Film memakai musik yang **berganti per babak cerita**. Alat: `scripts/musik_epidemic.py` (kunci Epidemic dari env atau `D:\Sound\mcpsound.md`, tidak dicetak).
1. **Bagi video jadi 3–5 babak emosi** dari daftar adegan (`cek` → `adegan`), mis. licik/gelap → sedih-tegang → horor membangun → sunyi-sedih penutup. Batas babak = pergantian adegan/suasana.
2. **Cari** per babak: `musik_epidemic.py cari "sneaky dark suspense" 8 60` (tanpa vokal; baca tag mood/genre). Kata kunci yang terbukti: licik `sneaky dark suspense`, sedih-tegang `sad tense strings` / `dark sad suspense`, horor `creepy horror tension` / `horror suspense build`, sunyi `eerie dark ambient`; ceria `upbeat quirky`, edukasi `curious light corporate`.
3. **Potong resmi** sepanjang babak + 1–1,5 dtk tumpang: `musik_epidemic.py edit <id> <dtk> _kerja/audio/musik/A.mp3` (EditRecording: akhir alami, bukan dipotong kasar).
4. **Ukur** (saya tidak bisa mendengar): `musik_epidemic.py ukur A.mp3 B.mp3 …` → kurva energi per 2 dtk. Cocokkan bentuknya ke cerita: hentakan/puncak jatuh di momen kunci (makhluk muncul, klimaks), hening sesaat sebelum kejutan; geser `mulai` potongan 1–3 dtk bila perlu.
5. **Rakit**: `musik_epidemic.py latar _kerja/audio/musik_latar.mp3 <durasi> A.mp3@0@-20 B.mp3@43@-20 C.mp3@92.5@-19 D.mp3@143.3@-21` (disamakan ke LUFS target, crossfade, dipotong sepanjang video). Babak horor/klimaks −19, babak tenang −21.
6. **Tanam**: `rakit … --musik _kerja/audio/musik_latar.mp3 --vol-musik 1.15 --redam-musik .2 --musik-utuh`.
7. **Cek campuran** (render audio saja, ±1 menit): `musik_epidemic.py cek _kerja/film.html` → tiap kalimat rata-rata ≥ +10 dB dan terburuk 0,5 dtk ≥ +6 dB di atas musik+SFX; musik di sela dialog −8 … −12 dB dari suara. Tenggelam → turunkan `--redam-musik`/`--vol-musik`; musik tak terasa → naikkan `--vol-musik`.
8. Catat kredit (judul — artis per babak) di `musik - kredit.txt` dan deskripsi YouTube. Contoh hasil: Timbangan Daging v4 (`Hasil Video\Motion Graphic 3D\_contoh\2026-11-27 Timbangan Daging v4 musik\`).

## 8. Transisi (`masuk` adegan berikutnya)
| Nama | Lama | SFX otomatis | Kapan |
|---|---|---|---|
| `potong` | 0 | — | kejutan, ritme cepat |
| `lebur` | .5 | — | lembut, jarang |
| `gelap` | .8 | — | ganti suasana / emosional |
| `whip` | .38 | whoosh | pindah tempat/waktu cepat (`arahMasuk` ±1) |
| `zoom` | .55 | whoosh | masuk ke detail, zoom-through |
| `wipe` | .6 | swish | sapuan miring berpita warna aksen (mask wipe) |
| `iris` | .6 | pop | match cut bentuk dari `titikMasuk` (lingkaran ke lingkaran) |
| `glitch` | .36 | glitch | gangguan, fakta mengejutkan |
| `geser` | .5 | swish | dorong vertikal (9:16) / horizontal (16:9) |
| `kilat` | .3 | impact | hentakan, angka besar |
Aturan: dalam satu video ≥ 4 jenis, jangan dua jenis sama berturutan kecuali `potong`.

## 9. SFX (`jenis`)
`whoosh swish pop klik tik ketik(lama) impact boom riser(lama) ding(nada) benar salah kaching koin(nada) notif glitch dum jantung kamera sub lalin(lama) dengung(lama) jam napas kuas data(lama) murmur(lama) tawa`. Opsi `vol`, `lama`, `nada`. Taruh tepat di kejadian visualnya (angka mendarat = `dum`/`ding`, teks pop = `pop`, perpindahan = `whoosh`).

### SFX berkas (sejak 18 Nov 2026: efek Epidemic atau rekaman sendiri)
`jalankan.py rakit … --sfx DIR` menanam semua berkas audio di `DIR` (mp3/wav/ogg/m4a) sebagai `data-suara.sfxBerkas`; nama = nama berkas tanpa ekstensi (pakai nama pendek tanpa spasi, mis. `hantam.mp3`, `sirine.mp3`). Dipanggil dari `sfx` adegan atau `KONFIG.sfx` seperti SFX sintesis:
```js
sfx: [{ t: 'L04.w9', jenis: 'berkas', berkas: 'hantam', vol: .55 },
      { t: .1, jenis: 'berkas', berkas: 'sirine', dari: 2, lama: 5.6, vol: .4 },        // mulai dari detik ke-2 berkas, diputar 5,6 dtk (pudar 0,3 dtk di ujung)
      { t: 'L05.akhir-2.4', jenis: 'berkas', berkas: 'riser', dari: 3.01, lama: 2.4 },  // riser berakhir tepat di 'L05.akhir' (dari = durasi berkas − lama)
      { t: 'L15.w21', jenis: 'berkas', berkas: 'jantung', ulang: true, lama: 6 }]      // ulang: berkas diulang sampai lama
```
Opsi: `t`, `vol`, `lama` (detik atau rujukan; bawaan = sisa berkas, atau 4 dtk bila `ulang`), `dari` (offset dalam berkas), `ulang`, `masuk` (naik 0,02 dtk bawaan). `KONFIG.sfxTransisi: false` mematikan whoosh sintesis transisi, lalu taruh whoosh berkas manual (`t: -.25` = 0,25 dtk sebelum adegan mulai). Potong dulu berkas panjang (ambient 1–2 menit) dengan ffmpeg ke 10–30 dtk supaya HTML tidak membengkak (semua berkas ikut tertanam sebagai base64). Musik berkas tetap lewat `--musik` (satu berkas, di-loop, diredam saat narasi). Contoh dipakai: Episode 2 Tragedi (musik "Where It All Happened" + 12 efek Epidemic, `audio/epidemic/sfx/`).

## 10. Fungsi global (otomatisasi)
`seek(t)`, `DURATION`, `FPS`, `SIAP`, `hasilCek()`, `lembarKontak(n)`, `thumbnail()`, `eksporMP4({fps, bitrate, progres})`. URL: `?t=12` mulai di detik 12, `?render` tanpa kontrol, `?cek` jalankan cek saat dibuka, `?hd=0` pratinjau setengah resolusi, `?hd=1` paksa HD (tanpa pindah otomatis).
Ekspor: WebCodecs `VideoEncoder` (H.264 High `avc1.640028`; 60 fps `avc1.64002A`; turun ke Main/Baseline bila perlu), `AudioEncoder` AAC (`mp4a.40.2`) atau Opus, penyusun MP4 sendiri (moov di depan, keyframe tiap 2 dtk). Browser tanpa WebCodecs → rekam waktu nyata (MediaRecorder, MP4/WebM).

## 11. Menambah fitur mesin
Properti/pose/transisi baru ditulis di blok `inti` `assets/templat.html` (bukan di konfig video) bila akan dipakai lagi; fungsi khusus satu video boleh ditulis di blok konfig (seperti `koin`, `gir`, `jam`, `tanah` di contoh). Setelah mengubah mesin: rakit ketiga contoh (`kartun-bakso-motor` = kartun warna per adegan, `sinema-begadang` = sinema malam, `kalah-judol` = flat), `cek` BERES, `kontak` dilihat, `ekspor` sekali, ukur ms/bingkai (§6a; jangan sampai lebih lambat tanpa alasan), lalu catat di dokumen ini.

**Riwayat warna**: 23 Nov 2026 palet bawaan pastel (`cerah`, 10 suasana) dibuat lalu **ditolak** ("masih terlihat anime sekali"). 24 Nov 2026: `SUASANA` diganti 8 keadaan hasil ukur bingkai RicksClips3000 (`siang malam kobalt oranye hijau sorot aula senja`), **`adegan.suasana` mengganti palet `P` + efek + cahaya per adegan** (`aturKeadaan`), `adegan.palet`/`adegan.efek`, gaya `kartun` (garis tepi otomatis `P.gelap`, tebal layar tetap), langit lebih jenuh, `g.motor`, `g.papan`, properti makanan/benda, pose aksi (`makan` `dudukMakan` `naikMotor` `dorong` …) + `KONFIG.pose` + `pegang` fungsi, `tokoh.putar`, helm, subtitle gaya film bawaan, stickman opsional. Contoh lama dipin ke gaya subtitle lama (`gaya: 'garis'`).