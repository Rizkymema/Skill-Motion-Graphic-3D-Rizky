/* ------------------------------------------------------------- Dunia3D: objek d di dunia(d) dan gerak(d, …) */
let _teksturPendar = null;
function teksturPendar() {   // cahaya bulat lembut (glow lampu, matahari, bokeh)
  if (_teksturPendar) return _teksturPendar;
  const S = 128, cv = kanvasBaru(S, S), c = cv.getContext('2d'), g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.55)'); g.addColorStop(.6, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, S, S); _teksturPendar = teksturKanvas(cv); _teksturPendar.userData.bersama = true; return _teksturPendar;
}
function teksturGradien(atas, bawah, tengah) {
  const kunci = `grad|${atas}|${tengah || ''}|${bawah}`; let t = M3.tekstur.get(kunci); if (t) return t;
  const cv = kanvasBaru(4, 256), c = cv.getContext('2d'), g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, atas); if (tengah) g.addColorStop(.55, tengah); g.addColorStop(1, bawah); c.fillStyle = g; c.fillRect(0, 0, 4, 256);
  t = teksturKanvas(cv); t.userData.bersama = true; M3.tekstur.set(kunci, t); return t;
}
function benih3(s) { return String(s || 'x').split('').reduce((n, ch) => n * 31 + ch.charCodeAt(0), 7) % 9973; }

class Dunia3D {
  constructor(a) {
    this.a = a; this.G = gaya3D(); this.scene = new THREE.Scene(); this.kamera = new THREE.PerspectiveCamera(40, W / H, .05, 500);
    this.upd = []; this.para = {}; this.nama = {}; this._grup = [this.scene]; this.luas = a.luas ?? 9; this.t = 0; this.T = a.mulai; this._n = 0;
    this.keadaan = (a.suasana && SUASANA[a.suasana]) ? a.suasana : (SUASANA[K.suasana] ? K.suasana : 'siang');
    this.L = aturCahaya(a);
    this.C3 = Object.assign({}, CAHAYA3D[this.keadaan] || CAHAYA3D.siang, K.cahaya3d || {}, a.cahaya3d || {});
    const L = this.L, C3 = this.C3;
    this.ekspos = this.G.ekspos * (C3.ekspos ?? 1);
    // cahaya: langit (hemisfer, sisi bayang berwarna) + matahari (bayangan lembut) + cahaya tepi dari belakang
    this.hemi = new THREE.HemisphereLight(warna3(campur(L.kabut, '#ffffff', .3)).clone(), warna3(C3.bayang3 || L.bayang).clone(), C3.hemi * (L.kuat ?? 1));   // bayang3: bayang dingin di keadaan gelap (kontras hangat-dingin)
    this.scene.add(this.hemi);
    this.matahari = new THREE.DirectionalLight(warna3(L.warna).clone(), C3.matahari * (L.kuat ?? 1));
    const sm = this.matahari.shadow; this.matahari.castShadow = C3.matahari > 0;
    sm.mapSize.set(2048, 2048); sm.bias = -.0004; sm.normalBias = .03; sm.radius = 3;
    this.scene.add(this.matahari); this.scene.add(this.matahari.target);
    this.cahayaTepi = new THREE.DirectionalLight(warna3(C3.warnaTepi || L.tepi).clone(), C3.tepi);
    this.scene.add(this.cahayaTepi); this.scene.add(this.cahayaTepi.target);
    // cahaya pengisi lembut dari arah kamera (wajah tidak gelap di bawah lampu atas); tanpa bayangan
    this.cahayaIsi = new THREE.DirectionalLight(warna3(campur(L.warna, '#ffffff', .5)).clone(), C3.isi ?? (C3.sorot ? .16 : .24));
    this.scene.add(this.cahayaIsi); this.scene.add(this.cahayaIsi.target);
    if (C3.sorot) {   // keadaan 'sorot': lampu sorot hangat dari atas, sekeliling gelap
      const s = new THREE.SpotLight(warna3(L.warna).clone(), C3.sorot, 0, 34 * D2R, .55, 1);
      s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -.0004; s.shadow.normalBias = .03;
      this.sorotUtama = s; this.scene.add(s); this.scene.add(s.target);
    }
    // latar bawaan: gradien layar dari warna latar keadaan (diganti langit()/studio()/ruang())
    this.scene.background = teksturGradien(campur(P.latar, '#ffffff', .18), campur(P.latar, P.gelap, .35), P.latar);
    this.warnaKabut = campur(P.latar, '#ffffff', .05);
    this.scene.fog = new THREE.Fog(warna3(this.warnaKabut).clone(), 30, 110);
    const ls = C3.langit;
    this.scene.environment = petaLingkungan(ls[0], ls[2], L.bayang, this.keadaan);
    this.langitObj = null;
  }
  get P() { return P; }
  /* --- susunan --- */
  _induk() { return this._grup[this._grup.length - 1]; }
  /** pasang objek ke dunia (atau grup aktif): posisi, putar (derajat [x,y,z] atau angka = y), skala, nama + animasi */
  pasang(obj, o = {}) {
    if (o.posisi) obj.position.set(o.posisi[0] ?? 0, o.posisi[1] ?? 0, o.posisi[2] ?? 0);
    if (o.putar !== undefined) { const r = typeof o.putar === 'number' ? [0, o.putar, 0] : o.putar; obj.rotation.set((r[0] || 0) * D2R, (r[1] || 0) * D2R, (r[2] || 0) * D2R); }
    if (o.skala !== undefined) { const s = Array.isArray(o.skala) ? o.skala : [o.skala, o.skala, o.skala]; obj.scale.set(s[0], s[1], s[2]); }
    (o.induk || this._induk()).add(obj);
    if (o.nama) this.nama[o.nama] = obj;
    obj.userData.benih = ++this._n;
    this.pasangAnim(obj, o);
    return obj;
  }
  /** grup: benda-benda di dalam fn ikut posisi/putar/skala/anim grup */
  grup(o, fn) { if (typeof o === 'function') { fn = o; o = {}; } const g = new THREE.Group(); this.pasang(g, o); this._grup.push(g); try { fn && fn(g); } finally { this._grup.pop(); } return g; }
  /** animasi objek: anim [[t, {posisi, putar, skala}, ease], …] · muncul t (+ masuk 'pop|naik|jatuh|tumbuh|geser|putar') · hilang t
      · ayun {tinggi, laju} · putarTerus [x,y,z] derajat/dtk · ikutJalur {titik: [[x,y,z],…], mulai, lama, ease, hadap} · gerak(obj, t, T) */
  pasangAnim(obj, o) {
    if (!(o.anim || o.muncul !== undefined || o.hilang !== undefined || o.ayun || o.putarTerus || o.gerak || o.ikutJalur || o.denyut)) return;
    const a = this.a, p0 = obj.position.clone(), r0 = [obj.rotation.x / D2R, obj.rotation.y / D2R, obj.rotation.z / D2R], s0 = obj.scale.clone();
    const mu = wl(o.muncul, a), hi = wl(o.hilang, a), lamaM = o.lamaMuncul ?? .5, masuk = o.masuk || 'pop', bn = obj.userData.benih || 1;
    if (o.anim) o.anim = o.anim.map(k => [k[0], Object.assign({}, k[1]), k[2]]);
    this.upd.push((t, T) => {
      let p = [p0.x, p0.y, p0.z], r = r0.slice(), s = [s0.x, s0.y, s0.z];
      if (o.anim) { const v = kunci3(t, o.anim, a); if (v.posisi) p = v.posisi.slice(); if (v.putar !== undefined) r = typeof v.putar === 'number' ? [r0[0], v.putar, r0[2]] : v.putar.slice(); if (v.skala !== undefined) s = Array.isArray(v.skala) ? v.skala.slice() : [s0.x * v.skala, s0.y * v.skala, s0.z * v.skala]; }
      if (o.ikutJalur) { const j = o.ikutJalur, k = fe(j.ease || 'inOutSine')(jepit((t - (wl(j.mulai, a) ?? 0)) / (j.lama ?? a.d))); const q = titikJalur(j.titik, k); p = q.p; if (j.hadap !== false) r[1] = Math.atan2(q.d[0], q.d[2]) / D2R + (j.putarY || 0); }
      if (o.ayun) { const y = o.ayun === true ? {} : o.ayun; p[1] += Math.sin(T * (y.laju ?? 2.2) + bn) * (y.tinggi ?? .06); r[2] += Math.sin(T * (y.laju ?? 2.2) * .7 + bn) * (y.miring ?? 0); }
      if (o.putarTerus) { const v = typeof o.putarTerus === 'number' ? [0, o.putarTerus, 0] : o.putarTerus; r = r.map((x, i) => x + (v[i] || 0) * t); }
      if (o.denyut) { const k = 1 + Math.sin(T * Math.PI * 2 * (o.denyut.laju ?? 1.5)) * (o.denyut.kuat ?? .05); s = s.map(x => x * k); }
      let vis = true, k = 1;
      if (mu !== undefined) {
        if (t < mu) vis = false;
        else { const e = jepit((t - mu) / lamaM);
          if (masuk === 'pop') k = E.outBack(e);
          else if (masuk === 'tumbuh') s[1] *= Math.max(1e-3, E.outCubic(e));
          else if (masuk === 'naik') { p[1] -= (1 - E.outCubic(e)) * (o.jarakMasuk ?? 1.2); k = Math.max(1e-3, E.outCubic(Math.min(1, e * 2))); }
          else if (masuk === 'jatuh') p[1] += (1 - E.outBounce(e)) * (o.jarakMasuk ?? 3);
          else if (masuk === 'geser') p[0] += (1 - E.outCubic(e)) * (o.jarakMasuk ?? -3);
          else if (masuk === 'putar') { k = E.outBack(e); r[1] += (1 - E.outCubic(e)) * 300; }
          else k = E.outCubic(e);
        }
      }
      if (hi !== undefined && t >= hi) { const e = jepit((t - hi) / .35); k *= Math.max(0, 1 - E.inBack(e)); if (e >= 1) vis = false; }
      obj.visible = vis && k > 1e-3;
      obj.position.set(p[0], p[1], p[2]); obj.rotation.set(r[0] * D2R, r[1] * D2R, r[2] * D2R);
      obj.scale.set(Math.max(1e-4, s[0] * k), Math.max(1e-4, s[1] * k), Math.max(1e-4, s[2] * k));
      if (o.gerak) o.gerak(obj, t, T);
    });
  }
  /** fungsi per bingkai sendiri: d.tiapBingkai((t, T) => { … }) */
  tiapBingkai(fn) { this.upd.push(fn); }
  /** posisi dunia sebuah rujukan: [x,y,z] | 'nama' | 'raka' (kaki) | 'raka.kepala' | 'raka.mulut' | 'raka.tanganKa' | 'raka.tanganKi' */
  titik(ref, awal) {
    if (Array.isArray(ref)) return ref.slice();
    const [id, bag] = String(ref).split('.');
    const tk = this.para[id];
    if (tk) { if (awal === 0) return tk.posisiAwal.slice(); return tk.titik(bag || 'pusat'); }
    const o = this.nama[id];
    if (o) { const v = new THREE.Vector3(); o.updateWorldMatrix(true, false); o.getWorldPosition(v); return [v.x, v.y + (bag === 'atas' ? (o.userData.tinggi || 0) : 0), v.z]; }
    return [0, 1, 0];
  }
  /** posisi dasar (kaki tokoh / titik pasang benda) di dunia, untuk kamera ikuti */
  titikDasar(ref) { if (Array.isArray(ref)) return ref.slice(); const tk = this.para[ref]; if (tk) return tk.titik('kaki'); const o = this.nama[ref]; if (o) { const v = new THREE.Vector3(); o.updateWorldMatrix(true, false); o.getWorldPosition(v); return [v.x, v.y, v.z]; } return [0, 0, 0]; }
  /* --- latar, langit, tanah --- */
  /** latar polos/gradien di belakang semua benda (layar penuh, tanpa ikut kamera) */
  latar(atas, bawah) { this.scene.background = typeof atas === 'string' && !bawah ? warna3(atas).clone() : teksturGradien(atas || P.latar, bawah || campur(P.latar, P.gelap, .35)); return this; }
  /** kabut jarak: dekat, jauh (meter), warna */
  kabut(dekat = 12, jauh = 60, wr) { this.warnaKabut = wr || this.warnaKabut; this.scene.fog = new THREE.Fog(warna3(this.warnaKabut).clone(), dekat, jauh); return this; }
  /** langit 3D: waktu (siang|malam|senja|oranye|kobalt|…; bawaan = keadaan adegan), atas/tengah/bawah, matahari (bool), bintang (jumlah), awan (jumlah) */
  langit(o = {}) {
    const C = CAHAYA3D[o.waktu] || this.C3, ls = C.langit, atas = o.atas || ls[0], tengah = o.tengah || ls[1], bawah = o.bawah || ls[2];
    const malam = (o.waktu || this.keadaan) === 'malam';
    const sunDir = this._arahMatahari();
    const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { a: { value: warna3(atas).clone() }, b: { value: warna3(tengah).clone() }, c: { value: warna3(bawah).clone() }, sd: { value: new THREE.Vector3(...sunDir) }, sc: { value: warna3(malam ? '#E8EEFF' : campur(this.L.warna, '#ffffff', .5)).clone() }, sz: { value: o.matahari === false ? 0 : (malam ? .9965 : .9972) } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }',
      fragmentShader: `uniform vec3 a; uniform vec3 b; uniform vec3 c; uniform vec3 sd; uniform vec3 sc; uniform float sz; varying vec3 vD;
        void main(){ float y = vD.y; vec3 col = y > .12 ? mix(b, a, smoothstep(.12, .75, y)) : mix(c, b, smoothstep(-.05, .12, y));
          if (sz > 0.0) { float d = dot(normalize(vD), normalize(sd)); col += sc * smoothstep(sz, sz + .0012, d) * 1.6 + sc * pow(max(d, 0.0), 60.0) * .35; }
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <encodings_fragment>
        }` });
    const m = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), mat); m.renderOrder = -10; m.frustumCulled = false;
    this.scene.add(m); this.langitObj = m; this.scene.background = warna3(bawah).clone();
    this.warnaKabut = bawah; this.scene.fog = new THREE.Fog(warna3(bawah).clone(), o.kabutDekat ?? 28, o.kabutJauh ?? 140);
    if (o.bintang || malam) {   // bintang tetap (titik), berkelip pelan
      const n = o.bintang ?? 260, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { const th = acak(i * 2.1) * Math.PI * 2, ph = .12 + acak(i * 5.7) * .85; pos.set([Math.cos(th) * Math.cos(ph) * 280, Math.sin(ph) * 280, Math.sin(th) * Math.cos(ph) * 280], i * 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pm = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2 * U, sizeAttenuation: false, fog: false, transparent: true, opacity: .85, depthWrite: false });
      const pt = new THREE.Points(g, pm); pt.renderOrder = -9; pt.frustumCulled = false; m.add(pt);
      this.upd.push((t, T) => { pm.opacity = .7 + Math.sin(T * 1.7) * .15; });
    }
    if (o.awan) this.awan({ n: o.awan });
    return m;
  }
  _arahMatahari() { const s = (this.L.sudut ?? -40) * D2R, e = (this.C3.tinggi ?? 50) * D2R; const v = [Math.sin(s) * Math.cos(e), Math.sin(e), Math.cos(s) * Math.cos(e) * .85 + .15]; const n = Math.hypot(...v); return v.map(x => x / n); }
  /** studio motion graphic: lantai + dinding belakang melengkung tanpa sambungan (cyclorama), warna keadaan */
  studio(o = {}) {
    this._adaLantai = true;
    const wr = o.warna || campur(P.latar, '#ffffff', .06), lebar = o.lebar ?? 120, R = o.lengkung ?? 7, zDinding = o.z ?? -9, depan = o.depan ?? 40, tinggi = o.tinggi ?? 70;
    const panjang = depan + (Math.PI / 2) * R + tinggi, segV = 80, g = new THREE.PlaneGeometry(lebar, panjang, 1, segV), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = (pos.getY(i) / panjang + .5) * panjang, zl = zDinding + R; let y, z;   // v = jarak sepanjang profil dari depan; zl = awal lengkung
      if (v <= depan) { y = 0; z = zl + depan - v; }
      else if (v <= depan + Math.PI / 2 * R) { const a = (v - depan) / R; y = R - Math.cos(a) * R; z = zl - Math.sin(a) * R; }
      else { y = R + (v - depan - Math.PI / 2 * R); z = zDinding; }
      pos.setXYZ(i, pos.getX(i), y, z);
    }
    g.computeVertexNormals();
    const tex = o.pola ? teksturPola(o.pola, wr) : null; if (tex) tex.repeat.set(lebar / 4, panjang / 4);
    const m = new THREE.Mesh(g, bahan({ warna: wr, kasar: .92, env: .15, peta: tex, unik: !!tex }));
    m.receiveShadow = true; this.scene.add(m);
    this.scene.background = warna3(campur(wr, P.gelap, .15)).clone();
    this.warnaKabut = campur(wr, P.gelap, .08); this.scene.fog = new THREE.Fog(warna3(this.warnaKabut).clone(), o.kabutDekat ?? 22, o.kabutJauh ?? 80);
    return m;
  }
  /** tanah luas: jenis polos|rumput|aspal|ubin|kayu|pasir|beton|karpet, warna, ukuran (m), ulang (m per tekstur) */
  tanah(o = {}) {
    this._adaLantai = true;   // kamera dijaga tetap di atas lantai (01-inti.js aturKamera3D)
    const jenis = o.jenis || 'polos', bawaanWarna = { rumput: campur(P.utama, '#7FBF4A', .45), aspal: '#545866', pasir: '#E2C38A', beton: '#A9ACB3', ubin: campur(P.terang, P.latar, .35), kayu: '#B8794A', karpet: campur(P.kedua, P.gelap, .35) };
    const wr = o.warna || bawaanWarna[jenis] || this.C3.lantai || campur(P.latar, P.utama, .3), uk = o.ukuran ?? 240;
    const tex = jenis !== 'polos' ? teksturPola(jenis, wr) : null;
    let mat = bahan({ warna: jenis === 'polos' ? wr : '#ffffff', kasar: o.kasar ?? .95, env: .2, peta: tex, unik: !!tex });
    if (tex) { mat.map = tex.clone(); mat.map.needsUpdate = true; const u = o.ulang ?? (jenis === 'ubin' ? 2.4 : jenis === 'kayu' ? 3 : 6); mat.map.repeat.set(uk / u, uk / u); }
    const m = new THREE.Mesh(geoBidang(uk, uk), mat); m.rotation.x = -Math.PI / 2; m.receiveShadow = true;
    if (o.posisi) m.position.set(o.posisi[0], o.posisi[1] || 0, o.posisi[2]);
    this._induk().add(m); return m;
  }
  /* --- cahaya tambahan --- */
  /** lampu titik + bola lampu menyala + pendar: posisi [x,y,z], warna, kuat, jarak (m), ukuran bola, pendar (ukuran glow), bayang */
  lampu(o = {}) {
    const g = new THREE.Group(), wr = o.warna || '#FFD58A';
    const l = new THREE.PointLight(warna3(wr).clone(), o.kuat ?? 2.2, o.jarak ?? 9, o.redup ?? 1.4); l.castShadow = !!o.bayang; if (l.castShadow) { l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -.002; }
    g.add(l);
    if (o.bola !== false) { const b = new THREE.Mesh(geoBola(o.ukuran ?? .09), bahan({ warna: campur(wr, '#ffffff', .6), dasar: true })); g.add(b); }
    if (o.pendar !== false) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: teksturPendar(), color: warna3(wr).clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8, toneMapped: false })); const u = o.pendar ?? .9; s.scale.set(u, u, u); g.add(s); g.userData.pendar = s; }
    g.userData.cahaya = l;
    this.pasang(g, Object.assign({}, o, { putar: undefined }));
    if (o.kedip) { const bn = g.userData.benih; this.upd.push((t, T) => { const k = .75 + .25 * Math.sin(T * 9 + bn) * Math.sin(T * 3.3 + bn * 2); l.intensity = (o.kuat ?? 2.2) * k; }); }
    return g;
  }
  /** lampu sorot: posisi, ke (titik sasaran), warna, kuat, sudut (derajat), kerucut (kerucut cahaya tampak) */
  sorot(o = {}) {
    const wr = o.warna || '#FFE2A8', s = new THREE.SpotLight(warna3(wr).clone(), o.kuat ?? 3.5, 0, (o.sudut ?? 26) * D2R, o.lembut ?? .5, 1);
    s.castShadow = o.bayang !== false; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -.0005; s.shadow.normalBias = .03;
    const p = o.posisi || [0, 6, 2], ke = o.ke || [0, 0, 0];
    s.position.set(...p); s.target.position.set(...ke); this.scene.add(s); this.scene.add(s.target);
    if (o.kerucut !== false) {   // kerucut cahaya tembus (aditif) dari lampu ke lantai
      const tinggi = Math.hypot(p[0] - ke[0], p[1] - ke[1], p[2] - ke[2]), r = Math.tan((o.sudut ?? 26) * D2R) * tinggi;
      const geo = new THREE.ConeGeometry(r, tinggi, 40, 1, true); geo.translate(0, -tinggi / 2, 0); geo.rotateX(-Math.PI / 2);
      const cv = kanvasBaru(4, 128), c = cv.getContext('2d'), gr = c.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); c.fillStyle = gr; c.fillRect(0, 0, 4, 128);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: warna3(wr).clone(), map: teksturKanvas(cv), transparent: true, opacity: o.kerucutAlfa ?? .16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false }));
      m.position.set(...p); m.lookAt(...ke); this.scene.add(m);
    }
    return s;
  }
  /* --- bentuk dasar: posisi = titik tengah ALAS (benda menapak di y), kecuali pusat: true --- */
  _bentuk(geo, tinggiBawah, o) {   // geo berpusat di (0,0,0); tinggiBawah = jarak pusat ke alas
    const g = new THREE.Group(), m = mesh3(geo, o);
    m.position.y = o.pusat ? 0 : tinggiBawah; if (o.miring) m.rotation.set(...o.miring.map(v => v * D2R));
    g.add(m); g.userData.mesh = m; g.userData.tinggi = tinggiBawah * 2;
    return this.pasang(g, o);
  }
  /** kotak: ukuran [lebar, tinggi, dalam] (m), r (sudut bulat, bawaan 0.06 × sisi terkecil) */
  kotak(o = {}) { const [w, h, dl] = o.ukuran || [1, 1, 1]; return this._bentuk(geoKotak(w, h, dl, o.r ?? Math.min(w, h, dl) * .12), h / 2, o); }
  bola(o = {}) { const r = o.r ?? .5; return this._bentuk(geoBola(r), r, o); }
  silinder(o = {}) { const r = o.r ?? .4, [ra, rb] = Array.isArray(r) ? r : [r, r], h = o.tinggi ?? 1; return this._bentuk(geoSilinder(ra, rb, h, o.sisi ?? 32), h / 2, o); }
  kapsul(o = {}) { const r = o.r ?? .3, h = Math.max(o.tinggi ?? 1.2, r * 2 + .01); return this._bentuk(geoKapsul(r, h - r * 2), h / 2, o); }
  kerucut(o = {}) { const r = o.r ?? .5, h = o.tinggi ?? 1; return this._bentuk(geoKerucut(r, h, o.sisi ?? 28), h / 2, o); }
  donat(o = {}) { const R = o.R ?? .5, r = o.r ?? .16; return this._bentuk(geoTorus(R, r), R + r, o); }
  /** bidang tegak menghadap +z (atau lantai: true = rebah); peta = Texture; dasar: true = tanpa cahaya */
  bidang(o = {}) { const w = o.lebar ?? 1, h = o.tinggi ?? 1, g = new THREE.Group(), m = new THREE.Mesh(geoBidang(w, h), o.bahan || bahan(Object.assign({ ganda: true }, o, { unik: !!o.peta || o.unik }))); m.receiveShadow = !o.dasar; m.castShadow = !!o.bayang; m.userData.padat = !o.lantai && o.padat !== false; if (o.lantai) { m.rotation.x = -Math.PI / 2; m.position.y = .005; } else m.position.y = o.pusat ? 0 : h / 2; g.add(m); g.userData.mesh = m; return this.pasang(g, o); }
  /** bentuk dari jalur 2D (THREE.Shape) diekstrusi: titik [[x,y],…] atau shape; tebal, bevel */
  ekstrusi(o = {}) {
    let shape = o.shape; if (!shape) { shape = new THREE.Shape(); (o.titik || [[0, 0], [1, 0], [0, 1]]).forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y))); shape.closePath(); }
    const tebal = o.tebal ?? .2, bv = o.bevel ?? tebal * .25, geo = new THREE.ExtrudeGeometry(shape, { depth: tebal, bevelEnabled: bv > 0, bevelThickness: bv, bevelSize: bv * .8, bevelSegments: 3, curveSegments: 24 });
    geo.center(); geo.computeBoundingBox(); const h = geo.boundingBox.max.y;
    return this._bentuk(geo, o.pusat ? 0 : h, o);
  }
}
/** titik pada polyline halus (Catmull-Rom) di kemajuan k: {p, d (arah)} */
function titikJalur(titik, k) {
  if (!titik._kurva) titik._kurva = new THREE.CatmullRomCurve3(titik.map(q => new THREE.Vector3(q[0], q[1] ?? 0, q[2] ?? 0)), false, 'centripetal');
  const c = titik._kurva, p = c.getPointAt(jepit(k)), d = c.getTangentAt(jepit(Math.min(k, .999)));
  return { p: [p.x, p.y, p.z], d: [d.x, d.y, d.z] };
}
Dunia3D.prototype.selesaiBangun = function () {
  // pusat bayangan matahari = sasaran kamera awal (atau a.pusatBayang); lingkup = luas (m)
  const a = this.a;
  this.perbarui(0, a.mulai);   // keadaan t = 0 (anim, tokoh) sebelum kamera awal dihitung → kamera ikuti + hadap bawaan deterministik
  daftarPadat(this);           // anti-tembus: benda padat + permukaan pijak (06-tabrak.js)
  this.perbarui(0, a.mulai);   // sekali lagi dengan daftar padat (kaki menapak, lengan tidak menembus)
  aturKamera3D(this, a, 0, a.mulai); this.kameraAwal = this.kamera.position.clone();
  this._pusatBayang = a.pusatBayang || (this._ke ? this._ke.slice() : [0, 1, 0]);
  const sm = this.matahari.shadow.camera, L = this.luas; sm.left = -L; sm.right = L; sm.top = L; sm.bottom = -L; sm.near = .5; sm.far = 80; sm.updateProjectionMatrix();
};
Dunia3D.prototype.cahayaIkutKamera = function () {
  const c = this.a.ikuti ? this.titik(this.a.ikuti) : this._pusatBayang, d = this._arahMatahari();
  this.matahari.target.position.set(c[0], 0, c[2]); this.matahari.position.set(c[0] + d[0] * 30, d[1] * 30, c[2] + d[2] * 30);
  this.cahayaTepi.target.position.set(c[0], 1, c[2]); this.cahayaTepi.position.set(c[0] - d[0] * 20, 12, c[2] - Math.abs(d[2]) * 20 - 12);
  if (this.sorotUtama) { this.sorotUtama.position.set(c[0], 7.5, c[2] + 2.2); this.sorotUtama.target.position.set(c[0], 0, c[2]); }
  if (this.langitObj) this.langitObj.position.copy(this.kamera.position);
  const kp = this.kamera.position; this.cahayaIsi.position.set(kp.x, kp.y + 1.5, kp.z); this.cahayaIsi.target.position.set(c[0], 1, c[2]);
};
Dunia3D.prototype.perbarui = function (t, T) {
  this.t = t; this.T = T; this._cap = (this._cap || 0) + 1;
  for (const f of this.upd) { try { f(t, T); } catch (e) { if (!this._galat) { this._galat = 1; console.error(e); catatan.push('Galat animasi 3D di adegan ' + this.a.id + ': ' + e.message); } } }
  // gerak(d, t) adegan SEBELUM tokoh diperbarui: perubahan tokoh di gerak (skala, posisi) berlaku di bingkai yang sama (dulu terlambat 1 bingkai)
  if (this.a.gerak) { try { this.a.gerak(this, t, this.a.d, T); } catch (e) { if (!this._galat2) { this._galat2 = 1; console.error(e); catatan.push('Galat di gerak adegan ' + this.a.id + ': ' + e.message); } } }
  for (const id in this.para) this.para[id].perbarui(t, T);
};
Dunia3D.prototype.daftarWajah = function () {   // wajah tokoh → REG.subjek (cek subtitle menutupi wajah)
  for (const id in this.para) {
    const tk = this.para[id]; if (!tk.akar.visible) continue;
    const p = tk.titik('kepala'), q = keLayar(this, p); if (q[2] > 1) continue;
    const pr = keLayar(this, [p[0] + tk.R * tk.skala, p[1], p[2]]), r = Math.abs(pr[0] - q[0]) * 1.1;
    if (r < 4) continue;
    REG.subjek.push({ id, x0: q[0] - r, x1: q[0] + r, y0: q[1] - r, y1: q[1] + r, tr: SEDANG_TRANSISI });
  }
};
