/* ------------------------------------------------------------- partikel 3D, awan, efek emosi tokoh */
/** partikel: jenis konfeti|koin|uang|daun|salju|hujan|debu|gelembung|bintang
    jatuh (bawaan): pusat [x,y,z], area [lebar, tinggi, dalam], laju (m/dtk)
    semburan: dari [x,y,z] (meledak dari titik lalu jatuh, berhenti di lantai), kuat (kecepatan awal)
    umum: n, mulai, warna (larik untuk konfeti), ukuran */
DP.partikel = function (jenis, o = {}) {
  const a = this.a, n = o.n ?? ({ hujan: 240, salju: 160, debu: 120, bintang: 90, konfeti: 120 }[jenis] || 60), mulai = wl(o.mulai, a) ?? 0;
  const [aw, ah, ad] = o.area || [10, 7, 6], pusat = o.pusat || [0, 0, 0], semburan = !!o.dari, uk = o.ukuran ?? 1;
  if (jenis === 'debu' || jenis === 'bintang') {   // titik bercahaya melayang (aditif)
    const pos = new Float32Array(n * 3), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ map: teksturPendar(), color: warna3(o.warna || (jenis === 'bintang' ? '#FFF2B0' : campur(this.L.warna, '#ffffff', .4))).clone(), size: (jenis === 'bintang' ? .22 : .1) * uk, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: o.alfa ?? .8, toneMapped: false });
    const pt = new THREE.Points(g, pm); pt.frustumCulled = false; this._induk().add(pt);
    this.upd.push((t, T) => { for (let i = 0; i < n; i++) { const s = i * 7.13; pos[i * 3] = pusat[0] + (acak(s) - .5) * aw + derau(T * .2 + s) * .4; pos[i * 3 + 1] = pusat[1] + ((acak(s + 1) * ah + T * .12 * (o.laju ?? 1)) % ah); pos[i * 3 + 2] = pusat[2] + (acak(s + 2) - .5) * ad + derau(T * .17 + s + 4) * .4; } g.attributes.position.needsUpdate = true; pm.opacity = (o.alfa ?? .8) * (t < mulai ? 0 : jepit((t - mulai) / .5)); });
    return pt;
  }
  let geo, wr = o.warna, bhn;
  const konfetiWarna = Array.isArray(wr) ? wr : [P.aksen, P.kedua, P.utama, '#FFFFFF', '#4AA8F0'];
  if (jenis === 'koin') { geo = geoSilinder(.09 * uk, .09 * uk, .022 * uk, 20); bhn = bahan({ warna: wr || '#F4C430', logam: .6, kasar: .3, env: 1.2 }); }
  else if (jenis === 'uang') { geo = geoKotak(.3 * uk, .003, .14 * uk, 0); bhn = bahan({ warna: wr || '#4FA36B', ganda: true }); }
  else if (jenis === 'daun') { geo = geoBola(.07 * uk, 8, 6); bhn = bahan({ warna: wr || '#E08A2E' }); }
  else if (jenis === 'salju') { geo = geoBola(.035 * uk, 8, 6); bhn = bahan({ warna: wr || '#FFFFFF', dasar: true }); }
  else if (jenis === 'hujan') { geo = geoKotak(.012, .38 * uk, .012, 0); bhn = bahan({ warna: wr || '#BFD8FF', dasar: true, tembus: .55 }); }
  else if (jenis === 'gelembung') { geo = geoBola(.08 * uk, 16, 12); bhn = bahan({ warna: wr || '#BDE6FF', tembus: .45, kasar: .05, env: 1.5 }); }
  else { geo = geoKotak(.07 * uk, .035 * uk, .006, 0); bhn = new THREE.MeshStandardMaterial({ roughness: .5, side: THREE.DoubleSide, envMapIntensity: .5 }); }
  const im = new THREE.InstancedMesh(geo, bhn, n); im.castShadow = jenis !== 'hujan' && jenis !== 'salju'; im.frustumCulled = false; this._induk().add(im);
  if (jenis === 'konfeti') for (let i = 0; i < n; i++) im.setColorAt(i, warna3(konfetiWarna[i % konfetiWarna.length]));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3(1, 1, 1);
  const laju = o.laju ?? ({ hujan: 9, salju: .7, daun: .9, uang: .8, konfeti: 1.4, koin: 2.2, gelembung: -.5 }[jenis] || 1);
  this.upd.push((t, T) => {
    const tt = t - mulai;
    for (let i = 0; i < n; i++) {
      const s = i * 3.71 + 1; let x, y, z, sk = 1;
      if (tt < 0) { m4.makeScale(1e-4, 1e-4, 1e-4); im.setMatrixAt(i, m4); continue; }
      if (semburan) {
        const [dx, dy, dz] = o.dari, kuat = (o.kuat ?? 4) * (.55 + acak(s) * .6), az = acak(s + 1) * Math.PI * 2, el = (.35 + acak(s + 2) * .6) * Math.PI / 2;
        const vx = Math.cos(az) * Math.cos(el) * kuat, vy = Math.sin(el) * kuat, vz = Math.sin(az) * Math.cos(el) * kuat * .6, grav = jenis === 'konfeti' || jenis === 'uang' ? 4.2 : 9.8, hambat = jenis === 'konfeti' || jenis === 'uang' ? .55 : 1;
        const τ = Math.max(0, tt - acak(s + 3) * .08);
        x = dx + vx * τ * hambat; z = dz + vz * τ * hambat; y = dy + vy * τ - .5 * grav * τ * τ;
        if (y < .01) { y = .01; }
        if (jenis === 'konfeti' || jenis === 'uang') { x += Math.sin(T * 3 + s) * .15; }
      } else {
        const turun = ((acak(s + 1) * ah + tt * laju * (.8 + acak(s + 5) * .4)) % ah + ah) % ah;
        x = pusat[0] + (acak(s) - .5) * aw + Math.sin(T * 1.3 + s) * (jenis === 'hujan' ? 0 : .25); z = pusat[2] + (acak(s + 2) - .5) * ad; y = laju > 0 ? pusat[1] + ah - turun : pusat[1] + turun;
      }
      const sp = jenis === 'hujan' ? 0 : (2 + acak(s + 6) * 5);
      e3.set(T * sp * (acak(s + 7) - .3), T * sp * .7 + s, T * sp * .5 * (acak(s + 8) - .5)); if (jenis === 'koin' && semburan && y <= .012) e3.set(0, s, 0);
      q.setFromEuler(e3); v.set(x, y, z); s3.setScalar(sk); m4.compose(v, q, s3); im.setMatrixAt(i, m4);
    }
    im.instanceMatrix.needsUpdate = true;
  });
  return im;
};
/** awan kumulus 3D: n, x [kiri, kanan], y [min, maks], z [min, maks], ukuran, laju (m/dtk), warna */
DP.awan = function (o = {}) {
  const n = o.n ?? 6, [x0, x1] = o.x || [-30, 30], [y0, y1] = o.y || [9, 18], [z0, z1] = o.z || [-45, -25], wr = o.warna || campur(this.L.warna, '#ffffff', .75), laju = o.laju ?? .35, uk = o.ukuran ?? 1;
  const grup = [];
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group(), u = (2 + acak(i * 5 + 1) * 2) * uk;
    for (let k = 0; k < 6; k++) { const r = u * (.45 + acak(i * 13 + k) * .4), m = mesh3(geoBola(1, 18, 12), { warna: wr, tepi: false, bayang: false, kasar: 1, env: .2, pancar: wr, pancarKuat: .25, latar: true }); m.scale.set(r, r * .78, r * .8); m.position.set((k - 2.5) * u * .42, r * .25 + (k % 2) * u * .18, (acak(k + i) - .5) * u * .5); g.add(m); }
    g.position.set(lerp(x0, x1, acak(i * 3)), lerp(y0, y1, acak(i * 7 + 2)), lerp(z0, z1, acak(i * 11 + 4)));
    this._induk().add(g); grup.push([g, g.position.x]);
  }
  const lebar = x1 - x0;
  this.upd.push((t, T) => grup.forEach(([g, x], i) => { g.position.x = x0 + (((x - x0) + T * laju * (.7 + acak(i) * .6)) % lebar + lebar) % lebar; }));
  return grup.map(q => q[0]);
};

/* efek emosi di sekitar kepala tokoh: efek: 'keringat' | [[t, 'jenis', lama], …]
   jenis: keringat uap tanya seru hati bintang zzz ide marah kilau */
const _teksturEfek = {};
function teksturEfek(jenis) {
  if (_teksturEfek[jenis]) return _teksturEfek[jenis];
  const S = 128, cv = kanvasBaru(S, S), c = cv.getContext('2d'); c.lineJoin = 'round'; c.lineCap = 'round';
  const teks = (s, wr, uk = 104) => { c.font = `900 ${uk}px ${FONT.judul}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = '#1E1420'; c.strokeText(s, 64, 70); c.fillStyle = wr; c.fillText(s, 64, 70); };
  if (jenis === 'keringat') { c.fillStyle = '#7CC8FF'; c.strokeStyle = '#1E4E7A'; c.lineWidth = 7; c.beginPath(); c.moveTo(64, 14); c.bezierCurveTo(84, 48, 98, 66, 98, 84); c.arc(64, 84, 34, 0, Math.PI, false); c.bezierCurveTo(30, 66, 44, 48, 64, 14); c.fill(); c.stroke(); c.fillStyle = '#E8F6FF'; c.beginPath(); c.ellipse(52, 78, 8, 13, -.4, 0, 7); c.fill(); }
  else if (jenis === 'uap') { c.fillStyle = 'rgba(255,255,255,.95)'; [[64, 74, 34], [40, 84, 24], [88, 86, 24], [64, 46, 22]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }); }
  else if (jenis === 'tanya') teks('?', '#FFD23F');
  else if (jenis === 'seru') teks('!', '#FF5A4E');
  else if (jenis === 'zzz') teks('Z', '#BFD8FF', 96);
  else if (jenis === 'hati') { c.fillStyle = '#FF4D6A'; c.strokeStyle = '#5A1020'; c.lineWidth = 7; c.beginPath(); c.moveTo(64, 108); c.bezierCurveTo(10, 70, 18, 22, 46, 22); c.bezierCurveTo(58, 22, 64, 34, 64, 40); c.bezierCurveTo(64, 34, 70, 22, 82, 22); c.bezierCurveTo(110, 22, 118, 70, 64, 108); c.fill(); c.stroke(); }
  else if (jenis === 'bintang' || jenis === 'kilau') { c.fillStyle = jenis === 'kilau' ? '#FFFFFF' : '#FFD23F'; c.strokeStyle = '#5A3A00'; c.lineWidth = jenis === 'kilau' ? 0 : 6; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? (jenis === 'kilau' ? 12 : 22) : 54, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(64 + Math.cos(a) * r, 66 + Math.sin(a) * r); } c.closePath(); c.fill(); if (jenis !== 'kilau') c.stroke(); }
  else if (jenis === 'ide') { c.fillStyle = '#FFE15A'; c.strokeStyle = '#5A4400'; c.lineWidth = 6; c.beginPath(); c.arc(64, 54, 36, Math.PI * .8, Math.PI * 2.2); c.lineTo(78, 96); c.lineTo(50, 96); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8A8F9A'; c.fillRect(48, 98, 32, 16); c.strokeRect(48, 98, 32, 16); }
  else if (jenis === 'marah') { c.strokeStyle = '#FF3B3B'; c.lineWidth = 14; [[0, 1], [Math.PI / 2, 1], [Math.PI, 1], [-Math.PI / 2, 1]].forEach(([a]) => { c.beginPath(); c.arc(64 + Math.cos(a + .785) * 30, 64 + Math.sin(a + .785) * 30, 22, a + .785 + 2.2, a + .785 + 4.1); c.stroke(); }); }
  const t = teksturKanvas(cv); t.userData.bersama = true; return (_teksturEfek[jenis] = t);
}
function efekEmosi(tk, dn) {
  let daftar = tk.o.efek; if (!daftar) return () => {};
  if (typeof daftar === 'string') daftar = [[0, daftar, 1e9]];
  const R = tk.R, a = dn.a, item = [];
  daftar.forEach(([t0, jenis, lama], idx) => {
    const n = { keringat: 2, uap: 3, hati: 3, bintang: 4, zzz: 3, kilau: 4 }[jenis] || 1;
    for (let k = 0; k < n; k++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: teksturEfek(jenis), transparent: true, depthWrite: false, toneMapped: false }));
      sp.renderOrder = 5; tk.kepalaIsi.add(sp); item.push({ sp, t0: wl(t0, a) ?? 0, lama: lama ?? 1.6, jenis, k, n });
    }
  });
  return (t, T) => item.forEach(it => {
    const u = t - it.t0, aktif = u >= 0 && u < it.lama; it.sp.visible = aktif; if (!aktif) return;
    const masuk = E.outBack(jepit(u / .3)), keluar = 1 - jepit((u - it.lama + .3) / .3), k = it.k, sp = it.sp; let x = 0, y = 0, z = R * .3, s = R * .5;
    if (it.jenis === 'keringat') { const f = ((u * .8 + k * .5) % 1); x = (k ? -1 : 1) * R * 1.02; y = R * (.55 - f * .7); s = R * .32; sp.material.opacity = (1 - f) * keluar; }
    else if (it.jenis === 'uap') { const f = ((u * 1.1 + k / 3) % 1); x = (k - 1) * R * .55; y = R * (1.1 + f * .9); s = R * (.35 + f * .4); sp.material.opacity = (1 - f) * keluar; }
    else if (it.jenis === 'hati' || it.jenis === 'zzz') { const f = ((u * .6 + k / it.n) % 1); x = R * (.8 + Math.sin(f * 6 + k) * .25); y = R * (1 + f * 1.4); s = R * (.25 + f * .3); sp.material.opacity = Math.min(1, (1 - f) * 2) * keluar; }
    else if (it.jenis === 'bintang' || it.jenis === 'kilau') { const ang = T * 3.2 + k / it.n * Math.PI * 2; x = Math.cos(ang) * R * 1.15; z = Math.sin(ang) * R * 1.15; y = R * 1.15; s = R * .28; sp.material.opacity = keluar; }
    else { y = R * 1.75 + Math.sin(T * 4) * R * .06; x = R * .5; s = R * .65 * masuk; sp.material.opacity = keluar; }
    sp.position.set(x, y, z); sp.scale.set(s, s, s);
  });
}
