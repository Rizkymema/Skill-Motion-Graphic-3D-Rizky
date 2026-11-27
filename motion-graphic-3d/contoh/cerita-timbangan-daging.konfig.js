/* =====================================================================
   TIMBANGAN DAGING v2 — dibuat ulang dengan motion-graphic-3d versi baru (bidikan otomatis, tokoh v2, pose bercerita, katalog benda,
   cahaya otomatis, anti-tembus). Cerita, waktu, dan suara (ElevenLabs per tokoh + efek + musik) sama dengan versi pengguna.
   PAKET VISUAL: dunia = gudang beras (dinding bata, karung goni menjulang, bohlam gantung, rolling door) · benda utama = timbangan dacin
   berkarat + timbangan digital · tokoh = Pak Darmo (gemuk, singlet, kumis), Ujang (kurus, kemeja kotak, topi), Mbok Sari (nenek, kebaya,
   jarik batik, konde) · makhluk = Si Penimbang (jubah goni, kepala palang dacin, mata kuning) · keadaan = oranye → sorot → senja → malam
   → hijau busuk → siang · kamera = bidikan otomatis (dua tokoh, atas bahu, close-up, sisipan benda), low angle ke makhluk.
   ===================================================================== */
const KONFIG = {
  judul: 'Timbangan Daging', rasio: '9:16', fps: 30, gaya: 'kartun', suasana: 'sorot',
  subtitle: { tampil: true }, durasi: 'L14.akhir+5', volumeSfx: .34, sfxTransisi: false,
  tokoh: {
    darmo: { tubuh: 'gemuk', kulit: '#C68A62', rambut: 'cepak', warnaRambut: '#1E1A16', baju: '#EDE8DC', kerah: 'singlet', celana: '#5A4E40', sepatu: '#3A2A1E', kumis: true },
    ujang: { tubuh: 'kurus', kulit: '#D9A07A', rambut: 'pendek', warnaRambut: '#16120E', baju: '#5E7E9A', motif: 'kotak', warnaMotif: '#2A3A5A', celana: '#3A3A44', topi: 'pet', warnaTopi: '#B83E2B' },
    mbok: { tubuh: 'tua', wanita: true, kulit: '#C89070', rambut: 'konde', baju: '#8A5A6A', kerah: 'kebaya', motif: 'bunga', warnaMotif: '#E8C8B0', rok: '#5A3A28', motifRok: 'batik', warnaMotifRok: '#D8B070', rokPanjang: true },
    penimbang: { tubuh: 'kurus', tinggi: 1.32, kulit: '#2A221A', rambut: 'botak', baju: '#5E4E36', motif: 'goni', jubah: '#5E4E36', mataMenyala: '#FFC020', wajah: false, kepalaSkala: .9 }
  },
  thumbnail: { t: 'L11+1' }
};

/* ---------------------------------------------------------------- suara (sama dengan versi pengguna) */
const bk = (nama, t, vol, o = {}) => Object.assign({ t, jenis: 'berkas', berkas: nama, vol }, o);
const ulang = (nama, t, lama, vol, o = {}) => bk(nama, t, vol, Object.assign({ lama, ulang: true }, o));
/** teks atas: hanya selama kalimatnya diucapkan (keluar otomatis setelah `lama` dtk, bawaan 3,4) — tidak tertinggal saat tokoh lain bicara */
const TS = (g, t, s, ref, y = 300, o = {}) => { const m = typeof ref === 'string' ? g.w(ref) : ref; return g.teksMasuk(s, 540, y, t, Object.assign({ mulai: m, keluar: m + (o.lama ?? 3.4), ukuran: 72, gaya: 'blur', aksen: P.aksen, garis: P.gelap, tebalGaris: 12, maks: W * .84 }, o)); };
const BUSUK = { latar: '#2A3A20', utama: '#5A7A3A', aksen: '#E8E8C8', kedua: '#C8D040', gelap: '#0E140A', terang: '#F2F4E0' };
const MALAM = { latar: '#14141E', utama: '#3A3A52', aksen: '#FFC020', gelap: '#06060A' };

/* ---------------------------------------------------------------- dunia */
function gudang(d, o = {}) {   // gudang: dinding bata, lantai beton, tumpukan karung goni, rak, bohlam gantung, rolling door di belakang
  d.ruang({ lebar: 9, dalam: 8, tinggi: 4.2, dinding: o.dinding || '#7A4A38', motif: 'bata', lantai: 'beton', warnaLantai: o.lantai || '#76705F', jendela: false, foto: false, lampu: false });
  for (let i = 0; i < 10; i++) d.karung({ posisi: [-3.7 + (i % 2) * .66, Math.floor(i / 2) * .76, -3.4 + (acak(i) - .5) * .1], putar: (acak(i * 7) - .5) * 14, tulisan: i % 4 === 0 ? 'BERAS\nSUPER' : false });
  for (let i = 0; i < 8; i++) d.karung({ posisi: [2.5 + (i % 2) * .66, Math.floor(i / 2) * .76, -3.5], putar: (acak(i * 3 + 1) - .5) * 14, tulisan: i % 3 === 0 ? 'BERAS\nSUPER' : false, warna: '#C8AC7E' });
  d.rakBarang({ posisi: [3.9, 0, -1.2], putar: -90, isi: 'kardus' });
  d.pintu({ jenis: 'rolling', nama: 'rolling', posisi: [-.6, 0, -3.8], lebar: 2.2, tinggi: 2.6, buka: o.buka ?? 0 });
  if (o.lampu !== false) d.lampuGantung({ nama: 'bohlam', posisi: [0, 4.2, -.8], kabel: .9, kuat: o.kuat ?? 1.9, jarak: 9, ayun: o.ayun ?? { kuat: .05 }, kedip: o.kedip });
}
function piringNasi(d, o) { return d.nasi(Object.assign({ ukuran: .25 }, o)); }   // benda bawaan: gundukan nasi berbutir di piring
function berasKusam(d, o) { return d.grup(o, () => { d.kerucut({ posisi: [0, 0, 0], r: 1.0, tinggi: .5, warna: '#B8A880' }); for (let i = 0; i < 30; i++) d.bola({ posisi: [(acak(i) - .5) * 1.3, .04 + acak(i + 3) * .18, (acak(i + 7) - .5) * 1.1], r: .025, warna: '#2A1E14', padat: false, tepi: false }); }); }
function belatungGrup(d, o, n) { return d.grup(o, () => { for (let i = 0; i < n; i++) d.kapsul({ nama: 'blt' + i, posisi: [(acak(i) - .5) * 1.4, acak(i + 3) * .2, (acak(i + 6) - .5) * 1.2], r: .035, tinggi: .09, putar: [90, acak(i) * 360, 0], warna: '#F2EEDC', padat: false }); }); }
/** kepala Si Penimbang: palang dacin + rantai + bandul bermata kuning, menempel di kepala tokoh (ikut gerak kepala) */
function kepalaDacin(d, tk) {
  const R = tk.R;
  d.grup({ nama: 'kepalaPalang', posisi: [0, R * 1.05, 0] }, () => {
    d.silinder({ posisi: [0, 0, 0], r: .04, tinggi: 1.4, putar: [0, 0, 90], pusat: true, warna: '#7A4A2A', logam: .6, padat: false });
    d.silinder({ posisi: [-.58, -.24, 0], r: .008, tinggi: .48, pusat: true, warna: '#3A3A3A', padat: false, tepi: false });
    d.donat({ posisi: [-.58, -.52, 0], R: .06, r: .018, pusat: true, warna: '#4A3A2A', padat: false });
    d.bola({ posisi: [.6, -.05, 0], r: .15, pusat: true, warna: '#2A1E16', logam: .5, padat: false });
    d.bola({ posisi: [.6, -.05, .12], r: .045, pusat: true, warna: '#FFD040', dasar: true, padat: false });
  });
}

/* ---------------------------------------------------------------- ADEGAN */
const ADEGAN = [
  /* #1a · KARTU + L01 — sepiring nasi putih hangat mengepul */
  { id: 'nasi', mulai: 0, durasi: 6.6, suasana: 'oranye', luas: 2,
    kamera: { orbit: true, ke: [0, .1, 0], jarak: 1.6, tinggi: .85, sudut: [-20, 15], fov: 36 },
    sfx: [ulang('pasar', 0, 14, 1.19)],
    dunia(d) { d.studio({ warna: '#C8673A' }); d.peti({ posisi: [0, -.5, 0], ukuran: [2.4, .5, 1.6], warna: '#8A5A3C' }); piringNasi(d, { posisi: [0, 0, 0], nama: 'piring' }); d.uap({ posisi: [0, .22, 0], ukuran: .18, tinggi: .7, n: 7 }); },
    gambar(g, t) { const k = maju(t, .3, .7) * (1 - maju(t, 5.6, .6)); if (k > .01) { g.label('CERITA FIKSI', 280, 215, { warna: alfa('#000000', .6 * k), warnaTeks: alfa('#FFFFFF', k), ukuran: 34 }); g.teks('TIMBANGAN\n*DAGING*', 540, 430, { ukuran: 110, aksen: '#E8C040', garis: '#1A0E08', tebalGaris: 16, alfa: k, maks: W * .9 }); } } },
  /* #1b · beras kusam berkutu di lantai gudang + karung */
  { id: 'kusam', mulai: 6.6, akhir: 'L02-4.0', suasana: 'sorot', masuk: 'lebur', luas: 3,
    kamera: [[0, { benda: 'kusam', sudut: 10, gerak: 'dorong' }]],
    dunia(d) { gudang(d, { kuat: 1.3 }); berasKusam(d, { posisi: [0, 0, -.6], nama: 'kusam', skala: .8 }); d.karung({ posisi: [.9, 0, -1.2], tulisan: 'BERAS\nSUPER', isi: .85, putar: -20 }); d.partikel('debu', { pusat: [0, .6, -.6], area: [2.4, 1.4, 1.6], n: 60 }); } },

  /* #2 · L02 — Darmo menuang pemutih, Ujang mengaduk dengan sekop */
  { id: 'oplos', mulai: 'L02-4.0', akhir: 'L03-1.2', suasana: 'sorot', masuk: 'potong', luas: 6,
    kamera: [[0, { dua: ['darmo', 'ujang'], jenis: 'penuh', gerak: 'dorong' }], ['L02', { bidik: 'darmo', jenis: 'setengah', sudut: 25 }], ['L02.w10', { atasBahu: ['ujang', 'darmo'] }], ['L02.w16', { dua: ['darmo', 'ujang'], jenis: 'lutut' }]],
    sfx: [bk('tuang', .6, 0.93, { lama: 3 }), ulang('sekop', 1.0, 14, 0.4)],
    dunia(d) {
      gudang(d);
      berasKusam(d, { posisi: [0, 0, -.5], skala: .6, nama: 'tumpukan' });
      d.tokoh('darmo', { posisi: [-.85, 0, .2], hadap: 'ujang', pose: [[0, 'tuang'], ['L02.w6', 'santai'], ['L02.w14', 'tunjukMarah']], ekspresi: [[0, 'licik'], ['L02', 'gembira']], bicara: 'L02', lihat: [[0, 'tumpukan'], ['L02', 'ujang']], pegang: [[0, 'jeriken'], ['L02.w6', null]] });
      d.tokoh('ujang', { posisi: [.85, 0, .05], hadap: 'darmo', pose: [[0, 'aduk'], ['L02.w10', 'lapKeringat'], ['L02.akhir', 'aduk']], ekspresi: 'sedih', lihat: [[0, 'tumpukan'], ['L02.w10', 'darmo']], pegang: [[0, 'sekop'], ['L02.w10', null], ['L02.akhir', 'sekop']] });
      d.jeriken({ posisi: [-1.7, 0, .9], tulisan: 'PEMUTIH' });
    } },

  /* #3 · sisipan magnet di bawah timbangan (KLIK) → L03 Ujang cemas → L04 Darmo membentak */
  { id: 'magnet', mulai: 'L03-1.2', akhir: 'L05-3.5', suasana: 'sorot', masuk: 'potong', luas: 5,
    kamera: [[0, { benda: 'timbangan', sudut: 25, tinggi: 'rendah', gerak: 'dorong' }], ['L03', { bidik: 'ujang', jenis: 'dekat', sudut: -15 }], ['L04', { bidik: 'darmo', jenis: 'setengah', sudut: 20, tinggi: 'rendah' }], ['L04.w9', { dua: ['darmo', 'ujang'], jenis: 'lutut' }, 'inOutSine']],
    sfx: [bk('klik', .6, 1.48)],
    dunia(d) {
      gudang(d);
      d.timbangan({ jenis: 'digital', nama: 'timbangan', posisi: [0, 0, -.2], angka: '-- .-- KG' });
      d.kotak({ posisi: [.18, .005, .06], ukuran: [.09, .05, .05], r: .01, warna: '#1A1A1E', nama: 'magnet', muncul: .55, masuk: 'geser', jarakMasuk: -.3, padat: false });
      d.tokoh('darmo', { posisi: [-.7, 0, -.9], hadap: 'ujang', pose: [[0, 'santai'], ['L04', 'kacakPinggang'], ['L04.w8', 'tunjukMarah']], ekspresi: [[0, 'licik'], ['L04', 'marah'], ['L04.w8', 'gembira']], bicara: 'L04', lihat: 'ujang' });
      d.tokoh('ujang', { posisi: [.8, 0, -1.1], hadap: 'darmo', pose: [[0, 'pikir'], ['L03', 'tolak'], ['L04', 'sedih']], ekspresi: [[0, 'bingung'], ['L03', 'takut'], ['L04', 'sedih']], bicara: 'L03', lihat: 'darmo' });
    } },

  /* #4 · L05–L06 — rolling door terbuka, Mbok Sari masuk membawa karung kecil; Darmo mengusir */
  { id: 'mbok', mulai: 'L05-3.5', akhir: 'L07-1.0', suasana: 'senja', masuk: 'potong', luas: 6,
    kamera: [[0, { bidik: 'mbok', jenis: 'penuh', sudut: 0, gerak: 'dorong' }], ['L05', { atasBahu: ['darmo', 'mbok'] }], ['L05.w12', { bidik: 'mbok', jenis: 'dekat' }], ['L06', { bidik: 'darmo', jenis: 'setengah', sudut: -20 }]],
    sfx: [bk('ketuk', .3, 0.47), bk('ketuk', .8, 0.47), bk('rolling', 1.0, 0.45), bk('napas', 'L05-0.2', 0.86)],
    dunia(d) {
      gudang(d, { kuat: 1.2, buka: [[0, 0], [1.0, 0], [2.2, .85]] });
      d.kotak({ posisi: [-.6, 0, -4.02], ukuran: [2.2, 2.6, .02], r: .001, warna: '#FFC88A', pancar: '#FFB060', pancarKuat: 1.4, dasar: true, padat: false });   // cahaya senja di luar pintu
      d.sorot({ posisi: [-.6, 2.4, -3.7], ke: [-.5, 0, -1.6], warna: '#FFB060', kuat: 2.4, sudut: 32 });
      d.tokoh('mbok', { hadap: 0, jalan: { dari: [-.6, -3.4], ke: [-.5, -1.7], mulai: 1.8, lama: 1.6 }, pose: [[0, 'sedih'], ['L05', 'serahkan']], ekspresi: 'sedih', bicara: 'L05', lihat: [[0, null], ['L05-0.5', 'darmo']], pegang: [[0, 'karung'], ['L05.w12', null]] });
      d.tokoh('darmo', { posisi: [.7, 0, -.4], hadap: [[0, 160], ['L05', 'mbok']], pose: [[0, 'santai'], ['L06', 'usir']], ekspresi: [[0, 'datar'], ['L06', 'marah']], bicara: 'L06', lihat: [[0, null], ['L05', 'mbok']] });
    },
    gambar(g, t) { TS(g, t, '"Cucu saya muntah-muntah\nhabis makan nasi ini..."', 'L05.w12', 300, { ukuran: 50 }); } },

  /* #5 · L07–L08 — Mbok menatap dingin sambil menunjuk; Darmo tertawa mengejek */
  { id: 'tatap', mulai: 'L07-1.0', akhir: 'L08.akhir+0.6', suasana: 'senja', masuk: 'potong', luas: 4,
    kamera: [[0, { bidik: 'mbok', jenis: 'wajah', gerak: 'dorong' }], ['L07.w6', { atasBahu: ['darmo', 'mbok'] }], ['L08', { bidik: 'darmo', jenis: 'dekat', tinggi: 'rendah' }], ['L08.w10', { dua: ['mbok', 'darmo'], jenis: 'setengah' }]],
    dunia(d) {
      gudang(d, { kuat: 1.0, buka: .85 });
      d.sorot({ posisi: [-.6, 2.4, -3.7], ke: [-.5, 0, -1.6], warna: '#FFB060', kuat: 2.0, sudut: 32 });
      d.tokoh('mbok', { posisi: [-.5, 0, -1.7], hadap: 'darmo', pose: [[0, 'sedih'], ['L07.w4', 'tunjuk']], tunjukKe: [[0, null], ['L07.w4', 'darmo'], ['L08', null]], ekspresi: [[0, 'sedih'], ['L07', 'marah']], bicara: 'L07', lihat: 'darmo' });
      d.tokoh('darmo', { posisi: [.7, 0, -.4], hadap: 'mbok', pose: [[0, 'kacakPinggang'], ['L08', 'tunjukMarah'], ['L08.w10', 'usir']], ekspresi: [[0, 'datar'], ['L08', 'gembira']], bicara: 'L08', lihat: 'mbok' });
    },
    gambar(g, t) { TS(g, t, 'Beras masuk perut juga\nujung-ujungnya jadi *kotoran!*', 'L08.w6', 300, { ukuran: 56 }); } },

  /* #6a · rolling door ditutup, Ujang pulang; Darmo sendirian mengelap keringat; 00.15 */
  { id: 'tutup', mulai: 'L08.akhir+0.6', durasi: 6.0, suasana: 'sorot', masuk: 'gelap', luas: 7,
    kamera: [[0, { bidik: 'darmo', jenis: 'lebar', sudut: 10, gerak: 'tarik' }], [2.4, { bidik: 'darmo', jenis: 'setengah', sudut: 25 }, 'inOutSine']],
    sfx: [bk('rolling', .2, 0.55), bk('langkah', .6, 1.51, { lama: 1.8 }), ulang('jam', 2.5, 3.5, 0.91)],
    dunia(d) {
      gudang(d, { kuat: 1.1, buka: [[0, .85], [1.3, 0]] });
      d.tokoh('ujang', { jalan: { dari: [.4, -1.4], ke: [-.6, -3.3], mulai: 0, lama: 1.5 }, hilang: 1.4, pose: 'santai', ekspresi: 'datar', padat: false });
      d.tokoh('darmo', { posisi: [.5, 0, -.3], hadap: 10, pose: [[0, 'kacakPinggang'], [2.4, 'lapKeringat']], ekspresi: [[0, 'datar'], [2.4, 'sedih']], efek: [[2.6, 'keringat', 2.5]] });
      d.jam({ posisi: [1.4, 2.7, -3.85], jam: 0.25, laju: 0 });
    },
    gambar(g, t) { TS(g, t, '*00.15 WIB*', 2.6, 300, { ukuran: 84 }); } },
  /* #6b · jeda sunyi — dacin di sudut berayun sendiri, KREEEK */
  { id: 'sunyi', mulai: 'L08.akhir+6.6', durasi: 3.0, suasana: 'malam', palet: MALAM, masuk: 'potong', luas: 4,
    kamera: [[0, { benda: 'dacin', sudut: -25, tinggi: 'mata', gerak: 'dorong' }]],
    sfx: [bk('rantai', .3, 0.69, { lama: 1.2 }), bk('rantai', 1.8, 0.69, { lama: 1.2 })],
    dunia(d) { gudang(d, { kuat: .7 }); d.timbangan({ jenis: 'dacin', nama: 'dacin', posisi: [2.2, 0, -2.4], putar: -20, ayun: { kuat: .07, laju: 2.2 } }); } },

  /* #7 · L09 — dacin berayun makin kencang, bohlam berkedip; Darmo menoleh heran */
  { id: 'ayun', mulai: 'L09-3.0', akhir: 'L10-6.0', suasana: 'malam', palet: MALAM, masuk: 'potong', luas: 5,
    kamera: [[0, { benda: 'dacin', sudut: -30, tinggi: 'rendah' }], ['L09-0.3', { bidik: 'darmo', jenis: 'setengah', sudut: -25 }], ['L09.w4', { bidik: 'darmo', jenis: 'dekat', sudut: -35, gerak: 'dorong' }]],
    sfx: [ulang('rantai', 0, 9, 0.69), ulang('bzzt', .4, 8, 0.7)],
    dunia(d) {
      gudang(d, { kuat: 1.0, kedip: true, ayun: { kuat: .14, laju: 2.6 } });
      d.timbangan({ jenis: 'dacin', nama: 'dacin', posisi: [2.2, 0, -2.4], putar: -20, ayun: { kuat: .16, laju: 3.2 } });
      d.tokoh('darmo', { posisi: [.3, 0, -.3], hadap: [[0, 10], ['L09-0.6', 45]], pose: [[0, 'lapKeringat'], ['L09', 'bingung']], ekspresi: [[0, 'datar'], ['L09', 'bingung']], bicara: 'L09', lihat: [[0, null], ['L09.w4', 'dacin']] });
    } },

  /* #8 · L10 — Si Penimbang berdiri dari balik karung (low angle); Darmo mundur ketakutan */
  { id: 'sosok', mulai: 'L10-6.0', akhir: 'L11-0.8', suasana: 'malam', palet: MALAM, masuk: 'potong', luas: 6,
    kamera: [[0, { bidik: 'penimbang', jenis: 'penuh', tinggi: 'rendah', sudut: 15, gerak: 'naik' }], ['L10-0.2', { bidik: 'darmo', jenis: 'dekat', sudut: 20 }], ['L10.w5', { bidik: 'darmo', jenis: 'dekat', sudut: -25, tinggi: 'tinggi' }]],
    sfx: [ulang('detak', 0, 10, 0.46), bk('rantai', .4, 0.69, { lama: 2 })],
    gerak(d, t) { if (d.nama.kepalaPalang) d.nama.kepalaPalang.rotation.z = Math.sin(t * 2.4) * .12; },
    dunia(d) {
      gudang(d, { kuat: .7, kedip: true });
      d.tokoh('penimbang', { posisi: [2.0, 0, -1.9], hadap: 'darmo', anim: [[0, { posisi: [2.0, -2.6, -1.9] }], [.4, { posisi: [2.0, -2.6, -1.9] }], [3.6, { posisi: [2.0, 0, -1.9] }, 'outCubic']], pose: [[0, 'berdiri'], [3.6, 'tunjuk']], tunjukKe: [[0, null], [3.6, 'darmo']], hiasKepala: kepalaDacin, padat: false, hidup: true });
      d.tokoh('darmo', { hadap: [[0, 'kameraAwal'], ['L10-0.4', 'penimbang']], anim: [[0, { posisi: [-.2, 0, -.2] }], ['L10-0.3', { posisi: [-.2, 0, -.2] }], ['L10+1.2', { posisi: [-.9, 0, .3] }, 'outCubic']], pose: [[0, 'bingung'], ['L10-0.3', 'mundurTakut'], ['L10.w5', 'tolak']], ekspresi: [[0, 'bingung'], ['L10-0.4', 'takut']], bicara: 'L10', lihat: 'penimbang', efek: [['L10', 'keringat', 3]] });
    } },

  /* #9 · L11 — close-up kepala palang dacin, mata kuning; si Penimbang bicara */
  { id: 'kepala', mulai: 'L11-0.8', akhir: 'L12-5.0', suasana: 'malam', palet: MALAM, masuk: 'kilat', luas: 4,
    kamera: [[0, { bidik: 'penimbang', jenis: 'dekat', tinggi: 'rendah', sudut: 10, gerak: 'dorong' }]],
    sfx: [ulang('detak', 0, 11, 0.46), bk('rantai', 'L11.w3', 0.69, { lama: 1.5 })],
    gerak(d, t) { if (d.nama.kepalaPalang) d.nama.kepalaPalang.rotation.z = -.3 * maju(t, .6, .2) + Math.floor(Math.sin(t * 1.3) * 4) / 4 * .1; },
    dunia(d) { gudang(d, { kuat: .6 }); d.tokoh('penimbang', { posisi: [2.0, 0, -1.9], hadap: 'kameraAwal', pose: [[0, 'tunjuk'], ['L11.w4', 'berdiri']], ekspresi: 'netral', bicara: 'L11', hiasKepala: kepalaDacin, padat: false }); } },

  /* #10 · L12 — bandul menghantam lantai (DUM), Darmo menyusut seukuran tikus */
  { id: 'susut', mulai: 'L12-5.0', akhir: 'L12.akhir+0.6', suasana: 'malam', palet: MALAM, masuk: 'potong', luas: 6,
    kamera: [[0, { dua: ['penimbang', 'darmo'], jenis: 'penuh' }], [2.5, { bidik: 'darmo', jenis: 'penuh', tinggi: 'rendah', gerak: 'dorong' }, 'inOutSine']],
    guncang: t => (t > 1.0 && t < 1.6 ? 1 : 0),
    sfx: [bk('dum', 1.0, 0.75), bk('susut', 1.2, 0.69)],
    gerak(d, t) { const p = d.para && d.para.darmo; if (p) p.skala = lerp(1, .14, maju(t, 1.2, 1.0, 'inCubic')); },
    dunia(d) {
      gudang(d, { kuat: .7 });
      d.tokoh('penimbang', { posisi: [1.6, 0, -2.0], hadap: 'darmo', pose: 'tunjuk', tunjukKe: 'darmo', hiasKepala: kepalaDacin, padat: false });
      d.karung({ posisi: [.6, 0, -1.0], nama: 'karungBuka', tulisan: 'BERAS\nSUPER' });
      d.tokoh('darmo', { posisi: [0, 0, -.2], hadap: [[0, 'penimbang'], [1.6, 'kameraAwal']], pose: [[0, 'mundurTakut'], [1.4, 'takut']], ekspresi: [[0, 'takut'], [1.2, 'kaget']], bicara: 'L12', efek: [[1.3, 'seru', 2]] });
    } },

  /* #11 · dalam karung: Darmo kecil di gunungan beras; butiran berubah jadi belatung; mulut karung diikat */
  { id: 'belatung', mulai: 'L12.akhir+0.6', akhir: 'L13-3.2', palet: BUSUK, suasana: 'malam', masuk: 'zoom', luas: 3,
    kamera: [[0, { dari: [0, .55, .8], ke: [0, .3, 0], fov: 46 }], [7.5, { dari: [0, .7, .55], ke: [0, .32, 0] }, 'linear']],
    sfx: [ulang('belatung', .6, 8, 0.83), bk('ikat', 7.0, 1.02)],
    gerak(d, t) { const ub = maju(t, 1.5, 3.0); for (let i = 0; i < 70; i++) { const b = d.nama['blt' + i]; if (!b) continue; b.visible = acak(i * 3.3) < ub; b.position.y = acak(i + 3) * .2 + Math.max(0, t - 2.5) * .06 * (1 + acak(i)); b.rotation.z = Math.sin(t * 6 + i) * .6; } if (d.nama.ikatan) d.nama.ikatan.scale.setScalar(Math.max(.001, maju(t, 7.0, .4))); },
    dunia(d) {
      d.latar('#1E2614', '#060802'); d.tanah({ jenis: 'pasir', warna: '#4A4028' });
      d.kerucut({ posisi: [0, 0, 0], r: .9, tinggi: .4, warna: '#E2DCC8' });
      belatungGrup(d, { posisi: [0, .05, 0] }, 70);
      d.tokoh('darmo', { skala: .14, hadap: 'kameraAwal', anim: [[0, { posisi: [.05, .21, .2] }], [4.5, { posisi: [.04, .3, .1] }, 'linear'], [6.0, { posisi: [.04, .25, .08] }, 'inCubic']], pose: [[0, 'takut'], [2, 'mundurTakut'], [4, 'peganKepala']], ekspresi: 'takut', padat: false, hilang: 6.2 });
      d.donat({ nama: 'ikatan', posisi: [0, 1.3, 0], R: .3, r: .03, putar: [90, 0, 0], pusat: true, warna: '#C83E2B', padat: false });
      d.lampu({ posisi: [0, 1.6, .6], warna: '#C8E080', kuat: 1.4, jarak: 3.5, bola: false, pendar: false });
    } },

  /* #12 · L13 — pagi: Ujang menaruh karung di timbangan digital: 68.00 KG */
  { id: 'pagi', mulai: 'L13-3.2', akhir: 'L14-0.3', suasana: 'siang', masuk: 'lebur', luas: 5, cahaya3d: { matahari: .8 },
    kamera: [[0, { bidik: 'ujang', jenis: 'lutut', sudut: 20 }], ['L13-0.8', { benda: 'timbangan', sudut: 10 }], ['L13', { bidik: 'ujang', jenis: 'dekat', sudut: -20 }], ['L13.w9', { bidik: 'ujang', jenis: 'setengah', sudut: 35 }]],
    sfx: [ulang('pasarPagi', 0, 12, 0.65), bk('bip', 'L13-0.6', 1.05)],
    dunia(d) {
      gudang(d, { dinding: '#8E5E46', lantai: '#8A847A', kuat: 2.0, buka: .9 });
      d.sorot({ posisi: [-1.6, 3.6, 1.0], ke: [0, 0, 0], warna: '#FFF4D8', kuat: 2.0, sudut: 40 });
      d.timbangan({ jenis: 'digital', nama: 'timbangan', posisi: [.4, 0, .1], angka: t => (t > w('L13-0.6') - w('L13-3.2') ? '68.00 KG' : '--.-- KG') });
      d.karung({ posisi: [.4, .17, .08], nama: 'karungTimbang', muncul: 1.0, masuk: 'jatuh', jarakMasuk: 1.2, warna: '#8A7A56', tulisan: 'BERAS\nSUPER' });
      d.tokoh('ujang', { posisi: [-.5, 0, .3], hadap: 40, pose: [[0, 'bawaKardus'], [1.2, 'santai'], ['L13', 'kaget'], ['L13.w9', 'mundurTakut']], ekspresi: [[0, 'datar'], ['L13', 'kaget'], ['L13.w9', 'takut']], bicara: 'L13', lihat: [[0, 'karungTimbang'], ['L13', 'kameraAwal']] });
    },
    gambar(g, t) { TS(g, t, '*68.00 KG*', 'L13.w6', 300, { ukuran: 96, aksen: '#FF3A2A' }); } },

  /* #13 · L14 + KARTU — karung busuk bergoyang dari dalam; kamera menjauh; pudar ke hitam */
  { id: 'akhir', mulai: 'L14-0.3', akhir: 'L14.akhir+1.2', suasana: 'malam', palet: MALAM, masuk: 'gelap', luas: 6,
    kamera: [[0, { benda: 'karungAkhir', sudut: 0, tinggi: 'mata', gerak: 'tarik' }]],
    sfx: [bk('rantai', .4, 0.69, { lama: 2 })],
    gerak(d, t) { const k = d.nama.karungAkhir; if (k) { k.rotation.z = Math.sin(t * 9) * .03 * (Math.sin(t * 1.3) > 0 ? 1 : .2); k.scale.y = 1 + Math.sin(t * 7) * .015; } },
    dunia(d) { gudang(d, { kuat: .8 }); d.timbangan({ jenis: 'dacin', posisi: [-1.0, 0, -.9], nama: 'dacinAkhir', ayun: { kuat: .04 } }); d.karung({ posisi: [0, 0, 0], nama: 'karungAkhir', warna: '#7A6A4A', tulisan: 'BERAS\nSUPER' }); },
    gambar(g, t, dur) { const h = maju(t, dur - 1.0, .9); if (h > 0) g.simpan(c => { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(0,0,0,${h})`; c.fillRect(0, 0, c.canvas.width, c.canvas.height); }); } },
  { id: 'kartu', mulai: 'L14.akhir+1.2', akhir: 'L14.akhir+5', masuk: 'potong', kameraHidup: false,
    gambar(g, t) {
      g.latar('polos', { warna: '#000000' });
      const k1 = maju(t, 0, .35), k2 = maju(t, .9, .6);
      g.teks('TIMBANGAN\n*DAGING*', 540, 760, { ukuran: 100, aksen: '#E8C040', garis: '#000000', tebalGaris: 10, alfa: k1, maks: W * .9 });
      g.teks('Pernah ketemu pedagang curang?\nCeritakan di komentar.\nFollow untuk kisah berikutnya.', 540, 1060, { ukuran: 44, warna: alfa('#E8E2DA', k2), bayang: false, maks: W * .72, berat: 600 });
    } }
];
