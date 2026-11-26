# Topik bersama (dipakai semua skill video)

Satu sumber aturan topik untuk semua skill visual. Skill = **cara menggambar** (mesin + gaya); topik = **apa yang dibicarakan** dan aturannya. Semua skill bisa dipakai untuk semua topik.

> Sumber utama: `_bersama/topik/` di root repo. Setiap skill punya salinannya di `.claude/skills/<skill>/topik/` (dibuat `_skills/sinkron_topik.ps1`, otomatis dijalankan `pasang_skill.ps1` dan `buat_zip_web.ps1`). Ubah **hanya** di `_bersama/topik/`, lalu jalankan sinkron.

## Cara dipakai skill (Tahap 1)
1. Tentukan kategori dari tabel di bawah; tulis di kartu ide (`Topik: kesehatan`) dan di baris status (`topik kesehatan`).
2. Baca `topik/<kategori>.md`. Topik yang memotong dua kategori (mis. "biaya servis motor" = otomotif + keuangan): pakai kategori utama, lalu ambil aturan **Sumber** dan **Batas & aman** dari kategori kedua juga.
3. Tidak cocok dengan mana pun → `umum.md`.
4. Di setup (klik 1) kategori topik tampil sebagai tombol yang bisa diganti.

## Urutan menang bila bertentangan
1. **Batas & aman** dan **Sumber** dari file topik (selalu menang).
2. Aturan preset seri yang dipilih (mis. Apa Jadinya, Kita Bongkar).
3. Aturan gaya (`gaya/<nama>/GAYA.md`) dan SKILL.md: tampilan, mesin, alur, durasi.
4. Saran topik lain (nada, hook, alur bab): saran, boleh disesuaikan dengan gaya.

`categoryId` YouTube diambil dari file topik; tag dasar topik ditambahkan ke tag video. Konten fiksi (skit, horor, film pendek) selalu memakai `cerita-hiburan.md` atau `misteri-horor.md` walau temanya kesehatan/uang, tetapi fakta nyata di dalamnya tetap ikut aturan sumber kategori aslinya.

## Daftar kategori

| File | Cakupan | Contoh dari proyek ini | categoryId |
|---|---|---|---|
| `kesehatan.md` | tubuh, penyakit, gizi, kebiasaan sehat, mental | Gigi Tidak Disikat Sebulan, Otak Zombie | 27 |
| `otomotif.md` | motor, mobil, servis, BBM, surat kendaraan | Motor Injeksi Diisi Solar, Rahasia CVT, Warna Busi | 2 |
| `keuangan.md` | uang pribadi, utang, paylater, pinjol, judi online, harga, ekonomi | Ilusi Paylater, 500 Ribu Jadi Berapa, Judol | 27 |
| `teknologi.md` | AI, gadget, internet, aplikasi, keamanan digital | AI Tidak Mikir Seperti Manusia, Listrik AI | 28 |
| `sains-alam.md` | fisika/kimia sehari-hari, alam, lingkungan, bencana, hewan | Efek Domino Hutan Bakau, Es Puter Ditaburi Garam, Krakatau | 27 |
| `sejarah.md` | peristiwa, tokoh, tempat, benda bersejarah | N250 Gatotkaca, Siaran TV Pertama Indonesia | 27 |
| `berita-politik.md` | berita terbaru, kebijakan, hukum, pemerintahan | Wapres Gibran Mundur, Kenapa Rokok Masih Legal, Day 1 Jadi Presiden | 25 |
| `misteri-horor.md` | kisah nyata ganjil, kasus, cerita horor fiksi bersambung | Desa Sukamaju, Sumur Rawasunyi, Tragedi Mbah Misem | 1 (fiksi) / 25 (kasus nyata) |
| `kebiasaan.md` | gaya hidup, psikologi sehari-hari, produktivitas, relasi | Scroll, Mager, Ngaret, Skripsi | 27 |
| `tips-rumah.md` | DIY, bikin sendiri, alat rumah, dapur, listrik & air rumah | Bikin Bunker, Kulkas Tanah Liat, Sawah Dibuat Seperti Tangga | 26 |
| `cerita-hiburan.md` | skit, komedi, film pendek, fabel, UGC promosi, lirik, opening brand | Pencuri Ide Rapat, Catatan Terakhir Pak Darto, Good Life | 1 / 23 / 24 / 22 |
| `umum.md` | apa pun yang tidak masuk daftar di atas | — | 27 |

## Menambah topik baru
Salin `umum.md` jadi `<kategori>.md` (huruf kecil, tanda hubung), isi semua bagiannya, tambahkan barisnya di tabel ini, lalu jalankan `_skills/sinkron_topik.ps1`.
