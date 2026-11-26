/* Contoh motion-graphic-3d bergaya INFOGRAFIS/EXPLAINER (topik keuangan), 9:16, ±21 dtk, tanpa narasi (subtitle teks + musik sintesis).
   Pamerkan: studio motion graphic (lantai + dinding melengkung) berganti keadaan per babak (kobalt → oranye → kobalt → hijau → senja),
   HP 3D yang layarnya berisi motion graphic 2D (saldo turun), papan harga di dunia cerita, grafik batang 3D yang tumbuh + angka 3D,
   diagram pai 3D dengan potongan yang keluar, benda buatan sendiri dari bentuk dasar (celengan babi lewat d.grup), tokoh bicara + gestur,
   label 2D yang menempel di benda 3D (g.labelDi), konfeti semburan, ajakan di akhir.
   Hitungan bisa dibuktikan (tanpa sumber luar): 15.000 × 30 = 450.000 per bulan; × 12 = 5.400.000 per tahun.
   PAKET VISUAL: inti = jajan kecil tiap hari jadi besar setahun · keadaan = kobalt (hook) → oranye (kafe) → kobalt (data) → hijau (gaji) → senja (penutup)
   · dunia = studio + meja kafe · benda utama = HP dengan saldo, gelas kopi · tokoh = Dina (pekerja muda) · diagram = batang 3D + pai 3D
   · hook = HP raksasa, saldo turun, koin berjatuhan · suara = pulsa, kaching, pop, ding. */
const KONFIG = {
  judul: 'Uang Bocor Halus 3D',
  rasio: '9:16',
  fps: 30,
  gaya: 'kartun',
  suasana: 'kobalt',
  tokoh: {
    dina: { kulit: '#E9B994', rambut: 'kuncir', warnaRambut: '#2A1810', baju: '#F2B134', kerah: 'kemeja', celana: '#2A3350', sepatu: '#3A2A22', bulu: true, warnaMata: '#3A2416' }
  },
  teks: [
    { mulai: 0.3, akhir: 3.3, teks: 'Saldo kamu bocor pelan-pelan.' },
    { mulai: 3.8, akhir: 7.6, teks: 'Cuma kopi lima belas ribu sehari, katanya.' },
    { mulai: 8.0, akhir: 12.0, teks: 'Sebulan jadi 450 ribu. Setahun 5,4 juta!' },
    { mulai: 12.4, akhir: 16.0, teks: 'Itu bisa jadi dana darurat kamu.' },
    { mulai: 16.4, akhir: 20.4, teks: 'Sisihkan dulu, baru jajan. Coba mulai besok.' }
  ],
  musik: [{ sintesis: 'pulsa', mulai: 0, akhir: 16.4, bpm: 108, vol: .45, fadeKeluar: .4 }, { sintesis: 'ceria', mulai: 16.2, bpm: 108, vol: .45, fadeMasuk: .3 }],
  thumbnail: { t: 9.5, teks: 'UANG\n*BOCOR*' }
};

/* celengan babi dari bentuk dasar (contoh benda khas cerita buatan sendiri) */
function celengan(d, o) {
  return d.grup(o, () => {
    const pink = '#F29BB2';
    d.bola({ posisi: [0, .08, 0], r: .42, warna: pink, skala: [1.15, 1, 1] });
    d.silinder({ posisi: [0, .3, .5], r: .15, tinggi: .12, warna: '#F5B3C5', putar: [90, 0, 0], pusat: true });
    [-1, 1].forEach(s => { d.kerucut({ posisi: [s * .22, .78, .12], r: .1, tinggi: .16, warna: pink }); d.bola({ posisi: [s * .16, .5, .38], r: .045, warna: '#2A1A22', pusat: true });
      [-1, 1].forEach(k => d.silinder({ posisi: [s * .26, 0, k * .18], r: .07, tinggi: .14, warna: '#E4859F' })); });
    d.kotak({ posisi: [0, .84, -.05], ukuran: [.26, .03, .06], r: .01, warna: '#7A3A4E' });
  });
}

const ADEGAN = [
  /* 1. Hook: HP raksasa, saldo turun, koin berjatuhan */
  { id: 'hook', durasi: 3.6, suasana: 'kobalt', luas: 5,
    kamera: [[0, { dari: [0, 1.7, 2.6], ke: [0, 1.5, 0], fov: 44 }], [3.6, { dari: [.5, 1.55, 3.4], ke: [0, 1.45, 0] }, 'outCubic']],
    guncang: t => (t > 2.0 && t < 2.3 ? .6 : 0),
    sfx: [{ t: .05, jenis: 'impact' }, { t: .4, jenis: 'koin' }, { t: 1.0, jenis: 'koin', nada: 1.2 }, { t: 2.0, jenis: 'salah' }],
    dunia(d) {
      d.studio();
      d.hp({ posisi: [0, .35, 0], tinggi: 2.3, putar: [0, -8, 0], ayun: { tinggi: .04, laju: 1.6 }, muncul: 0, masuk: 'naik',
        layar(g, w, h, t) {
          g.latar('gradien', { atas: '#1E3A8A', bawah: '#0F1E52' });
          g.teks('SALDO', w / 2, h * .2, { ukuran: 40, warna: '#C9D6FF', cek: false });
          const v = lerp(1000000, 12000, E.inOutCubic(jepit((t - .3) / 1.9)));
          g.teks(rupiah(v), w / 2, h * .33, { ukuran: 66, warna: t > 2 ? '#FF6B5E' : '#FFFFFF', cek: false });
          g.grafikGaris(w / 2, h * .62, w * .8, h * .25, [9, 8.6, 8.8, 7, 6.2, 4, 2.5, .4], t, { mulai: .3, lama: 1.9, warna: '#FF6B5E' });
        } });
      d.partikel('koin', { pusat: [0, 0, .4], area: [3.2, 4.2, 1.2], n: 40, mulai: .3 });
    },
    gambar(g, t) { g.teksMasuk('UANG *BOCOR* HALUS', 540, 260, t, { mulai: .25, ukuran: 92, gaya: 'pop', aksen: P.kedua, garis: P.gelap, tebalGaris: 12, maks: 940 }); } },

  /* 2. Kafe: Dina pesan kopi, papan harga di dinding */
  { id: 'kafe', durasi: 4.2, masuk: 'whip', suasana: 'oranye', luas: 5,
    kamera: [[0, { dari: [-1.3, 1.5, 3.4], ke: [0, 1.15, 0], fov: 40 }], [4.2, { dari: [.4, 1.4, 2.8], ke: [0, 1.2, 0] }, 'inOutSine']],
    sfx: [{ t: .1, jenis: 'whoosh' }, { t: 1.2, jenis: 'kaching' }, { t: 2.6, jenis: 'pop' }],
    dunia(d) {
      d.studio();
      d.papan('KOPI\n15RB', { posisi: [-.9, 1.8, -1.8], lebar: 1.3, tinggi: 1.0, warna: P.gelap, warnaTeks: P.aksen, lampu: true });
      d.meja({ posisi: [.05, 0, .2], lebar: 1.1, dalam: .6, warna: '#8A5A3C' });
      d.gelas({ posisi: [.25, .75, .3], muncul: 1.2 }); d.uap({ posisi: [.25, .95, .3], ukuran: .1, tinggi: .35, n: 4 });
      d.tokoh('dina', { posisi: [-.25, 0, -.35], pose: [[0, 'pegangHp'], [1.4, 'santai'], [2.8, 'angkatBahu']], ekspresi: [[0, 'senang'], [2.8, 'licik']], pegang: [[0, 'hp'], [1.4, null]], bicara: [1.4, 4.0], hadap: 10 });
    },
    gambar(g, t) { if (t > 1.2) g.labelDi([.25, 1.3, .3], '-Rp15.000', { warna: P.kedua, dy: -30 }); } },

  /* 3. Data: grafik batang 3D tumbuh, Dina menjelaskan */
  { id: 'data', durasi: 4.4, masuk: 'zoom', suasana: 'kobalt', luas: 6,
    // 9:16: lebar terlihat ±0,45 × jarak kamera → susun benda rapat dan bertingkat ke dalam, bukan berjajar lebar
    kamera: [[0, { dari: [-.4, 1.7, 6.4], ke: [0, 1.0, 0], fov: 42 }], [4.4, { dari: [.4, 1.55, 5.8], ke: [.1, 1.05, 0] }, 'inOutSine']],
    sfx: [{ t: .2, jenis: 'whoosh' }, { t: .6, jenis: 'pop' }, { t: 1.4, jenis: 'pop' }, { t: 2.4, jenis: 'dum' }, { t: 2.5, jenis: 'kaching' }],
    dunia(d) {
      d.studio();
      d.batang([{ nilai: 15, label: 'HARI', warna: P.utama }, { nilai: 450, label: 'BULAN', warna: P.aksen }, { nilai: 5400, label: 'TAHUN', warna: P.kedua }],
        { posisi: [.3, 0, -.4], tinggi: 2.5, lebar: .5, jarak: .72, mulai: .4, jeda: .6, lama: 1.2, akhiran: 'rb', ukuranAngka: .22 });
      d.tokoh('dina', { posisi: [-.72, 0, 1.3], pose: [[0, 'presentasi'], [2.4, 'tunjukAtas'], [3.4, 'kaget']], ekspresi: [[0, 'senang'], [2.4, 'kaget']], bicara: [0, 2.4], hadap: 25 });
    } },

  /* 4. Gaji: diagram pai 3D, potongan jajan keluar */
  { id: 'gaji', durasi: 4.0, masuk: 'iris', suasana: 'hijau', luas: 5,
    kamera: { orbit: true, ke: [0, .25, 0], jarak: 4.6, tinggi: 2.7, sudut: [-14, 14], fov: 40 },
    sfx: [{ t: .1, jenis: 'pop' }, { t: 1.2, jenis: 'swish' }, { t: 2.2, jenis: 'ding' }],
    dunia(d) {
      d.studio();
      // potongan pertama mulai di arah +z (menghadap kamera) → potongan JAJAN ditaruh pertama supaya keluar ke arah kamera
      d.pai([{ nilai: 15, warna: P.kedua }, { nilai: 50, warna: P.utama }, { nilai: 35, warna: P.aksen }], { posisi: [0, 0, 0], r: 1.0, tebal: .35, mulai: .2, lepas: 0 });
      d.ikon('tetes', { posisi: [-.7, 1.3, .2], ukuran: .4, warna: '#4AA8F0', muncul: 1.3, ayun: true });
    },
    gambar(g, t) { if (t > 1.3) g.labelDi([.35, .4, .75], 'JAJAN 15%', { warna: P.kedua, dy: -150 }); } },

  /* 5. Penutup: celengan + Dina hore + konfeti, ajakan */
  { id: 'penutup', durasi: 4.6, masuk: 'kilat', suasana: 'senja', luas: 5,
    kamera: [[0, { dari: [0, 1.4, 4.2], ke: [0, 1.0, 0], fov: 42 }], [4.6, { dari: [.6, 1.3, 3.5], ke: [0, 1.05, 0] }, 'inOutSine']],
    sfx: [{ t: .05, jenis: 'impact' }, { t: .5, jenis: 'koin' }, { t: 1.2, jenis: 'ding' }, { t: 2.4, jenis: 'pop' }],
    dunia(d) {
      d.studio();
      celengan(d, { posisi: [.75, 0, .1], putar: -25, muncul: .2, nama: 'celengan' });
      d.koin({ posisi: [.75, 2.4, .1], r: .16, putar: [0, 0, 0], anim: [[.3, { posisi: [.75, 2.4, .1] }], [1.0, { posisi: [.75, .82, .1] }, 'inCubic']], hilang: 1.05 });
      d.tokoh('dina', { posisi: [-.6, 0, .2], pose: [[0, 'tunjuk'], [1.2, 'hore']], ekspresi: [[0, 'senang'], [1.2, 'gembira']], bicara: [0, 1.2], hadap: 20, efek: [[1.2, 'bintang', 2.2]] });
      d.partikel('konfeti', { dari: [0, 1.6, 0], mulai: 1.2, n: 150, kuat: 4.5 });
    },
    gambar(g, t) {
      g.teksMasuk('SISIHKAN *15RB/HARI*', 540, 280, t, { mulai: .3, ukuran: 80, gaya: 'pop', aksen: P.aksen, garis: P.gelap, tebalGaris: 11, maks: 940 });
      if (t > 2.4) g.label('Follow untuk tips uang lainnya', CX, H * .62, { warna: P.kedua, ukuran: 40 });
    } }
];
