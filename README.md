# Skill Kartun 3D (dulu Motion Graphic 3D)

Skill Claude Code untuk membuat **semua video kartun** (9:16 atau 16:9, Shorts sampai beberapa menit) dari **satu file HTML** dengan Three.js tertanam, untuk topik dan seri apa pun, **mengikuti storyboard** adegan demi adegan.

Sejak 27 Nov 2026 skill ini menggabungkan dua skill 3D yang isinya sama: `motion-graphic-3d` (berganti nama jadi `kartun-3d`) dan `kartun-stickman-3d` (preset seri, tanpa stickman: tokoh kartun 3D). Skill 2D `motion-graphic` tetap terpisah (gaya berbeda).

- **Render sinematik (bawaan), tokoh tetap kartun**: cahaya HDR + bayangan lembut, relief bahan (bata, kayu, goni, motif kain), latar kabur otomatis menurut jarak ke subjek (close-up kuat, bidikan lebar tipis), bloom lampu dan mata menyala, warna film (sorot hangat, bayang dingin), vignet, butir film halus. Gaya lain tetap ada: `kartun` (RicksClips polos), `clay`, `mainan`, `lowpoly`.
- Adegan 2D pendek (kartu judul, grafik, ajakan) boleh disisipkan di antara adegan 3D.
- **Bidikan kamera otomatis ala film**: `{ bidik: 'darmo', jenis: 'dekat' }`, `{ dua: ['a','b'] }`, `{ atasBahu: ['a','b'] }`, `{ benda: 'timbangan' }`; kamera menghindari benda/tokoh penghalang, mulut yang tertutup tangan, tangan tokoh lain yang menyusup, dan tetap di dalam ruang serta di atas lantai. Sejak 27 Nov 2026: dibingkai dari garis mata (close-up 9:16 mata ±40 %), garis 180° otomatis, komposisi atas-bahu sepertiga, ruang pandang, push `tiba` yang mendarat di kata kunci; kamus teknik pengambilan per fungsi cerita di `references/teknik-kamera.md`.
- **Tokoh 3D ber-rig beragam**: tubuh pria/wanita/gemuk/kurus/tua/anak, motif baju (kotak, garis, batik, bunga, polkadot, goni), singlet/kebaya/jarik/jubah, 60+ pose (termasuk pose bercerita), 11 ekspresi, mulut bicara ikut kata, menunjuk/meraih tepat (IK), akting otomatis, anti-tembus. Sejak 27 Nov 2026: **rig lentur** (lengan, kaki, badan ber-skin: siku/lutut/punggung melengkung tanpa bola sendi), 6 bentuk tangan, gerak hidup (antisipasi → aksi → lewat sasaran → mengendap, sendi bertumpuk, `poseTiba`, `reaksi` tertunda, kontrapposto, kedip acak, rambut berayun).
- **Dunia**: ruangan tertutup 4 dinding + plafon (latar tidak pernah kosong), kota, jalan, warung, rumah, studio, nasi berbutir, karung, timbangan, pintu (kayu/rolling/besi), lampu gantung, rak, kendaraan, HP/TV/laptop berlayar grafik 2D, papan bertulisan, grafik 3D, partikel. Warna berganti mengikuti keadaan adegan (8 suasana).
- **Suara**: narasi Edge TTS gratis dengan waktu kata persis (`scripts/suara_edge.py`), ElevenLabs, atau rekaman sendiri; **musik latar per babak dari Epidemic Sound** (`scripts/musik_epidemic.py`: cari, potong resmi sepanjang babak, rakit dengan crossfade, cek kejelasan dialog); musik turun otomatis saat dialog.
- **Seri**: folder seri (Horor Bersambung, Film Kebiasaan Buruk, Fabel Garis, Metafora Mindset, Day 1 Jadi Presiden, Orang Dalam, Dari Nol, Bikin Sendiri), ajakan follow/like/komen wajib di akhir, caption satu kata (pilihan).
- **Cek otomatis**: clipping, wajah/mulut tokoh yang bicara, latar kosong, teks menutupi wajah, ajakan di akhir, teknik pengambilan (garis mata, bidikan pendek, kamera diam, garis 180°, reaksi serentak, tangan keluar bingkai); bingkai yang sama identik di urutan seek mana pun; `jalankan.py lembar` membuat lembar kontak per detik untuk diperiksa mata sebelum ekspor.
- **Ekspor MP4 di browser** (WebCodecs H.264 + AAC, 10/14 Mbps; `--batas-mb 46` bila perlu ≤ 50 MB). File HTML jalan offline.

## Isi repo
| Folder/berkas | Isi |
|---|---|
| `kartun-3d/SKILL.md` | alur 5 tahap dua klik (brief → storyboard + build + cek → suara → render → unggah), mode, seri |
| `kartun-3d/assets/` | `templat.html` (mesin 2D, pemutar, suara, cek, ekspor), `three.min.js` (Three.js r147, MIT), `mesin3d/01-inti.js … 08-sinema.js` |
| `kartun-3d/references/` | `mesin.md` (API dunia 3D + sinematik), `teknik-kamera.md` (kamus teknik pengambilan + gerak tokoh), `mesin-2d.md`, `gaya.md`, `palet.md`, `dunia-topik.md`, `storyboard.md`, `hook.md`, `penyampaian.md`, `kemasan.md`, `kemasan-seri.md` |
| `kartun-3d/contoh/` | `cerita-timbangan-daging` (cerita berdialog), `kartun-bakso-motor-3d`, `infografis-uang-3d`; semuanya lolos `cek` |
| `kartun-3d/scripts/` | `jalankan.py` (`rakit`, `cek`, `kontak`, `lembar`, `bingkai`, `thumbnail`, `ekspor`), `suara_edge.py`, `musik_epidemic.py` |
| `kartun-3d/topik/` | aturan per kategori topik (sumber data, nada, hook, tag) |
| `pasang.ps1` | memasang `kartun-3d` ke `%USERPROFILE%\.claude\skills\` (instalasi lama `motion-graphic-3d` dipindah ke cadangan) |

Video, audio, dan hasil render **tidak disimpan di repo ini**.

## Pasang di PC
```powershell
git clone https://github.com/Rizkymema/Skill-Motion-Graphic-3D-Rizky.git
cd Skill-Motion-Graphic-3D-Rizky
powershell -ExecutionPolicy Bypass -File .\pasang.ps1
```
`pasang.ps1` menyalin skill ke `%USERPROFILE%\.claude\skills\` dan mencadangkan versi lama ke `%USERPROFILE%\.claude\skills-cadangan\`. Panggil di Claude Code: `/kartun-3d`.

Kebutuhan: Python 3.12 + Playwright (memakai Chrome/Edge terpasang), Pillow, numpy; `edge-tts` + `imageio-ffmpeg` untuk narasi Edge TTS; browser dengan WebGL2 (akselerasi grafis aktif). Narasi ElevenLabs, musik Epidemic (kunci API milik sendiri), dan unggah YouTube memakai repo Video AI (`_elevenlabs`, `_youtube`, `_thumbnail`, skill `unggah-youtube`).

## Coba cepat
```powershell
python kartun-3d\scripts\jalankan.py rakit kartun-3d\contoh\kartun-bakso-motor-3d.konfig.js film.html
python kartun-3d\scripts\jalankan.py cek film.html
python kartun-3d\scripts\jalankan.py lembar film.html lembar
```
Buka `film.html` di Chrome/Edge: ▶ untuk memutar, tombol **Ekspor MP4** untuk menyimpan video.

## Ubah skill
Repo ini salinan rapi dari skill yang dikembangkan di project Video AI (`.claude/skills/kartun-3d` di repo Automation-youtube). Di PC pemilik: ubah di sana, jalankan `_skills/sinkron_repo_skill.ps1`, lalu commit + push di repo ini. Di PC lain: `git pull` lalu `pasang.ps1`. Fitur mesin 3D baru masuk `kartun-3d/assets/mesin3d/`; setelah itu rakit semua contoh, pastikan `cek` BERES dan `lembar` dilihat, lalu catat di `references/mesin.md`.
