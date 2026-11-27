/* =====================================================================
   MESIN 3D motion-graphic-3d (Three.js r147 tertanam). Jangan disunting per video.
   Adegan yang punya dunia(d) digambar Three.js: cahaya + bayangan asli, bahan berkilau, kabut jarak, kamera 3D.
   Lapisan 2D (gambar(g, …): teks, label, notif, balon, grafik) dan subtitle ditumpuk di atasnya oleh mesin 2D.
   Deterministik: dunia dibangun SEKALI per adegan (dunia(d)), lalu tiap bingkai hanya diperbarui dari t
   (anim, tokoh, partikel, gerak(d, t, …)). Tanpa Math.random/Date: pakai acak(n), derau(x).
   Blok ini dimuat SEBELUM blok inti, jadi di tingkat atas hanya definisi (K, P, W, H dipakai saat dipanggil).
   ===================================================================== */
'use strict';
const M3 = { r: null, gagal: false, statTokoh: new Map(), dunia: new Map(), geo: new Map(), bahan: new Map(), tepi: [], env: new Map(), tekstur: new Map(), aktif: null, tebalTepi: 3 };
const D2R = Math.PI / 180;

/* gaya bahan 3D (KONFIG.gaya): kartun = plastik lembut + garis tepi gelap bernuansa (acuan RicksClips3000, bawaan)
   clay = tanah liat doff tanpa garis · mainan = plastik mengilap · lowpoly = sisi rata bersudut */
const GAYA3D_DASAR = {
  kartun:  { kasar: .62, logam: 0, env: .38, tepi: 3.4, datar: false, ekspos: 1.0, seg: 1 },
  clay:    { kasar: .92, logam: 0, env: .25, tepi: 0, datar: false, ekspos: 1.02, seg: 1 },
  mainan:  { kasar: .3, logam: 0, env: .7, tepi: 0, datar: false, ekspos: .98, seg: 1 },
  lowpoly: { kasar: .8, logam: 0, env: .3, tepi: 0, datar: true, ekspos: 1.0, seg: .45 }
};
function gaya3D() { return Object.assign({}, GAYA3D_DASAR[K.gaya] || GAYA3D_DASAR.kartun, K.bahan || {}); }

/* cahaya 3D per keadaan (adegan.suasana): warna cahaya kunci / bayang / tepi / kabut diambil dari SUASANA mesin 2D;
   di sini kekuatan + tinggi matahari + langit. sorot = lampu sorot dari atas, sekeliling gelap. */
const CAHAYA3D = {
  siang:  { matahari: .95, hemi: .42, tepi: .35, tinggi: 52, langit: ['#2F7FD8', '#7DBDF0', '#CFEAF8'], lantai: '#7FB069' },
  malam:  { matahari: .55, hemi: .4, tepi: 1.0, isi: .3, terang: .3, warnaTepi: '#9DB8FF', tinggi: 48, langit: ['#0B1446', '#1E2C74', '#34489A'], lantai: '#26306A' },
  kobalt: { matahari: .85, hemi: .45, tepi: .4, tinggi: 50, langit: ['#1E3388', '#2D4BB0', '#4A6FD0'], lantai: '#2D418E' },
  oranye: { matahari: 1.0, hemi: .38, tepi: .5, tinggi: 30, langit: ['#C9562E', '#E58A48', '#F6C27A'], lantai: '#C87442' },
  hijau:  { matahari: .9, hemi: .42, tepi: .35, tinggi: 50, langit: ['#5FA3C8', '#9FD0D8', '#DDF0DA'], lantai: '#8EBE88' },
  sorot:  { matahari: 0, hemi: .26, tepi: .95, isi: .3, terang: .3, warnaTepi: '#A8C0FF', bayang3: '#2E3858', tinggi: 70, sorot: 2.2, langit: ['#140F0C', '#241B14', '#33261B'], lantai: '#3B2E22' },
  aula:   { matahari: .75, hemi: .42, tepi: .6, terang: .38, bayang3: '#3A3E5E', tinggi: 60, langit: ['#4F4448', '#6E5F63', '#8F7F82'], lantai: '#756669' },
  senja:  { matahari: .95, hemi: .36, tepi: .7, terang: .4, tinggi: 16, langit: ['#3D3F9A', '#B35A8C', '#FF9E5E'], lantai: '#5D4A7A' }
};

/* ------------------------------------------------------------- warna + waktu */
const _warnaTmp = new Map();
function warna3(c) {   // '#hex' | 'rgb()' | THREE.Color → THREE.Color (sRGB → linear lewat ColorManagement)
  if (c && c.isColor) return c;
  const k = String(c || '#ffffff'); let v = _warnaTmp.get(k);
  if (!v) { v = new THREE.Color(); try { v.setStyle(k.startsWith('rgba') ? k.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)') : k); } catch (e) { v.set('#ff00ff'); } if (_warnaTmp.size > 4000) _warnaTmp.clear(); _warnaTmp.set(k, v); }
  return v;
}
function gelapkan(c, k = .7) { return campur(c, P.gelap, k); }
function terangkan(c, k = .4) { return campur(c, '#ffffff', k); }
/** waktu lokal adegan: angka = detik adegan, string = rujukan ('L03.w2', 'hook.akhir') */
function wl(v, a) { if (v === undefined || v === null) return undefined; if (typeof v === 'number') return v; const x = w(v); return x === undefined ? undefined : x - (a ? a.mulai : 0); }
/** keyframe objek berisi angka/larik (kamera, anim): nilai yang tidak ditulis ikut keyframe sebelumnya */
function kunci3(t, kf, a) {
  if (!kf || !kf.length) return undefined;
  if (!kf._siap) {
    let lalu = {};
    kf.forEach(k => { k[0] = wl(k[0], a) ?? 0; if (k[1] && typeof k[1] === 'object' && !Array.isArray(k[1])) { k[1] = Object.assign({}, lalu, k[1]); lalu = k[1]; } });
    kf._siap = true;
  }
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) {
    if (t < kf[i][0]) {
      const [t0, A0] = kf[i - 1], [t1, B0, e] = kf[i], k = fe(e || 'inOutCubic')((t - t0) / Math.max(1e-6, t1 - t0));
      const camp = (x, y) => (typeof x === 'number' && typeof y === 'number') ? lerp(x, y, k) : (Array.isArray(x) && Array.isArray(y)) ? x.map((v, j) => lerp(v, y[j] ?? v, k)) : (typeof x === 'string' && x[0] === '#' && typeof y === 'string') ? campur(x, y, k) : (k < .5 ? x : y);
      if (A0 && typeof A0 === 'object' && !Array.isArray(A0)) { const o = {}; for (const q in Object.assign({}, A0, B0)) o[q] = camp(A0[q] ?? B0[q], B0[q] ?? A0[q]); return o; }
      return camp(A0, B0);
    }
  }
  return kf[kf.length - 1][1];
}

/* ------------------------------------------------------------- renderer */
function rendererM3() {
  if (M3.r || M3.gagal) return M3.r;
  if (typeof THREE === 'undefined') { M3.gagal = true; catatan.push('Three.js tidak termuat (blok three-js kosong?)'); return null; }
  try {
    THREE.ColorManagement.legacyMode = false;
    const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false, powerPreference: 'high-performance' });
    r.outputEncoding = THREE.sRGBEncoding;
    // tone mapping 'lutut lembut': linier sampai 0,8 lalu ditekan halus ke 1 menurut kanal terang → warna palet tetap jenuh
    // (ACES memudarkan warna kartun jadi pastel). K.tonemap: 'aces' untuk kembali ke ACES.
    if (K.tonemap === 'aces') r.toneMapping = THREE.ACESFilmicToneMapping;
    else {
      THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
        'vec3 CustomToneMapping( vec3 color ) { return color; }',
        'vec3 CustomToneMapping( vec3 color ) { color *= toneMappingExposure; float m = max( max( color.r, color.g ), color.b ); const float k = 0.8; if ( m > k ) { float m2 = k + ( 1.0 - k ) * ( 1.0 - exp( -( m - k ) / ( 1.0 - k ) ) ); color *= m2 / m; } return color; }');
      r.toneMapping = THREE.CustomToneMapping;
    }
    r.toneMappingExposure = 1;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setPixelRatio(1);
    M3.r = r;
  } catch (e) { M3.gagal = true; catatan.push('WebGL tidak tersedia di browser ini: ' + e.message + ' (buka di Chrome/Edge dengan akselerasi grafis aktif)'); }
  return M3.r;
}

/* ------------------------------------------------------------- geometri (dibagi, disimpan) */
function geoSimpan(kunci, buat, sdf) { let g = M3.geo.get(kunci); if (!g) { g = buat(); g.userData.bersama = true; if (sdf) g.userData.sdf = sdf; M3.geo.set(kunci, g); } return g; }
const segQ = n => Math.max(3, Math.round(n * (gaya3D().seg || 1)));
/** kotak bersudut bulat (w lebar x, h tinggi y, dl dalam z), pusat di tengah; normal halus di tepi */
function geoKotak(w, h, dl, r = 0, m = 4) {
  r = Math.max(0, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, dl / 2 - 1e-3));
  const kunci = `kotak|${w.toFixed(3)}|${h.toFixed(3)}|${dl.toFixed(3)}|${r.toFixed(3)}|${m}`;
  return geoSimpan(kunci, () => {
    if (r < 1e-3) return new THREE.BoxGeometry(w, h, dl);
    const s = 2 * m + 1, g = new THREE.BoxGeometry(1, 1, 1, s, s, s), pos = g.attributes.position, nor = g.attributes.normal;
    const hx = w / 2, hy = h / 2, hz = dl / 2, ix = hx - r, iy = hy - r, iz = hz - r;
    const peta = (c, half) => { const k = Math.round((c + .5) * s); return k <= m ? -half + r * (k / m) : half - r * ((s - k) / m); };
    for (let i = 0; i < pos.count; i++) {
      const x = peta(pos.getX(i), hx), y = peta(pos.getY(i), hy), z = peta(pos.getZ(i), hz);
      const cx = jepit(x, -ix, ix), cy = jepit(y, -iy, iy), cz = jepit(z, -iz, iz);
      let dx = x - cx, dy = y - cy, dz = z - cz; const L = Math.hypot(dx, dy, dz);
      if (L > 1e-6) { dx /= L; dy /= L; dz /= L; pos.setXYZ(i, cx + dx * r, cy + dy * r, cz + dz * r); nor.setXYZ(i, dx, dy, dz); }
      else pos.setXYZ(i, x, y, z);
    }
    g.computeBoundingSphere(); return g;
  }, { j: 'kotak', h: [w / 2, h / 2, dl / 2], r });
}
const geoBola = (r, ws = 32, hs = 22) => geoSimpan(`bola|${r}|${ws}|${hs}`, () => new THREE.SphereGeometry(r, segQ(ws), segQ(hs)), { j: 'bola', r });
const geoSilinder = (ra, rb, h, n = 32) => geoSimpan(`sil|${ra}|${rb}|${h}|${n}`, () => new THREE.CylinderGeometry(ra, rb, h, segQ(n), 1), { j: 'silinder', ra, rb, h2: h / 2 });
const geoKapsul = (r, p, n = 20) => geoSimpan(`kap|${r}|${p}|${n}`, () => new THREE.CapsuleGeometry(r, p, segQ(6), segQ(n)), { j: 'kapsul', r, h2: p / 2 });
const geoTorus = (R, r, n = 40) => geoSimpan(`tor|${R}|${r}|${n}`, () => new THREE.TorusGeometry(R, r, segQ(14), segQ(n)), { j: 'torus', R, r });
const geoKerucut = (r, h, n = 28) => geoSimpan(`ker|${r}|${h}|${n}`, () => new THREE.ConeGeometry(r, h, segQ(n), 1), { j: 'silinder', ra: 0, rb: r, h2: h / 2 });
const geoBidang = (w, h) => geoSimpan(`bid|${w}|${h}`, () => new THREE.PlaneGeometry(w, h), { j: 'kotak', h: [w / 2, h / 2, .01], r: 0 });

/* ------------------------------------------------------------- bahan (material) */
/** o: warna, kasar, logam, pancar (warna menyala), pancarKuat, tembus (0..1 opasitas), peta (Texture), datar, ganda, unik, dasar (tanpa cahaya) */
function bahan(o = {}) {
  const G = gaya3D(), wr = o.warna ?? P.utama;
  const kunci = ['b', wr, o.kasar ?? G.kasar, o.logam ?? G.logam, o.pancar || '', o.pancarKuat ?? 1, o.tembus ?? 1, o.datar ?? G.datar, o.ganda ? 1 : 0, o.dasar ? 1 : 0, o.env ?? G.env, o.peta ? o.peta.uuid : ''].join('|');
  if (!o.unik) { const m = M3.bahan.get(kunci); if (m) return m; }
  let m;
  if (o.dasar) m = new THREE.MeshBasicMaterial({ color: warna3(wr).clone(), map: o.peta || null, transparent: (o.tembus ?? 1) < 1 || !!o.petaAlfa, opacity: o.tembus ?? 1, side: o.ganda ? THREE.DoubleSide : THREE.FrontSide, toneMapped: o.toneMapped ?? false });
  else m = new THREE.MeshStandardMaterial({
    color: warna3(wr).clone(), roughness: o.kasar ?? G.kasar, metalness: o.logam ?? G.logam, envMapIntensity: o.env ?? G.env,
    emissive: o.pancar ? warna3(o.pancar).clone() : new THREE.Color(0), emissiveIntensity: o.pancar ? (o.pancarKuat ?? 1) : 0,
    map: o.peta || null, flatShading: !!(o.datar ?? G.datar), transparent: (o.tembus ?? 1) < 1 || !!o.petaAlfa, opacity: o.tembus ?? 1,
    side: o.ganda ? THREE.DoubleSide : THREE.FrontSide });
  if (o.petaAlfa) { m.depthWrite = false; }
  m.userData.bersama = !o.unik;
  if (!o.unik) M3.bahan.set(kunci, m);
  return m;
}
/* garis tepi kartun: kulit terbalik (BackSide) yang didorong sepanjang normal di RUANG LAYAR → tebal tetap ±3 px di 1080p
   walau benda diskalakan atau jauh; warna = warna benda digelapkan ke P.gelap (bernuansa, bukan hitam polos) */
function bahanTepi(wr) {
  const kunci = 'tepi|' + wr; let m = M3.bahan.get(kunci); if (m) return m;
  m = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { warna: { value: warna3(wr).clone() }, tebal: { value: M3.tebalTepi }, res: { value: new THREE.Vector2(1080, 1920) } }]),
    vertexShader: `uniform float tebal; uniform vec2 res;
      #include <fog_pars_vertex>
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 p = projectionMatrix * mvPosition;
        vec3 n = normalize(normalMatrix * normal);
        vec2 d = (projectionMatrix * vec4(n, 0.0)).xy; float l = length(d); if (l > 1e-5) d /= l;
        p.xy += d * tebal * 2.0 / res * p.w; gl_Position = p;
        #include <fog_vertex>
      }`,
    fragmentShader: `uniform vec3 warna;
      #include <fog_pars_fragment>
      void main() { gl_FragColor = vec4(warna, 1.0);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
      }`,
    side: THREE.BackSide, fog: true });
  m.userData.bersama = true; M3.bahan.set(kunci, m); M3.tepi.push(m); return m;
}
/** mesh + bayangan + garis tepi otomatis (gaya kartun). o.tepi: false | warna; o.bayang: false */
function mesh3(geo, o = {}) {
  const m = new THREE.Mesh(geo, o.bahan || bahan(o));
  m.castShadow = o.bayang !== false && (o.tembus ?? 1) >= 1 && !o.dasar; m.receiveShadow = o.terimaBayang !== false && !o.dasar;
  const G = gaya3D();
  if (G.tepi > 0 && o.tepi !== false && !o.dasar && (o.tembus ?? 1) >= 1) {
    const wr = typeof o.tepi === 'string' ? o.tepi : campur(o.warna ?? P.utama, P.gelap, .78);
    const t = new THREE.Mesh(geo, bahanTepi(wr)); t.userData.tepi = true; t.castShadow = false; t.receiveShadow = false; m.add(t);
  }
  // anti-tembus (06-tabrak.js): benda padat diperiksa/dihindari; pijak = permukaan tempat kaki menapak; latar = langit/bukit/awan (tidak diperiksa)
  m.userData.padat = o.padat !== false && !o.dasar && !o.latar; if (o.pijak) m.userData.pijak = true; if (o.latar) m.userData.latar = true;
  return m;
}

/* ------------------------------------------------------------- tekstur kanvas */
function teksturKanvas(cv, o = {}) {
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  if (o.ulang) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.ulang[0], o.ulang[1]); }
  return t;
}
/** pola permukaan (dibuat sekali per jenis + warna): rumput, aspal, ubin, kayu, pasir, beton, karpet, papan */
function teksturPola(jenis, wr, o = {}) {
  const kunci = `pola|${jenis}|${wr}|${o.wr2 || ''}`; let t = M3.tekstur.get(kunci); if (t) return t;
  const S = 512, cv = kanvasBaru(S, S), c = cv.getContext('2d');
  c.fillStyle = wr; c.fillRect(0, 0, S, S);
  const gelap = campur(wr, '#000', .14), terang = campur(wr, '#fff', .12), w2 = o.wr2 || gelap;
  if (jenis === 'ubin') { c.strokeStyle = campur(wr, '#000', .25); c.lineWidth = 6; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * S / 4, 0); c.lineTo(i * S / 4, S); c.moveTo(0, i * S / 4); c.lineTo(S, i * S / 4); c.stroke(); } for (let i = 0; i < 16; i++) { c.fillStyle = alfa(i % 2 ? terang : gelap, .25); c.fillRect((i % 4) * S / 4 + 3, Math.floor(i / 4) * S / 4 + 3, S / 4 - 6, S / 4 - 6); } }
  else if (jenis === 'kayu') { for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? campur(wr, '#000', .06) : campur(wr, '#fff', .05); c.fillRect(0, i * S / 6, S, S / 6); c.fillStyle = campur(wr, '#000', .3); c.fillRect(0, i * S / 6, S, 3); c.fillRect(((i * 137) % 5) * S / 5, i * S / 6, 3, S / 6); for (let j = 0; j < 5; j++) { c.strokeStyle = alfa(gelap, .35); c.lineWidth = 2; c.beginPath(); const y = i * S / 6 + 12 + j * 14; c.moveTo(0, y); for (let x = 0; x <= S; x += 32) c.lineTo(x, y + Math.sin(x * .02 + i + j) * 3); c.stroke(); } } }
  else if (jenis === 'aspal' || jenis === 'beton' || jenis === 'pasir' || jenis === 'rumput' || jenis === 'karpet') {
    const n = jenis === 'rumput' ? 2600 : 3800;
    for (let i = 0; i < n; i++) { const x = acak(i * 3.1) * S, y = acak(i * 7.7 + 1) * S, r = jenis === 'rumput' ? 2 + acak(i) * 5 : 1 + acak(i) * 2.2; c.fillStyle = alfa(acak(i * 5.3) > .5 ? terang : gelap, jenis === 'rumput' ? .5 : .55); if (jenis === 'rumput') { c.fillRect(x, y, 2, r * 2); } else c.fillRect(x, y, r, r); }
    if (jenis === 'beton') { c.strokeStyle = alfa(campur(wr, '#000', .35), .7); c.lineWidth = 4; c.beginPath(); c.moveTo(0, S / 2); c.lineTo(S, S / 2); c.moveTo(S / 2, 0); c.lineTo(S / 2, S); c.stroke(); }
  }
  else if (jenis === 'garis') { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? w2 : wr; c.fillRect(i * S / 8, 0, S / 8, S); } }
  else if (jenis === 'bata') { const nat = campur(wr, '#3A2A22', .45); c.fillStyle = nat; c.fillRect(0, 0, S, S); for (let r = 0; r < 8; r++) for (let k = -1; k < 5; k++) { const x = k * 128 + (r % 2) * 64 + 4, y = r * 64 + 4; c.fillStyle = campur(wr, acak(r * 13 + k) > .5 ? '#000' : '#fff', acak(r * 7 + k * 3) * .14); c.fillRect(x, y, 120, 56); } }
  else if (jenis === 'kotak') { for (let i = 0; i < 64; i++) { c.fillStyle = (i + Math.floor(i / 8)) % 2 ? w2 : wr; c.fillRect((i % 8) * S / 8, Math.floor(i / 8) * S / 8, S / 8, S / 8); } }
  t = teksturKanvas(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.userData.bersama = true; M3.tekstur.set(kunci, t); return t;
}
/** motif kain (baju, rok, jarik, sarung): kotak | garis | batik | bunga | polkadot | goni; warna dasar + warna motif */
function teksturMotif(jenis, wr, wr2) {
  const kunci = `motif|${jenis}|${wr}|${wr2 || ''}`; let t = M3.tekstur.get(kunci); if (t) return t;
  const S = 256, cv = kanvasBaru(S, S), c = cv.getContext('2d'), m2 = wr2 || campur(wr, '#ffffff', .55), gelap = campur(wr, '#000000', .3);
  c.fillStyle = wr; c.fillRect(0, 0, S, S);
  if (jenis === 'kotak') { c.globalAlpha = .55; c.fillStyle = m2; for (let i = 0; i < 4; i++) { c.fillRect(i * 64 + 20, 0, 22, S); c.fillRect(0, i * 64 + 20, S, 22); } c.globalAlpha = .35; c.fillStyle = gelap; for (let i = 0; i < 4; i++) { c.fillRect(i * 64 + 4, 0, 6, S); c.fillRect(0, i * 64 + 4, S, 6); } }
  else if (jenis === 'garis') { c.fillStyle = m2; for (let i = 0; i < 6; i++) c.fillRect(0, i * S / 6 + 6, S, 14); }
  else if (jenis === 'polkadot') { c.fillStyle = m2; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(i * 64 + 32 + (j % 2) * 32, j * 64 + 32, 11, 0, 7); c.fill(); } }
  else if (jenis === 'bunga') { for (let i = 0; i < 9; i++) { const x = acak(i * 3.1) * S, y = acak(i * 7.3) * S; c.fillStyle = m2; for (let k = 0; k < 5; k++) { const a = k * 1.2566; c.beginPath(); c.ellipse(x + Math.cos(a) * 11, y + Math.sin(a) * 11, 9, 6, a, 0, 7); c.fill(); } c.fillStyle = gelap; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }
  else if (jenis === 'batik') {   // kawung + garis parang sederhana
    c.strokeStyle = m2; c.fillStyle = m2; c.lineWidth = 5;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * 64 + 32, y = j * 64 + 32; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; c.beginPath(); c.ellipse(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 13, 7, a, 0, 7); c.stroke(); } c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); }
    c.strokeStyle = gelap; c.lineWidth = 3; for (let i = -4; i < 8; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64 + S, S); c.stroke(); }
  }
  else if (jenis === 'goni') { for (let i = 0; i < S; i += 6) { c.fillStyle = alfa(i % 12 ? gelap : m2, .16); c.fillRect(i, 0, 3, S); c.fillRect(0, i, S, 3); } for (let i = 0; i < 900; i++) { c.fillStyle = alfa(acak(i) > .5 ? gelap : m2, .3); c.fillRect(acak(i * 3.3) * S, acak(i * 7.7) * S, 2, 2); } }
  t = teksturKanvas(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(jenis === 'goni' ? 5 : 3, jenis === 'goni' ? 5 : 2); t.userData.bersama = true; M3.tekstur.set(kunci, t); return t;
}
/** tekstur teks (kanvas): {tex, w, h} ukuran piksel. Teks putih bila o.putih (supaya bisa diwarnai bahan). */
function teksturTeks(s, o = {}) {
  const uk = o.px || 160, font = `${o.berat || 900} ${uk}px ${o.font === 'teks' ? FONT.teks : o.font === 'mono' ? FONT.mono : FONT.judul}`;
  const baris = String(s).replace(/\*/g, '').split('\n'), cv0 = kanvasBaru(8, 8), c0 = cv0.getContext('2d'); c0.font = font;
  const lb = Math.max(...baris.map(b => c0.measureText(b).width)), pad = (o.pad ?? .22) * uk, lh = uk * 1.12;
  const cw = Math.ceil(lb + pad * 2), ch = Math.ceil(lh * baris.length + pad * 2 - uk * .12);
  const cv = kanvasBaru(cw, ch), c = cv.getContext('2d');
  if (o.latar) { c.fillStyle = o.latar; const p = new Path2D(); bulatSudut(p, 0, 0, cw, ch, (o.r ?? .3) * uk); c.fill(p); }
  c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  baris.forEach((b, i) => { const y = pad + lh * (i + .5) - uk * .04;
    if (o.garis) { c.strokeStyle = o.garis; c.lineWidth = uk * (o.tebalGaris ?? .14); c.strokeText(b, cw / 2, y); }
    c.fillStyle = o.warna || '#ffffff'; c.fillText(b, cw / 2, y); });
  const tex = teksturKanvas(cv); tex.anisotropy = 8;
  return { tex, w: cw, h: ch };
}

/* ------------------------------------------------------------- peta lingkungan (pantulan lembut) per keadaan */
function petaLingkungan(atas, tengah, bawah, kunciTambahan = '') {
  const kunci = [atas, tengah, bawah, kunciTambahan].join('|'); let e = M3.env.get(kunci); if (e) return e;
  const r = rendererM3(); if (!r) return null;
  const sc = new THREE.Scene(), geo = new THREE.SphereGeometry(10, 32, 16);
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
    uniforms: { a: { value: warna3(atas).clone() }, b: { value: warna3(tengah).clone() }, c: { value: warna3(bawah).clone() } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 a; uniform vec3 b; uniform vec3 c; varying vec3 vP; void main(){ float y = vP.y; vec3 col = y > 0.0 ? mix(b, a, pow(y, .6)) : mix(b, c, pow(-y, .5)); gl_FragColor = vec4(col, 1.0); }' });
  sc.add(new THREE.Mesh(geo, mat));
  // dua panel cahaya lembut (kesan studio) → kilau halus di benda bulat
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.35, 1.3, 1.25), side: THREE.DoubleSide }));
  panel.position.set(-5, 6, 5); panel.lookAt(0, 0, 0); sc.add(panel);
  const p2 = panel.clone(); p2.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(.6, .65, .75), side: THREE.DoubleSide }); p2.position.set(6, 3, -4); p2.lookAt(0, 0, 0); sc.add(p2);
  const pm = new THREE.PMREMGenerator(r); e = pm.fromScene(sc, .02).texture; pm.dispose(); geo.dispose(); mat.dispose();
  M3.env.set(kunci, e); return e;
}

/* ------------------------------------------------------------- dunia per adegan (dibangun sekali, LRU kecil) */
function buang3(obj) {   // lepaskan geometri/bahan/tekstur milik dunia ini (yang dibagi bersama tidak)
  obj.traverse(o => {
    if (o.geometry && !o.geometry.userData.bersama) o.geometry.dispose();
    const ms = o.material ? [].concat(o.material) : [];
    ms.forEach(m => { if (m.userData && m.userData.bersama) return; ['map', 'emissiveMap', 'alphaMap'].forEach(k => { if (m[k] && !(m[k].userData && m[k].userData.bersama)) m[k].dispose(); }); m.dispose(); });
  });
}
/* eksposur otomatis (sekali per adegan, keadaan t = 0 → deterministik): render kecil 54×96, ukur kecerahan rata-rata bagian tengah,
   setel ekspos ke target keadaan (C3.terang; terang .46, gelap .3). Adegan keruh/gosong tidak terjadi lagi. adegan.ekspos menimpa. */
function ukurEksposur(dn) {
  const r = M3.r, a = dn.a; if (!r || a.ekspos !== undefined || K.eksposOtomatis === false) { if (a.ekspos !== undefined) dn.ekspos = a.ekspos; return; }
  aturKamera3D(dn, a, 0, a.mulai); dn.cahayaIkutKamera();
  const w = 54, h = Math.round(54 * H / W); r.setSize(w, h, false); r.toneMappingExposure = dn.ekspos; r.shadowMap.needsUpdate = true; r.render(dn.scene, dn.kamera);
  const gl = r.getContext(), px = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let jumlah = 0, n = 0;
  for (let y = Math.floor(h * .15); y < h * .8; y++) for (let x = Math.floor(w * .12); x < w * .88; x++) { const i = (y * w + x) * 4; jumlah += (px[i] * .2126 + px[i + 1] * .7152 + px[i + 2] * .0722) / 255; n++; }
  const rata = n ? jumlah / n : .4, target = dn.C3.terang ?? .46;
  if (rata > .01) dn.ekspos *= jepit(Math.pow(target / rata, .65), .78, 1.7);
}
function duniaAdegan(a) {
  let dn = M3.dunia.get(a.i);
  if (dn) { M3.dunia.delete(a.i); M3.dunia.set(a.i, dn); return dn; }
  dn = new Dunia3D(a);
  const lama = MEMBANGUN; MEMBANGUN = true;
  try { a.dunia(dn); }
  catch (e) { console.error('Galat di dunia adegan', a.id, e); catatan.push('Galat di dunia adegan ' + a.id + ': ' + e.message); }
  finally { MEMBANGUN = lama; }
  dn.selesaiBangun();
  try { ukurEksposur(dn); } catch (e) { console.warn('ukur eksposur', e); }
  M3.dunia.set(a.i, dn);
  while (M3.dunia.size > 4) { const k = M3.dunia.keys().next().value, d0 = M3.dunia.get(k); M3.dunia.delete(k); buang3(d0.scene); }
  return dn;
}
function hapusDunia3D() { M3.dunia.forEach(d => buang3(d.scene)); M3.dunia.clear(); }

/* ------------------------------------------------------------- kamera 3D */
function kameraBawaan() { return { dari: [0, 1.45, 5], ke: [0, 1.15, 0], fov: POTRET ? 40 : 30, guling: 0 }; }
function aturKamera3D(dn, a, t, T) {
  const cam = dn.kamera, k0 = kameraBawaan();
  let k = a.kamera, bidikan = false;
  if (k === undefined && Object.keys(dn.para).length) k = a.kamera = { bidik: Object.keys(dn.para)[0], jenis: 'penuh', gerak: 'dorong' };   // tanpa kamera: bidik tokoh pertama
  if (typeof k === 'function') k = k(t, dn);
  else if (Array.isArray(k) && k.some(e => adaBidikan(e[1]))) { k = kameraDaftarBidikan(dn, a, t); bidikan = true; }   // 07-bidikan.js
  else if (adaBidikan(k)) { BEKU = metrikBeku(dn, a, 0, 0, k, a.d); try { k = resolBidikan(dn, k, jepit(t / Math.max(.01, a.d)), a) || {}; } finally { BEKU = null; } bidikan = true; }
  else if (Array.isArray(k)) k = kunci3(t, k, a);
  else if (k && k.orbit) {   // orbit: { ke, jarak, tinggi, sudut: [awal, akhir] (derajat, 0 = depan), ease }
    const o = k, s = lerp(o.sudut ? o.sudut[0] : -15, o.sudut ? o.sudut[1] : 15, fe(o.ease || 'inOutSine')(jepit(t / Math.max(.01, a.d)))) * D2R, ke = o.ke || k0.ke, j = o.jarak ?? 6;
    k = { ke, dari: [ke[0] + Math.sin(s) * j, (o.tinggi ?? 1.6), ke[2] + Math.cos(s) * j], fov: o.fov };
  }
  k = Object.assign({}, k0, k || {});
  let dari = k.dari.slice(), ke = typeof k.ke === 'string' ? dn.titik(k.ke) : k.ke.slice();
  if (a.ikuti && !bidikan) { const p = dn.titikDasar(a.ikuti); for (let i = 0; i < 3; i++) { dari[i] += p[i]; if (typeof k.ke !== 'string') ke[i] += p[i]; } }   // ikuti: dari/ke RELATIF ke benda/tokoh yang diikuti
  let guling = k.guling || 0;
  if (K.kameraHidup !== false && a.kameraHidup !== false) {   // napas kamera (genggam tangan)
    const q = a.i * 7.3; dari[0] += derau(T * .23 + q) * .035; dari[1] += derau(T * .19 + q + 3) * .03; ke[0] += derau(T * .17 + q + 5) * .02; ke[1] += derau(T * .21 + q + 9) * .02; guling += derau(T * .11 + q) * .35;
  }
  if (a.guncang) { const gk = typeof a.guncang === 'function' ? a.guncang(t) : (Array.isArray(a.guncang) ? kunci(t, a.guncang) : a.guncang); if (gk) { const f = Math.floor(T * 30); dari[0] += (acak(f) - .5) * .12 * gk; dari[1] += (acak(f + 9) - .5) * .12 * gk; ke[0] += (acak(f + 4) - .5) * .08 * gk; } }
  cam.fov = k.fov ?? k0.fov; cam.aspect = W / H; cam.near = .05; cam.far = 500; cam.updateProjectionMatrix();
  if (dn._adaLantai && !a.bawahLantai) { const yl = dn.lantaiDi(dari[0], dari[2]) + .12; if (dari[1] < yl) dari[1] = yl; }   // kamera tidak pernah di bawah lantai (sudut rendah 'rendah' dulu menembus lantai → latar kosong)
  cam.position.set(dari[0], dari[1], dari[2]); cam.up.set(0, 1, 0); cam.lookAt(ke[0], ke[1], ke[2]);
  if (guling) cam.rotateZ(guling * D2R);
  cam.updateMatrixWorld(); dn._ke = ke;
}

/* ------------------------------------------------------------- menggambar adegan 3D ke kanvas 2D */
function gambar3D(c, a, t) {
  const r = rendererM3(); if (!r) { c.fillStyle = P.latar; c.fillRect(0, 0, W, H); return null; }
  const dn = duniaAdegan(a), T = a.mulai + t;
  aturKamera3D(dn, a, t, T);
  dn.perbarui(t, T);
  dn._bolehBeku = true; try { aturKamera3D(dn, a, t, T); } finally { dn._bolehBeku = false; }   // sekali lagi: kamera yang mengikuti tokoh/benda memakai posisi bingkai ini (boleh membekukan metrik bidikan)
  dn.cahayaIkutKamera();
  const w = Math.max(2, Math.round(W * SK)), h = Math.max(2, Math.round(H * SK));
  if (r.domElement.width !== w || r.domElement.height !== h) r.setSize(w, h, false);
  M3.tebalTepi = (dn.G.tepi || 0) * SK * U;
  M3.tepi.forEach(m => { m.uniforms.tebal.value = M3.tebalTepi; m.uniforms.res.value.set(w, h); });
  r.toneMappingExposure = dn.ekspos;
  r.shadowMap.needsUpdate = true;
  r.render(dn.scene, dn.kamera);
  c.drawImage(r.domElement, 0, 0, W, H);
  M3.aktif = dn; (M3.digambar || (M3.digambar = [])).push(dn);   // dunia yang tergambar di bingkai ini (cek anti-tembus)
  if (!MEMBANGUN) dn.daftarWajah();
  return dn;
}
/** titik 3D → piksel kanvas (x, y) memakai kamera adegan terakhir yang digambar; z > 1 = di belakang kamera */
function keLayar(dn, p) { const v = new THREE.Vector3(p[0], p[1], p[2]).project(dn.kamera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
