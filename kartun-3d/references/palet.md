# Warna menurut keadaan adegan (acuan RicksClips3000)

Dibaca di Tahap 1 (memilih warna untuk 3 konsep) dan Tahap 2 (build). Permintaan pengguna 24 Nov 2026: warna visualnya **seperti contoh RicksClips3000** (`D:\automation\Video AI\Video Refrensi\RicksClips3000`), dan "intinya **warna menyesuaikan dengan keadaan**". Versi 23 Nov (pastel ala Ghibli) ditolak: "masih terlihat anime sekali". Jadi warna bukan palet tetap satu video; **tiap adegan berwarna sesuai keadaannya** (tempat, waktu, perasaan), seperti di acuan: kantor biru kobalt, kapal oranye, ubin hijau, taman siang biru, lorong gelap berlampu sorot amber.

## 1. Apa yang diukur dari acuan (18 bingkai dari 6 Shorts, 14 Nov 2026)
- **Satu warna dominan jenuh per adegan** yang berganti antar-adegan: kobalt `#2D418E` `#0C1967` `#3A4BC5`, oranye karat `#CD4522` `#C87442` `#DE8548`, hijau `#8EBE88` `#6B946E` `#397336`, langit biru `#4A9AE1` `#7EC0F2` `#99D9F7`, kuning madu/emas untuk aksen kecil.
- **Adegan lampu sorot**: ruang gelap cokelat-zaitun (`#2D241B` `#6B584B`), satu lampu gantung hangat (amber), lantai bergaris, tepi layar sangat gelap (vinyet kuat).
- **Garis tepi cokelat-hitam bernuansa** (`#2C1911`), bukan hitam murni; sama tebalnya di tokoh dan benda.
- **Wajah krem** `#E6CBB6`/`#F2E4D2`; benda bertulisan (papan, koran) memberi info di dunia cerita.
- Rata-rata saturasi ±0,46 dan kecerahan ±0,55: kaya dan berani, **bukan pastel dan bukan neon**. Bayangan berwarna (biru-ungu di siang, cokelat di sorot), lampu hangat bercahaya.

## 2. Mesin: `suasana` = keadaan (palet + cahaya + efek)
- `KONFIG.suasana` = palet dasar video; **`adegan.suasana` = palet + cahaya + efek adegan itu** (mesin mengganti `P` tiap adegan, jadi `P.latar`, `P.utama`, … otomatis mengikuti keadaan adegan). `KONFIG.palet`/`adegan.palet` menimpa satu per satu; `adegan.efek` menimpa grain/vinyet/grade; `paletSuasana('malam')` mengambil palet suasana lain untuk satu benda.
- Tulis di storyboard kolom **Keadaan** per adegan (tempat + waktu + perasaan) lalu pilih satu suasana; jangan memakai satu suasana untuk seluruh video kecuali ceritanya memang di satu keadaan.

| `suasana` | Keadaan | latar | utama | aksen | kedua | gelap (tepi) | terang | Contoh dari acuan |
|---|---|---|---|---|---|---|---|---|
| `siang` | luar ruang siang, langit biru, rumput, kayu | `#6FB4EC` | `#4F9A52` | `#F2B134` | `#D8402F` | `#2A1A12` | `#F7F9F9` | taman hiburan, dek kapal siang |
| `malam` | malam kobalt, bulan, lampu jalan/jendela | `#1E2A5E` | `#3A4BC5` | `#FFB547` | `#E0553A` | `#0A0A2A` | `#EAF0FF` | gedung kantor malam, kapal malam |
| `kobalt` | dalam gedung/kota, biru jenuh bersih | `#2D418E` | `#4A9AE1` | `#FFC24A` | `#D8402F` | `#0C1967` | `#F7F9F9` | kantor putih berkarpet biru |
| `oranye` | panas, senja, gurun, kapal, hidangan hangat | `#C87442` | `#CD4522` | `#F2C14E` | `#2F6FB0` | `#2B1210` | `#FBE9D0` | ngarai oranye, kapal bajak laut |
| `hijau` | ubin hijau, taman, alam, kesegaran | `#8EBE88` | `#397336` | `#F2C14E` | `#D8402F` | `#1F2B2A` | `#F2F4E8` | dinding ubin hijau, taman |
| `sorot` | ruang gelap berlampu sorot hangat, tegang/intim | `#2D241B` | `#6B584B` | `#FFC25A` | `#C0452F` | `#120F0F` | `#E6CBB6` | ruang bohlam gantung, warung |
| `aula` | gedung klasik, abu-ungu, resmi, sejarah | `#756669` | `#322F43` | `#E0B040` | `#8C2F2F` | `#1A1822` | `#E9E3DA` | aula istana |
| `senja` | langit ungu-mawar, ngarai biru-ungu | `#5572BC` | `#973F71` | `#FFB35A` | `#E05A44` | `#1E1B45` | `#F3E3E0` | ngarai senja |

Cahaya dan efek tiap suasana sudah tertanam di mesin (`sudut`, `warna`, `bayang` berwarna, `tepi`, `kabut`, `grain`, `vinyet`, `grade`); vinyet `sorot` .6 (sekeliling gelap), `siang`/`hijau`/`kobalt` .25–.3.

## 3. Memilih keadaan per adegan
1. Baca storyboard/topik; tiap adegan jawab: **di mana, kapan, rasanya apa**. Pilih suasana yang paling dekat.
2. Aturan pasangan:

| Keadaan adegan | Suasana |
|---|---|
| luar ruang siang, jalan, taman, alam, olahraga | `siang`, `hijau` |
| sore/senja, perjalanan pulang, panas, makanan hangat, gurun | `oranye`, `senja` |
| malam di luar, kota malam, begadang, sunyi | `malam` |
| kantor, kota, teknologi, keuangan, kerja | `kobalt` |
| warung/kafe/dapur/kamar bercahaya hangat, adegan intim atau tegang, misteri, bahaya | `sorot` |
| sejarah, gedung resmi, pemerintahan, formal | `aula` |
| dapur/kamar mandi/kebersihan/kesehatan segar | `hijau` |
| reaksi wajah dekat | ikut tempat adegan sebelumnya atau warna kontras (`hijau` dan `kobalt` memberi wajah latar bersih) |

3. **Tiap adegan baru mengganti warna dominan** (seperti acuan), kecuali dua adegan berurutan memang di tempat yang sama. Ganti warna dominan lewat `adegan.suasana`; tokoh dan benda otomatis mengikuti `P` adegan itu bila warnanya diturunkan dari palet.
4. **Topik tidak menentukan warna, keadaan ceritanya yang menentukan**: video keuangan bisa diawali `kobalt` (kantor), lalu `sorot` (malam menegangkan), lalu `siang` (jalan keluar). Kategori topik (`topik/README.md`) hanya memberi titik awal: sains-alam `siang`/`hijau`, kesehatan `hijau`/`kobalt`, otomotif `siang`/`oranye`, keuangan `kobalt`/`sorot`, teknologi `kobalt`/`malam`, sejarah `aula`/`oranye`, berita-politik `kobalt`/`aula`, misteri-horor `sorot`/`malam`, kebiasaan `sorot`/`kobalt`, tips-rumah `sorot`/`hijau`, cerita-hiburan mengikuti tempat tiap adegan.

## 4. Menurunkan warna benda dari keadaan
- Gunakan `P.latar/utama/aksen/kedua/gelap/terang` dan `campur(P.utama, P.gelap, .25)` (gelap), `campur(P.latar, P.terang, .3)` (terang) di dalam `gambar`, bukan hex baru; hasilnya otomatis serasi saat suasana adegan diganti.
- Warna tetap yang boleh ditulis hex: kulit/rambut/baju tokoh (`KONFIG.tokoh`), benda dengan warna bawaan (cahaya lampu `#FFF3C0`, api `#FF9A3C`, roda motor), dan tanda peringatan (`P.kedua`).
- Garis tepi: `P.gelap` (otomatis di gaya `kartun`); teks putih bertepi `P.gelap`; aksen teks `P.aksen` atau `P.kedua` untuk bahaya.
- Langit 3D: `d.langit({ waktu })` mengikuti keadaan adegan (siang biru jenuh, senja ungu-mawar-jingga, malam kobalt + bintang); untuk langit oranye/ngarai tulis `atas/tengah/bawah` sendiri (contoh `contoh/kartun-bakso-motor-3d.konfig.js` adegan 1). Studio (`d.studio()`) dan tanah polos memakai `P.latar` adegan.
- Cahaya 3D ikut keadaan otomatis (warna cahaya kunci, bayang berwarna, cahaya tepi, kabut, kekuatan); `adegan.cahaya3d` menimpa kekuatannya (`references/mesin.md` §5). Tone mapping lembut menjaga warna palet tetap jenuh.

## 5. Salah kaprah yang harus dihindari
| Jangan | Ganti dengan |
|---|---|
| pastel lembut seragam (terasa "anime") | warna kaya dengan satu warna dominan jenuh per adegan |
| satu palet untuk seluruh video | warna berganti mengikuti keadaan tiap adegan (`adegan.suasana`) |
| neon (`#00F0FF`, `#FF2BD6`, `#B6FF3B`) dan magenta jenuh | kobalt, oranye karat, hijau daun, kuning madu |
| hitam murni di tepi/bayangan | `P.gelap` bernuansa (cokelat-hitam, navy gelap) dan bayang berwarna |
| lampu tanpa cahaya (bohlam polos) | lampu 3D bercahaya (`d.lampu`, `d.sorot` dengan kerucut cahaya) dan keadaan `sorot` di sekeliling gelap |
| warna benda acak | turunkan dari palet adegan |
