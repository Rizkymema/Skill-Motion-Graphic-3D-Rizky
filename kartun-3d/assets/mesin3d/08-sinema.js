/* ------------------------------------------------------------- RENDER SINEMATIK (sejak 27 Nov 2026)
   Permintaan pengguna: "upgrade versi 100% realistis" → dipilih "render sinematik, tokoh tetap kartun".
   Pasca-proses HDR buatan sendiri (inti Three r147, tanpa EffectComposer):
     1. adegan → target HDR (half float, MSAA 4×), tanpa tone mapping;
     2. kedalaman → target setengah resolusi (MeshDepthMaterial, sprite/partikel disembunyikan);
     3. warna diperkecil ke 1/4 dan 1/8 lalu dikaburkan gaussian dua arah;
     4. gabung ke layar: KEDALAMAN RUANG (yang jauh/dekat dari fokus kabur; fokus = jarak kamera → sasaran bidikan, jadi close-up
        latarnya kabur kuat, bidikan lebar hampir tajam), BLOOM (bagian > 1: lampu, mata menyala, layar), tone mapping lutut lembut,
        WARNA FILM (kontras S lembut, sorot hangat / bayang dingin, saturasi), VIGNET, BUTIR FILM deterministik per bingkai.
   Bahan (sekali per dunia): relief dari tekstur yang sudah ada (kayu, bata, goni, motif kain, tulisan karung) + variasi kilap mikro.
   Aktif bila KONFIG.gaya 'sinematik' (bawaan kartun-3d) atau KONFIG.sinema: true. Mati: KONFIG.sinema: false / adegan.sinema: false.
   Atur: KONFIG/adegan dof (pengali kabur, 0 = mati, bawaan 1), fokus (m | id tokoh | nama benda), bloom (.5), vignet (.22), butir (.02),
   hangat (1 = sorot hangat/bayang dingin, 0 = netral). Deterministik: tidak memakai waktu nyata atau Math.random. */
const SIN = { siap: false, rt: {}, ukuran: '' };
function sinemaAktif(dn) { const a = dn.a; if (a.sinema === false || K.sinema === false) return false; return !!(K.sinema || dn.G.sinema || a.sinema); }
function _sinPilih(nama, bawaan, a) { return a[nama] ?? K[nama] ?? bawaan; }

function sinemaSiapkan(r) {
  if (SIN.siap) return SIN.ok;
  SIN.siap = true;
  const gl2 = r.capabilities.isWebGL2, ext = r.extensions.has('EXT_color_buffer_float') || r.extensions.has('EXT_color_buffer_half_float');
  SIN.tipe = gl2 && ext ? THREE.HalfFloatType : THREE.UnsignedByteType;
  SIN.msaa = gl2 ? 4 : 0;
  SIN.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  SIN.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); SIN.quad.frustumCulled = false;
  SIN.sc = new THREE.Scene(); SIN.sc.add(SIN.quad);
  SIN.depthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  const vs = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  SIN.turun = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, px: { value: new THREE.Vector2() } }, vertexShader: vs, depthTest: false, depthWrite: false,
    fragmentShader: 'uniform sampler2D t; uniform vec2 px; varying vec2 vUv; void main(){ vec3 c = texture2D(t, vUv + px * vec2(-1.,-1.)).rgb + texture2D(t, vUv + px * vec2(1.,-1.)).rgb + texture2D(t, vUv + px * vec2(-1.,1.)).rgb + texture2D(t, vUv + px * vec2(1.,1.)).rgb; gl_FragColor = vec4(c * .25, 1.); }' });
  SIN.kabur = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, arah: { value: new THREE.Vector2() } }, vertexShader: vs, depthTest: false, depthWrite: false,
    fragmentShader: 'uniform sampler2D t; uniform vec2 arah; varying vec2 vUv; void main(){ vec3 c = texture2D(t, vUv).rgb * .2270270270; c += (texture2D(t, vUv + arah * 1.3846153846).rgb + texture2D(t, vUv - arah * 1.3846153846).rgb) * .3162162162; c += (texture2D(t, vUv + arah * 3.2307692308).rgb + texture2D(t, vUv - arah * 3.2307692308).rgb) * .0702702703; gl_FragColor = vec4(c, 1.); }' });
  SIN.gabung = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: { tW: { value: null }, tA: { value: null }, tC: { value: null }, tD: { value: null }, near: { value: .05 }, far: { value: 500 }, fokus: { value: 3 }, dof: { value: 1 },
      ekspos: { value: 1 }, bloom: { value: .5 }, vignet: { value: .22 }, butir: { value: .02 }, seed: { value: 0 }, aspek: { value: 9 / 16 }, hangat: { value: 1 } },
    vertexShader: vs,
    fragmentShader: `#include <packing>
      uniform sampler2D tW, tA, tC, tD; uniform float near, far, fokus, dof, ekspos, bloom, vignet, butir, seed, aspek, hangat; varying vec2 vUv;
      vec3 lutut(vec3 c){ c *= ekspos; float m = max(max(c.r, c.g), c.b); const float k = .8; if (m > k) { float m2 = k + (1. - k) * (1. - exp(-(m - k) / (1. - k))); c *= m2 / m; } return c; }
      vec3 keSRGB(vec3 c){ c = max(c, 0.); return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(.0031308, c)); }
      float acakP(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + seed * 7.13) * 43758.5453); }
      float jarak(vec2 uv){ float d = unpackRGBAToDepth(texture2D(tD, uv)); return d >= .9999 ? far : -perspectiveDepthToViewZ(d, near, far); }
      void main(){
        vec3 tajam = texture2D(tW, vUv).rgb, a = texture2D(tA, vUv).rgb, c = texture2D(tC, vUv).rgb;
        float z = jarak(vUv);
        float coc = clamp(dof * abs(1. / fokus - 1. / max(z, .05)) * 1.6, 0., 1.);
        vec3 col = mix(tajam, a, smoothstep(.07, .42, coc)); col = mix(col, c, smoothstep(.42, 1., coc));
        col += (max(c - 1., 0.) * .9 + max(a - 1.15, 0.) * .45) * bloom;   // bloom: bagian HDR > 1 (lampu, mata menyala) berpendar
        col = lutut(col);
        float l = dot(col, vec3(.2126, .7152, .0722));
        col = mix(vec3(l), col, 1.07);   // saturasi sedikit naik
        col = mix(col, col * col * (3. - 2. * col), .22);   // kontras S lembut
        vec3 hg = mix(vec3(.955, .99, 1.05), vec3(1.045, 1., .945), smoothstep(.12, .78, l));   // bayang dingin, sorot hangat
        col *= mix(vec3(1.), hg, hangat);
        vec2 q = vUv - .5; q.x *= aspek * 1.2; col *= mix(1. - vignet, 1., smoothstep(.78, .2, length(q)));
        col = keSRGB(clamp(col, 0., 1.));
        col += (acakP(floor(vUv * vec2(1080., 1920.))) - .5) * butir;
        gl_FragColor = vec4(col, 1.);
      }` });
  SIN.ok = true; return true;
}
function _sinRT(nama, w, h, o = {}) {
  let t = SIN.rt[nama];
  if (!t) { t = SIN.rt[nama] = new THREE.WebGLRenderTarget(w, h, Object.assign({ type: SIN.tipe, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }, o)); }
  else if (t.width !== w || t.height !== h) t.setSize(w, h);
  return t;
}
function _sinPass(r, mat, ke) { SIN.quad.material = mat; r.setRenderTarget(ke); r.render(SIN.sc, SIN.cam); }
/** bahan dunia dibuat lebih nyata sekali: relief dari tekstur warna, variasi kilap mikro. Tidak menyentuh bahan transparan/dasar/layar. */
function sinemaBahan(dn) {
  if (dn._sinBahan) return; dn._sinBahan = true;
  let derau = M3.tekstur.get('sin-derau');
  if (!derau) {
    const S = 256, cv = kanvasBaru(S, S), c = cv.getContext('2d'), im = c.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const v = .86 + .14 * (.55 * derau2(x / 23, y / 23) + .3 * derau2(x / 7 + 9, y / 7) + .15 * acak(y * S + x)); const i = (y * S + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = Math.round(jepit(v) * 255); im.data[i + 3] = 255; }
    c.putImageData(im, 0, 0); derau = teksturKanvas(cv); derau.wrapS = derau.wrapT = THREE.RepeatWrapping; derau.repeat.set(3, 3); derau.userData.bersama = true; M3.tekstur.set('sin-derau', derau);
  }
  const sel = new Set();
  dn.scene.traverse(o => { if (!o.isMesh || o.userData.tepi) return; [].concat(o.material || []).forEach(m => sel.add(m)); });
  sel.forEach(m => {
    if (!m || !m.isMeshStandardMaterial || m.transparent || m.userData.sinema) return;
    m.userData.sinema = true;
    if (m.map && !m.bumpMap && !(m.map.image && m.map.image.width > 600 && m.map.image.height < 600)) { m.bumpMap = m.map; m.bumpScale = m.userData.lunak ? .012 : .02; }   // relief halus dari tekstur (bukan wajah/layar lebar)
    if (!m.roughnessMap) m.roughnessMap = derau;
    m.needsUpdate = true;
  });
}
function derau2(x, y) { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, h = (a, b) => acak(((a % 997) + 997) * 131 + ((b % 991) + 991) * 7919), sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), sx), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), sx), sy); }
/** jarak fokus (m): adegan.fokus (angka | id tokoh | nama benda) atau jarak kamera → sasaran pandang (bidikan: wajah/subjek) */
function sinemaFokus(dn) {
  const a = dn.a, f = a.fokus ?? K.fokus, cp = dn.kamera.position;
  if (typeof f === 'number') return Math.max(.2, f);
  if (typeof f === 'string') { try { const p = dn.titik(f); return Math.max(.2, cp.distanceTo(new THREE.Vector3(p[0], p[1], p[2]))); } catch (e) { } }
  if (!dn._kamBidikan) {   // kamera manual: fokus ke tokoh yang kepalanya paling dekat ke tengah bingkai (mis. tokoh mungil di bidikan makro), bukan titik pandang
    let pilih = null, terbaik = 1e9; const v = new THREE.Vector3();
    for (const id in dn.para) { const tk = dn.para[id]; if (!tk.akar.visible) continue; const h = tk.titik('kepala'); v.set(h[0], h[1], h[2]).project(dn.kamera);
      if (v.z > 1 || Math.abs(v.x) > .75 || Math.abs(v.y) > .85) continue; const s2 = v.x * v.x + v.y * v.y; if (s2 < terbaik) { terbaik = s2; pilih = h; } }
    if (pilih) return Math.max(.12, cp.distanceTo(new THREE.Vector3(pilih[0], pilih[1], pilih[2])));
  }
  const ke = dn._ke; return ke ? Math.max(.2, cp.distanceTo(new THREE.Vector3(ke[0], ke[1], ke[2]))) : 3;
}
/** gambar satu bingkai adegan 3D dengan pasca-proses sinematik ke kanvas renderer (r.domElement) */
function sinemaRender(r, dn, w, h) {
  if (!sinemaSiapkan(r)) { r.render(dn.scene, dn.kamera); return; }
  sinemaBahan(dn);
  const a = dn.a, cam = dn.kamera;
  const tW = _sinRT('w', w, h, { samples: SIN.msaa, depthBuffer: true });
  const hw = Math.max(2, w >> 1), hh = Math.max(2, h >> 1), qw = Math.max(2, w >> 2), qh = Math.max(2, h >> 2), ew = Math.max(2, w >> 3), eh = Math.max(2, h >> 3);
  const tD = _sinRT('d', hw, hh, { type: THREE.UnsignedByteType, depthBuffer: true, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
  const tA = _sinRT('a', qw, qh), tA2 = _sinRT('a2', qw, qh), tC = _sinRT('c', ew, eh), tC2 = _sinRT('c2', ew, eh);
  const auto = r.shadowMap.autoUpdate, wb = new THREE.Color(); r.getClearColor(wb); const ab = r.getClearAlpha();
  // 1. adegan HDR
  r.shadowMap.autoUpdate = false; r.shadowMap.needsUpdate = true;
  r.setRenderTarget(tW); r.render(dn.scene, cam);
  // 2. kedalaman (sprite/partikel/uap disembunyikan, latar = jauh)
  // benda tembus pandang (berkas cahaya sorot, kaca, uap, pendar, lapisan wajah) tidak boleh menulis kedalaman: dulu kerucut d.sorot
  // tercatat 0,4 m di depan kamera → seluruh close-up Mbok kabur
  if (!dn._sinSprite) { dn._sinSprite = []; dn.scene.traverse(o => { if (o.isSprite || o.isPoints || o.isLine || (o.isMesh && [].concat(o.material || []).some(m => m && (m.transparent || m.blending === THREE.AdditiveBlending || m.depthWrite === false)))) dn._sinSprite.push(o); }); }
  const vis = dn._sinSprite.map(o => o.visible); dn._sinSprite.forEach(o => { o.visible = false; });
  const bg = dn.scene.background, fog = dn.scene.fog; dn.scene.background = null; dn.scene.fog = null; dn.scene.overrideMaterial = SIN.depthMat;
  r.setClearColor(0xffffff, 1); r.setRenderTarget(tD); r.render(dn.scene, cam);
  dn.scene.overrideMaterial = null; dn.scene.background = bg; dn.scene.fog = fog; dn._sinSprite.forEach((o, i) => { o.visible = vis[i]; });
  r.setClearColor(wb, ab);
  // 3. perkecil + kaburkan (1/4, lalu 1/8 dua kali)
  SIN.turun.uniforms.t.value = tW.texture; SIN.turun.uniforms.px.value.set(1 / w, 1 / h); _sinPass(r, SIN.turun, tA);
  SIN.kabur.uniforms.t.value = tA.texture; SIN.kabur.uniforms.arah.value.set(1 / qw, 0); _sinPass(r, SIN.kabur, tA2);
  SIN.kabur.uniforms.t.value = tA2.texture; SIN.kabur.uniforms.arah.value.set(0, 1 / qh); _sinPass(r, SIN.kabur, tA);
  SIN.turun.uniforms.t.value = tA.texture; SIN.turun.uniforms.px.value.set(1 / qw, 1 / qh); _sinPass(r, SIN.turun, tC);
  for (let i = 0; i < 2; i++) {
    SIN.kabur.uniforms.t.value = tC.texture; SIN.kabur.uniforms.arah.value.set(1 / ew, 0); _sinPass(r, SIN.kabur, tC2);
    SIN.kabur.uniforms.t.value = tC2.texture; SIN.kabur.uniforms.arah.value.set(0, 1 / eh); _sinPass(r, SIN.kabur, tC);
  }
  // 4. gabung ke layar
  const u = SIN.gabung.uniforms;
  u.tW.value = tW.texture; u.tA.value = tA.texture; u.tC.value = tC.texture; u.tD.value = tD.texture;
  u.near.value = cam.near; u.far.value = cam.far; u.fokus.value = sinemaFokus(dn); u.dof.value = _sinPilih('dof', 1, a);
  u.ekspos.value = dn.ekspos; u.bloom.value = _sinPilih('bloom', .5, a); u.vignet.value = _sinPilih('vignet', .22, a); u.butir.value = _sinPilih('butir', .02, a);
  u.hangat.value = _sinPilih('hangat', 1, a); u.aspek.value = w / h; u.seed.value = (typeof BINGKAI === 'number' ? BINGKAI : 0) % 997;
  _sinPass(r, SIN.gabung, null);
  r.shadowMap.autoUpdate = auto;
}
