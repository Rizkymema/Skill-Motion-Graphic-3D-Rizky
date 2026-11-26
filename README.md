# Skill Motion Graphic 3D

Skill Claude Code untuk membuat video **motion graphic 3D** (9:16 atau 16:9, Shorts sampai beberapa menit) dari **satu file HTML** dengan Three.js tertanam, untuk topik apa pun, **mengikuti storyboard** adegan demi adegan. Versi 3D dari skill `motion-graphic`. Versi 2D tetap terpisah dan tidak diubah.

- **Dunia 3D sungguhan**: cahaya + bayangan, kabut jarak, kamera 3D (dolly, orbit, ikut benda), garis tepi kartun. Warna berganti mengikuti keadaan tiap adegan (8 suasana: siang, malam, kobalt, oranye, hijau, sorot, aula, senja).
- **Tokoh 3D ber-rig**: 40+ pose, 11 ekspresi, mulut bicara ikut kata, jalan/lari, naik motor/mobil, duduk makan, memegang properti, efek emosi, akting otomatis supaya tidak kaku.
- **Benda dan tempat**: studio melengkung, langit, ruangan, kota, jalan, warung, rumah, pohon, motor, mobil, perabot, HP/TV/laptop yang layarnya berisi grafik 2D bergerak, papan bertulisan, grafik batang/pai 3D, ikon 3D, koin, uang, partikel.
- **Lapisan 2D + suara**: teks atas, label yang menempel di benda 3D, subtitle kecil gaya film, musik dan SFX sintesis atau berkas, narasi ElevenLabs/rekaman sendiri.
- **Tanpa clipping**: kaki selalu menapak, tangan/lengan tidak pernah masuk ke badan, kepala, atau benda (IK otomatis tiap bingkai); `cek` menolak tokoh yang menembus benda, benda saling tembus, dan kamera di dalam benda.
- **Ekspor MP4 di browser** (WebCodecs H.264 + AAC), cek kualitas otomatis, lembar kontak, thumbnail. File HTML jalan offline.
- Gaya bahan: `kartun` (bawaan), `clay`, `mainan`, `lowpoly`.

## Isi repo
| Folder/berkas | Isi |
|---|---|
| `motion-graphic-3d/SKILL.md` | alur 5 tahap dua klik (brief → storyboard + build + cek → suara → render → unggah) |
| `motion-graphic-3d/assets/` | `templat.html` (mesin 2D, pemutar, suara, ekspor), `three.min.js` (Three.js r147, lisensi MIT), `mesin3d/*.js` (mesin 3D) |
| `motion-graphic-3d/references/` | `mesin.md` (API dunia 3D), `mesin-2d.md` (lapisan 2D, suara, transisi), `gaya.md`, `palet.md`, `dunia-topik.md`, `storyboard.md`, `kemasan.md` |
| `motion-graphic-3d/contoh/` | `kartun-bakso-motor-3d.konfig.js` (cerita), `infografis-uang-3d.konfig.js` (explainer), keduanya lolos `cek` |
| `motion-graphic-3d/scripts/jalankan.py` | `rakit`, `cek`, `kontak`, `bingkai`, `thumbnail`, `ekspor` |
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
Repo ini salinan rapi dari skill yang dikembangkan di project Video AI (`.claude/skills/motion-graphic-3d` di repo Automation-youtube). Di PC pemilik: ubah di sana, jalankan `_skills/sinkron_repo_skill.ps1`, lalu commit + push di repo ini. Di PC lain: `git pull` lalu `pasang.ps1`. Jangan menyunting salinan di `~/.claude/skills` langsung. Fitur mesin 3D baru masuk `motion-graphic-3d/assets/mesin3d/`. Setelah itu rakit kedua contoh, pastikan `cek` BERES, lalu catat di `references/mesin.md`.
