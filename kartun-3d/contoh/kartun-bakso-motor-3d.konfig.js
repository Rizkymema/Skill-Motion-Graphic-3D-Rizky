/* Contoh ACUAN kartun-3d (gaya sinematik): storyboard yang sama dengan contoh motion-graphic (kartun-bakso-motor), dibangun ulang dalam dunia 3D.
   Gaya kartun (plastik lembut + garis tepi bernuansa, acuan warna RicksClips3000), 9:16, ±22 dtk, tanpa narasi.
   Pamerkan: warna berganti MENGIKUTI KEADAAN tiap adegan (oranye → sorot → oranye → hijau → malam), tokoh 3D HANYA bila storyboard menyebutnya
   (adegan 3 tanpa tokoh) dan melakukan aksi cerita (naik motor, duduk makan, mendorong motor), kamera 3D selalu bergerak (ikut motor, dolly,
   orbit), bayangan + lampu asli, benda bertulisan di dunia cerita (papan BAKSO), subtitle kecil ala film, teks atas 2D hanya di adegan 5.
   PAKET VISUAL: dunia = jalan kota sore + warung bakso · benda utama = semangkuk bakso beruap · tokoh = Pak Joko (kemeja biru, helm kuning)
   · diagram = – · kamera = ikut motor, dolly masuk, orbit pelan · musik = ceria lalu pad sendu · SFX = mesin motor, klik, pop, salah
   · keadaan = oranye → sorot → oranye → hijau → malam.
   STORYBOARD (ditulis pengguna → satu baris = satu adegan):
   1. Sore, Pak Joko naik motor pulang kerja (jalan oranye, kota)            2. Warung bakso, ia makan sambil duduk (lampu sorot hangat)
   3. Close-up semangkuk bakso beruap (tanpa tokoh)                          4. Close-up wajahnya puas (dinding ubin hijau)
   5. Malam, bensin motor habis, ia mendorongnya (teks penting di atas) */
const KONFIG = {
  judul: 'Pak Joko dan Bakso Terakhir 3D',
  rasio: '9:16',
  fps: 30,
  gaya: 'sinematik',
  suasana: 'siang',
  tokoh: {
    joko: { kulit: '#E8B48C', rambut: 'pendek', warnaRambut: '#24170F', baju: '#2F6FB0', kerah: 'kemeja', celana: '#262C46', sepatu: '#3A2418', sol: '#D9D4CC', warnaMata: '#4A3020' }
  },
  subtitle: { tampil: true },
  teks: [
    { mulai: 0.4, akhir: 4.0, teks: 'Sore itu, Pak Joko pulang kerja naik motor.' },
    { mulai: 4.8, akhir: 8.9, teks: 'Perutnya keroncongan, jadi mampir ke warung bakso.' },
    { mulai: 9.4, akhir: 12.5, teks: 'Kuahnya panas, baksonya besar-besar.' },
    { mulai: 13.0, akhir: 16.2, teks: 'Enak sekali, sampai lupa waktu.' },
    { mulai: 16.9, akhir: 21.2, teks: 'Pas mau pulang, bensin motornya habis.' }
  ],
  musik: [
    { sintesis: 'ceria', mulai: 0, akhir: 16.5, vol: 0.4, bpm: 104, fadeKeluar: 0.5 },
    { sintesis: 'pad', mulai: 16.3, vol: 0.55, fadeMasuk: 0.4 }
  ],
  thumbnail: { t: 2.0, teks: 'BENSIN\n*HABIS*' }
};

const ADEGAN = [
  /* 1. Jalan sore oranye: motor melaju ke kanan, kamera ikut motor, kota + bukit di belakang */
  { id: 'jalan', durasi: 4.4, suasana: 'oranye', ikuti: 'motor', luas: 12,
    // ikuti: dari/ke ditulis RELATIF ke motor (kamera ikut melaju)
    kamera: [[0, { dari: [-3.4, 1.6, 5.6], ke: [.3, 1.05, 0], fov: 42 }], [4.4, { dari: [-.6, 1.35, 4.8], ke: [.5, 1.1, 0] }, 'inOutSine']],
    sfx: [{ t: 0.05, jenis: 'dengung', lama: 4, vol: .5 }, { t: 0.3, jenis: 'whoosh' }],
    dunia(d) {
      d.langit({ atas: '#B83E2B', tengah: '#E8743F', bawah: '#F7B864' });
      d.tanah({ jenis: 'pasir', warna: '#D98A4E' });
      d.jalan({ posisi: [6, 0, -1.6], panjang: 120 });
      d.bukit({ posisi: [-10, -2, -48], lebar: 60, tinggi: 10 }); d.bukit({ posisi: [30, -2, -55], lebar: 70, tinggi: 13 });
      d.kota({ x: [-14, 34], z: -16, n: 14, tinggi: [5, 14], warna: '#9C4A3A', benih: 5 });
      for (let i = 0; i < 6; i++) d.pohon({ posisi: [-6 + i * 6.5, 0, -5.2 - acak(i) * 1.5], tinggi: 2.6 + acak(i + 3) * 1.2, warna: '#7E8F3A' });
      for (let i = 0; i < 4; i++) d.lampuJalan({ posisi: [-3 + i * 8, 0, -3.6] });
      const m = d.motor({ nama: 'motor', warna: P.kedua, putar: 90, anim: [[0, { posisi: [-2, 0, -1.6] }], [4.4, { posisi: [6.5, 0, -1.6] }, 'linear']] });
      d.tokoh('joko', { naik: m, pose: 'naikMotor', ekspresi: [[0, 'senang'], [2.6, 'gembira']], def: { topi: 'helm', warnaTopi: '#F2B134' } });
    },
    gambar(g, t, d, T) {   // garis kecepatan 2D tipis di atas dunia 3D
      for (let i = 0; i < 6; i++) { const yy = H * .3 + acak(i + 3) * H * .32, xx = ((((i * 230 - T * 1300) % 1500) + 1500) % 1500) - 200; g.garis(xx, yy, xx + 100 + acak(i) * 90, yy, { tebal: 4, warna: alfa(P.terang, .45) }); }
    } },

  /* 2. Warung bakso: lampu sorot hangat, papan BAKSO di dinding, tokoh duduk makan, kamera dolly masuk */
  { id: 'warung', durasi: 4.8, masuk: 'whip', suasana: 'sorot', luas: 6,
    kamera: [[0, { dari: [-1.2, 1.45, 3.6], ke: [0, 1.0, 0], fov: 40 }], [4.8, { dari: [.5, 1.3, 2.6], ke: [0, 1.05, 0] }, 'inOutSine']],
    sfx: [{ t: 0.2, jenis: 'whoosh' }, { t: 1.6, jenis: 'klik' }, { t: 3.1, jenis: 'pop' }],
    dunia(d) {
      d.ruang({ lebar: 7, dalam: 5, dinding: '#3A2E22', motif: 'garis', lantai: 'ubin', warnaLantai: '#7A5A3C', jendela: false, foto: false, lampu: false });
      d.papan('BAKSO\nPAK DI', { posisi: [-.2, 1.75, -2.35], lebar: 1.9, tinggi: 1.0, warna: '#B83E2B', warnaTeks: P.terang, lampu: true });
      d.lampu({ posisi: [.9, 2.3, -.6], warna: '#FFD68A', kuat: 1.6, jarak: 6, pendar: 1.4 });
      const k = d.kursi({ posisi: [0, 0, -.55], warna: '#8A5A3C' });
      d.tokoh('joko', { naik: k, pose: [[0, 'duduk'], [1.2, 'dudukMakan']], ekspresi: [[0, 'senang'], [1.4, 'gembira']], pegang: [[0, null], [1.2, 'sendok']] });
      d.meja({ posisi: [0, 0, .05], lebar: 1.3, dalam: .7, warna: '#8A5A3C' });
      d.mangkuk({ posisi: [.12, .75, .15], r: .17 });
      d.uap({ posisi: [.12, .92, .15], ukuran: .16, tinggi: .5, n: 5 });
      d.gelas({ posisi: [-.42, .75, .2] });
      d.partikel('debu', { pusat: [0, .2, 0], area: [4, 2.6, 3], n: 50 });
    } },

  /* 3. Close-up bakso beruap, TANPA tokoh: kamera orbit pelan di atas mangkuk */
  { id: 'mangkuk', durasi: 3.6, masuk: 'zoom', suasana: 'oranye', luas: 3,
    kamera: { orbit: true, ke: [0, .1, 0], jarak: 1.25, tinggi: .75, sudut: [-25, 20], fov: 38 },
    sfx: [{ t: 0.2, jenis: 'pop' }, { t: 1.0, jenis: 'napas', lama: 1.2, vol: .6 }, { t: 2.2, jenis: 'ding' }],
    dunia(d) {
      d.studio({ warna: '#C8673A' });
      d.kotak({ posisi: [0, -.6, 0], ukuran: [2.4, .6, 1.6], r: .05, warna: '#8A5A3C' });
      d.mangkuk({ posisi: [0, 0, 0], r: .3 });
      d.uap({ posisi: [0, .24, 0], ukuran: .22, tinggi: .7, n: 7 });
      d.lampu({ posisi: [.6, 1.1, .7], warna: '#FFD68A', kuat: 1.2, jarak: 4, bola: false, pendar: false });
      d.ikon('bintang', { posisi: [-.45, .5, -.1], ukuran: .16, muncul: .6, putarTerus: [0, 90, 0] });
      d.ikon('bintang', { posisi: [.48, .58, -.05], ukuran: .12, muncul: .9, putarTerus: [0, -90, 0] });
    } },

  /* 4. Close-up wajah puas di dinding ubin hijau */
  { id: 'puas', durasi: 3.8, masuk: 'kilat', suasana: 'hijau', luas: 3,
    kamera: [[0, { dari: [.25, 1.62, 1.35], ke: [0, 1.55, 0], fov: 38 }], [3.8, { dari: [-.15, 1.6, 1.05], ke: [0, 1.56, 0] }, 'inOutSine']],
    sfx: [{ t: 0.05, jenis: 'impact' }, { t: 0.7, jenis: 'pop' }],
    dunia(d) {
      const tex = teksturPola('ubin', P.latar); tex.repeat.set(4, 3);
      d.bidang({ posisi: [0, 0, -.9], lebar: 6, tinggi: 4.5, peta: tex, warna: '#ffffff' });
      d.tokoh('joko', { posisi: [0, 0, 0], pose: [[0, 'berdiri'], [1.6, 'hore']], ekspresi: [[0, 'senang'], [.5, 'gembira']], lirik: [.5, -.2], efek: [[1.6, 'hati', 2]] });
      d.partikel('bintang', { pusat: [0, 1.2, -.3], area: [2, 1.2, .6], n: 30 });
    } },

  /* 5. Malam: bensin habis, mendorong motor di bawah lampu jalan; teks atas hanya di sini karena penting */
  { id: 'habis', durasi: 5.0, masuk: 'gelap', suasana: 'malam', luas: 10,
    kamera: [[0, { dari: [-1.0, 1.4, 5.2], ke: [.4, 1.0, -1.6], fov: 42 }], [5.0, { dari: [1.6, 1.3, 4.8], ke: [1.2, 1.0, -1.6] }, 'inOutSine']],
    sfx: [{ t: 0.3, jenis: 'dengung', lama: 2, vol: .3 }, { t: 1.1, jenis: 'salah' }, { t: 3.2, jenis: 'napas', vol: .6 }],
    dunia(d) {
      d.langit({ bintang: 220 });
      d.tanah({ jenis: 'aspal', warna: '#2B3060' });
      d.jalan({ posisi: [0, 0, -1.6] });
      d.kota({ x: [-16, 16], z: -14, n: 11, tinggi: [4, 12], benih: 9 });
      d.lampuJalan({ posisi: [-1.8, 0, -3.4], bayang: true });
      const e = t => maju(t, .4, 4.2, 'inOutSine');
      d.motor({ nama: 'motor', warna: P.kedua, putar: 90, anim: [[0, { posisi: [.2, 0, -1.6] }], [.4, { posisi: [.2, 0, -1.6] }], [4.6, { posisi: [2.6, 0, -1.6] }, 'inOutSine']] });
      d.tokoh('joko', { pose: 'dorong', jalan: { dari: [-.95, -1.6], ke: [1.45, -1.6], mulai: .4, lama: 4.2 }, ekspresi: [[0, 'kaget'], [2.2, 'sedih']], efek: [[2.4, 'keringat', 2.6]] });
      d.ikon('peringatan', { posisi: [.2, 1.9, -1.6], ukuran: .5, warna: P.kedua, muncul: 1.0, denyut: { laju: 1.6, kuat: .08 }, anim: [[0, { posisi: [.2, 1.9, -1.6] }], [.4, { posisi: [.2, 1.9, -1.6] }], [4.6, { posisi: [2.6, 1.9, -1.6] }, 'inOutSine']] });
    },
    gambar(g, t) { g.teksMasuk('BENSIN *HABIS*', 540, 300, t, { mulai: 1.0, ukuran: 88, gaya: 'pop', aksen: P.kedua, garis: P.gelap, tebalGaris: 12, maks: 900 });
      if (t > 2.4) g.label('Follow + komen: pernah begini?', 540, 470, { ukuran: 42, warna: P.terang, warnaTeks: P.gelap, ikon: 'hati', skala: maju(t, 2.4, .4, 'outBack') }); } }   // ajakan wajib (kartun-3d)
];
