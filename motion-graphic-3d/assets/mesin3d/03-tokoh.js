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
  lari:       { lKi: [3, 9, 15, 70], lKa: [3, 9, 15, 70], badan: [10, 0, 0] }
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

class Tokoh3D {
  constructor(dn, id, def, o) {
    this.dn = dn; this.id = id; this.def = def; this.o = o; this.a = dn.a; this.benih = benih3(id);
    const anak = def.tubuh === 'anak', R = this.R = .2 * (def.kepalaSkala ?? (anak ? 1.18 : 1)), gemuk = def.gemuk ? 1.22 : 1;
    this.skala = (o.skala ?? 1) * (def.tinggi ?? 1) * (anak ? .62 : 1);
    const kulit = def.kulit || '#F0C29A', baju = def.baju || P.utama, celana = def.celana || campur(P.gelap, '#33415C', .6), sepatu = def.sepatu || '#3A3A48';
    const lp = def.lengan === 'pendek', cp = def.celanaPendek || def.panjangCelana === 'pendek';
    const M = (geo, wr, x = {}) => mesh3(geo, Object.assign({ warna: wr }, x));
    // --- kerangka
    const akar = this.akar = new THREE.Group();
    const pinggul = this.pinggul = new THREE.Group(); pinggul.position.y = .86; akar.add(pinggul);
    const badan = this.badan = new THREE.Group(); pinggul.add(badan);
    const dada = this.dada = new THREE.Group(); dada.position.y = .3; badan.add(dada);
    const leher = this.leher = new THREE.Group(); leher.position.y = .22; dada.add(leher);
    const kepala = this.kepala = new THREE.Group(); kepala.position.y = .07; leher.add(kepala);
    const kepalaIsi = this.kepalaIsi = new THREE.Group(); kepalaIsi.position.y = R * .95; kepala.add(kepalaIsi);
    // --- badan: profil bubut (lathe) dipipihkan depan-belakang
    const prof = [[.0, -.06], [.15, -.06], [.165, 0], [.17, .12], [.178, .26], [.185, .38], [.17, .47], [.12, .52], [.05, .535], [0, .54]].map(([x, y]) => new THREE.Vector2(x * gemuk, y));
    const gBadan = geoSimpan(`badan|${gemuk}`, () => new THREE.LatheGeometry(prof, segQ(28)));
    const mBadan = M(gBadan, baju); mBadan.scale.z = .74; badan.add(mBadan);
    if (def.rok) { const rk = M(geoSilinder(.17 * gemuk, .3 * gemuk, .36, 28), def.rok); rk.position.y = -.16; rk.scale.z = .8; badan.add(rk); }
    else { const pg = M(geoKotak(.31 * gemuk, .16, .23 * gemuk, .07), celana); pg.position.y = -.04; pinggul.add(pg); }
    if (def.sabuk !== false && !def.rok) { const sb = M(geoKotak(.335 * gemuk, .045, .25 * gemuk, .02), campur(celana, P.gelap, .5), { tepi: false }); sb.position.y = .015; pinggul.add(sb); }
    // kerah / pakaian
    const kerah = def.kerah || 'kaos';
    if (kerah === 'kaos') { const k = M(geoTorus(.07, .02, 24), campur(baju, P.gelap, .2), { tepi: false }); k.rotation.x = Math.PI / 2; k.position.y = .51; k.scale.z = .8; badan.add(k); }
    if (kerah === 'kemeja' || kerah === 'jas') {
      const wk = kerah === 'jas' ? (def.warnaKemeja || '#F4F1EA') : (def.warnaKerah || terangkan(baju, .25));
      [-1, 1].forEach(s => { const k = M(geoKotak(.09, .07, .02, .008), wk); k.position.set(s * .045, .5, .115); k.rotation.set(-.35, 0, s * .55); badan.add(k); });
      if (kerah === 'jas') { const dalam = M(geoKotak(.1, .22, .02, .01), wk, { tepi: false }); dalam.position.set(0, .38, .118); badan.add(dalam); }
      if (def.dasi) { const d1 = M(geoKotak(.045, .22, .025, .01), def.dasi); d1.position.set(0, .36, .128); badan.add(d1); }
      if (kerah === 'kemeja') for (let i = 0; i < 3; i++) { const b = M(geoBola(.012, 10, 8), campur(baju, P.gelap, .45), { tepi: false }); b.position.set(0, .42 - i * .1, .132); badan.add(b); }
    }
    if (kerah === 'hoodie') { const h = M(geoTorus(.1, .045, 24), baju); h.rotation.x = Math.PI / 2 + .4; h.position.set(0, .5, -.06); badan.add(h); const kt = M(geoKotak(.2, .1, .03, .02), campur(baju, P.gelap, .15)); kt.position.set(0, .12, .12); badan.add(kt); }
    if (def.celemek) { const ce = M(geoKotak(.26, .5, .02, .03), def.celemek); ce.position.set(0, .2, .135); badan.add(ce); }
    // leher + kepala
    const ml = M(geoSilinder(.064, .07, .12, 18), kulit, { tepi: false }); ml.position.y = .02; leher.add(ml);
    const mk = this.mKepala = M(geoBola(R, 40, 28), kulit); mk.scale.set(1, 1.04, .98); kepalaIsi.add(mk);
    [-1, 1].forEach(s => { const t = M(geoBola(R * .22, 16, 12), kulit); t.position.set(s * R * .97, -R * .06, -R * .04); t.scale.set(.45, .78, .62); kepalaIsi.add(t); });
    const hidung = M(geoBola(R * .13, 16, 12), campur(kulit, '#B5684A', .14), { tepi: false }); hidung.position.set(0, -R * .1, R * .97); hidung.scale.set(1, .82, .78); kepalaIsi.add(hidung);
    // wajah: tudung bola bertekstur (phi ±55°, theta 58°–138°)
    this.kanvasWajah = kanvasBaru(660, 480); this.texWajah = teksturKanvas(this.kanvasWajah); this.kunciWajah = '';
    const gw = new THREE.SphereGeometry(R * 1.006, 48, 32, Math.PI / 2 - 55 * D2R, 110 * D2R, 58 * D2R, 80 * D2R);
    const mw = new THREE.MeshStandardMaterial({ map: this.texWajah, transparent: true, roughness: .55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, envMapIntensity: .4 });
    const wajah = new THREE.Mesh(gw, mw); wajah.renderOrder = 2; wajah.scale.copy(mk.scale); kepalaIsi.add(wajah);
    this.rambut(def, R, M);
    // lengan
    this.lengan = {};
    [['Ki', 1], ['Ka', -1]].forEach(([n, s]) => {
      const bahu = new THREE.Group(); bahu.position.set(s * .182 * gemuk, .165, 0); bahu.rotation.order = 'XZY'; dada.add(bahu);
      const bola = M(geoBola(.06, 18, 14), baju); bola.scale.set(.95, .9, .9); bahu.add(bola);
      const atas = M(geoKapsul(.054, .2), lp ? kulit : baju); atas.position.y = -.14; bahu.add(atas);
      if (lp) { const lgn = M(geoSilinder(.068, .064, .13, 18), baju); lgn.position.y = -.06; bahu.add(lgn); }
      const siku = new THREE.Group(); siku.position.y = -.28; bahu.add(siku);
      const bawah = M(geoKapsul(.046, .18), lp ? kulit : baju); bawah.position.y = -.12; siku.add(bawah);
      if (!lp) { const mn = M(geoSilinder(.052, .052, .04, 16), campur(baju, P.gelap, .2), { tepi: false }); mn.position.y = -.235; siku.add(mn); }
      const tangan = new THREE.Group(); tangan.position.y = -.26; siku.add(tangan);
      const telapak = M(geoBola(.062, 18, 14), kulit); telapak.position.y = -.055; telapak.scale.set(.82, 1.02, .66); tangan.add(telapak);
      const jempol = M(geoKapsul(.02, .045, 10), kulit); jempol.position.set(-s * .035, -.04, .03); jempol.rotation.set(.5, 0, s * .7); tangan.add(jempol);
      this.lengan[n] = { bahu, siku, tangan, s };
    });
    // kaki
    this.kaki = {};
    [['Ki', 1], ['Ka', -1]].forEach(([n, s]) => {
      const paha = new THREE.Group(); paha.position.set(s * .095 * gemuk, -.04, 0); paha.rotation.order = 'XZY'; pinggul.add(paha);
      const mp = M(geoKapsul(.078 * Math.sqrt(gemuk), .24), cp ? kulit : (def.rok ? kulit : celana)); mp.position.y = -.19; paha.add(mp);
      if (cp && !def.rok) { const cl = M(geoSilinder(.088, .09, .18, 18), celana); cl.position.y = -.08; paha.add(cl); }
      const lutut = new THREE.Group(); lutut.position.y = -.38; paha.add(lutut);
      const mb = M(geoKapsul(.064, .24), (cp || def.rok) ? kulit : celana); mb.position.y = -.18; lutut.add(mb);
      const tumit = new THREE.Group(); tumit.position.y = -.36; lutut.add(tumit);
      const sp = M(geoKotak(.12, .1, .25, .045), sepatu); sp.position.set(0, -.02, .045); tumit.add(sp);
      const sol = M(geoKotak(.125, .025, .26, .01), def.sol || campur(sepatu, '#ffffff', .55), { tepi: false }); sol.position.set(0, -.065, .045); tumit.add(sol);
      this.kaki[n] = { paha, lutut, tumit, s };
    });
    // pegangan (properti di tangan)
    this.pegangan = { Ka: null, Ki: null };
    // pasang ke dunia
    this.posisiAwal = [(o.posisi || [0, 0, 0])[0], (o.posisi || [0, 0, 0])[1] || 0, (o.posisi || [0, 0, 0])[2] ?? 0];
    if (o.jalan) { const j = o.jalan; this.posisiAwal = [j.dari[0], this.posisiAwal[1], j.dari[1] ?? j.dari[2] ?? 0]; }
    akar.position.set(...this.posisiAwal); akar.scale.setScalar(this.skala);
    (o.naik && o.naik.userData && o.naik.userData.jok ? o.naik.userData.jok : (o.induk || dn._induk())).add(akar);
    if (o.naik) { akar.position.set(0, 0, 0); this.naik = true; }
    this.efek = efekEmosi(this, dn);
    this.yawSkr = null;
  }
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
    const batas = { pendek: [.31, .47, .64], poni: [.40, .48, .64], jabrik: [.30, .46, .62], cepak: [.33, .44, .56], panjang: [.31, .5, .66], kuncir: [.30, .47, .63], ikal: [.30, .48, .66] }[jenis] || [.31, .47, .64];
    const tebal = jenis === 'cepak' ? 1.025 : 1.065;
    const g = new THREE.SphereGeometry(R * tebal, 44, 22, 0, Math.PI * 2, 0, Math.PI * .64), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), r = Math.hypot(x, y, z), th = Math.acos(jepit(y / r, -1, 1)), az = Math.atan2(x, z);
      const k = (1 - Math.cos(az)) / 2, lim = (k < .5 ? lerp(batas[0], batas[1], k * 2) : lerp(batas[1], batas[2], (k - .5) * 2)) * Math.PI;
      const th2 = th / (Math.PI * .64) * lim, rr = R * tebal * (1 + (jenis === 'cepak' ? 0 : .04 * Math.cos(th2 * 1.2)));
      pos.setXYZ(i, Math.sin(th2) * Math.sin(az) * rr, Math.cos(th2) * rr * 1.04, Math.sin(th2) * Math.cos(az) * rr);
    }
    g.computeVertexNormals();
    K0.add(M(g, wr));
    if (jenis === 'poni') for (let i = -2; i <= 2; i++) { const p = M(geoBola(R * .2, 16, 10), wr); const az = i * .26, th = .36 * Math.PI; p.position.set(Math.sin(th) * Math.sin(az) * R * 1.03, Math.cos(th) * R * 1.07, Math.sin(th) * Math.cos(az) * R * 1.03); p.scale.set(1.2, .75, .6); p.lookAt(p.position.clone().multiplyScalar(2)); K0.add(p); }
    if (jenis === 'jabrik') for (let i = 0; i < 9; i++) { const az = (i / 9) * Math.PI * 2 + .2, th = (.12 + (i % 3) * .1) * Math.PI; const c = M(geoKerucut(R * .17, R * .5, 12), wr); const n = new THREE.Vector3(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az)); c.position.copy(n.clone().multiplyScalar(R * 1.1)); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n.add(new THREE.Vector3(0, .6, -.3)).normalize()); K0.add(c); }
    if (jenis === 'panjang') { const tirai = M(new THREE.CylinderGeometry(R * 1.04, R * 1.18, .46, 36, 1, true, .95, Math.PI * 2 - 1.9), wr, { ganda: true }); tirai.position.y = -R * .9; K0.add(tirai); const ujung = M(new THREE.TorusGeometry(R * 1.11, .03, 10, 36, Math.PI * 2 - 1.9), wr); ujung.rotation.set(Math.PI / 2, 0, Math.PI / 2 + .95); ujung.position.y = -R * .9 - .23; K0.add(ujung); }
    if (jenis === 'kuncir') { const b = M(geoBola(R * .3, 18, 14), wr); b.position.set(0, R * .5, -R * .95); K0.add(b); const ek = M(geoKapsul(R * .2, R * .9, 14), wr); ek.position.set(0, R * .05, -R * 1.2); ek.rotation.x = .35; K0.add(ek); const ik = M(geoTorus(R * .14, R * .05, 16), def.warnaIkat || P.kedua, { tepi: false }); ik.position.set(0, R * .48, -R * 1.08); ik.rotation.x = 1.2; K0.add(ik); }
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
      c.strokeStyle = def.warnaAlis || campur(def.warnaRambut || '#2B1B12', '#000', .2); c.lineWidth = 15; c.lineCap = 'round';
      c.beginPath(); c.moveTo(cx - s * 40, cy + dalam); c.quadraticCurveTo(cx, cy - 9 + dalam * .45, cx + s * 40, cy + 2); c.stroke();
    });
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
  perbarui(t, T) {
    const o = this.o, a = this.a, def = this.def, bn = this.benih;
    // muncul / hilang
    let k = 1; const mu = wl(o.muncul, a), hi = wl(o.hilang, a);
    if (mu !== undefined) k = t < mu ? 0 : E.outBack(jepit((t - mu) / .45));
    if (hi !== undefined && t >= hi) k *= Math.max(0, 1 - E.inBack(jepit((t - hi) / .35)));
    this.akar.visible = k > 1e-3; if (!this.akar.visible) return;
    // pose (perpindahan halus 0,4 dtk dengan sedikit lewat sasaran)
    const pv = nilaiDi(o.pose || 'berdiri', t, a, .42);
    let p = campurPose3D(pose3D(pv.a), pv.b ? pose3D(pv.b) : null, pv.b ? E.outBack(pv.k) * .9 + pv.k * .1 : 1);
    p = JSON.parse(JSON.stringify(p));
    const lKi = (p.lKi || [3, 9, 15, 12]).slice(), lKa = (p.lKa || [3, 9, 15, 12]).slice();
    const kKi = (p.kKi || [0, 3, 2]).slice(), kKa = (p.kKa || [0, 3, 2]).slice();
    const badan = (p.badan || [0, 0, 0]).slice(), kepala = (p.kepala || [0, 0, 0]).slice();
    // jalan / lari
    let x = this.posisiAwal[0], y = this.posisiAwal[1], z = this.posisiAwal[2], yaw = null, fase = 0, langkah = 0, bob = 0;
    const j = o.jalan;
    if (j) {
      const mulai = wl(j.mulai, a) ?? 0, lama = j.lama ?? 1.6, kj = jepit((t - mulai) / lama), e = (j.ease ? fe(j.ease) : E.inOutSine)(kj);
      const titik = [[j.dari[0], 0, j.dari[1] ?? j.dari[2]], ...(j.lewat || []).map(q => [q[0], 0, q[1] ?? q[2]]), [j.ke[0], 0, j.ke[1] ?? j.ke[2]]];
      let arah;
      if (titik.length > 2) { const q = titikJalur(titik, e); x = q.p[0]; z = q.p[2]; arah = q.d; }
      else { x = lerp(titik[0][0], titik[1][0], e); z = lerp(titik[0][2], titik[1][2], e); arah = [titik[1][0] - titik[0][0], 0, titik[1][2] - titik[0][2]]; }
      const panjang = titik.reduce((s, q, i) => s + (i ? Math.hypot(q[0] - titik[i - 1][0], q[2] - titik[i - 1][2]) : 0), 0);
      if (kj > 0 && kj < 1) { langkah = j.lari ? 1.6 : 1; fase = panjang * e / ((j.lari ? 1.7 : 1.15) * this.skala) * Math.PI * 2; }
      if (kj > 0 && kj < 1 || (o.hadap === undefined && kj >= 1)) yaw = Math.atan2(arah[0], arah[2]) / D2R;
      if (kj >= 1 && o.hadap === undefined && j.akhirHadap !== undefined) yaw = j.akhirHadap === 'kamera' ? this.sudutKe('kameraAwal') : j.akhirHadap;
      // masuk/keluar langkah halus (tidak langsung berhenti)
      langkah *= Math.min(1, kj * lama / .25, (1 - kj) * lama / .25);
    }
    if (o.anim) { const v = kunci3(t, o.anim, a); if (v && v.posisi) { x = v.posisi[0]; y = v.posisi[1] ?? y; z = v.posisi[2] ?? z; } }
    if (yaw === null) {
      const hv = o.hadap === undefined ? 'kameraAwal' : o.hadap;
      if (Array.isArray(hv)) { const q = nilaiDi(hv, t, a, .5); const ya = typeof q.a === 'number' ? q.a : this.sudutKe(q.a), yb = q.b === null ? ya : (typeof q.b === 'number' ? q.b : this.sudutKe(q.b)); let dd = ((ya - yb + 540) % 360) - 180; yaw = yb + dd * q.k; }
      else yaw = typeof hv === 'number' ? hv : this.sudutKe(hv);
    }
    if (this.naik) { x = 0; y = 0; z = 0; yaw = o.hadap ?? 0; }
    // penanda pose
    if (p.goyang) { lKa[3] += Math.sin(T * 11) * 22; lKa[1] += Math.sin(T * 11) * 6; }
    if (p.gores) { lKa[3] += Math.sin(T * 8.5) * 9 + Math.sin(T * 3.1) * 6; lKa[2] += Math.sin(T * 6.3) * 6; }
    if (p.ketik) { lKa[3] += Math.max(0, Math.sin(T * 17)) * 8; lKi[3] += Math.max(0, Math.sin(T * 15 + 1)) * 8; }
    if (p.tepuk) { const c = Math.abs(Math.sin(T * 7)); lKa[2] += c * 20; lKi[2] += c * 20; }
    if (p.joget) { const s = Math.sin(T * 6.5); lKa[0] += s * 40; lKi[0] -= s * 40; lKa[3] += s * 30; lKi[3] -= s * 30; badan[1] += s * 6; kepala[1] -= s * 6; bob += Math.abs(Math.sin(T * 6.5)) * .05; }
    const gem = p.gemetar ? Math.sin(T * 41) * .006 * p.gemetar : 0, loncat = p.loncat ? Math.abs(Math.sin(T * 6)) * .14 * p.loncat : 0;
    // jalan: kaki + lengan berayun
    if (langkah > 0) {
      const sw = Math.sin(fase), amp = j.lari ? 38 : 24;
      if (!p.depan) { lKi[0] = lerp(lKi[0], -sw * amp * .9, langkah); lKa[0] = lerp(lKa[0], sw * amp * .9, langkah); lKi[3] = lerp(lKi[3], j.lari ? 80 : 16 + Math.max(0, -sw) * 18, langkah); lKa[3] = lerp(lKa[3], j.lari ? 80 : 16 + Math.max(0, sw) * 18, langkah); }
      kKi[0] = lerp(kKi[0], sw * amp, langkah); kKa[0] = lerp(kKa[0], -sw * amp, langkah);
      kKi[2] = lerp(kKi[2], 6 + Math.max(0, Math.cos(fase)) * (j.lari ? 75 : 42), langkah); kKa[2] = lerp(kKa[2], 6 + Math.max(0, -Math.cos(fase)) * (j.lari ? 75 : 42), langkah);
      bob += Math.abs(Math.cos(fase)) * (j.lari ? .05 : .028) * langkah; badan[2] += Math.sin(fase) * 6 * langkah; badan[0] += (j.lari ? 8 : 2) * langkah;
    }
    // akting otomatis: napas, berat badan berpindah, kepala hidup, mata melirik
    const napas = Math.sin(T * Math.PI * 2 * .3 + bn), hidup = o.hidup !== false;
    if (hidup) {
      badan[1] += derau(T * .45 + bn) * 2.2; badan[2] += derau(T * .3 + bn + 4) * 3;
      kepala[0] += derau(T * .6 + bn + 2) * 3; kepala[1] += derau(T * .5 + bn + 7) * 2.5; kepala[2] += derau(T * .4 + bn + 11) * 5;
      lKi[1] += napas * 1.5; lKa[1] += napas * 1.5; lKi[3] += derau(T * .7 + bn) * 4; lKa[3] += derau(T * .65 + bn + 3) * 4;
    }
    // bicara: angguk per kata + gestur tangan bergantian (pose bertanda gestur)
    const buka = bukaMulut3(o, a, T);
    const bic = sedangBicara3(o, a, T);
    if (bic && hidup) {
      const kt = KATA.find(q => T >= q[0] && T < q[1]);
      if (kt) kepala[0] += Math.sin(jepit((T - kt[0]) / Math.max(.08, kt[1] - kt[0])) * Math.PI) * 4;
      const gname = pv.b ? null : pv.a;
      if (o.gestur !== false && gname && GESTUR_POSE.has(gname)) {
        const ka = (derau(T * .8 + bn) + 1) / 2, ki = (derau(T * .7 + bn + 20) + 1) / 2, duduk = !!p.duduk;
        lKa[0] += ka * (duduk ? 25 : 38); lKa[3] += ka * 55; lKa[2] += ka * 25; lKa[1] += ka * 8;
        lKi[0] += ki * ki * (duduk ? 18 : 28); lKi[3] += ki * ki * 45; lKi[2] += ki * 20;
        badan[0] += ka * 3; badan[2] += (ka - ki) * 6;
      }
    }
    // lihat (kepala menoleh ke rujukan)
    if (o.lihat) {
      const lv = nilaiDi(o.lihat, t, a, .45), sasaran = lv.a;
      if (sasaran) {
        const q = sasaran === 'kamera' ? this.dn.kamera.position.toArray() : this.dn.titik(sasaran);
        const ph = this.titik('kepala'), dyaw = Math.atan2(q[0] - ph[0], q[2] - ph[2]) / D2R - yaw, dist = Math.hypot(q[0] - ph[0], q[2] - ph[2]);
        let dy = ((dyaw + 540) % 360) - 180; dy = jepit(dy, -60, 60); const dp = jepit(-Math.atan2(q[1] - ph[1], dist) / D2R, -30, 30);
        const kk = lv.b ? lv.k : 1; kepala[2] += dy * kk; kepala[0] += dp * kk; badan[2] += dy * .25 * kk;
      }
    }
    // pasang ke sendi
    const sk = this.skala * k;
    if (this.yawSkr === null) this.yawSkr = yaw;
    this.akar.position.set(x + gem, y, z); this.akar.rotation.set(0, yaw * D2R, 0); this.akar.scale.setScalar(Math.max(1e-4, sk));
    const turun = p.turun || 0;
    if (this.naik) this.akar.position.y = sk * (.1 - (.86 - turun));   // pinggul 10 cm di atas jok (jok = permukaan dudukan)
    this.pinggul.position.set(derau(T * .45 + bn + 9) * .012 * (hidup ? 1 : 0), .86 - turun + bob + loncat, 0);
    if (p.rebah) { this.akar.rotation.set(-Math.PI / 2, yaw * D2R, 0, 'YXZ'); this.akar.position.y = y + .16; }
    this.badan.rotation.set(badan[0] * D2R, badan[2] * D2R, badan[1] * D2R);
    this.dada.scale.set(1 + napas * .012, 1 + napas * .018, 1 + napas * .02);
    this.dada.position.y = .3 + (p.bahu ? .03 : 0);
    this.kepala.rotation.set(kepala[0] * D2R, kepala[2] * D2R, kepala[1] * D2R, 'YXZ');
    const lg = (L, v) => { const s = L.s; L.bahu.rotation.set(-v[0] * D2R, -s * (v[2] || 0) * D2R, s * v[1] * D2R, 'XZY'); L.siku.rotation.set(-(v[3] || 0) * D2R, 0, 0); };
    lg(this.lengan.Ki, lKi); lg(this.lengan.Ka, lKa);
    const kk = (L, v) => { const s = L.s; L.paha.rotation.set(-v[0] * D2R, 0, s * (v[1] || 0) * D2R, 'XZY'); L.lutut.rotation.set((v[2] || 0) * D2R, 0, 0); L.tumit.rotation.set((v[0] - (v[2] || 0)) * D2R * (p.duduk ? 1 : .6), 0, 0); };
    kk(this.kaki.Ki, kKi); kk(this.kaki.Ka, kKa);
    // pegangan
    ['Ka', 'Ki'].forEach(sisi => {
      const v = o[sisi === 'Ka' ? 'pegang' : 'pegangKiri'], q = Array.isArray(v) && Array.isArray(v[0]) ? nilaiDi(v, t, a, .01).a : v;
      const P0 = this.pegangan[sisi];
      if (!P0 || P0.jenis !== q) { if (P0 && P0.obj) this.lengan[sisi].tangan.remove(P0.obj); const obj = q ? bendaPegang(q, this.dn, this) : null; if (obj) this.lengan[sisi].tangan.add(obj); this.pegangan[sisi] = { jenis: q, obj }; }
      const ob = this.pegangan[sisi].obj; if (ob && ob.userData.gerak) ob.userData.gerak(t, T);
    });
    // wajah
    const ev = nilaiDi(o.ekspresi || 'senang', t, a, .3), ea = EKSPRESI[ev.a] || EKSPRESI.senang, eb = ev.b ? EKSPRESI[ev.b] : null;
    const ex = eb ? { alis: ea.alis.map((v, i) => lerp(eb.alis[i], v, ev.k)), mata: ev.k > .5 ? ea.mata : eb.mata, mulut: ev.k > .5 ? ea.mulut : eb.mulut } : ea;
    const per = 3.1 + (bn % 7) * .27, fk = ((T + bn * .37) % per + per) % per, kedip = o.kedip !== false && fk < .13;
    let lir = o.lirik || [derau(T * .5 + bn) * .35 + (Math.floor(T * .7 + bn) % 3 - 1) * .15, derau(T * .4 + bn + 5) * .2];
    if (o.lirik === 'kamera') lir = [0, 0];
    const key = [ex.alis.map(v => v.toFixed(2)).join(','), ex.mata, ex.mulut, (Math.round(buka * 8) / 8).toFixed(3), kedip ? 1 : 0, lir.map(v => v.toFixed(2)).join(',')].join('|');
    if (key !== this.kunciWajah) { this.kunciWajah = key; this.gambarWajah(ex, Math.round(buka * 8) / 8, kedip, lir); }
    this.efek(t, T);
  }
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
