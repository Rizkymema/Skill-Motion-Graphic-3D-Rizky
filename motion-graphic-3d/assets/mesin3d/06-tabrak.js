/* ------------------------------------------------------------- ANTI-TEMBUS (clipping), sejak 26 Nov 2026
   Permintaan: "masih ada clipping 3D objek … agar bug itu hilang di setiap video". Tiga lapis:
   1. OTOMATIS tiap bingkai, untuk semua tokoh:
      - kaki menapak: telapak terendah diletakkan tepat di lantai (y dasar tokoh) atau permukaan `pijak` (trotoar, panggung) → tidak melayang/tenggelam;
      - lengan tak tembus: siku, lengan bawah, pergelangan, telapak, ujung jari, dan properti di tangan didorong keluar (IK kecil, perubahan sudut
        sekecil mungkin) dari badan, pinggul, kepala, paha/betis sendiri, badan/kepala tokoh lain, dan benda padat di dekatnya → tangan berhenti
        TEPAT di permukaan (mendorong motor, tangan di meja, pegang kepala) dan tidak pernah masuk ke dalamnya.
   2. CEK (hasilCek → SALAH, wajib diperbaiki sebelum render): tokoh menembus benda/tokoh lain, benda saling tembus, kamera di dalam atau
      terlalu dekat benda/kepala. Tiap benda padat punya bentuk jarak bertanda (SDF) lokal: kotak bulat, bola, silinder/kerucut, kapsul, torus,
      benda bubut (lathe); lainnya kotak batas.
   3. Pengecualian yang disengaja: `padat: false` (benda/tokoh boleh ditembus, mis. hantu), `latar` (langit, bukit, awan), `pijak` (lantai). */

/* --- jarak bertanda lokal --- */
function sdfGeo(geo) {
  if (geo.userData.sdf) return geo.userData.sdf;
  if (geo.type === 'LatheGeometry') { const pr = geo.parameters.points.map(v => [v.x, v.y]); return (geo.userData.sdf = { j: 'bubut', pr, y0: Math.min(...pr.map(q => q[1])), y1: Math.max(...pr.map(q => q[1])) }); }
  if (!geo.boundingBox) geo.computeBoundingBox();
  const b = geo.boundingBox, c = [(b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2];
  return (geo.userData.sdf = { j: 'kotak', c, h: [(b.max.x - b.min.x) / 2, (b.max.y - b.min.y) / 2, Math.max(.005, (b.max.z - b.min.z) / 2)], r: 0 });
}
function sdfLokal(s, x, y, z) {
  switch (s.j) {
    case 'bola': return Math.hypot(x, y, z) - s.r;
    case 'kapsul': { const yy = jepit(y, -s.h2, s.h2); return Math.hypot(x, y - yy, z) - s.r; }
    case 'torus': return Math.hypot(Math.hypot(x, y) - s.R, z) - s.r;
    case 'silinder': {
      const rr = lerp(s.rb, s.ra, jepit((y + s.h2) / (2 * s.h2))), qx = Math.hypot(x, z) - rr, qy = Math.abs(y) - s.h2;
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
    }
    case 'bubut': {
      let r = 0; const pr = s.pr, yc = jepit(y, s.y0, s.y1);
      for (let i = 0; i < pr.length - 1; i++) { const [r0, a0] = pr[i], [r1, a1] = pr[i + 1], lo = Math.min(a0, a1), hi = Math.max(a0, a1); if (yc >= lo && yc <= hi) r = Math.max(r, hi - lo < 1e-6 ? Math.max(r0, r1) : lerp(r0, r1, (yc - a0) / (a1 - a0))); }
      const qx = Math.hypot(x, z) - r, qy = Math.max(s.y0 - y, y - s.y1);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
    }
    default: {   // kotak (bulat)
      const c = s.c || [0, 0, 0], r = s.r || 0, qx = Math.abs(x - c[0]) - (s.h[0] - r), qy = Math.abs(y - c[1]) - (s.h[1] - r), qz = Math.abs(z - c[2]) - (s.h[2] - r);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
    }
  }
}
/* rintangan = mesh dengan SDF; matriks balik + skala diperbarui sekali per bingkai (cap dunia) */
const _v3 = new THREE.Vector3();
function siapRintang(m, cap) {
  const u = m.userData;
  if (u._cap === cap) return u;
  m.updateWorldMatrix(true, false);
  if (!u._inv) { u._inv = new THREE.Matrix4(); u._pusat = new THREE.Vector3(); }
  u._inv.copy(m.matrixWorld).invert();
  const e = m.matrixWorld.elements, sx = Math.hypot(e[0], e[1], e[2]), sy = Math.hypot(e[4], e[5], e[6]), sz = Math.hypot(e[8], e[9], e[10]);
  u._sk = Math.min(sx, sy, sz); u._skMaks = Math.max(sx, sy, sz);
  if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
  u._pusat.copy(m.geometry.boundingSphere.center).applyMatrix4(m.matrixWorld); u._jari = m.geometry.boundingSphere.radius * u._skMaks;
  u._sdf = sdfGeo(m.geometry); u._cap = cap;
  return u;
}
/** jarak dunia (m) dari titik p (Vector3) ke permukaan mesh; negatif = di dalam */
function jarakKe(m, p, cap, tambah = 0) {
  const u = siapRintang(m, cap);
  _v3.copy(p).applyMatrix4(u._inv);
  return sdfLokal(u._sdf, _v3.x, _v3.y, _v3.z) * u._sk - tambah;
}

/* --- daftar benda padat + permukaan pijak (setelah dunia dibangun) --- */
function bendaAtas(o, dn) { while (o.parent && o.parent !== dn.scene) o = o.parent; return o; }
function daftarPadat(dn) {
  for (const id in dn.para) dn.para[id].akar.traverse(o => { o.userData.tokoh = id; });
  const padat = [], pijak = [];
  dn.scene.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.tepi || o.userData.tokoh) return;
    let ada = true; for (let q = o; q; q = q.parent) if (q.userData.padatMati) { ada = false; break; }
    if (!ada) return;
    if (o.userData.pijak) pijak.push(o);
    else if (o.userData.padat && !o.userData.latar) { o.userData.benda = bendaAtas(o, dn); padat.push(o); }
  });
  dn.padat = padat; dn.pijak = pijak;
}
/** tinggi lantai di (x, z): 0, atau puncak permukaan pijak di bawah titik itu */
Dunia3D.prototype.lantaiDi = function (x, z, dasar = 0) {
  let y = dasar; const cap = this._cap;
  for (const m of this.pijak || []) {
    const u = siapRintang(m, cap); _v3.set(x, 0, z).applyMatrix4(u._inv); const s = u._sdf, c = s.c || [0, 0, 0];
    if (s.j === 'kotak' && Math.abs(_v3.x - c[0]) <= s.h[0] + .02 && Math.abs(_v3.z - c[2]) <= s.h[2] + .02) { _v3.set(c[0], c[1] + s.h[1], c[2]).applyMatrix4(m.matrixWorld); y = Math.max(y, _v3.y); }
  }
  return y;
};
function namaBenda(o) { return (o && (o.userData.namaBenda || o.userData.jenis)) || 'benda'; }

/* --- tokoh: kaki menapak --- */
const TELAPAK = [[0, -.0775, -.085], [0, -.0775, .175]];
Tokoh3D.prototype.tapakKaki = function () {
  const S = this.sudut, p = S.p;
  if (this.naik || p.duduk || p.rebah || !this.akar.visible) return;
  this.akar.updateWorldMatrix(true, true);
  let selisih = Infinity;
  for (const n of ['Ki', 'Ka']) {
    const tm = this.kaki[n].tumit;
    for (const q of TELAPAK) { const w = new THREE.Vector3(q[0], q[1], q[2]).applyMatrix4(tm.matrixWorld); const lantai = this.dn.lantaiDi(w.x, w.z, S.yDasar); selisih = Math.min(selisih, w.y - lantai); }
  }
  if (!isFinite(selisih) || Math.abs(selisih) < 1e-4) return;
  if (selisih > 0 && p.loncat) return;   // loncat (kaget, hore) boleh di udara, tidak boleh di bawah lantai
  this.akar.position.y -= selisih;
  this.akar.updateWorldMatrix(false, true);
};

/* --- tokoh: lengan tak tembus (IK kecil) --- */
Tokoh3D.prototype.aturLengan = function (L, v) { const s = L.s; L.bahu.rotation.set(-v[0] * D2R, -s * (v[2] || 0) * D2R, s * v[1] * D2R, 'XZY'); L.siku.rotation.set(-(v[3] || 0) * D2R, 0, 0); L.bahu.updateMatrixWorld(true); };
Tokoh3D.prototype.titikLengan = function (L, sisi) {
  const sk = this.akar.scale.x, d = (obj, x, y, z, r, diri = true) => ({ p: new THREE.Vector3(x, y, z).applyMatrix4(obj.matrixWorld), r: r * sk, diri, obj, lok: [x, y, z] });
  const t = [d(L.bahu, 0, -.15, 0, .05, false), d(L.siku, 0, 0, 0, .052), d(L.siku, 0, -.12, 0, .045), d(L.tangan, 0, 0, 0, .045), d(L.tangan, 0, -.055, 0, .052), d(L.tangan, 0, -.11, 0, .028)];
  const pg = this.pegangan[sisi] && this.pegangan[sisi].obj;
  if (pg) { const bx = new THREE.Box3().setFromObject(pg); if (!bx.isEmpty()) { const c = bx.getCenter(new THREE.Vector3()), r = Math.min(.12 * sk, bx.getSize(new THREE.Vector3()).length() / 2 * .6); const lok = L.tangan.worldToLocal(c.clone()); t.push({ p: c, r, diri: true, obj: L.tangan, lok: [lok.x, lok.y, lok.z] }); } }
  return t;
};
Tokoh3D.prototype.rintanganLengan = function (bahu) {
  const sk = this.akar.scale.x, r = [];
  r.push({ m: this.mBadan, tambah: -.004 * sk, diri: true }, { m: this.mKepala, tambah: .016 * sk, diri: false });
  if (this.mPinggul) r.push({ m: this.mPinggul, tambah: -.004 * sk, diri: true });
  if (this.mPerut) r.push({ m: this.mPerut, tambah: -.006 * sk, diri: true });   // perut gemuk (bayangan tabrak tak terlihat)
  for (const n of ['Ki', 'Ka']) r.push({ m: this.kaki[n].mPaha, tambah: 0, diri: true }, { m: this.kaki[n].mBetis, tambah: 0, diri: true });
  for (const id in this.dn.para) { const lain = this.dn.para[id]; if (lain === this || !lain.akar.visible || lain.o.padat === false) continue; r.push({ m: lain.mBadan, tambah: .005, diri: false }, { m: lain.mKepala, tambah: .02, diri: false }); }
  const jangkau = .85 * sk, cap = this.dn._cap;
  for (const m of this.dn.padat || []) { const u = siapRintang(m, cap); if (u._pusat.distanceTo(bahu) < u._jari + jangkau && jarakKe(m, bahu, cap) < jangkau) r.push({ m, tambah: .006, diri: false, dunia: true }); }   // jarak sebenarnya (gedung besar yang jauh tidak ikut)
  return r;
};
/** LM umum atas 4 sudut lengan v (diubah di tempat): sisaFn(v) → larik sisa; batas = perubahan maks. (derajat) dari v awal */
Tokoh3D.prototype.lmLengan = function (L, v, sisaFn, o = {}) {
  const v0 = v.slice(), BOBOT = o.bobot || [1, 1, .3, .55], LANGKAH = 1.5, E = r => r.reduce((s, x) => s + x * x, 0), batas = o.batas ?? 85;
  let r0 = sisaFn(v), e0 = E(r0), lam = -1;
  for (let iter = 0; iter < (o.iter ?? 8) && e0 > (o.ambang ?? 2.5e-6); iter++) {
    const J = [0, 1, 2, 3].map(j => { const vj = v.slice(); vj[j] += LANGKAH; const rj = sisaFn(vj); return rj.map((x, k) => (x - r0[k]) / LANGKAH); });
    const A = [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => J[i].reduce((s, x, k) => s + x * J[j][k], 0))), g = [0, 1, 2, 3].map(i => J[i].reduce((s, x, k) => s + x * r0[k], 0));
    if (lam < 0) lam = 1e-3 * (A[0][0] + A[1][1] + A[2][2] + A[3][3]) / 4 + 1e-12;
    let maju = false;
    for (let coba = 0; coba < 4 && !maju; coba++) {
      const M = A.map((row, i) => row.map((x, j) => x + (i === j ? lam / BOBOT[i] : 0))), d = selesaikan4(M, g.map(x => -x));
      const v1 = v.map((x, j) => v0[j] + jepit(x + jepit(d[j], -30, 30) - v0[j], -batas, batas)), r1 = sisaFn(v1), e1 = E(r1);
      if (e1 < e0) { for (let j = 0; j < 4; j++) v[j] = v1[j]; r0 = r1; e0 = e1; lam *= .4; maju = true; } else lam *= 5;
    }
    if (!maju) break;
  }
  this.aturLengan(L, v);
};
/** raih / tunjukKe: tangan ke sasaran (tokoh, benda bernama, rujukan 'id.kepala', atau [x,y,z]); bertransisi halus 0,35 dtk
    tunjukKe: lengan lurus mengarah ke sasaran (jari ke arah sasaran) · raih: { ka, ki }: telapak ke sasaran (berhenti di permukaan oleh anti-tembus) */
Tokoh3D.prototype.raihSasaran = function (t) {
  const o = this.o, a = this.a, S = this.sudut, dn = this.dn, sk = this.akar.scale.x;
  this.akar.updateWorldMatrix(true, true);
  const titikSasaran = (ref, tunjuk) => {
    if (Array.isArray(ref) && typeof ref[0] === 'number') return new THREE.Vector3(...ref);
    const s = String(ref); if (dn.para[s] && dn.para[s] !== this) return new THREE.Vector3(...dn.titik(s + (tunjuk ? '.kepala' : '')));
    if (dn.nama[s]) { const bx = new THREE.Box3().setFromObject(dn.nama[s]); if (!bx.isEmpty()) return bx.getCenter(new THREE.Vector3()); }
    return new THREE.Vector3(...dn.titik(s));
  };
  const sudutUntuk = (sisi, ref, tunjuk, v0) => {
    if (ref === null || ref === undefined) return v0.slice();
    const L = this.lengan[sisi], v = v0.slice(), bahu = L.bahu.getWorldPosition(new THREE.Vector3()), tuju = titikSasaran(ref, tunjuk);
    const P = tunjuk ? bahu.clone().add(tuju.clone().sub(bahu).normalize().multiplyScalar(.62 * sk)) : tuju;
    const lok = tunjuk ? [0, -.11, 0] : [0, -.06, 0];
    this.lmLengan(L, v, vv => { this.aturLengan(L, vv); const hnd = new THREE.Vector3(...lok).applyMatrix4(L.tangan.matrixWorld); return [hnd.x - P.x, hnd.y - P.y, hnd.z - P.z, tunjuk ? (vv[3] || 0) * .0015 : 0, (vv[2] - v0[2]) * .0004]; }, { iter: 10, ambang: 1e-6, batas: 175, bobot: [1, 1, .5, .8] });
    return v.slice();
  };
  const tugas = [];
  if (o.tunjukKe) tugas.push(['Ka', nilaiDi(o.tunjukKe, t, a, .35), true, x => x]);
  if (o.raih) for (const [sisi, kunciSisi] of [['Ka', 'ka'], ['Ki', 'ki']]) tugas.push([sisi, nilaiDi(o.raih, t, a, .35), false, x => (x && typeof x === 'object' && !Array.isArray(x) ? x[kunciSisi] : null)]);
  for (const [sisi, v, tunjuk, ambil] of tugas) {
    const asli = sisi === 'Ka' ? S.lKa : S.lKi, v0 = asli.slice(), keA = ambil(v.a);
    if ((keA === null || keA === undefined) && (v.k >= 1 || ambil(v.b) == null)) continue;
    const tujuA = sudutUntuk(sisi, keA, tunjuk, v0), dariB = v.k < 1 ? sudutUntuk(sisi, ambil(v.b), tunjuk, v0) : tujuA;
    for (let j = 0; j < 4; j++) asli[j] = lerp(dariB[j], tujuA[j], v.k);
    this.aturLengan(this.lengan[sisi], asli);
  }
};
/* Levenberg–Marquardt kecil atas 4 sudut lengan [maju, samping, putar, tekuk]: meminimalkan jumlah kuadrat kedalaman tembus SEMUA titik lengan
   terhadap SEMUA rintangan sekaligus (tangan yang terjepit antara meja dan paha mencari celah bebas, bukan bolak-balik), dengan redaman yang
   lebih suka menggerakkan bahu daripada memelintir/menekuk siku. Perubahan dibatasi ±85° dari pose asli. */
Tokoh3D.prototype.lenganTakTembus = function () {
  if (!this.akar.visible) return;
  this.akar.updateWorldMatrix(true, true);
  const cap = this.dn._cap, S = this.sudut, BOBOT = [1, 1, .3, .55], LANGKAH = 1.5;
  for (const sisi of ['Ki', 'Ka']) {
    const L = this.lengan[sisi], v = sisi === 'Ki' ? S.lKi : S.lKa, v0 = v.slice();
    const rintang = this.rintanganLengan(L.bahu.getWorldPosition(new THREE.Vector3()));
    const sisa = vv => {   // vektor kedalaman tembus (0 bila bebas) untuk semua pasangan titik × rintangan
      this.aturLengan(L, vv); const out = [];
      for (const q of this.titikLengan(L, sisi)) for (const o of rintang) { const u = siapRintang(o.m, cap); out.push((o.diri && !q.diri) || u._pusat.distanceTo(q.p) > u._jari + q.r + .05 ? 0 : Math.max(0, q.r - jarakKe(o.m, q.p, cap, o.tambah))); }
      return out;
    };
    const E = r => r.reduce((s, x) => s + x * x, 0);
    let r0 = sisa(v), e0 = E(r0), lam = -1;
    for (let iter = 0; iter < 8 && e0 > 2.5e-6; iter++) {
      const J = [0, 1, 2, 3].map(j => { const vj = v.slice(); vj[j] += LANGKAH; const rj = sisa(vj); return rj.map((x, k) => (x - r0[k]) / LANGKAH); });
      const A = [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => J[i].reduce((s, x, k) => s + x * J[j][k], 0))), g = [0, 1, 2, 3].map(i => J[i].reduce((s, x, k) => s + x * r0[k], 0));
      if (lam < 0) lam = 1e-3 * (A[0][0] + A[1][1] + A[2][2] + A[3][3]) / 4 + 1e-12;
      let maju = false;
      for (let coba = 0; coba < 4 && !maju; coba++) {
        const M = A.map((row, i) => row.map((x, j) => x + (i === j ? lam / BOBOT[i] : 0))), d = selesaikan4(M, g.map(x => -x));
        const v1 = v.map((x, j) => v0[j] + jepit(x + jepit(d[j], -25, 25) - v0[j], -85, 85)), r1 = sisa(v1), e1 = E(r1);
        if (e1 < e0) { for (let j = 0; j < 4; j++) v[j] = v1[j]; r0 = r1; e0 = e1; lam *= .4; maju = true; } else lam *= 5;
      }
      if (!maju) break;
    }
    this.aturLengan(L, v);
  }
};
function selesaikan4(M, b) {   // eliminasi Gauss 4×4 (pivot parsial)
  const n = 4, A = M.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; const piv = A[c][c] || 1e-12;
    for (let r = c + 1; r < n; r++) { const f = A[r][c] / piv; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; }
  }
  const x = [0, 0, 0, 0];
  for (let r = n - 1; r >= 0; r--) { let s = A[r][n]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / (A[r][r] || 1e-12); }
  return x;
}

/* --- CEK: tembus antar-benda, tokoh, kamera (dipanggil hasilCek tiap langkah waktu) --- */
const TITIK_BADAN = [['pinggul', 'pinggul', 0, -.02, 0, .13], ['badan', 'badan', 0, .12, 0, .14], ['badan', 'badan', 0, .38, 0, .14], ['kepala', 'kepalaIsi', 0, 0, 0, .19]];
Tokoh3D.prototype.titikPeriksa = function () {
  this.akar.updateWorldMatrix(true, true);
  const sk = this.akar.scale.x, out = [], d = (bag, obj, x, y, z, r, kendaraan) => out.push({ bag, p: new THREE.Vector3(x, y, z).applyMatrix4(obj.matrixWorld), r: r * sk, kendaraan });
  for (const [bag, nm, x, y, z, r] of TITIK_BADAN) d(bag, this[nm], x, y, z, r * (nm === 'kepalaIsi' ? this.R / .2 : 1), true);
  for (const n of ['Ki', 'Ka']) { const K = this.kaki[n]; d('paha', K.paha, 0, -.19, 0, .07, true); d('lutut', K.lutut, 0, 0, 0, .062, false); d('betis', K.lutut, 0, -.18, 0, .058, false); d('kaki', K.tumit, 0, -.03, .05, .05, false); }
  for (const n of ['Ki', 'Ka']) { const L = this.lengan[n]; d('siku', L.siku, 0, 0, 0, .045, false); d('tangan', L.tangan, 0, -.055, 0, .045, false); }
  return out;
};
function aabbBenda(o) { const b = new THREE.Box3(); o.updateWorldMatrix(true, true); o.traverse(m => { if (m.isMesh && m.userData.padat && !m.userData.tepi && !m.userData.tokoh && !m.userData.latar) { if (!m.geometry.boundingBox) m.geometry.computeBoundingBox(); b.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld)); } }); return b; }
Dunia3D.prototype.periksaTembus = function () {
  const cap = this._cap, hasil = [], TOL = .025, catat = s => { if (!hasil.includes(s)) hasil.push(s); }, padat = this.padat || [];
  // 1. tokoh menembus benda padat / tokoh lain
  for (const id in this.para) {
    const tk = this.para[id]; if (!tk.akar.visible || tk.o.padat === false) continue;
    const kend = tk.naik ? bendaAtas(tk.akar.parent, this) : null;
    const duduk = !!(tk.sudut && tk.sudut.p && tk.sudut.p.duduk);
    for (const q of tk.titikPeriksa()) {
      for (const m of padat) {
        const u = siapRintang(m, cap); if (u._pusat.distanceTo(q.p) > u._jari + q.r) continue;
        if (kend && m.userData.benda === kend) continue;   // duduk/naik: kontak dengan benda yang dinaiki wajar
        if (duduk && q.kendaraan && m.userData.benda && m.userData.benda.userData.jok) continue;   // pose duduk di atas kursi/sofa/kasur tanpa naik: tetap wajar
        if (q.r - jarakKe(m, q.p, cap) > TOL) catat(`tokoh "${id}" menembus ${namaBenda(m.userData.benda)} — geser tokoh/benda atau ubah pose`);
      }
      for (const id2 in this.para) { const lain = this.para[id2]; if (lain === tk || !lain.akar.visible || lain.o.padat === false || (q.bag !== 'badan' && q.bag !== 'kepala' && q.bag !== 'pinggul')) continue;
        if (q.r - Math.min(jarakKe(lain.mBadan, q.p, cap), jarakKe(lain.mKepala, q.p, cap)) > TOL * 1.5) catat(`tokoh "${id}" dan "${id2}" saling menembus — beri jarak`); }
    }
  }
  // 2. benda saling tembus (antar-benda tingkat atas; bagian satu benda tidak dibandingkan)
  const kelompok = new Map(); for (const m of padat) { const b = m.userData.benda; if (!kelompok.has(b)) kelompok.set(b, []); kelompok.get(b).push(m); }
  const daftar = [...kelompok.entries()].filter(([b]) => b && b.visible !== false).map(([b, ms]) => ({ b, ms, box: aabbBenda(b) })).filter(e => !e.box.isEmpty());
  for (let i = 0; i < daftar.length; i++) for (let j = i + 1; j < daftar.length; j++) {
    const A = daftar[i], B = daftar[j], ov = A.box.clone().intersect(B.box); if (ov.isEmpty()) continue;
    const s = ov.getSize(new THREE.Vector3()); if (Math.min(s.x, s.y, s.z) < TOL) continue;
    // toleransi: benda lunak (karung) saling menekan ±8 cm; benda menempel di dinding ruang (pintu, papan, jam, rak) ±15 cm
    const lunak = A.b.userData.lunak || B.b.userData.lunak, dinding = A.b.userData.jenis === 'ruang' || B.b.userData.jenis === 'ruang', tol = dinding ? .15 : lunak ? .08 : TOL;
    let tembus = false;
    for (const [P1, P2] of [[A, B], [B, A]]) { if (tembus) break;
      for (const m of P1.ms) { if (tembus) break; const bb = m.geometry.boundingBox || (m.geometry.computeBoundingBox(), m.geometry.boundingBox);
        for (let a = 0; a < 3 && !tembus; a++) for (let c = 0; c < 3 && !tembus; c++) for (let e = 0; e < 3 && !tembus; e++) {
          const p = new THREE.Vector3(lerp(bb.min.x, bb.max.x, .15 + a * .35), lerp(bb.min.y, bb.max.y, .15 + c * .35), lerp(bb.min.z, bb.max.z, .15 + e * .35)).applyMatrix4(m.matrixWorld);
          if (!ov.containsPoint(p)) continue;
          if (jarakKe(m, p, cap) > 0) continue;   // titik di dalam benda A (benda tipis pun ikut)
          for (const m2 of P2.ms) if (jarakKe(m2, p, cap) < -tol) { tembus = true; break; }
        } } }
    if (tembus) catat(`${namaBenda(A.b)} dan ${namaBenda(B.b)} saling menembus — geser salah satu atau ubah ukuran/anim`);
  }
  // 3. kamera di dalam / terlalu dekat benda atau kepala tokoh, atau di bawah lantai
  const kp = this.kamera.position;
  if (this._adaLantai && !this.a.bawahLantai && kp.y < this.lantaiDi(kp.x, kp.z) + .03) catat('kamera di bawah lantai (latar kosong) — naikkan kamera');
  for (const m of padat) { if (m.userData.dindingRuang) continue; const u = siapRintang(m, cap); if (u._pusat.distanceTo(kp) > u._jari + .2) continue; if (jarakKe(m, kp, cap) < .12) catat(`kamera di dalam/terlalu dekat ${namaBenda(m.userData.benda)} (benda terpotong) — mundurkan atau geser kamera`); }
  for (const id in this.para) { const tk = this.para[id]; if (tk.akar.visible && (jarakKe(tk.mKepala, kp, cap) < .1 || jarakKe(tk.mBadan, kp, cap) < .1)) catat(`kamera menembus tokoh "${id}" — mundurkan kamera`); }
  return hasil;
};
/** dipanggil hasilCek: semua dunia yang tergambar di bingkai ini */
function periksaTembus3D() { const out = []; for (const dn of M3.digambar || []) for (const s of dn.periksaTembus()) out.push(`adegan "${dn.a.id}": ${s}`); return out; }

/* --- nama jenis benda (untuk pesan cek): d.motor(…) → 'motor', d.kotak(…) → 'kotak', nama: '…' menang --- */
['kotak', 'bola', 'silinder', 'kapsul', 'kerucut', 'donat', 'bidang', 'ekstrusi', 'pohon', 'semak', 'batu', 'rumah', 'gedung', 'kota', 'jalan', 'lampuJalan', 'ruang', 'meja', 'kursi', 'sofa', 'kasur', 'rak', 'tv', 'laptop', 'hp', 'papan', 'ikon', 'koin', 'uang', 'batang', 'pai', 'panah', 'motor', 'mobil', 'warung', 'jam', 'kardus', 'mangkuk', 'gelas', 'buku', 'grup', 'nasi', 'karung', 'timbangan', 'pintu', 'jeriken', 'ember', 'drum', 'gentong', 'peti', 'lampuGantung', 'rakBarang']
  .forEach(n => { const asli = DP[n]; if (typeof asli !== 'function') return; DP[n] = function (...arg) { const r = asli.apply(this, arg); if (r && r.isObject3D) { if (n !== 'grup' || !r.userData.jenis) r.userData.jenis = n; const o = arg.find(x => x && typeof x === 'object' && !Array.isArray(x) && !x.isObject3D); if (o && o.nama) r.userData.namaBenda = o.nama; if (o && o.padat === false) r.userData.padatMati = true; } return r; }; });
