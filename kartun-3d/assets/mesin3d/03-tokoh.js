/* ------------------------------------------------------------- tokoh 3D ber-rig
   Tinggi ±1,86 m × skala, menghadap +z. Sendi: akar (kaki di tanah) → pinggul → badan → dada → leher → kepala;
   dada → bahu → lengan atas → siku → lengan bawah → tangan; pinggul → paha → lutut → betis → pergelangan → sepatu.
   Wajah = tekstur kanvas di tudung bola depan kepala (mata, alis, mulut, pipi), digambar ulang hanya bila berubah.
   POSE3D: lengan lKi/lKa [maju, samping, putar ke dalam, tekuk siku] · kaki kKi/kKa [maju, samping, tekuk lutut]
           badan [condong maju, miring, putar] · kepala [angguk, miring, toleh] (derajat) · turun (m) · penanda. */
const POSE3D = {
  berdiri:    { lKi: [3, 9, 15, 12], lKa: [3, 9, 15, 12], gestur: 1 },
  santai:     { lKi: [-5, 8, 25, 24], lKa: [7, 12, 10, 20], badan: [0, 2, 0], kepala: [0, 4, 0], gestur: 1 },
  lambai:     { lKi: [3, 9, 15, 12], lKa: [8, 118, -90, 48], goyang: 1, kepala: [0, -4, 0] },
  tunjuk:     { lKi: [3, 9, 15, 14], lKa: [84, 6, 0, 4], badan: [0, -2, -8] },
  tunjukAtas: { lKi: [3, 9, 15, 14], lKa: [165, 10, 0, 0], kepala: [-14, 0, 0] },
  presentasi: { lKi: [10, 12, 15, 22], lKa: [42, 30, 35, 58], badan: [0, 0, -10], gestur: 1 },
  pikir:      { lKi: [26, 6, 85, 96], lKa: [34, 10, 62, 138], kepala: [6, 8, 0] },
  sedekap:    { lKi: [26, 10, 82, 106], lKa: [30, 10, 86, 104], kepala: [-3, 0, 0] },
  kaget:      { lKi: [25, 48, -50, 75], lKa: [25, 48, -50, 75], badan: [-8, 0, 0], kepala: [-8, 0, 0], loncat: .35 },
  hore:       { lKi: [8, 158, 0, 12], lKa: [8, 158, 0, 12], kepala: [-12, 0, 0], loncat: 1 },
  angkatBahu: { lKi: [18, 36, -70, 82], lKa: [18, 36, -70, 82], kepala: [0, 9, 0], bahu: 1 },
  sedih:      { lKi: [0, 5, 10, 6], lKa: [0, 5, 10, 6], badan: [10, 0, 0], kepala: [22, 4, 0], gestur: 1 },
  marah:      { lKi: [-18, 38, 95, 100], lKa: [-18, 38, 95, 100], badan: [5, 0, 0], kepala: [6, 0, 0] },
  bingung:    { lKi: [3, 9, 15, 12], lKa: [18, 112, -90, 128], kepala: [0, -10, 0] },
  pegangHp:   { lKi: [34, 10, 55, 108], lKa: [38, 10, 50, 112], kepala: [16, 0, 0] },
  telepon:    { lKi: [3, 9, 15, 12], lKa: [22, 64, 25, 156], kepala: [4, 10, 0] },
  duduk:      { lKi: [32, 10, 22, 52], lKa: [32, 10, 22, 52], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, gestur: 1 },
  dudukHp:    { lKi: [40, 10, 55, 100], lKa: [44, 10, 50, 104], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, kepala: [18, 0, 0] },
  dudukTegang:{ lKi: [40, 14, 30, 70], lKa: [40, 14, 30, 70], kKi: [88, 4, 92], kKa: [88, 4, 92], turun: .34, duduk: 1, gemetar: 1, kepala: [-5, 0, 0] },
  dudukLesu:  { lKi: [20, 8, 20, 30], lKa: [20, 8, 20, 30], kKi: [86, 9, 84], kKa: [86, 9, 84], turun: .34, duduk: 1, badan: [12, 0, 0], kepala: [22, 0, 0], gestur: 1 },
  dudukMakan: { lKi: [32, 10, 22, 52], lKa: [48, 16, 52, 146], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, kepala: [4, 0, 0] },
  menggambar: { lKi: [36, 10, 50, 86], lKa: [44, 10, 38, 78], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, kepala: [20, 0, 0], gores: 1 },
  ketik:      { lKi: [46, 12, 30, 72], lKa: [46, 12, 30, 72], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, kepala: [12, 0, 0], ketik: 1 },
  minum:      { lKi: [46, 12, 58, 150], lKa: [32, 10, 22, 52], kKi: [88, 7, 88], kKa: [88, 7, 88], turun: .34, duduk: 1, kepala: [-8, 0, 0] },
  jongkok:    { lKi: [40, 14, 25, 40], lKa: [40, 14, 25, 40], kKi: [125, 16, 140], kKa: [125, 16, 140], turun: .5, badan: [24, 0, 0], kepala: [-14, 0, 0] },
  jongkokBimbing: { lKi: [40, 14, 25, 40], lKa: [62, 20, 10, 30], kKi: [125, 16, 140], kKa: [125, 16, 140], turun: .5, badan: [20, 0, 0], kepala: [-6, 6, 0] },
  takut:      { lKi: [52, 18, 72, 140], lKa: [52, 18, 72, 140], badan: [10, 0, 0], kepala: [10, 0, 0], gemetar: 1 },
  bawaKardus: { lKi: [48, 16, 22, 68], lKa: [48, 16, 22, 68], badan: [-4, 0, 0], kepala: [-2, 0, 0] },
  serahkan:   { lKi: [3, 9, 15, 12], lKa: [70, 10, 5, 18], badan: [6, 0, 0], kepala: [4, 0, 0] },
  bimbing:    { lKi: [30, 14, 30, 40], lKa: [55, 20, 20, 40], badan: [22, 0, 0], kepala: [6, 6, 0], turun: .12 },
  peganKepala:{ lKi: [22, 108, -90, 132], lKa: [22, 108, -90, 132], kepala: [8, 0, 0], badan: [4, 0, 0], gemetar: .3 },
  makan:      { lKi: [3, 9, 15, 12], lKa: [48, 16, 52, 146], kepala: [-4, 0, 0] },
  makanKiri:  { lKi: [48, 16, 52, 146], lKa: [3, 9, 15, 12], kepala: [-4, 0, 0] },
  minumBerdiri: { lKi: [46, 12, 58, 150], lKa: [3, 9, 15, 12], kepala: [-10, 0, 0] },
  naikMotor:  { lKi: [62, 14, 5, 28], lKa: [62, 14, 5, 28], kKi: [72, 16, 74], kKa: [72, 16, 74], turun: 0, duduk: 1, badan: [14, 0, 0], kepala: [-12, 0, 0] },
  setir:      { lKi: [58, 10, 18, 52], lKa: [58, 10, 18, 52], kKi: [86, 6, 80], kKa: [86, 6, 80], turun: .34, duduk: 1, badan: [4, 0, 0] },
  dorong:     { lKi: [82, 10, 2, 14], lKa: [82, 10, 2, 14], badan: [18, 0, 0], kepala: [-12, 0, 0], depan: 1 },
  baca:       { lKi: [40, 12, 42, 96], lKa: [40, 12, 42, 96], kepala: [20, 0, 0] },
  tepuk:      { lKi: [60, 22, 80, 62], lKa: [60, 22, 80, 62], tepuk: 1, kepala: [-4, 0, 0] },
  angkat:     { lKi: [30, 24, 70, 40], lKa: [30, 24, 70, 40], badan: [14, 0, 0], kKi: [30, 10, 40], kKa: [30, 10, 40], turun: .1 },
  joget:      { lKi: [30, 40, 0, 60], lKa: [30, 40, 0, 60], joget: 1 },
  tidur:      { lKi: [0, 10, 10, 10], lKa: [0, 10, 10, 10], rebah: 1, kepala: [0, 10, 0] },
  lari:       { lKi: [3, 9, 15, 70], lKa: [3, 9, 15, 70], badan: [10, 0, 0] },
  // pose bercerita (sejak 26 Nov 2026, dari uji "Timbangan Daging": penulis terpaksa membuat pose sendiri yang kaku)
  usir:       { lKi: [3, 9, 15, 12], lKa: [50, 18, 10, 45], kibas: 1, badan: [0, 0, -12], kepala: [0, 0, -15] },
  tolak:      { lKi: [42, 28, -22, 52], lKa: [42, 28, -22, 52], badan: [-5, 0, 0] },
  mundurTakut:{ lKi: [55, 25, 45, 118], lKa: [55, 25, 45, 118], badan: [-12, 0, 0], kepala: [-8, 0, 0], kKi: [-8, 6, 14], kKa: [10, 6, 18], gemetar: .6 },
  lapKeringat:{ lKi: [3, 9, 15, 12], lKa: [40, 38, -55, 148], kepala: [-6, 6, 0] },
  tuang:      { lKa: [44, 26, 4, 34], lKi: [40, 14, 46, 74], badan: [14, 0, 0], kepala: [16, 0, 0] },
  aduk:       { lKa: [52, 14, 30, 58], lKi: [44, 12, 40, 72], badan: [22, 0, 0], kepala: [18, 0, 0], kKi: [10, 6, 12], kKa: [-4, 6, 6], aduk: 1 },
  pikul:      { lKa: [155, 22, -40, 150], lKi: [3, 9, 15, 12], badan: [4, 6, 0], kepala: [0, -6, 0] },
  angkatAtas: { lKi: [165, 18, 0, 30], lKa: [165, 18, 0, 30], kepala: [-10, 0, 0] },
  menangis:   { lKi: [50, 16, 70, 132], lKa: [50, 16, 70, 132], kepala: [20, 0, 0], badan: [10, 0, 0], isak: 1 },
  berdoa:     { lKi: [36, 8, 78, 118], lKa: [36, 8, 78, 118], kepala: [14, 0, 0] },
  peluk:      { lKi: [38, 10, 96, 112], lKa: [42, 10, 92, 108], kepala: [8, 0, 0], gemetar: .5 },
  tunjukMarah:{ lKa: [86, 8, 0, 4], lKi: [-18, 38, 95, 100], badan: [10, 0, -8], kepala: [-4, 0, 0] },
  kacakPinggang: { lKi: [-18, 38, 95, 100], lKa: [-18, 38, 95, 100], gestur: 1 },
  membungkuk: { lKi: [70, 10, 0, 12], lKa: [70, 10, 0, 12], badan: [55, 0, 0], kepala: [-28, 0, 0], kKi: [14, 6, 20], kKa: [14, 6, 20] },
  ambil:      { lKi: [60, 12, 10, 20], lKa: [95, 10, 0, 10], badan: [62, 0, 0], kepala: [-30, 0, 0], kKi: [45, 10, 70], kKa: [45, 10, 70], turun: .12 },
  terduduk:   { lKi: [-30, 25, 0, 10], lKa: [-30, 25, 0, 10], kKi: [88, 10, 6], kKa: [88, 10, 6], turun: .7, duduk: 1, badan: [-8, 0, 0] },
  lambaiDua:  { lKi: [8, 118, -90, 48], lKa: [8, 118, -90, 48], goyang: 1, goyangKi: 1 },
  tepukDada:  { lKi: [3, 9, 15, 12], lKa: [40, 12, 80, 128], kepala: [-6, 0, 0], badan: [-4, 0, 0] }
};
const GESTUR_POSE = new Set(Object.keys(POSE3D).filter(k => POSE3D[k].gestur));
function pose3D(nama) { const p = (K.pose3d && K.pose3d[nama]) || POSE3D[nama]; if (!p && nama && !pose3D._lapor) { pose3D._lapor = 1; catatan.push('pose 3D tidak dikenal: ' + nama + ' (lihat references/mesin.md §6)'); } return p || POSE3D.berdiri; }
function campurPose3D(a, b, k) {   // b → a dengan kemajuan k
  if (!b || k >= 1) return a; const o = {};
  for (const q of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const va = a[q], vb = b[q];
    if (Array.isArray(va) || Array.isArray(vb)) { const A0 = va || [0, 0, 0, 0], B0 = vb || [0, 0, 0, 0]; o[q] = A0.map((v, i) => lerp(B0[i] ?? 0, v ?? 0, k)); }
    else if (typeof (va ?? vb) === 'number') o[q] = lerp(vb ?? 0, va ?? 0, k);
    else o[q] = k > .5 ? va : vb;
  }
  return o;
}
/** nilai berwaktu: 'nama' | [[t, 'nama'], …] → {a, b, k} dengan perpindahan halus `lama` dtk */
function nilaiDi(v, t, a, lama = .4) {
  if (!Array.isArray(v) || !Array.isArray(v[0])) return { a: v, b: null, k: 1 };
  let A0 = v[0][1], B0 = null, k = 1;
  for (let i = 0; i < v.length; i++) { const ti = wl(v[i][0], a); if (t >= ti) { A0 = v[i][1]; if (i) { const kk = jepit((t - ti) / lama); if (kk < 1) { B0 = v[i - 1][1]; k = E.inOutCubic(kk); } else { B0 = null; k = 1; } } } }
  return { a: A0, b: B0, k };
}

/* ===================================================================== GERAK HIDUP + RIG LENTUR (sejak 27 Nov 2026)
   Dari bedah RicksClips3000 + reel IG + riset (references/teknik-kamera.md §5–§6): pose berpindah lewat ANTISIPASI (tarik balik ±10–16 %
   selama 0,14 dtk) → AKSI cepat → lewat sasaran lalu MENGENDAP (pegas bentuk-tertutup, murni fungsi waktu = aman untuk seek), sendi
   BERTUMPUK (badan 0 → kepala 0,04 → bahu 0,05 → siku 0,09 dtk), pergelangan TERTINGGAL saat lengan berayun, bentuk tangan berganti per
   pose, badan memampat/memanjang (volume tetap), kontrapposto saat berdiri, kedip berjeda acak, mata mendahului kepala, rambut berayun.
   Rig LENTUR: lengan, kaki, dan badan = satu permukaan ber-skin (SkinnedMesh bawaan Three r147) → siku/lutut/punggung melengkung tanpa
   bola sendi (dulu ruas kapsul + bola, tampak manekin). Mode lama: KONFIG.gerakLama: true / tokoh gerakLama: true; rig lama: KONFIG.rig = 'ruas'. */
function pegasT(tau, zeta, w) {   // respons langkah 0→1 pegas teredam, bentuk tertutup (Holden "Spring-It-On", cth9191/animate MIT) — tanpa state
  if (tau <= 0) return 0;
  if (zeta >= 1) return 1 - Math.exp(-w * tau) * (1 + w * tau);
  const wd = w * Math.sqrt(1 - zeta * zeta); return 1 - Math.exp(-zeta * w * tau) * (Math.cos(wd * tau) + zeta * w / wd * Math.sin(wd * tau));
}
function impulsPegas(tau, zeta = .3, f = 1.6) { if (tau <= 0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - zeta * zeta); return Math.exp(-zeta * w * tau) * Math.sin(wd * tau); }
const POSE_AKSI = new Set(['tunjuk', 'tunjukAtas', 'lambai', 'lambaiDua', 'kaget', 'hore', 'angkatBahu', 'marah', 'dorong', 'usir', 'tolak', 'mundurTakut', 'tunjukMarah', 'angkatAtas', 'pikul', 'angkat', 'ambil', 'serahkan', 'tepuk', 'peganKepala', 'lapKeringat', 'tepukDada', 'membungkuk', 'jongkok', 'presentasi', 'bingung', 'takut', 'kacakPinggang', 'pikir', 'sedekap']);
const GRUP_GERAK = { badan: { jeda: 0, lama: .34, zeta: .82, ant: .1 }, kepala: { jeda: .04, lama: .3, zeta: .6, ant: .08 }, bahu: { jeda: .05, lama: .28, zeta: .6, ant: .16 }, siku: { jeda: .09, lama: .26, zeta: .5, ant: .14 } };
const T_ANT = .14;
function kurvaGerak(dt, g, aksi) {   // kemajuan 0→1 satu kelompok sendi: <0 = antisipasi, >1 = lewat sasaran
  if (dt <= 0) return 0;
  const ant = aksi ? g.ant : 0;
  if (ant > 0 && dt < T_ANT) { const u = dt / T_ANT; return -ant * Math.sin(u * Math.PI / 2) ** 2; }
  const tau = dt - (ant > 0 ? T_ANT : 0);
  return -ant + (1 + ant) * pegasT(tau, aksi ? g.zeta : Math.max(g.zeta, .85), 4.2 / (aksi ? g.lama : g.lama * 1.3));
}
/** pose berwaktu → { a, b, dt (dtk sejak transisi ke a mulai) }; tiba: puncak aksi jatuh TEPAT di waktu kunci (transisi mulai ±0,36 dtk lebih awal) */
function poseBerwaktu(v, t, a, tiba) {
  if (!Array.isArray(v) || !Array.isArray(v[0])) return { a: v, b: null, dt: 99 };
  let A0 = v[0][1], B0 = null, dt = 99;
  for (let i = 0; i < v.length; i++) { let ti = wl(v[i][0], a); if (i && tiba) ti -= (POSE_AKSI.has(v[i][1]) ? T_ANT : 0) + .22; if (t >= ti) { A0 = v[i][1]; B0 = i ? v[i - 1][1] : null; dt = i ? t - ti : 99; } }
  if (dt > 1.6) B0 = null;   // sudah mengendap
  return { a: A0, b: B0, dt };
}
/** campur pose per kelompok sendi (jeda bertumpuk + antisipasi + pegas); bobot boleh < 0 (antisipasi) dan > 1 (lewat sasaran) */
function campurPoseHidup(pa, pb, dt, aksi) {
  const k = {}; for (const g in GRUP_GERAK) k[g] = kurvaGerak(dt - GRUP_GERAK[g].jeda, GRUP_GERAK[g], aksi);
  const o = {};
  for (const q of new Set([...Object.keys(pa), ...Object.keys(pb)])) {
    const va = pa[q], vb = pb[q];
    if (Array.isArray(va) || Array.isArray(vb)) {
      const A0 = va || (q[0] === 'l' ? [3, 9, 15, 12] : [0, 0, 0, 0]), B0 = vb || (q[0] === 'l' ? [3, 9, 15, 12] : [0, 0, 0, 0]);
      const buka = (q === 'lKi' || q === 'lKa') && (B0[3] ?? 0) > 100 && (A0[3] ?? 0) < (B0[3] ?? 0) - 30;   // meluruskan siku dari pose dekat wajah/dada: SIKU dulu (tangan menjauh dari badan), baru bahu — tangan tidak melintas di depan mulut
      const kSiku = buka ? kurvaGerak(dt - .01, GRUP_GERAK.siku, aksi) : k.siku, kBahu = buka ? kurvaGerak(dt - .1, GRUP_GERAK.bahu, aksi) : k.bahu;
      o[q] = A0.map((x, i) => { const kk = q === 'lKi' || q === 'lKa' ? (i === 3 ? kSiku : kBahu) : q === 'kepala' ? k.kepala : k.badan; return lerp(B0[i] ?? 0, x ?? 0, kk); });
    } else if (typeof (va ?? vb) === 'number') o[q] = lerp(vb ?? 0, va ?? 0, jepit(k.badan, 0, 1));
    else o[q] = k.badan > .5 ? va : vb;
  }
  return o;
}
/** squash & stretch dari transisi aksi: memampat saat antisipasi, memanjang saat aksi cepat, lalu kembali (volume tetap: sx = sz = 1/√sy) */
function regangTransisi(dt, aksi) {
  if (!aksi || dt <= 0 || dt > .7) return 0;
  if (dt < T_ANT) return -.05 * Math.sin(dt / T_ANT * Math.PI / 2) ** 2;
  const u = (dt - T_ANT) / .36; return u >= 1 ? 0 : -.05 * (1 - u) ** 3 + .045 * Math.sin(Math.PI * u) * (1 - u * .6);
}
/** bentuk tangan otomatis per pose (teknik "swap hands"): [Ki, Ka] */
const TANGAN_POSE = {
  tunjuk: [null, 'tunjuk'], tunjukAtas: [null, 'tunjuk'], tunjukMarah: ['kepal', 'tunjuk'], marah: ['kepal', 'kepal'], kacakPinggang: ['kepal', 'kepal'],
  lambai: [null, 'buka'], lambaiDua: ['buka', 'buka'], hore: ['buka', 'buka'], kaget: ['buka', 'buka'], tolak: ['buka', 'buka'], angkatBahu: ['buka', 'buka'],
  presentasi: [null, 'buka'], serahkan: [null, 'buka'], takut: ['kepal', 'kepal'], mundurTakut: ['buka', 'buka'], usir: [null, 'buka'], angkatAtas: ['buka', 'buka'],
  tepuk: ['buka', 'buka'], peganKepala: ['buka', 'buka'], dorong: ['buka', 'buka'], bingung: [null, 'buka'], berdoa: ['buka', 'buka'], tepukDada: [null, 'buka'],
  lapKeringat: [null, 'buka'], sedekap: ['kepal', 'kepal'], pikir: [null, 'kepal'], menangis: ['buka', 'buka'], peluk: ['buka', 'buka'], joget: ['buka', 'buka']
};
/** fleksi pergelangan per pose [Ki, Ka] (derajat; − = menekuk ke punggung tangan, telapak menghadap keluar) */
const PERGELANGAN = { tolak: [-62, -62], dorong: [-58, -58], lambai: [0, -22], lambaiDua: [-22, -22], hore: [-14, -14], presentasi: [0, -18], serahkan: [0, -12], angkatAtas: [-20, -20], tepuk: [-8, -8], tunjuk: [0, 4], tunjukMarah: [0, 4], kaget: [-18, -18] };
const BAHAN_PROKSI = new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 });   // bayangan tabrak (SDF) yang tidak tergambar
/** tabung anggota ber-skin: sumbu −y dari 0 ke −L, sendi tengah di −Ls; jari-jari r0 (pangkal) → rs (sendi) → r1 (ujung); bobot halus ±zona di sendi */
function geoAnggota(L, Ls, r0, rs, r1, zona = .055) {
  return geoSimpan(`angg|${L}|${Ls}|${r0.toFixed(4)}|${rs}|${r1}|${zona}`, () => {
    const pts = [], nCap = 6, nBody = 32;
    for (let i = 0; i <= nCap; i++) { const q = -Math.PI / 2 + (i / nCap) * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0, Math.cos(q) * r1), -L + Math.sin(q) * r1)); }
    for (let i = 1; i < nBody; i++) { const y = -L + (i / nBody) * L, rr = y < -Ls ? lerp(r1, rs, (y + L) / (L - Ls)) : lerp(rs, r0, (y + Ls) / Ls); pts.push(new THREE.Vector2(rr, y)); }
    for (let i = 0; i <= nCap; i++) { const q = (i / nCap) * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0, Math.cos(q) * r0), Math.sin(q) * r0)); }
    pts[0].x = 0; pts[pts.length - 1].x = 0;
    return kulitTinggi(new THREE.LatheGeometry(pts, segQ(18)), -Ls + zona, -Ls - zona);
  });
}
/** bobot kulit dua tulang menurut tinggi: y di sisi y0 → tulang 0, sisi y1 → tulang 1, peralihan halus (smoothstep) */
function kulitTinggi(g, y0, y1) {
  const pos = g.attributes.position, n = pos.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) { const w = jepit((pos.getY(i) - y0) / (y1 - y0)), s = w * w * (3 - 2 * w); si[i * 4 + 1] = 1; sw[i * 4] = 1 - s; sw[i * 4 + 1] = s; }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  return g;
}
/** SkinnedMesh + bayangan + garis tepi (bahanTepi sudah mendukung skinning) */
function kulitMesh(geo, o = {}) {
  const m = new THREE.SkinnedMesh(geo, o.bahan || bahan(o)); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
  const G = gaya3D();
  if (G.tepi > 0 && o.tepi !== false) { const wr = typeof o.tepi === 'string' ? o.tepi : campur(o.warna ?? P.utama, P.gelap, .78); const t = new THREE.SkinnedMesh(geo, bahanTepi(wr)); t.userData.tepi = true; t.castShadow = false; t.receiveShadow = false; t.frustumCulled = false; m.add(t); }
  m.userData.padat = true; return m;
}
/** bentuk tangan 3D (kartun, 4 jari bulat + jempol): santai · buka · kepal · tunjuk · jempol · genggam. Sumbu −y = arah jari, s = sisi (Ki 1, Ka −1) */
function bangunTangan(tangan, s, kulit, ML, M) {
  const bentuk = {}, buat = (nama, isi) => { const g = new THREE.Group(); g.visible = nama === 'santai'; tangan.add(g); isi(g); bentuk[nama] = g; };
  const jari = (g, x, y, z, r, p, rot) => { const j = M(geoKapsul(r, p, 8), kulit, { tepi: false }); j.position.set(x, y, z); if (rot) j.rotation.set(rot[0], rot[1], rot[2]); g.add(j); return j; };
  buat('santai', g => { const t = ML(geoBola(.068, 18, 14), kulit); t.position.y = -.06; t.scale.set(.84, 1.02, .68); g.add(t); jari(g, -s * .04, -.045, .032, .022, .05, [.5, 0, s * .7]); });
  buat('buka', g => { const t = ML(geoBola(.066, 18, 14), kulit); t.position.y = -.052; t.scale.set(.62, .9, .82); g.add(t);
    [-.036, -.012, .012, .036].forEach((z, i) => jari(g, 0, -.112 - (i === 1 || i === 2 ? .008 : 0), z * 1.05, .0155, .046, [z * 2.2, 0, 0]));
    jari(g, -s * .035, -.04, .058, .018, .042, [.9, 0, s * 1.05]); });
  const kepal = g => { const t = ML(geoKotak(.072, .09, .1, .034), kulit); t.position.y = -.058; g.add(t);
    const r = M(geoKapsul(.022, .07, 8), kulit, { tepi: false }); r.position.set(s * .006, -.1, 0); r.rotation.x = Math.PI / 2; g.add(r); };
  buat('kepal', g => { kepal(g); jari(g, -s * .03, -.058, .052, .02, .03, [1.2, 0, s * .4]); });
  buat('genggam', g => { kepal(g); jari(g, -s * .032, -.05, .055, .02, .03, [1.0, 0, s * .6]); });
  buat('tunjuk', g => { kepal(g); jari(g, s * .004, -.16, .03, .0175, .075, null); jari(g, -s * .03, -.06, .05, .02, .03, [1.2, 0, s * .4]); });
  buat('jempol', g => { kepal(g); jari(g, -s * .008, -.035, .075, .021, .05, [Math.PI / 2, 0, 0]); });
  return bentuk;
}

/** perut gemuk: dorong permukaan depan badan (profil bubut) keluar dengan bentuk halus → satu permukaan, tanpa sambungan */
function perutkan(g) {
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const r = Math.hypot(v.x, v.z); if (r < 1e-4) continue;
    const depan = Math.max(0, v.z / r) ** 1.4, dorong = .095 * Math.exp(-(((v.y - .15) / .13) ** 2)) * depan;
    p.setXYZ(i, v.x * (1 + dorong / r * .35), v.y, v.z * (1 + dorong / r));
  }
  g.computeVertexNormals(); return g;
}
class Tokoh3D {
  constructor(dn, id, def, o) {
    this.dn = dn; this.id = id; this.def = def; this.o = o; this.a = dn.a; this.benih = benih3(id);
    // jenis tubuh (def.tubuh): pria (bawaan) | wanita | gemuk | kurus | tua (bungkuk, uban) | anak; boleh juga def.wanita/def.gemuk/def.tua/def.kurus
    const tb = def.tubuh || 'pria', anak = tb === 'anak', wanita = tb === 'wanita' || !!def.wanita, tua = tb === 'tua' || !!def.tua, kurus = tb === 'kurus' || !!def.kurus;
    const R = this.R = .2 * (def.kepalaSkala ?? (anak ? 1.24 : 1.1)), gemuk = (def.gemuk || tb === 'gemuk') ? 1.22 : kurus ? .86 : 1, bahuX = (wanita ? .9 : 1) * (kurus ? .93 : 1);
    this.tua = tua; this.wanita = wanita; this.gemuk = (def.gemuk || tb === 'gemuk') ? 1.22 : 1;
    this.skala = (o.skala ?? 1) * (def.tinggi ?? 1) * (anak ? .62 : tua ? .95 : wanita ? .96 : 1);
    const KULIT = ['#F2C29A', '#E6B088', '#D9A07A', '#F6D3B3', '#C98E66'];
    const kulit = def.kulit || KULIT[this.benih % KULIT.length], baju = def.baju || P.utama, celana = def.celana || campur(P.gelap, '#33415C', .6), sepatu = def.sepatu || '#3A3A48';
    if (tua && !def.warnaRambut) def.warnaRambut = '#D6D2CA';
    if (!def.rambut) def.rambut = wanita ? (tua ? 'konde' : 'panjang') : 'pendek';
    const kerahJenis = def.kerah || 'kaos', lp = def.lengan === 'pendek' || kerahJenis === 'singlet', cp = def.celanaPendek || def.panjangCelana === 'pendek';
    // motif baju/rok (tekstur kanvas): kotak garis batik bunga polkadot
    const petaBaju = def.motif ? teksturMotif(def.motif, baju, def.warnaMotif) : null, petaRok = def.motifRok ? teksturMotif(def.motifRok, def.rok || celana, def.warnaMotifRok) : null;
    const bajuX = petaBaju ? { warna: '#ffffff', peta: petaBaju, unik: true, tepi: campur(baju, P.gelap, .78) } : {};
    const M = (geo, wr, x = {}) => mesh3(geo, Object.assign({ warna: wr }, x));
    const ML = (geo, wr, x = {}) => mesh3(geo, Object.assign({ warna: wr }, x, { tepi: def.garisAnggota ? x.tepi : false }));   // ruas lengan/kaki tanpa garis tepi: tidak tampak seperti boneka kayu bersambung
    const lentur = this.lentur = (def.rig ?? K.rig) !== 'ruas', kulitan = [];   // rig lentur (ber-skin) bawaan sejak 27 Nov 2026
    // --- kerangka
    const akar = this.akar = new THREE.Group();
    const pinggul = this.pinggul = new THREE.Group(); pinggul.position.y = .86; akar.add(pinggul);
    const badan = this.badan = new THREE.Group(); pinggul.add(badan);
    const dada = this.dada = new THREE.Group(); dada.position.y = .3; badan.add(dada);
    const leher = this.leher = new THREE.Group(); leher.position.y = .22; dada.add(leher);
    const kepala = this.kepala = new THREE.Group(); kepala.position.y = .07; leher.add(kepala);
    const kepalaIsi = this.kepalaIsi = new THREE.Group(); kepalaIsi.position.y = R * .95; kepala.add(kepalaIsi);
    // --- badan: profil bubut (lathe) dipipihkan depan-belakang
    const prof = (wanita ? [[.0, -.06], [.16, -.06], [.17, 0], [.148, .14], [.158, .26], [.17, .36], [.152, .46], [.11, .52], [.05, .535], [0, .54]]
                         : [[.0, -.06], [.15, -.06], [.165, 0], [.17, .12], [.178, .26], [.185, .38], [.17, .47], [.12, .52], [.05, .535], [0, .54]]).map(([x, y]) => new THREE.Vector2(x * gemuk * (kurus ? .92 : 1), y));
    const gBadan = geoSimpan(`badan|${gemuk}|${wanita}|${kurus}`, () => { const g = new THREE.LatheGeometry(prof, segQ(28)); if (gemuk > 1.1) perutkan(g); return g; });
    let mBadan;
    if (lentur) {   // badan ber-skin 2 tulang (badan ↔ dada): punggung melengkung saat membungkuk/condong; kapsul bubut asli = bayangan tabrak tak terlihat
      mBadan = this.mBadan = new THREE.Mesh(gBadan, BAHAN_PROKSI); mBadan.scale.z = .74; badan.add(mBadan);
      const tb0 = new THREE.Bone(), tb1 = new THREE.Bone(); badan.add(tb0); dada.add(tb1);
      const gk = geoSimpan(`badanKulit|${gemuk}|${wanita}|${kurus}`, () => kulitTinggi(gBadan.clone(), .2, .38));
      const mk = this.mBadanKulit = kulitMesh(gk, Object.assign({ warna: baju }, bajuX)); mk.scale.z = .74; badan.add(mk); kulitan.push([mk, [tb0, tb1]]);
    } else { mBadan = this.mBadan = M(gBadan, baju, bajuX); mBadan.scale.z = .74; badan.add(mBadan); }
    if (gemuk > 1.1) { const pr = this.mPerut = new THREE.Mesh(geoBola(.17, 16, 12), new THREE.MeshBasicMaterial()); pr.visible = false; pr.position.set(0, .15, .07); pr.scale.set(1, .9, .8); badan.add(pr); }   // perut menyatu di profil badan; bola ini hanya bayangan tabrak lengan
    if (def.jubah) {   // jubah panjang sampai tanah (makhluk, dukun, penyihir): kaki tertutup
      const jp = [[0, .55], [.13, .53], [.24, .4], [.27, .2], [.31, 0], [.37, -.4], [.44, -.84], [0, -.84]].map(([x, y]) => new THREE.Vector2(x * gemuk, y));
      const mj = M(geoSimpan(`jubah|${gemuk}`, () => new THREE.LatheGeometry(jp, segQ(32))), def.jubah); mj.scale.z = .82; badan.add(mj); this.mJubah = mj;
    }
    if (def.rok) { const rk = M(geoSilinder(.17 * gemuk, (def.rokPanjang ? .26 : .3) * gemuk, def.rokPanjang ? .72 : .36, 28), def.rok, petaRok ? { warna: '#ffffff', peta: petaRok, unik: true, tepi: campur(def.rok, P.gelap, .78) } : {}); rk.position.y = def.rokPanjang ? -.34 : -.16; rk.scale.z = .8; badan.add(rk); this.mPinggul = rk; }
    else { const pg = M(geoKotak(.31 * gemuk, .16, .23 * gemuk, .07), celana); pg.position.y = -.04; pinggul.add(pg); this.mPinggul = pg; }
    if (def.sabuk !== false && !def.rok) { const sb = M(geoKotak(.335 * gemuk, .045, .25 * gemuk, .02), campur(celana, P.gelap, .5), { tepi: false }); sb.position.y = .015; pinggul.add(sb); }
    // kerah / pakaian
    const kerah = kerahJenis;
    if (kerah === 'kaos' || kerah === 'singlet') { const k = M(geoTorus(.07, .02, 24), campur(baju, P.gelap, .2), { tepi: false }); k.rotation.x = Math.PI / 2; k.position.y = .51; k.scale.z = .8; badan.add(k); }
    if (kerah === 'kemeja' || kerah === 'jas' || kerah === 'kebaya') {
      const wk = kerah === 'jas' ? (def.warnaKemeja || '#F4F1EA') : (def.warnaKerah || terangkan(baju, .25));
      [-1, 1].forEach(s => { const k = M(geoKotak(.09, .07, .02, .008), wk); k.position.set(s * .045, .5, .115); k.rotation.set(-.35, 0, s * .55); badan.add(k); });
      if (kerah === 'jas') { const dalam = M(geoKotak(.1, .22, .02, .01), wk, { tepi: false }); dalam.position.set(0, .38, .118); badan.add(dalam); }
      if (def.dasi) { const d1 = M(geoKotak(.045, .22, .025, .01), def.dasi); d1.position.set(0, .36, .128); badan.add(d1); }
      if (kerah === 'kebaya') { const bros = M(geoBola(.022, 12, 10), '#E8C040', { logam: .7, kasar: .3, tepi: false }); bros.position.set(0, .4, .134); badan.add(bros); }
      if (kerah === 'kemeja' || kerah === 'kebaya') for (let i = 0; i < 3; i++) { const b = M(geoBola(.012, 10, 8), campur(baju, P.gelap, .45), { tepi: false }); b.position.set(0, .42 - i * .1, .132); badan.add(b); }
    }
    if (kerah === 'hoodie') { const h = M(geoTorus(.1, .045, 24), baju); h.rotation.x = Math.PI / 2 + .4; h.position.set(0, .5, -.06); badan.add(h); const kt = M(geoKotak(.2, .1, .03, .02), campur(baju, P.gelap, .15)); kt.position.set(0, .12, .12); badan.add(kt); }
    if (def.celemek) { const ce = M(geoKotak(.26, .5, .02, .03), def.celemek); ce.position.set(0, .2, .135); badan.add(ce); }
    if (lentur) for (const ch of [...badan.children]) { if ([mBadan, this.mBadanKulit, this.mJubah, this.mPinggul, this.mPerut, dada].includes(ch) || ch.isBone) continue; if (ch.position.y > .33) { badan.remove(ch); ch.position.y -= .3; dada.add(ch); } }   // kerah, kancing atas, dasi ikut dada
    // leher + kepala
    const ml = M(geoSilinder(.064, .07, .12, 18), kulit, { tepi: false }); ml.position.y = .02; leher.add(ml);
    const mk = this.mKepala = M(geoBola(R, 40, 28), kulit); mk.scale.set(1, 1.04, .98); kepalaIsi.add(mk);
    [-1, 1].forEach(s => { const t = M(geoBola(R * .22, 16, 12), kulit); t.position.set(s * R * .97, -R * .06, -R * .04); t.scale.set(.45, .78, .62); kepalaIsi.add(t); });
    const hidung = M(geoBola(R * .13, 16, 12), campur(kulit, '#B5684A', .14), { tepi: false }); hidung.position.set(0, -R * .1, R * .97); hidung.scale.set(1, .82, .78); kepalaIsi.add(hidung);
    // wajah: tudung bola bertekstur (phi ±55°, theta 58°–138°)
    this.kanvasWajah = kanvasBaru(660, 480); this.texWajah = teksturKanvas(this.kanvasWajah); this.kunciWajah = '';
    const gw = new THREE.SphereGeometry(R * 1.006, 48, 32, Math.PI / 2 - 55 * D2R, 110 * D2R, 58 * D2R, 80 * D2R);
    const mw = new THREE.MeshStandardMaterial({ map: this.texWajah, transparent: true, roughness: .55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, envMapIntensity: .4 });
    const wajah = new THREE.Mesh(gw, mw); wajah.renderOrder = 2; wajah.scale.copy(mk.scale); if (def.wajah !== false) kepalaIsi.add(wajah);
    if (def.mataMenyala) [-1, 1].forEach(s => {   // mata menyala (makhluk): bola terang + pendar
      const az = s * 19 * D2R, th = 92 * D2R, n = new THREE.Vector3(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az));
      const b = new THREE.Mesh(geoBola(R * .13, 14, 10), new THREE.MeshBasicMaterial({ color: warna3(def.mataMenyala).clone().multiplyScalar(2.2), toneMapped: false })); b.position.copy(n.clone().multiplyScalar(R * 1.0)); kepalaIsi.add(b);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: teksturPendar(), color: warna3(def.mataMenyala).clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.position.copy(b.position); sp.scale.setScalar(R * 1.1); kepalaIsi.add(sp);
    });
    this.rambut(def, R, M);
    // lengan
    this.lengan = {};
    [['Ki', 1], ['Ka', -1]].forEach(([n, s]) => {
      const bahu = new THREE.Group(); bahu.position.set(s * .182 * gemuk, .165, 0); bahu.rotation.order = 'XZY'; dada.add(bahu);
      const bola = ML(geoBola(.06, 18, 14), kerah === 'singlet' ? kulit : baju, kerah === 'singlet' ? {} : bajuX); bola.scale.set(.95, .9, .9); bahu.add(bola);
      const siku = new THREE.Group(); siku.position.y = -.28; bahu.add(siku);
      if (lentur) {   // satu tabung ber-skin bahu→pergelangan: siku melengkung halus, tanpa sambungan ruas
        const tb0 = new THREE.Bone(), tb1 = new THREE.Bone(); bahu.add(tb0); siku.add(tb1);
        const wl0 = lp ? kulit : baju, lg = kulitMesh(geoAnggota(.52, .28, .054, .05, .046), Object.assign({ warna: wl0, tepi: def.garisAnggota ? undefined : false }, lp ? {} : bajuX));
        bahu.add(lg); kulitan.push([lg, [tb0, tb1]]);
        const isi = M(geoBola(.046, 16, 12), wl0, Object.assign({ tepi: false }, lp ? {} : bajuX)); siku.add(isi);   // pengisi sudut luar siku saat menekuk tajam (tersembunyi saat lurus)
        if (lp && kerah !== 'singlet') { const lgn = M(geoSilinder(.068, .064, .13, 18), baju, bajuX); lgn.position.y = -.06; bahu.add(lgn); }
        if (!lp) { const mn = M(geoSilinder(.052, .052, .04, 16), campur(baju, P.gelap, .2), { tepi: false }); mn.position.y = -.235; siku.add(mn); }
      } else {
        const atas = ML(geoKapsul(.054, .2), lp ? kulit : baju, lp ? {} : bajuX); atas.position.y = -.14; bahu.add(atas);
        if (lp && kerah !== 'singlet') { const lgn = M(geoSilinder(.068, .064, .13, 18), baju, bajuX); lgn.position.y = -.06; bahu.add(lgn); }
        const sendi = M(geoBola(.05, 16, 12), lp ? kulit : baju, lp ? { tepi: false } : Object.assign({ tepi: false }, bajuX)); siku.add(sendi);   // sendi siku bulat: tidak terlihat seperti manekin
        const bawah = ML(geoKapsul(.046, .18), lp ? kulit : baju, lp ? {} : bajuX); bawah.position.y = -.12; siku.add(bawah);
        if (!lp) { const mn = M(geoSilinder(.052, .052, .04, 16), campur(baju, P.gelap, .2), { tepi: false }); mn.position.y = -.235; siku.add(mn); }
      }
      const tangan = new THREE.Group(); tangan.position.y = -.26; tangan.rotation.order = 'XZY'; siku.add(tangan);
      const bentuk = bangunTangan(tangan, s, kulit, ML, M);
      this.lengan[n] = { bahu, siku, tangan, s, bentuk, bahuDasar: bahu.position.clone() };
    });
    // kaki
    this.kaki = {};
    [['Ki', 1], ['Ka', -1]].forEach(([n, s]) => {
      const paha = new THREE.Group(); paha.position.set(s * .095 * gemuk, -.04, 0); paha.rotation.order = 'XZY'; pinggul.add(paha);
      const lutut = new THREE.Group(); lutut.position.y = -.38; paha.add(lutut);
      const wKaki = (cp || def.rok) ? kulit : celana;
      let mp, mb;
      if (lentur) {   // satu tabung ber-skin pinggul→pergelangan kaki; kapsul paha/betis tetap ada sebagai bayangan tabrak tak terlihat
        const tb0 = new THREE.Bone(), tb1 = new THREE.Bone(); paha.add(tb0); lutut.add(tb1);
        const kk = kulitMesh(geoAnggota(.72, .38, .078 * Math.sqrt(gemuk), .066, .062, .06), { warna: wKaki, tepi: def.garisAnggota ? undefined : false });
        paha.add(kk); kulitan.push([kk, [tb0, tb1]]);
        mp = new THREE.Mesh(geoKapsul(.078 * Math.sqrt(gemuk), .24), BAHAN_PROKSI); mp.position.y = -.19; paha.add(mp);
        mb = new THREE.Mesh(geoKapsul(.064, .24), BAHAN_PROKSI); mb.position.y = -.18; lutut.add(mb);
        const sl = M(geoBola(.062, 16, 12), wKaki, { tepi: false }); lutut.add(sl);   // pengisi lutut saat duduk/jongkok
      } else {
        mp = ML(geoKapsul(.078 * Math.sqrt(gemuk), .24), cp ? kulit : (def.rok ? kulit : celana)); mp.position.y = -.19; paha.add(mp);
        const sl = M(geoBola(.068, 16, 12), wKaki, { tepi: false }); lutut.add(sl);   // sendi lutut bulat
        mb = ML(geoKapsul(.064, .24), wKaki); mb.position.y = -.18; lutut.add(mb);
      }
      if (cp && !def.rok) { const cl = M(geoSilinder(.088, .09, .18, 18), celana); cl.position.y = -.08; paha.add(cl); }
      const tumit = new THREE.Group(); tumit.position.y = -.36; lutut.add(tumit);
      const sp = M(geoKotak(.12, .1, .25, .045), sepatu); sp.position.set(0, -.02, .045); tumit.add(sp);
      const sol = M(geoKotak(.125, .025, .26, .01), def.sol || campur(sepatu, '#ffffff', .55), { tepi: false }); sol.position.set(0, -.065, .045); tumit.add(sol);
      this.kaki[n] = { paha, lutut, tumit, s, mPaha: mp, mBetis: mb };
    });
    // pegangan (properti di tangan)
    this.pegangan = { Ka: null, Ki: null };
    // pasang ke dunia
    this.posisiAwal = [(o.posisi || [0, 0, 0])[0], (o.posisi || [0, 0, 0])[1] || 0, (o.posisi || [0, 0, 0])[2] ?? 0];
    if (o.jalan) { const j = o.jalan; this.posisiAwal = [j.dari[0], this.posisiAwal[1], j.dari[1] ?? j.dari[2] ?? 0]; }
    akar.position.set(...this.posisiAwal); akar.scale.setScalar(this.skala);
    if (kulitan.length) { akar.updateMatrixWorld(true); for (const [m, tl] of kulitan) { const sk = new THREE.Skeleton(tl); m.bind(sk, m.matrixWorld); m.children.forEach(c => { if (c.isSkinnedMesh) c.bind(sk, c.matrixWorld); }); } }   // pose istirahat = pose ikat
    (o.naik && o.naik.userData && o.naik.userData.jok ? o.naik.userData.jok : (o.induk || dn._induk())).add(akar);
    if (o.naik) { akar.position.set(0, 0, 0); this.naik = true; }
    if (typeof o.hiasKepala === 'function') { dn._grup.push(this.kepalaIsi); try { o.hiasKepala(dn, this); } finally { dn._grup.pop(); } }   // aksesori sendiri di kepala (koordinat kepala, jari-jari tk.R)
    if (typeof o.hiasBadan === 'function') { dn._grup.push(this.badan); try { o.hiasBadan(dn, this); } finally { dn._grup.pop(); } }
    this.efek = efekEmosi(this, dn);
    this.yawSkr = null;
  }
  /** grup rambut berayun (kuncir, rambut panjang): poros di titik tempel; anak dipindah relatif ke poros */
  ayunGrup(induk, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); induk.add(g); g.tambah = m => { m.position.sub(g.position); g.add(m); }; this.ayun = g; return g; }
  rambut(def, R, M) {
    const jenis = def.rambut || 'pendek', wr = def.warnaRambut || '#2B1B12', K0 = this.kepalaIsi;
    if (jenis === 'botak') return;
    if (jenis === 'jilbab') {
      const wj = def.warnaJilbab || P.kedua;
      const tudung = M(new THREE.SphereGeometry(R * 1.13, 40, 24, Math.PI / 2 + 1.0, Math.PI * 2 - 2.0, 0, Math.PI * .86), wj, { ganda: true }); tudung.scale.set(1, 1.04, 1); K0.add(tudung);
      const dahi = M(new THREE.SphereGeometry(R * 1.13, 24, 8, Math.PI / 2 - 1.06, 2.12, 0, Math.PI * .31), wj, { ganda: true, tepi: false }); dahi.scale.set(1, 1.04, 1); K0.add(dahi);
      const jubah = M(new THREE.CylinderGeometry(R * .86, .235, .3, 32, 1, true), wj, { ganda: true }); jubah.position.y = -R - .07; jubah.scale.z = .78; K0.add(jubah);
      const tepiJ = M(geoTorus(.232, .022, 32), wj, { tepi: false }); tepiJ.rotation.x = Math.PI / 2; tepiJ.position.y = -R - .22; tepiJ.scale.y = .78; K0.add(tepiJ);
      return;
    }
    // tudung rambut: batas depan/samping/belakang (theta maks) mengikuti arah, jadi dahi terbuka dan belakang tertutup
    const batas = { pendek: [.31, .47, .64], poni: [.40, .48, .64], jabrik: [.30, .46, .62], cepak: [.33, .44, .56], panjang: [.31, .5, .66], kuncir: [.30, .47, .63], ikal: [.30, .48, .66], konde: [.29, .46, .62] }[jenis] || [.31, .47, .64];
    const tebal = jenis === 'cepak' ? 1.025 : 1.065;
    const g = new THREE.SphereGeometry(R * tebal, 44, 22, 0, Math.PI * 2, 0, Math.PI * .64), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), r = Math.hypot(x, y, z), th = Math.acos(jepit(y / r, -1, 1)), az = Math.atan2(x, z);
      const k = (1 - Math.cos(az)) / 2, gel = jenis === 'cepak' ? 0 : .022 * Math.max(0, Math.cos(az)) * Math.sin(az * 11 + 1),   // tepi depan bergelombang (helai poni), bukan garis lurus topi renang
        lim = ((k < .5 ? lerp(batas[0], batas[1], k * 2) : lerp(batas[1], batas[2], (k - .5) * 2)) + gel) * Math.PI;
      const th2 = th / (Math.PI * .64) * lim, rr = R * tebal * (1 + (jenis === 'cepak' ? 0 : .04 * Math.cos(th2 * 1.2)));
      pos.setXYZ(i, Math.sin(th2) * Math.sin(az) * rr, Math.cos(th2) * rr * 1.04, Math.sin(th2) * Math.cos(az) * rr);
    }
    g.computeVertexNormals();
    K0.add(M(g, wr));
    if (false) {   // (dinonaktifkan: jumput di dahi terbaca seperti alis tebal; diganti tepi rambut bergelombang di bawah)
      const n = jenis === 'cepak' ? 4 : 6;
      for (let i = 0; i < n; i++) { const az = (i - (n - 1) / 2) * (jenis === 'cepak' ? .32 : .27), th = (.3 + Math.abs(az) * .06) * Math.PI;
        const j = M(geoBola(R * (jenis === 'cepak' ? .14 : .19), 14, 10), wr, { tepi: i === 0 || i === n - 1 ? undefined : false }); j.position.set(Math.sin(th) * Math.sin(az) * R * 1.05, Math.cos(th) * R * 1.09, Math.sin(th) * Math.cos(az) * R * 1.05); j.scale.set(1.25, .6, .7); j.lookAt(j.position.clone().multiplyScalar(2)); K0.add(j); }
      [-1, 1].forEach(s => { const j = M(geoBola(R * .2, 12, 10), wr, { tepi: false }); j.position.set(s * R * .9, R * .32, -R * .08); j.scale.set(.6, .9, 1.1); K0.add(j); });
      for (let i = 0; i < 5; i++) { const az = Math.PI + (i - 2) * .45, th = .22 * Math.PI; const j = M(geoBola(R * .26, 12, 10), wr, { tepi: false }); j.position.set(Math.sin(th) * Math.sin(az) * R * .98, Math.cos(th) * R * 1.08, Math.sin(th) * Math.cos(az) * R * .98); j.scale.set(1, .7, 1); K0.add(j); }
    }
    if (jenis === 'konde') { const b = M(geoBola(R * .4, 20, 14), wr); b.position.set(0, R * .25, -R * 1.02); b.scale.set(1, .85, .8); K0.add(b); const tusuk = M(geoKapsul(R * .035, R * .8, 8), '#C8A040', { tepi: false, logam: .6 }); tusuk.position.set(0, R * .3, -R * 1.1); tusuk.rotation.z = 1.2; K0.add(tusuk); }
    if (jenis === 'poni') for (let i = -2; i <= 2; i++) { const p = M(geoBola(R * .2, 16, 10), wr); const az = i * .26, th = .36 * Math.PI; p.position.set(Math.sin(th) * Math.sin(az) * R * 1.03, Math.cos(th) * R * 1.07, Math.sin(th) * Math.cos(az) * R * 1.03); p.scale.set(1.2, .75, .6); p.lookAt(p.position.clone().multiplyScalar(2)); K0.add(p); }
    if (jenis === 'jabrik') for (let i = 0; i < 9; i++) { const az = (i / 9) * Math.PI * 2 + .2, th = (.12 + (i % 3) * .1) * Math.PI; const c = M(geoKerucut(R * .17, R * .5, 12), wr); const n = new THREE.Vector3(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az)); c.position.copy(n.clone().multiplyScalar(R * 1.1)); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n.add(new THREE.Vector3(0, .6, -.3)).normalize()); K0.add(c); }
    if (jenis === 'panjang') { const AY = this.ayunGrup(K0, 0, -R * .25, 0); const tirai = M(new THREE.CylinderGeometry(R * 1.04, R * 1.18, .46, 36, 1, true, .95, Math.PI * 2 - 1.9), wr, { ganda: true }); tirai.position.y = -R * .9; AY.tambah(tirai); const ujung = M(new THREE.TorusGeometry(R * 1.11, .03, 10, 36, Math.PI * 2 - 1.9), wr); ujung.rotation.set(Math.PI / 2, 0, Math.PI / 2 + .95); ujung.position.y = -R * .9 - .23; AY.tambah(ujung); }
    if (jenis === 'kuncir') { const AY = this.ayunGrup(K0, 0, R * .5, -R * .95); const b = M(geoBola(R * .3, 18, 14), wr); b.position.set(0, R * .5, -R * .95); AY.tambah(b); const ek = M(geoKapsul(R * .2, R * .9, 14), wr); ek.position.set(0, R * .05, -R * 1.2); ek.rotation.x = .35; AY.tambah(ek); const ik = M(geoTorus(R * .14, R * .05, 16), def.warnaIkat || P.kedua, { tepi: false }); ik.position.set(0, R * .48, -R * 1.08); ik.rotation.x = 1.2; AY.tambah(ik); }
    if (jenis === 'ikal') for (let i = 0; i < 20; i++) { const az = acak(i * 3.3 + 1) * Math.PI * 2, th = (.05 + acak(i * 7.1) * .5) * Math.PI; if (Math.cos(az) > .55 && th > .25 * Math.PI) continue; const b = M(geoBola(R * (.2 + acak(i) * .08), 14, 10), wr); b.position.set(Math.sin(th) * Math.sin(az) * R * 1.08, Math.cos(th) * R * 1.1, Math.sin(th) * Math.cos(az) * R * 1.08); K0.add(b); }
    // topi
    const wt = def.warnaTopi || P.kedua;
    if (def.topi === 'pet') { const kp = M(new THREE.SphereGeometry(R * 1.12, 32, 12, 0, Math.PI * 2, 0, Math.PI * .44), wt); kp.position.y = R * .04; K0.add(kp); const pt = M(new THREE.CylinderGeometry(R * .8, R * .8, .022, 32, 1, false, -1.15, 2.3), wt); pt.position.set(0, R * .3, R * .62); pt.rotation.x = .18; K0.add(pt); }
    if (def.topi === 'helm') {   // helm terbuka di depan (wajah tetap terlihat): tudung atas + cangkang samping/belakang + pet kecil
      const atas = M(new THREE.SphereGeometry(R * 1.24, 36, 12, 0, Math.PI * 2, 0, Math.PI * .3), wt); atas.position.y = R * .04; K0.add(atas);
      const sisi = M(new THREE.SphereGeometry(R * 1.24, 36, 14, Math.PI / 2 + 1.05, Math.PI * 2 - 2.1, Math.PI * .3, Math.PI * .32), wt, { ganda: true }); sisi.position.y = R * .04; K0.add(sisi);
      const pet = M(new THREE.CylinderGeometry(R * 1.0, R * 1.05, .03, 28, 1, false, -.9, 1.8), campur(wt, P.gelap, .35)); pet.position.set(0, R * .55, R * .55); pet.rotation.x = .3; K0.add(pet);
      const tali = M(geoTorus(R * .95, R * .03, 24), '#2B2C33', { tepi: false }); tali.rotation.set(Math.PI / 2 + .35, 0, 0); tali.scale.set(1, 1.15, 1); tali.position.set(0, -R * .35, -R * .1); K0.add(tali);
    }
    if (def.topi === 'peci') { const pc = M(geoSilinder(R * .86, R * .95, R * .5, 28), def.warnaTopi || '#1E1E26'); pc.position.y = R * .88; pc.scale.z = .82; pc.rotation.x = -.08; K0.add(pc); }
    if (def.topi === 'caping') { const cp = M(geoKerucut(R * 2.6, R * 1.1, 32), def.warnaTopi || '#D9B26A'); cp.position.y = R * 1.15; K0.add(cp); }
    if (def.topi === 'koki') { const kk = M(geoSilinder(R * .95, R * .9, R * .5, 28), '#FFFFFF'); kk.position.y = R * .95; K0.add(kk); const kb = M(geoBola(R * .8, 20, 14), '#FFFFFF'); kb.position.y = R * 1.4; kb.scale.y = .7; K0.add(kb); }
    if (def.kacamata) { const wk = def.warnaKacamata || '#1E1E26'; [-1, 1].forEach(s => { const az = s * 19 * D2R, th = 92 * D2R, n = new THREE.Vector3(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az)); const r = M(geoTorus(R * .3, R * .035, 24), wk, { tepi: false }); r.position.copy(n.clone().multiplyScalar(R * 1.07)); r.lookAt(r.position.clone().multiplyScalar(2)); K0.add(r); }); const jb = M(geoKapsul(R * .025, R * .14, 8), wk, { tepi: false }); jb.rotation.z = Math.PI / 2; jb.position.set(0, -R * .02, R * 1.05); K0.add(jb); }
    if (def.kumis) { const km = M(geoKapsul(R * .06, R * .3, 10), def.warnaRambut || '#2B1B12', { tepi: false }); km.rotation.z = Math.PI / 2; km.position.set(0, -R * .28, R * .95); K0.add(km); }
  }
  /* --- wajah (kanvas 660×480 = 6 px per derajat; x 0 = phi −55°, y 0 = theta 58°) --- */
  gambarWajah(ex, buka, kedip, lirik) {
    const c = this.kanvasWajah.getContext('2d'), def = this.def, X = d => (d + 55) * 6, Y = th => (th - 58) * 6, kulit = def.kulit || '#F0C29A';
    const tinta = campur(kulit, '#2A130C', .82);
    c.clearRect(0, 0, 660, 480);
    if (def.pipi !== false) [-1, 1].forEach(s => { c.fillStyle = alfa('#FF7B86', .3); c.beginPath(); c.ellipse(X(s * 27), Y(106), 32, 17, 0, 0, 7); c.fill(); });
    const mata = kedip ? 'tutup' : ex.mata || 'normal', [lx, ly] = lirik;
    [-1, 1].forEach(s => {
      const cx = X(s * 19), cy = Y(92);
      if (mata === 'titik' || def.mata === 'titik') { c.fillStyle = tinta; c.beginPath(); c.ellipse(cx + lx * 8, cy + ly * 6, 15, 22, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(cx + lx * 8 - 4, cy + ly * 6 - 8, 5, 0, 7); c.fill(); return; }
      if (mata === 'tutup' || mata === 'senyum') {
        c.strokeStyle = tinta; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath();
        if (mata === 'senyum') c.arc(cx, cy + 14, 30, Math.PI * 1.15, Math.PI * 1.85); else c.arc(cx, cy - 10, 36, Math.PI * .2, Math.PI * .8);
        c.stroke(); return;
      }
      const rx = mata === 'lebar' ? 52 : 45, ry = mata === 'lebar' ? 64 : 57;
      c.save(); c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 7); c.fillStyle = '#FFFFFF'; c.fill(); c.clip();
      const ir = mata === 'lebar' ? 27 : 33, ix = cx + lx * 14, iy = cy + 6 + ly * 12;
      c.fillStyle = def.warnaMata || '#4A2C1A'; c.beginPath(); c.arc(ix, iy, ir, 0, 7); c.fill();
      c.fillStyle = campur(def.warnaMata || '#4A2C1A', '#ffffff', .25); c.beginPath(); c.arc(ix, iy + ir * .35, ir * .62, 0, Math.PI); c.fill();
      c.fillStyle = '#120808'; c.beginPath(); c.arc(ix, iy, ir * .52, 0, 7); c.fill();
      c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(ix - ir * .35, iy - ir * .42, ir * .3, 0, 7); c.fill(); c.beginPath(); c.arc(ix + ir * .38, iy + ir * .3, ir * .13, 0, 7); c.fill();
      if (mata === 'sipit') { c.fillStyle = kulit; c.fillRect(cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * .95); c.fillRect(cx - rx - 4, cy + ry * .62, rx * 2 + 8, ry); }
      c.restore();
      c.strokeStyle = tinta; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath();
      if (mata === 'sipit') { c.moveTo(cx - rx, cy - ry * .05); c.quadraticCurveTo(cx, cy - ry * .2, cx + rx, cy - ry * .05); }
      else c.ellipse(cx, cy, rx, ry, 0, Math.PI * 1.08, Math.PI * 1.92);
      c.stroke();
      if (def.bulu) { c.lineWidth = 5; c.beginPath(); c.moveTo(cx + s * rx * .85, cy - ry * .5); c.lineTo(cx + s * (rx + 14), cy - ry * .75); c.stroke(); }
    });
    // alis
    const al = ex.alis || [0, 0, 0], naik = (al[2] || 0) * .45 * 6;
    [-1, 1].forEach((s, i) => {
      const cx = X(s * 19), cy = Y(76) + naik, dalam = -(al[s > 0 ? 0 : 1] || 0) * 3 * 6;
      c.strokeStyle = def.warnaAlis || campur(def.warnaRambut || '#2B1B12', '#000', .2); c.lineWidth = 18; c.lineCap = 'round';
      c.beginPath(); c.moveTo(cx - s * 40, cy + dalam); c.quadraticCurveTo(cx, cy - 9 + dalam * .45, cx + s * 40, cy + 2); c.stroke();
    });
    if (this.tua) { c.strokeStyle = alfa(tinta, .45); c.lineWidth = 5; [-1, 1].forEach(s => { c.beginPath(); c.arc(X(s * 19), Y(92) + 36, 34, Math.PI * .2, Math.PI * .8); c.stroke(); c.beginPath(); c.moveTo(X(s * 33), Y(100)); c.lineTo(X(s * 36), Y(108)); c.stroke(); }); c.beginPath(); c.moveTo(X(-10), Y(64)); c.quadraticCurveTo(X(0), Y(62), X(10), Y(64)); c.stroke(); }
    // mulut
    const mx = X(0), my = Y(117), m = ex.mulut || 'datar';
    c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = tinta; c.lineWidth = 8;
    const terbuka = (lebar, tinggi, atasDatar) => {
      c.beginPath(); if (atasDatar) { c.moveTo(mx - lebar, my - 6); c.quadraticCurveTo(mx, my - 14, mx + lebar, my - 6); c.quadraticCurveTo(mx + lebar * .8, my + tinggi, mx, my + tinggi); c.quadraticCurveTo(mx - lebar * .8, my + tinggi, mx - lebar, my - 6); }
      else c.ellipse(mx, my + tinggi * .3, lebar, tinggi * .65 + 4, 0, 0, 7);
      c.closePath(); c.fillStyle = '#5A1C22'; c.fill();
      c.save(); c.clip();
      if (tinggi > 18) { c.fillStyle = '#FFFFFF'; c.fillRect(mx - lebar, my - 20, lebar * 2, Math.min(16, tinggi * .3) + 6); }
      c.fillStyle = '#E2646C'; c.beginPath(); c.ellipse(mx, my + tinggi * .95, lebar * .6, tinggi * .45, 0, 0, 7); c.fill(); c.restore();
      c.stroke();
    };
    if (buka > .06) {
      const t = 8 + buka * 46;
      if (m === 'O' || m === 'gigi' || m === 'sedih' || m === 'marah') terbuka(20 + buka * 12, t * 1.05, false); else terbuka(38 + buka * 10, t, true);
    } else if (m === 'datar') { c.beginPath(); c.moveTo(mx - 34, my); c.quadraticCurveTo(mx, my + 5, mx + 34, my); c.stroke(); }
    else if (m === 'senyum') { c.beginPath(); c.moveTo(mx - 42, my - 8); c.quadraticCurveTo(mx, my + 30, mx + 42, my - 8); c.stroke(); }
    else if (m === 'lebar') terbuka(48, 44, true);
    else if (m === 'O') terbuka(20, 34, false);
    else if (m === 'sedih') { c.beginPath(); c.moveTo(mx - 36, my + 14); c.quadraticCurveTo(mx, my - 14, mx + 36, my + 14); c.stroke(); }
    else if (m === 'marah') { c.beginPath(); c.moveTo(mx - 38, my + 10); c.lineTo(mx - 12, my); c.lineTo(mx + 12, my); c.lineTo(mx + 38, my + 10); c.stroke(); }
    else if (m === 'miring') { c.beginPath(); c.moveTo(mx - 34, my + 8); c.quadraticCurveTo(mx + 4, my + 2, mx + 34, my - 10); c.stroke(); }
    else if (m === 'seringai') { c.beginPath(); c.moveTo(mx - 36, my + 2); c.quadraticCurveTo(mx + 10, my + 16, mx + 40, my - 14); c.stroke(); }
    else if (m === 'gigi') { c.beginPath(); c.roundRect ? c.roundRect(mx - 42, my - 14, 84, 32, 10) : c.rect(mx - 42, my - 14, 84, 32); c.fillStyle = '#FFFFFF'; c.fill(); c.stroke(); c.lineWidth = 4; c.beginPath(); c.moveTo(mx - 42, my + 2); c.lineTo(mx + 42, my + 2); for (let i = -2; i <= 2; i++) { c.moveTo(mx + i * 16, my - 14); c.lineTo(mx + i * 16, my + 18); } c.stroke(); }
    else { c.beginPath(); c.moveTo(mx - 30, my); c.lineTo(mx + 30, my); c.stroke(); }
    this.texWajah.needsUpdate = true;
  }
  /* --- titik dunia --- */
  titik(bag) {
    const v = new THREE.Vector3();
    const di = (obj, x = 0, y = 0, z = 0) => { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); return [v.x, v.y, v.z]; };
    if (bag === 'kepala') return di(this.kepalaIsi);
    if (bag === 'mulut') return di(this.kepalaIsi, 0, -this.R * .42, this.R * .95);
    if (bag === 'atas') return di(this.kepalaIsi, 0, this.R * 1.5, 0);
    if (bag === 'tanganKa' || bag === 'tangan') return di(this.lengan.Ka.tangan, 0, -.06, 0);
    if (bag === 'tanganKi') return di(this.lengan.Ki.tangan, 0, -.06, 0);
    if (bag === 'kaki') return di(this.akar);
    return di(this.pinggul);
  }
  sudutKe(ref, T) {   // yaw (derajat) dari akar tokoh ke rujukan
    const p = this.akar.getWorldPosition(new THREE.Vector3());
    let q;
    if (ref === 'kamera') q = this.dn.kamera.position;
    else if (ref === 'kameraAwal') q = this.dn.kameraAwal;
    else { const x = this.dn.titik(ref); q = new THREE.Vector3(x[0], x[1], x[2]); }
    if (!q) return 0;
    return Math.atan2(q.x - p.x, q.z - p.z) / D2R;
  }
  /* --- per bingkai --- */
  /** reaksi: [[t, 'kaget'], [t, { ekspresi, pose, lalu, tahan }], …] → kunci ekspresi/pose yang DITUNDA ±0,35 dtk sesudah kejadian (acuan:
      wajah berubah 0,3–0,6 dtk sesudah aksi); 'lalu' = reaksi tahap kedua sesudah `tahan` dtk (bawaan 1,4). Digabung sekali ke o.pose/o.ekspresi. */
  _gabungReaksi() {
    if (this._reaksiSiap) return; this._reaksiSiap = true;
    const o = this.o, a = this.a, rk = o.reaksi; if (!rk) return;
    const tunda = o.tundaReaksi ?? .35, daftar = Array.isArray(rk[0]) ? rk : [rk];
    const keDaftar = v => v === undefined ? null : (Array.isArray(v) && Array.isArray(v[0]) ? v.map(e => [wl(e[0], a) ?? 0, e[1]]) : [[0, v]]);
    const ps = keDaftar(o.pose) || [[0, 'berdiri']], es = keDaftar(o.ekspresi) || [[0, 'senang']];
    for (const [tr, isi] of daftar) {
      const t0 = (wl(tr, a) ?? 0) + tunda, sp = typeof isi === 'string' ? { ekspresi: EKSPRESI[isi] ? isi : null, pose: POSE3D[isi] ? isi : null } : isi;
      if (sp.ekspresi) es.push([t0 - .05, sp.ekspresi]);   // wajah sedikit lebih dulu dari badan
      if (sp.pose) ps.push([t0, sp.pose]);
      if (sp.lalu) { const t1 = t0 + (sp.tahan ?? 1.4), l = typeof sp.lalu === 'string' ? { ekspresi: sp.lalu } : sp.lalu; if (l.ekspresi) es.push([t1, l.ekspresi]); if (l.pose) ps.push([t1, l.pose]); }
    }
    ps.sort((x, y) => x[0] - y[0]); es.sort((x, y) => x[0] - y[0]); o.pose = ps; o.ekspresi = es;
  }
  /** kedip berjeda acak berbenih 2–6 dtk (16 % kedip ganda), durasi 0,12 dtk; jadwal dibuat berurutan dari 0 → sama di urutan seek mana pun */
  kedipDi(T) {
    const bn = this.benih, j = this._jadwalKedip || (this._jadwalKedip = [acak(bn * 3.1) * 3]);
    while (j[j.length - 1] < T + 1) { const n = j.length; j.push(j[n - 1] + 2 + 4 * acak(bn * 13.7 + n * 7.3)); if (acak(bn * 5.3 + n * 1.9) < .16) j.push(j[j.length - 1] + .24); }
    for (let i = j.length - 1; i >= 0 && j[i] > T - .3; i--) if (T >= j[i] && T - j[i] < .12) return true;
    return false;
  }
  /** kontrapposto: berat badan pindah kaki tiap 4–7 dtk (peralihan 0,7 dtk); +1 = di kaki Ki */
  beratDi(T) {
    const bn = this.benih; let t0 = 0, i = 0, sisi = acak(bn * 2.7) < .5 ? -1 : 1, lalu = sisi;
    while (i < 400) { const L = 4 + 3 * acak(bn * 7.1 + i * 3.3); if (t0 + L > T) break; t0 += L; lalu = sisi; sisi = -sisi; i++; }
    if (!i) return sisi; const u = jepit((T - t0) / .7); return lerp(lalu, sisi, u * u * (3 - 2 * u));
  }
  perbarui(t, T) {
    const o = this.o, a = this.a, def = this.def, bn = this.benih, lama = !!(K.gerakLama || o.gerakLama);
    this._gabungReaksi();
    // muncul / hilang
    let k = 1; const mu = wl(o.muncul, a), hi = wl(o.hilang, a);
    if (mu !== undefined) k = t < mu ? 0 : E.outBack(jepit((t - mu) / .45));
    if (hi !== undefined && t >= hi) k *= Math.max(0, 1 - E.inBack(jepit((t - hi) / .35)));
    this.akar.visible = k > 1e-3; if (!this.akar.visible) return;
    // pose: antisipasi → aksi → lewat sasaran + mengendap, sendi bertumpuk (gerak hidup); mode lama: 0,42 dtk + outBack
    const tiba = o.poseTiba ?? K.poseTiba ?? false;
    let pv, p, regang = 0, aksi = false;
    if (lama) { pv = nilaiDi(o.pose || 'berdiri', t, a, .42); p = campurPose3D(pose3D(pv.a), pv.b ? pose3D(pv.b) : null, pv.b ? E.outBack(pv.k) * .9 + pv.k * .1 : 1); pv.dt = pv.b ? .42 * pv.k : 99; }
    else {
      pv = poseBerwaktu(o.pose || 'berdiri', t, a, tiba); aksi = !!pv.b && POSE_AKSI.has(pv.a) && o.antisipasi !== false;
      p = pv.b ? campurPoseHidup(pose3D(pv.a), pose3D(pv.b), pv.dt, aksi) : pose3D(pv.a);
      regang = regangTransisi(pv.dt, aksi) * (pose3D(pv.a).loncat ? .3 : 1);   // pose berlompat (hore, kaget): lompatannya sendiri yang memanjang, kepala tidak naik dua kali
    }
    p = JSON.parse(JSON.stringify(p));
    const lKi = (p.lKi || [3, 9, 15, 12]).slice(), lKa = (p.lKa || [3, 9, 15, 12]).slice();
    const kKi = (p.kKi || [0, 3, 2]).slice(), kKa = (p.kKa || [0, 3, 2]).slice();
    const badan = (p.badan || [0, 0, 0]).slice(), kepala = (p.kepala || [0, 0, 0]).slice();
    // jalan / lari
    let x = this.posisiAwal[0], y = this.posisiAwal[1], z = this.posisiAwal[2], yaw = null, fase = 0, langkah = 0, bob = 0;
    const j = o.jalan;
    if (j) {
      const mulai = wl(j.mulai, a) ?? 0, lamaJ = j.lama ?? 1.6, kj = jepit((t - mulai) / lamaJ), e = (j.ease ? fe(j.ease) : E.inOutSine)(kj);
      const titik = [[j.dari[0], 0, j.dari[1] ?? j.dari[2]], ...(j.lewat || []).map(q => [q[0], 0, q[1] ?? q[2]]), [j.ke[0], 0, j.ke[1] ?? j.ke[2]]];
      let arah;
      if (titik.length > 2) { const q = titikJalur(titik, e); x = q.p[0]; z = q.p[2]; arah = q.d; }
      else { x = lerp(titik[0][0], titik[1][0], e); z = lerp(titik[0][2], titik[1][2], e); arah = [titik[1][0] - titik[0][0], 0, titik[1][2] - titik[0][2]]; }
      const panjang = titik.reduce((s, q, i) => s + (i ? Math.hypot(q[0] - titik[i - 1][0], q[2] - titik[i - 1][2]) : 0), 0);
      if (kj > 0 && kj < 1) { langkah = j.lari ? 1.6 : 1; fase = panjang * e / ((j.lari ? 1.7 : 1.15) * this.skala) * Math.PI * 2; }
      if (kj > 0 && kj < 1 || (o.hadap === undefined && kj >= 1)) yaw = Math.atan2(arah[0], arah[2]) / D2R;
      if (kj >= 1 && o.hadap === undefined && j.akhirHadap !== undefined) yaw = j.akhirHadap === 'kamera' ? this.sudutKe('kameraAwal') : j.akhirHadap;
      langkah *= Math.min(1, kj * lamaJ / .25, (1 - kj) * lamaJ / .25);   // masuk/keluar langkah halus
    }
    if (o.anim) { const v = kunci3(t, o.anim, a); if (v && v.posisi) { x = v.posisi[0]; y = v.posisi[1] ?? y; z = v.posisi[2] ?? z; } }
    if (!this.naik) this.akar.position.set(x, y, z);   // posisi akar bingkai INI dulu → sudutKe (hadap ke tokoh/kamera) tidak memakai posisi lama
    if (yaw === null) {
      const hv = o.hadap === undefined ? 'kameraAwal' : o.hadap;
      if (Array.isArray(hv)) { const q = nilaiDi(hv, t, a, .5); const ya = typeof q.a === 'number' ? q.a : this.sudutKe(q.a), yb = q.b === null ? ya : (typeof q.b === 'number' ? q.b : this.sudutKe(q.b)); let dd = ((ya - yb + 540) % 360) - 180; yaw = yb + dd * q.k; }
      else { yaw = typeof hv === 'number' ? hv : this.sudutKe(hv);
        if (typeof hv === 'string' && this.dn.para[hv] && o.cheat !== false) { const yk = this.sudutKe('kameraAwal'), dd = ((yk - yaw + 540) % 360) - 180; yaw += jepit(dd, -60, 60) * .3; } }   // 'cheat' ke kamera (gaya film): lawan bicara tetap terlihat 3/4
    }
    if (this.naik) { x = 0; y = 0; z = 0; yaw = o.hadap ?? 0; }
    // penanda pose
    if (p.goyang) { lKa[3] += Math.sin(T * 11) * 22; lKa[1] += Math.sin(T * 11) * 6; }
    if (p.goyangKi) { lKi[3] += Math.sin(T * 11 + 1) * 22; lKi[1] += Math.sin(T * 11 + 1) * 6; }
    if (p.kibas) { lKa[3] += Math.sin(T * 14) * 25; lKa[2] += Math.sin(T * 14) * 10; }
    if (p.aduk) { lKa[0] += Math.sin(T * 5) * 10; lKa[1] += Math.cos(T * 5) * 8; lKi[0] += Math.sin(T * 5) * 8; lKi[1] += Math.cos(T * 5) * 6; }
    if (p.isak) { const s = Math.abs(Math.sin(T * 9)); badan[0] += s * 3; kepala[0] += s * 4; }
    if (p.gores) { lKa[3] += Math.sin(T * 8.5) * 9 + Math.sin(T * 3.1) * 6; lKa[2] += Math.sin(T * 6.3) * 6; }
    if (p.ketik) { lKa[3] += Math.max(0, Math.sin(T * 17)) * 8; lKi[3] += Math.max(0, Math.sin(T * 15 + 1)) * 8; }
    if (p.tepuk) { const c = Math.abs(Math.sin(T * 7)); lKa[2] += c * 20; lKi[2] += c * 20; }
    if (p.joget) { const s = Math.sin(T * 6.5); lKa[0] += s * 40; lKi[0] -= s * 40; lKa[3] += s * 30; lKi[3] -= s * 30; badan[1] += s * 6; kepala[1] -= s * 6; bob += Math.abs(Math.sin(T * 6.5)) * .05; }
    const gem = p.gemetar ? Math.sin(T * 41) * .006 * p.gemetar : 0;
    let loncat = 0;
    if (p.loncat) {
      if (p.loncat >= .9 || lama) { const h = Math.abs(Math.sin(T * 6)); loncat = h * .14 * p.loncat; if (!lama) regang += h < .22 ? -.05 * (1 - h / .22) : 0; }   // lompat berulang (hore): mampat saat menapak (tanpa memanjang: kepala tidak lebih tinggi dari dulu)
      else { const u = (pv.dt - (aksi ? T_ANT : 0)) / .4; if (u > 0 && u < 1) { loncat = Math.sin(Math.PI * u) * .22 * p.loncat; regang += .05 * Math.sin(Math.PI * u); } else if (u >= 1 && u < 1.5) regang -= .07 * Math.sin(Math.PI * (u - 1) / .5); }   // kaget: SATU lompatan + mampat saat mendarat (dulu memantul terus)
    }
    // jalan: kaki + lengan berayun
    if (langkah > 0) {
      const sw = Math.sin(fase), amp = j.lari ? 38 : 24;
      if (!p.depan) { lKi[0] = lerp(lKi[0], -sw * amp * .9, langkah); lKa[0] = lerp(lKa[0], sw * amp * .9, langkah); lKi[3] = lerp(lKi[3], j.lari ? 80 : 16 + Math.max(0, -sw) * 18, langkah); lKa[3] = lerp(lKa[3], j.lari ? 80 : 16 + Math.max(0, sw) * 18, langkah); }
      kKi[0] = lerp(kKi[0], sw * amp, langkah); kKa[0] = lerp(kKa[0], -sw * amp, langkah);
      kKi[2] = lerp(kKi[2], 6 + Math.max(0, Math.cos(fase)) * (j.lari ? 75 : 42), langkah); kKa[2] = lerp(kKa[2], 6 + Math.max(0, -Math.cos(fase)) * (j.lari ? 75 : 42), langkah);
      bob += Math.abs(Math.cos(fase)) * (j.lari ? .05 : .028) * langkah; badan[2] += Math.sin(fase) * 6 * langkah; badan[0] += (j.lari ? 8 : 2) * langkah;
      if (!lama) regang -= Math.max(0, 1 - Math.abs(Math.cos(fase)) * 4) * .02 * langkah;   // sedikit mampat saat telapak menapak
    }
    if (this.gemuk > 1.1) { lKi[1] += 7; lKa[1] += 7; }   // gemuk: lengan menggantung di sisi perut, bukan menembusnya
    if (this.tua && !p.duduk && !p.rebah) { badan[0] += 6; kepala[0] -= 6; kKi[2] += 8; kKa[2] += 8; kKi[0] += 4; kKa[0] += 4; }   // tua: sedikit bungkuk, lutut sedikit tertekuk
    if (!p.membungkuk && badan[0] > 20 && !['membungkuk', 'ambil'].includes(pv.a)) badan[0] = 20 + (badan[0] - 20) * .3;   // condong berlebihan (pose sedih + tua) dibatasi
    const hidup = o.hidup !== false;
    // kontrapposto: berat di satu kaki, panggul miring, kaki bebas menekuk, bahu miring berlawanan; lutut tidak pernah terkunci lurus
    const berdiri = !lama && hidup && !p.duduk && !p.rebah && !p.kKi && !p.kKa && !p.loncat && langkah === 0 && !this.naik && o.kontrapposto !== false;
    let berat = 0;
    if (berdiri) {
      berat = this.beratDi(T); const tilt = berat * 3.2;
      kKi[2] += 3 + Math.max(0, -berat) * 11; kKa[2] += 3 + Math.max(0, berat) * 11; kKi[0] += Math.max(0, -berat) * 5; kKa[0] += Math.max(0, berat) * 5;
      kKi[1] -= tilt; kKa[1] += tilt; badan[1] -= tilt * 1.6;
    }
    // akting otomatis: napas, berat badan berpindah, kepala hidup, mata melirik
    const napas = Math.sin(T * Math.PI * 2 * .3 + bn);
    if (hidup) {
      badan[1] += derau(T * .45 + bn) * 2.2; badan[2] += derau(T * .3 + bn + 4) * 3;
      kepala[0] += derau(T * .6 + bn + 2) * 3; kepala[1] += derau(T * .5 + bn + 7) * 2.5; kepala[2] += derau(T * .4 + bn + 11) * 5;
      lKi[1] += napas * 1.5; lKa[1] += napas * 1.5; lKi[3] += derau(T * .7 + bn) * 4; lKa[3] += derau(T * .65 + bn + 3) * 4;
    }
    // bicara: angguk per kata + gestur tangan bergantian (pose bertanda gestur, sesudah pose mengendap)
    const buka = bukaMulut3(o, a, T);
    const bic = sedangBicara3(o, a, T);
    if (bic && hidup) {
      const kt = KATA.find(q => T >= q[0] && T < q[1]);
      if (kt) kepala[0] += Math.sin(jepit((T - kt[0]) / Math.max(.08, kt[1] - kt[0])) * Math.PI) * 4;
      const gname = (!pv.b || pv.dt > .6) ? pv.a : null;
      if (o.gestur !== false && gname && GESTUR_POSE.has(gname)) {
        const ka = (derau(T * .8 + bn) + 1) / 2, ki = (derau(T * .7 + bn + 20) + 1) / 2, duduk = !!p.duduk;
        lKa[0] += ka * (duduk ? 25 : 34); lKa[3] += ka * 50; lKa[2] += ka * 4 - Math.max(0, lKa[2] - 18) * ka * .6; lKa[1] += ka * 10;   // lengan bawah ke depan-luar (menjelaskan), tidak melipat ke dada
        lKi[0] += ki * ki * (duduk ? 18 : 26); lKi[3] += ki * ki * 42; lKi[2] += ki * 3 - Math.max(0, lKi[2] - 18) * ki * .6; lKi[1] += ki * 8;
        badan[0] += ka * 3; badan[2] += (ka - ki) * 6;
      }
    }
    // lihat: MATA lebih dulu ke sasaran, kepala menyusul (jeda 0,06 dtk + pegas), badan ikut 25 %; kedip saat menoleh > 30°
    let lirLihat = null, kedipToleh = false;
    if (o.lihat) {
      const lv = nilaiBerwaktu(o.lihat, t, a), ph = this.titik('kepala');
      const arahKe = s => { if (!s) return [0, 0]; const q = s === 'kamera' ? this.dn.kamera.position.toArray() : this.dn.titik(s); const dist = Math.hypot(q[0] - ph[0], q[2] - ph[2]); return [((Math.atan2(q[0] - ph[0], q[2] - ph[2]) / D2R - yaw + 540) % 360) - 180, -Math.atan2(q[1] - ph[1], dist) / D2R]; };
      const A1 = arahKe(lv.a), B1 = lv.dt < 1.6 ? arahKe(lv.b) : A1;
      const kh = lama ? E.inOutCubic(jepit(lv.dt / .45)) : pegasT(lv.dt - .06, .8, 4.2 / .34);
      const dyR = lerp(B1[0], A1[0], kh), dpR = lerp(B1[1], A1[1], kh), dy = jepit(dyR, -60, 60), dp = jepit(dpR, -30, 30);
      kepala[2] += dy; kepala[0] += dp; badan[2] += dy * .25;
      if (!lama && lv.a) { const sisaY = (A1[0] - dyR) + (jepit(A1[0], -95, 95) - jepit(A1[0], -60, 60)), sisaP = A1[1] - dpR; lirLihat = [jepit(sisaY / 30, -1, 1) * .95, jepit(sisaP / 25, -1, 1) * .6]; }
      if (!lama && lv.dt < .12 && Math.abs(A1[0] - B1[0]) > 30) kedipToleh = true;
    }
    if (!p.membungkuk && !['membungkuk', 'ambil', 'tidur'].includes(pv.a)) { kepala[0] = jepit(kepala[0], -34, 36); kepala[2] = jepit(kepala[2], -70, 70); }   // leher wajar: pose menunduk + lihat ke tokoh pendek dulu menekuk kepala ±52° (seperti patah)
    // pasang ke sendi
    const sk = this.skala * k;
    if (this.yawSkr === null) this.yawSkr = yaw;
    this.akar.position.set(x + gem, y, z); this.akar.rotation.set(0, yaw * D2R, 0); this.akar.scale.setScalar(Math.max(1e-4, sk));
    const turun = p.turun || 0;
    if (this.naik) this.akar.position.y = sk * (.1 - (.86 - turun));   // pinggul 10 cm di atas jok (jok = permukaan dudukan)
    this.pinggul.position.set(derau(T * .45 + bn + 9) * .012 * (hidup ? 1 : 0) + berat * .022, .86 - turun + bob + loncat, 0);
    this.pinggul.rotation.set(0, !lama && langkah > 0 ? -Math.sin(fase) * 4 * langkah * D2R : 0, berat * 3.2 * D2R);   // panggul: putar berlawanan bahu saat jalan, miring saat kontrapposto
    if (p.rebah) { this.akar.rotation.set(-Math.PI / 2, yaw * D2R, 0, 'YXZ'); this.akar.position.y = y + .16; }
    if (this.lentur && !lama) {   // tulang belakang: tekuk dibagi badan 55 % + dada 45 % → punggung melengkung (badan ber-skin)
      this.badan.rotation.set(badan[0] * .55 * D2R, badan[2] * .55 * D2R, badan[1] * .55 * D2R); this.dada.rotation.set(badan[0] * .45 * D2R, badan[2] * .45 * D2R, badan[1] * .45 * D2R);
    } else { this.badan.rotation.set(badan[0] * D2R, badan[2] * D2R, badan[1] * D2R); this.dada.rotation.set(0, 0, 0); }
    const sy = lama ? 1 : 1 + jepit(regang, -.1, .1), sxz = 1 / Math.sqrt(sy); this.badan.scale.set(sxz, sy, sxz);   // squash & stretch (volume tetap)
    this.dada.scale.set(1 + napas * .012, 1 + napas * .018, 1 + napas * .02);
    this.dada.position.y = .3 + (p.bahu && lama ? .03 : 0);
    if (!lama) { this.leher.rotation.set(kepala[0] * .35 * D2R, kepala[2] * .35 * D2R, kepala[1] * .35 * D2R, 'YXZ'); this.kepala.rotation.set(kepala[0] * .65 * D2R, kepala[2] * .65 * D2R, kepala[1] * .65 * D2R, 'YXZ'); }   // leher ikut menoleh 35 %
    else { this.leher.rotation.set(0, 0, 0); this.kepala.rotation.set(kepala[0] * D2R, kepala[2] * D2R, kepala[1] * D2R, 'YXZ'); }
    const lg = (L, v) => { const s = L.s; L.bahu.rotation.set(-v[0] * D2R, -s * (v[2] || 0) * D2R, s * v[1] * D2R, 'XZY'); L.siku.rotation.set(-(v[3] || 0) * D2R, 0, 0);
      if (!lama && L.bahuDasar) { const naik = jepit((Math.max(v[0], v[1] * 1.05) - 70) / 100), angkat = p.bahu ? 1 : 0; L.bahu.position.copy(L.bahuDasar); L.bahu.position.y += .035 * naik + .03 * angkat; L.bahu.position.x -= s * .012 * naik; } };   // klavikula: bahu naik saat lengan > 70°
    lg(this.lengan.Ki, lKi); lg(this.lengan.Ka, lKa);
    const kk = (L, v) => { const s = L.s; L.paha.rotation.set(-v[0] * D2R, 0, s * (v[1] || 0) * D2R, 'XZY'); L.lutut.rotation.set((v[2] || 0) * D2R, 0, 0); L.tumit.rotation.set((v[0] - (v[2] || 0)) * D2R * (p.duduk ? 1 : .6), 0, 0); };
    kk(this.kaki.Ki, kKi); kk(this.kaki.Ka, kKa);
    this.sudut = { lKi, lKa, p, yDasar: y };   // untuk anti-tembus (06-tabrak.js)
    // pergelangan + bentuk tangan: pergelangan menekuk per pose dan TERTINGGAL saat lengan berayun (kecepatan dari pose 0,05 dtk sebelumnya)
    if (!lama) {
      const pv2 = poseBerwaktu(o.pose || 'berdiri', t - .05, a, tiba), aksi2 = !!pv2.b && POSE_AKSI.has(pv2.a) && o.antisipasi !== false, p2 = pv2.b ? campurPoseHidup(pose3D(pv2.a), pose3D(pv2.b), pv2.dt, aksi2) : pose3D(pv2.a);
      const kS = pv.b ? kurvaGerak(pv.dt - GRUP_GERAK.siku.jeda, GRUP_GERAK.siku, aksi) : 1, namaPose = kS > .5 || !pv.b ? pv.a : pv.b;
      const tv = o.tangan, tq = Array.isArray(tv) && Array.isArray(tv[0]) ? nilaiBerwaktu(tv, t, a).a : tv;
      ['Ki', 'Ka'].forEach((n, i) => {
        const L = this.lengan[n], s = L.s, v = n === 'Ki' ? lKi : lKa, d0 = (p2[n === 'Ki' ? 'lKi' : 'lKa'] || [3, 9, 15, 12]), d1 = (p[n === 'Ki' ? 'lKi' : 'lKa'] || [3, 9, 15, 12]);
        let vM = (d1[0] - d0[0]) / .05, vT = (d1[3] - d0[3]) / .05;
        if (n === 'Ka' && p.goyang) vT += 22 * 11 * Math.cos(T * 11); if (n === 'Ki' && p.goyangKi) vT += 22 * 11 * Math.cos(T * 11 + 1); if (n === 'Ka' && p.kibas) vT += 25 * 14 * Math.cos(T * 14);
        if (langkah > 0) vM += (n === 'Ki' ? -1 : 1) * Math.cos(fase) * (j.lari ? 38 : 24) * .9 * 6 * langkah;
        const pgA = (PERGELANGAN[pv.a] || [0, 0])[i], pgB = pv.b ? (PERGELANGAN[pv.b] || [0, 0])[i] : pgA, fleksi = lerp(pgB, pgA, jepit(kS));
        L.tangan.rotation.set(jepit((vM + vT * .7) * .045, -26, 26) * D2R, 0, -s * fleksi * D2R);
        let bt = (TANGAN_POSE[namaPose] || [])[i] || 'santai';
        if (o[n === 'Ka' ? 'pegang' : 'pegangKiri']) bt = 'genggam';
        if (tq) bt = typeof tq === 'string' ? tq : (tq[n === 'Ka' ? 'ka' : 'ki'] || bt);
        if (L.bentuk) for (const nm in L.bentuk) L.bentuk[nm].visible = nm === (L.bentuk[bt] ? bt : 'santai');
      });
    }
    // pegangan
    ['Ka', 'Ki'].forEach(sisi => {
      const v = o[sisi === 'Ka' ? 'pegang' : 'pegangKiri'], q = Array.isArray(v) && Array.isArray(v[0]) ? nilaiDi(v, t, a, .01).a : v;
      const P0 = this.pegangan[sisi];
      if (!P0 || P0.jenis !== q) { if (P0 && P0.obj) this.lengan[sisi].tangan.remove(P0.obj); const obj = q ? bendaPegang(q, this.dn, this) : null; if (obj) this.lengan[sisi].tangan.add(obj); this.pegangan[sisi] = { jenis: q, obj }; }
      const ob = this.pegangan[sisi].obj; if (ob && ob.userData.gerak) ob.userData.gerak(t, T);
    });
    // anti-tembus: kaki menapak lantai/permukaan pijak, lalu lengan + tangan + properti didorong keluar dari badan, kepala, paha, tokoh lain, dan benda padat
    if (o.padat !== false) this.tapakKaki();
    if (o.raih || o.tunjukKe) this.raihSasaran(t);   // tangan ke sasaran (IK), sebelum anti-tembus
    if (o.padat !== false) this.lenganTakTembus();
    // rambut/kuncir berayun: impuls dari perpindahan pose (kepala + badan), langkah, dan derau halus — fungsi waktu murni
    if (this.ayun && !lama) {
      let ax = 0, az = 0;
      if (pv.b) { const pa = pose3D(pv.a), pb = pose3D(pv.b), dk = i => ((pa.kepala || [0, 0, 0])[i] - (pb.kepala || [0, 0, 0])[i]) + .6 * ((pa.badan || [0, 0, 0])[i] - (pb.badan || [0, 0, 0])[i]), imp = impulsPegas(pv.dt - .06, .28, 1.5); ax -= dk(0) * imp * .9; az -= dk(1) * imp * .9; }
      if (loncat) ax += loncat * 60;
      if (langkah > 0) { ax += Math.abs(Math.sin(fase)) * 6 * langkah; az += Math.sin(fase) * 5 * langkah; }
      ax += derau(T * .7 + bn) * 2 - kepala[0] * .25; az += derau(T * .6 + bn + 4) * 2.5 - kepala[1] * .3;
      this.ayun.rotation.set(jepit(ax, -35, 35) * D2R, 0, jepit(az, -30, 30) * D2R);
    }
    // wajah
    const ev = nilaiDi(o.ekspresi || 'senang', t, a, .3), ea = EKSPRESI[ev.a] || EKSPRESI.senang, eb = ev.b ? EKSPRESI[ev.b] : null;
    const ex = eb ? { alis: ea.alis.map((v, i) => lerp(eb.alis[i], v, ev.k)), mata: ev.k > .5 ? ea.mata : eb.mata, mulut: ev.k > .5 ? ea.mulut : eb.mulut } : ea;
    let kedip;
    if (lama) { const per = 3.1 + (bn % 7) * .27, fk = ((T + bn * .37) % per + per) % per; kedip = o.kedip !== false && fk < .13; }
    else kedip = o.kedip !== false && (this.kedipDi(T) || kedipToleh || (ev.b && eb && ev.k < .35 && ea.mata !== eb.mata));   // kedip juga saat ekspresi berganti bentuk mata
    let lir = o.lirik || [derau(T * .5 + bn) * .35 + (Math.floor(T * .7 + bn) % 3 - 1) * .15, derau(T * .4 + bn + 5) * .2];
    if (lirLihat && !o.lirik) lir = [lirLihat[0] + lir[0] * .25, lirLihat[1] + lir[1] * .25];
    if (o.lirik === 'kamera') lir = [0, 0];
    const q2 = v => Math.round(v * 100) / 100, exQ = { alis: ex.alis.map(q2), mata: ex.mata, mulut: ex.mulut }, lirQ = lir.map(q2);   // digambar dari nilai yang SAMA dengan kunci (dulu kunci dibulatkan, gambar tidak → pupil bergantung bingkai mana yang menggambar dulu)
    const key = [exQ.alis.map(v => v.toFixed(2)).join(','), exQ.mata, exQ.mulut, (Math.round(buka * 8) / 8).toFixed(3), kedip ? 1 : 0, lirQ.map(v => v.toFixed(2)).join(',')].join('|');
    if (key !== this.kunciWajah) { this.kunciWajah = key; this.gambarWajah(exQ, Math.round(buka * 8) / 8, kedip, lirQ); }
    this.efek(t, T);
  }
}
/** nilai berwaktu umum: { a (kini), b (sebelumnya), dt (dtk sejak berganti; 99 = belum pernah) } */
function nilaiBerwaktu(v, t, a) {
  if (!Array.isArray(v) || !Array.isArray(v[0])) return { a: v, b: v, dt: 99 };
  let A0 = v[0][1], B0 = v[0][1], dt = 99;
  for (let i = 0; i < v.length; i++) { const ti = wl(v[i][0], a); if (t >= ti) { A0 = v[i][1]; B0 = i ? v[i - 1][1] : v[i][1]; dt = i ? t - ti : 99; } }
  return { a: A0, b: B0, dt };
}
/** mulut 0..1 dari waktu kata narasi (bicara: true | [mulai, akhir] dtk adegan | 'L03' | ['L03','L04']) */
function rentangBicara3(o, a) {
  if (o._rb !== undefined) return o._rb;
  let r = null;
  if (o.bicara === true) r = [[-1e9, 1e9]];
  else if (Array.isArray(o.bicara) && typeof o.bicara[0] === 'number') r = [[a.mulai + o.bicara[0], a.mulai + o.bicara[1]]];
  else if (o.bicara) { const ids = [].concat(o.bicara); r = (SUARA && SUARA.baris || []).filter(b => ids.includes(b.id)).map(b => [b.mulai, b.mulai + b.durasi]); }
  return (o._rb = r);
}
function sedangBicara3(o, a, T) { const r = rentangBicara3(o, a); return !!(r && r.some(([x, y]) => T >= x && T < y)); }
function bukaMulut3(o, a, T) {
  if (!sedangBicara3(o, a, T)) return 0;
  const k = KATA.find(q => T >= q[0] && T < q[1]);
  if (KATA.length && !k) return .05;
  const f = k ? (T - k[0]) / Math.max(.05, k[1] - k[0]) : (T * 6) % 1;
  return .25 + .75 * Math.abs(Math.sin(f * Math.PI * Math.max(1, Math.round((k ? k[2].length : 4) / 3))));
}

/** d.tokoh(id, {posisi:[x,y,z], hadap (derajat | 'kamera' | id | [[t, …]]), pose, ekspresi, bicara, jalan:{dari:[x,z], ke:[x,z], lewat, mulai, lama, lari},
    lihat, lirik, pegang, pegangKiri, muncul, hilang, skala, naik (motor/kursi yang punya jok), efek: [[t, 'keringat', lama]], hidup, gestur}) */
Dunia3D.prototype.tokoh = function (id, o = {}) {
  const def = Object.assign({}, (K.tokoh || {})[id] || {}, o.def || {});
  if (!(K.tokoh || {})[id] && !o.def && !this._laporTokoh) { this._laporTokoh = 1; catatan.push(`tokoh "${id}" belum didefinisikan di KONFIG.tokoh (dipakai rupa bawaan)`); }
  const tk = new Tokoh3D(this, id, def, o);
  this.para[o.kunci || id] = tk;
  M3.statTokoh.set(this.a.id + '|' + (o.kunci || id), { a: this.a, id, o });   // untuk cek 'tokoh kaku'
  return tk;
};
