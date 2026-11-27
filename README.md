# Skill Motion Graphic 3D

Skill Claude Code untuk membuat video **motion graphic 3D** (9:16 atau 16:9, Shorts sampai beberapa menit) dari **satu file HTML** dengan Three.js tertanam, untuk topik apa pun, **mengikuti storyboard** adegan demi adegan. Versi 3D dari skill `motion-graphic`. Versi 2D tetap terpisah dan tidak diubah.

- **Dunia 3D sungguhan**: cahaya + bayangan, eksposur otomatis per adegan (tidak keruh/gosong), kabut jarak, garis tepi kartun. Warna berganti mengikuti keadaan tiap adegan (8 suasana: siang, malam, kobalt, oranye, hijau, sorot, aula, senja); adegan gelap memakai kontras lampu hangat + bayang biru.
- **Bidikan kamera otomatis ala film**: cukup tulis `{ bidik: 'darmo', jenis: 'dekat' }`, `{ dua: ['a','b'] }`, `{ atasBahu: ['a','b'] }`, `{ benda: 'timbangan' }`; mesin menghitung posisi kamera dari wajah tokoh, menghindari benda/tokoh yang menghalangi, tidak masuk dinding. `cek` menolak tokoh yang sedang bicara bila wajahnya di luar bingkai, membelakangi kamera, atau tertutup.
- **Tokoh 3D ber-rig beragam**: tubuh pria/wanita/gemuk/kurus/tua/anak, kulit bervariasi, motif baju (kotak, garis, batik, bunga, polkadot, goni), singlet/kebaya/jarik/jubah, konde, mata menyala, aksesori kepala sendiri (`hiasKepala`). 60+ pose (termasuk pose bercerita: usir, tolak, mundurTakut, tuang, pikul, menangis, berdoa, tunjukMarah …), 11 ekspresi, mulut bicara ikut kata, jalan/lari, naik motor/mobil, memegang properti, menunjuk/meraih sasaran tepat (IK), akting otomatis supaya tidak kaku.
- **Benda dan tempat**: studio melengkung, langit, ruangan (dinding bata/motif), kota, jalan, warung, rumah, pohon, motor, mobil, perabot, nasi berbutir, karung goni, timbangan (dacin/digital/duduk), pintu (kayu/rolling door/besi, bisa membuka), jeriken, ember, drum, gentong, peti, lampu gantung berayun, rak barang, HP/TV/laptop yang layarnya berisi grafik 2D bergerak, papan bertulisan, grafik batang/pai 3D, ikon 3D, koin, uang, partikel.
- **Lapisan 2D + suara**: teks atas, label yang menempel di benda 3D, subtitle kecil gaya film, musik dan SFX sintesis atau berkas, narasi ElevenLabs/rekaman sendiri. **Musik latar per babak dari Epidemic Sound** (`scripts/musik_epidemic.py`: cari, potong resmi sepanjang babak, rakit dengan crossfade, cek kejelasan dialog); musik turun otomatis saat dialog, lebih dalam untuk kalimat yang diucapkan pelan.
- **Ruang tertutup + cek visual**: `ruang()` berdinding 4 sisi + plafon gaya rumah boneka (kamera di sisi mana pun tidak pernah melihat latar kosong), kamera selalu di atas lantai; `cek` menolak mulut/wajah tokoh yang bicara tertutup tangan/properti, teks menutupi wajah, latar kosong; `jalankan.py lembar` membuat lembar kontak per detik untuk diperiksa mata sebelum ekspor.
- **Tanpa clipping**: kaki selalu menapak, tangan/lengan tidak pernah masuk ke badan, kepala, atau benda (IK otomatis tiap bingkai); `cek` menolak tokoh yang menembus benda, benda saling tembus, dan kamera di dalam benda.
- **Ekspor MP4 di browser** (WebCodecs H.264 + AAC, 10/14 Mbps; `--batas-mb 46` bila perlu ≤ 50 MB), cek kualitas otomatis, lembar kontak, thumbnail. File HTML jalan offline.
- Gaya bahan: `kartun` (bawaan), `clay`, `mainan`, `lowpoly`.

## Isi repo
| Folder/berkas | Isi |
|---|---|
| `motion-graphic-3d/SKILL.md` | alur 5 tahap dua klik (brief → storyboard + build + cek → suara → render → unggah) |
| `motion-graphic-3d/assets/` | `templat.html` (mesin 2D, pemutar, suara, ekspor), `three.min.js` (Three.js r147, lisensi MIT), `mesin3d/*.js` (mesin 3D) |
| `motion-graphic-3d/references/` | `mesin.md` (API dunia 3D), `mesin-2d.md` (lapisan 2D, suara, transisi), `gaya.md`, `palet.md`, `dunia-topik.md`, `storyboard.md`, `kemasan.md` |
| `motion-graphic-3d/contoh/` | `kartun-bakso-motor-3d.konfig.js` (cerita), `infografis-uang-3d.konfig.js` (explainer), `cerita-timbangan-daging.konfig.js` (cerita berdialog 4 tokoh + bidikan otomatis), semuanya lolos `cek` |
| `motion-graphic-3d/scripts/jalankan.py` | `rakit`, `cek`, `kontak`, `lembar` (per detik), `bingkai`, `thumbnail`, `ekspor` |
| `motion-graphic-3d/topik/` | aturan per kategori topik (sumber data, nada, hook, tag) |
| `pasang.ps1` | memasang skill ke `%USERPROFILE%\.claude\skills\motion-graphic-3d\` |

Video, audio, dan hasil render **tidak disimpan di repo ini**.

## Pasang di PC
```powershell
git clone https://github.com/Rizkymema/Skill-Motion-Graphic-3D-Rizky.git
cd Skill-Motion-Graphic-3D-Rizky
powershell -ExecutionPolicy Bypass -File .\pasang.ps1
```
`pasang.ps1` menyalin skill ke `%USERPROFILE%\.claude\skills\motion-graphic-3d\` dan mencadangkan versi lama ke `%USERPROFILE%\.claude\skills-cadangan\`. Panggil di Claude Code: `/motion-graphic-3d`.

Kebutuhan: Python 3.12 + Playwright (memakai Chrome/Edge terpasang), Pillow; browser dengan WebGL (akselerasi grafis aktif). Narasi ElevenLabs dan unggah YouTube memakai repo Video AI (`_elevenlabs`, `_youtube`, `_thumbnail`, skill `unggah-youtube`).

## Coba cepat
```powershell
python motion-graphic-3d\scripts\jalankan.py rakit motion-graphic-3d\contoh\kartun-bakso-motor-3d.konfig.js film.html
python motion-graphic-3d\scripts\jalankan.py cek film.html
```
Buka `film.html` di Chrome/Edge: ▶ untuk memutar, tombol **Ekspor MP4** untuk menyimpan video.

## Ubah skill
Repo ini salinan rapi dari skill yang dikembangkan di project Video AI (`.claude/skills/motion-graphic-3d` di repo Automation-youtube). Di PC pemilik: ubah di sana, jalankan `_skills/sinkron_repo_skill.ps1`, lalu commit + push di repo ini. Di PC lain: `git pull` lalu `pasang.ps1`. Jangan menyunting salinan di `~/.claude/skills` langsung. Fitur mesin 3D baru masuk `motion-graphic-3d/assets/mesin3d/`. Setelah itu rakit ketiga contoh, pastikan `cek` BERES, lalu catat di `references/mesin.md`.
