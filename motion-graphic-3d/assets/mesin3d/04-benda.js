/* ------------------------------------------------------------- benda siap pakai (prefab). Semua: posisi = titik tengah alas,
   putar (derajat y atau [x,y,z]), skala, nama, warna…, plus animasi umum (muncul, anim, ayun, putarTerus, hilang, gerak). */
const DP = Dunia3D.prototype;
/** bagian benda di grup aktif: geo berpusat, p = posisi pusat, x = opsi bahan + r (putaran radian [x,y,z]) */
DP._b = function (geo, wr, p = [0, 0, 0], x = {}) { const m = mesh3(geo, Object.assign({ warna: wr }, x)); m.position.set(p[0], p[1], p[2]); if (x.r) m.rotation.set(x.r[0] || 0, x.r[1] || 0, x.r[2] || 0); if (x.s) m.scale.set(...(Array.isArray(x.s) ? x.s : [x.s, x.s, x.s])); this._induk().add(m); return m; };
DP._layar = function (lebar, tinggi, o, posisi, px = 540) {   // bidang layar menyala; o.layar(g2, w, h, t, T) digambar dengan API 2D tiap bingkai
  const cw = Math.round(px), ch = Math.round(px * tinggi / lebar), cv = kanvasBaru(cw, ch), tex = teksturKanvas(cv);
  const m = new THREE.Mesh(geoBidang(lebar, tinggi), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: new THREE.Color(o.terang ?? 1, o.terang ?? 1, o.terang ?? 1) }));
  m.position.set(...posisi); this._induk().add(m);
  const a = this.a, isi = o.layar, wl0 = o.warnaLayar || '#1B2A4A';
  const gambarLayar = (t, T) => {
    const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = wl0; c.fillRect(0, 0, cw, ch);
    if (typeof isi === 'function') { const lama = [MEMBANGUN, SK]; MEMBANGUN = true; SK = 1; try { const g2 = new Gambar(c, a, t, T); isi(g2, cw, ch, t, T); } catch (e) { if (!DP._layar.galat) { DP._layar.galat = 1; catatan.push('Galat di layar adegan ' + a.id + ': ' + e.message); } } finally { [MEMBANGUN, SK] = lama; } }
    else { const g = c.createLinearGradient(0, 0, cw, ch); g.addColorStop(0, campur(wl0, '#ffffff', .25)); g.addColorStop(1, wl0); c.fillStyle = g; c.fillRect(0, 0, cw, ch); }
    tex.needsUpdate = true;
  };
  gambarLayar(0, a.mulai);
  if (typeof isi === 'function') this.upd.push(gambarLayar);
  return m;
};
Object.assign(DP, {
  /* --- alam --- */
  pohon(o = {}) {
    const jenis = o.jenis || 'bulat', daun = o.warna || campur(P.utama, '#3F9A3A', .45), batang = o.warnaBatang || '#7A4E2D', h = o.tinggi ?? 3.2;
    return this.grup(o, () => {
      if (jenis === 'cemara') { this._b(geoSilinder(.1, .14, h * .3), batang, [0, h * .15, 0]); [0, 1, 2].forEach(i => this._b(geoKerucut(h * (.32 - i * .07), h * .42, 18), campur(daun, '#000', i * .06), [0, h * (.42 + i * .2), 0])); return; }
      if (jenis === 'kelapa') { const n = 6; for (let i = 0; i < n; i++) this._b(geoSilinder(.09, .11, h / n), batang, [Math.sin(i / n * 1.4) * .5, h / n * (i + .5), 0], { r: [0, 0, -.12] }); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; this._b(geoKapsul(.08, 1.3, 8), daun, [.6 + Math.sin(a) * .7, h + .1, Math.cos(a) * .7], { r: [Math.cos(a) * 1.1, 0, -Math.sin(a) * 1.1], s: [1, 1, .35] }); } return; }
      this._b(geoSilinder(.13, .19, h * .55), batang, [0, h * .27, 0]);
      [[0, h * .72, 0, h * .3], [-h * .17, h * .6, .05, h * .22], [h * .18, h * .62, -.04, h * .23], [0, h * .9, -.05, h * .2]].forEach(([x, y, z, r], i) => this._b(geoBola(r, 22, 16), campur(daun, i % 2 ? '#ffffff' : '#000000', .06), [x, y, z], { s: [1, .9, 1] }));
    });
  },
  semak(o = {}) { const wr = o.warna || campur(P.utama, '#3F9A3A', .4), s = o.ukuran ?? .6; return this.grup(o, () => { [[0, s * .55, 0, s * .6], [-s * .6, s * .4, .05, s * .45], [s * .6, s * .42, -.05, s * .48]].forEach(([x, y, z, r], i) => this._b(geoBola(r, 16, 12), campur(wr, '#000', i * .05), [x, y, z])); }); },
  /** bukit/gunung di kejauhan: lebar, tinggi, warna, salju */
  bukit(o = {}) { const lb = o.lebar ?? 30, t = o.tinggi ?? 8, wr = o.warna || campur(P.utama, this.warnaKabut, .35); return this.grup(o, () => { const m = this._b(geoBola(1, 40, 20), wr, [0, 0, 0], { s: [lb / 2, t, lb / 3], tepi: false, latar: true }); m.castShadow = false; if (o.salju) this._b(geoBola(1, 30, 14), '#F4F7FF', [0, t * .72, 0], { s: [lb * .14, t * .32, lb * .1], tepi: false, latar: true }); }); },
  batu(o = {}) { const u = o.ukuran ?? .5; return this.grup(o, () => this._b(new THREE.IcosahedronGeometry(u, 0), o.warna || '#8E8C94', [0, u * .6, 0], { s: [1.2, .75, 1], datar: true })); },
  /* --- kota & jalan --- */
  rumah(o = {}) {
    const lb = o.lebar ?? 4, t = o.tinggi ?? 2.6, dl = o.dalam ?? 3.5, dinding = o.warna || campur(P.terang, P.aksen, .25), atap = o.warnaAtap || P.kedua, malam = this.keadaan === 'malam' || o.malam;
    return this.grup(o, () => {
      this._b(geoKotak(lb, t, dl, .05), dinding, [0, t / 2, 0]);
      const g = new THREE.CylinderGeometry(1, 1, 1, 3, 1); g.rotateZ(Math.PI / 2); g.rotateX(Math.PI / 2 + Math.PI / 6);
      this._b(g, atap, [0, t + .55, 0], { s: [lb * .58, 1.25, dl * .64], r: [0, Math.PI / 2, 0] });
      this._b(geoKotak(.8, 1.5, .1, .04), o.warnaPintu || '#7A4A2E', [-lb * .22, .75, dl / 2 + .03]);
      [lb * .2].forEach(x => { this._b(geoKotak(.95, .8, .08, .03), '#FFFFFF', [x, t * .58, dl / 2 + .03]); this._b(geoBidang(.8, .65), malam ? '#FFD27A' : '#9FD3F5', [x, t * .58, dl / 2 + .075], { dasar: true, toneMapped: false }); });
      if (malam && o.lampu !== false) this.lampu({ posisi: [lb * .2, t * .58, dl / 2 + .6], warna: '#FFC870', kuat: 1.2, jarak: 5, bola: false, pendar: 1.6 });
    });
  },
  /** gedung: lebar, tinggi, dalam, warna; jendela menyala di malam */
  gedung(o = {}) {
    const lb = o.lebar ?? 3, t = o.tinggi ?? 10, dl = o.dalam ?? 3, wr = o.warna || campur(P.latar, P.terang, .25), malam = this.keadaan === 'malam' || o.malam;
    const kunci = `jendela|${wr}|${malam}`; let tex = M3.tekstur.get(kunci);
    if (!tex) { const cv = kanvasBaru(128, 128), c = cv.getContext('2d'); c.fillStyle = wr; c.fillRect(0, 0, 128, 128); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.fillStyle = malam ? (acak(i * 4 + j) > .45 ? '#FFD37A' : campur(wr, '#000', .45)) : campur('#9FD3F5', wr, .35); c.fillRect(8 + j * 30, 8 + i * 30, 20, 22); } tex = teksturKanvas(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.userData.bersama = true; M3.tekstur.set(kunci, tex); }
    return this.grup(o, () => {
      const mat = bahan({ warna: '#ffffff', peta: tex, unik: true, pancar: malam ? '#ffffff' : null, pancarKuat: malam ? .55 : 0 });
      mat.map = tex.clone(); mat.map.needsUpdate = true; mat.map.repeat.set(Math.max(1, Math.round(lb / 1.2)), Math.max(1, Math.round(t / 1.2)));
      if (malam) mat.emissiveMap = mat.map;
      const m = this._b(geoKotak(lb, t, dl, .06), wr, [0, t / 2, 0], { bahan: mat });
      this._b(geoKotak(lb * 1.04, .22, dl * 1.04, .04), campur(wr, P.gelap, .3), [0, t + .11, 0]);
    });
  },
  /** deretan gedung di belakang: n, x [kiri, kanan], z, tinggi [min, maks], benih */
  kota(o = {}) {
    const n = o.n ?? 9, [x0, x1] = o.x || [-14, 14], z = o.z ?? -14, [t0, t1] = o.tinggi || [5, 16], bn = o.benih ?? 3;
    return this.grup(Object.assign({}, o, { posisi: undefined }), () => { for (let i = 0; i < n; i++) { const lb = 2 + acak(i * 3 + bn) * 2.4, t = lerp(t0, t1, acak(i * 7 + bn)); this.gedung({ posisi: [lerp(x0, x1, (i + .5) / n) + (acak(i + bn) - .5), 0, z - acak(i * 5 + bn) * 4], lebar: lb, tinggi: t, dalam: 2.5 + acak(i * 11) * 2, warna: o.warna ? campur(o.warna, '#ffffff', acak(i * 13) * .2) : campur(P.latar, i % 2 ? P.terang : P.utama, .2 + acak(i * 13) * .2) }); } });
  },
  /** jalan aspal + marka putus-putus + trotoar: panjang, lebar, arah 'x'|'z', trotoar (bool) */
  jalan(o = {}) {
    const pj = o.panjang ?? 80, lb = o.lebar ?? 6, arahX = (o.arah || 'x') === 'x';
    return this.grup(Object.assign({ putar: arahX ? 0 : 90 }, o), () => {
      const aspal = bahan({ warna: '#ffffff', peta: teksturPola('aspal', o.warna || '#4E525E'), unik: true, kasar: .95 }); aspal.map = aspal.map.clone(); aspal.map.repeat.set(pj / 6, lb / 6); aspal.map.needsUpdate = true;
      const m = new THREE.Mesh(geoBidang(pj, lb), aspal); m.rotation.x = -Math.PI / 2; m.position.y = .01; m.receiveShadow = true; this._induk().add(m);
      for (let x = -pj / 2 + 1; x < pj / 2; x += 3) { const s = new THREE.Mesh(geoBidang(1.6, .14), bahan({ warna: '#F2F2EA', kasar: .8 })); s.rotation.x = -Math.PI / 2; s.position.set(x, .02, 0); s.receiveShadow = true; this._induk().add(s); }
      if (o.trotoar !== false) [-1, 1].forEach(s => this._b(geoKotak(pj, .18, 1.6, .03), o.warnaTrotoar || '#B9B6AE', [0, .09, s * (lb / 2 + .8)], { tepi: false, pijak: true }));
    });
  },
  lampuJalan(o = {}) {
    const t = o.tinggi ?? 4.2, malam = this.keadaan === 'malam' || o.nyala;
    return this.grup(o, () => {
      this._b(geoSilinder(.06, .09, t, 14), o.warna || '#3B4256', [0, t / 2, 0]);
      this._b(geoKapsul(.045, .8, 8), o.warna || '#3B4256', [.4, t, 0], { r: [0, 0, Math.PI / 2] });
      this._b(geoKotak(.36, .12, .22, .04), '#2A2F3D', [.78, t - .05, 0]);
      if (malam) this.lampu({ posisi: [.78, t - .18, 0], warna: '#FFC66E', kuat: 2.4, jarak: 8, ukuran: .08, pendar: 1.6, bayang: !!o.bayang });
    });
  },
  /* --- dalam ruangan --- */
  /** ruangan: lebar, dalam, tinggi, dinding (warna), lantai (jenis tanah), jendela (true | [x, y, lebar, tinggi]), lampu (gantung), dindingSamping, motif */
  ruang(o = {}) {
    const lb = o.lebar ?? 9, dl = o.dalam ?? 7, t = o.tinggi ?? 3.4, din = o.dinding || campur(P.latar, P.terang, .32), malam = this.keadaan === 'malam' || o.malam;
    this.scene.background = warna3(campur(din, P.gelap, .5)).clone();
    this._tertutup = true;   // cek latar kosong (07-bidikan.js) berlaku di adegan ber-ruang
    return this.grup(Object.assign({}, o, { warna: undefined }), () => {
      this.tanah({ jenis: o.lantai || 'kayu', warna: o.warnaLantai, ukuran: Math.max(lb, dl) * 2.2 });
      /* Dinding "rumah boneka" (sejak 27 Nov 2026, uji Timbangan Daging: bidikan otomatis menghadap sisi ruang yang terbuka → latar ungu kosong):
         4 dinding + plafon = bidang yang hanya terlihat dari DALAM (FrontSide menghadap ke dalam). Kamera di luar dinding mana pun tetap melihat isi
         ruang (dinding di depannya tak tergambar) dan di belakang tokoh selalu ada dinding/plafon. Tabrakan memakai kotak tak terlihat
         (dindingRuang: tokoh/benda tetap tidak boleh menembus, tetapi kamera boleh berada di baliknya). tutup: false = hanya belakang + samping (lama). */
      const tutup = o.tutup !== false, petaDinding = (w, h) => {
        if (o.motif === 'bata') { const tx = teksturPola('bata', din).clone(); tx.needsUpdate = true; tx.repeat.set(w / .9, h / .9); return bahan({ warna: '#ffffff', peta: tx, unik: true, kasar: .95 }); }
        if (o.motif === 'garis') { const cv = kanvasBaru(256, 256), c = cv.getContext('2d'); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? din : campur(din, '#ffffff', .12); c.fillRect(i * 32, 0, 32, 256); } const tx = teksturKanvas(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(w / 2, 1); return bahan({ warna: '#ffffff', peta: tx, unik: true }); }
        return null;
      };
      const dinding = (w, pos, rotY, wr, bayang = true) => {
        const mat = petaDinding(w, t), m = this._b(geoBidang(w, t), wr, pos, Object.assign({ r: [0, rotY, 0], tepi: false, latar: true }, mat ? { bahan: mat } : {}));
        m.castShadow = bayang; m.userData.dindingVisual = true;
        const plint = this._b(geoBidang(w, .16), campur(din, P.gelap, .45), [0, 0, 0], { tepi: false, latar: true }); plint.castShadow = false;
        plint.position.set(pos[0], .08, pos[2]); plint.rotation.set(0, rotY, 0); plint.translateZ(.012);
        return m;
      };
      const kotakTabrak = (w, d, pos) => { const m = this._b(geoKotak(w, t, d, .01), din, pos, { tepi: false }); m.visible = false; m.castShadow = false; m.userData.dindingRuang = true; return m; };
      dinding(lb, [0, t / 2, -dl / 2], 0, din); kotakTabrak(lb, .2, [0, t / 2, -dl / 2 - .1]);
      if (o.dindingSamping !== false) [-1, 1].forEach(s => { dinding(dl, [s * lb / 2, t / 2, 0], -s * Math.PI / 2, campur(din, P.gelap, .08)); kotakTabrak(.2, dl, [s * (lb / 2 + .1), t / 2, 0]); });
      if (tutup) {
        dinding(lb, [0, t / 2, dl / 2], Math.PI, campur(din, P.gelap, .04), false); kotakTabrak(lb, .2, [0, t / 2, dl / 2 + .1]);
        const pl = this._b(geoBidang(lb, dl), o.warnaPlafon || campur(din, P.gelap, .3), [0, t, 0], { r: [Math.PI / 2, 0, 0], tepi: false, latar: true }); pl.castShadow = false; pl.userData.dindingVisual = true;
      }
      if (o.jendela !== false) {
        const [jx, jy, jw, jh] = Array.isArray(o.jendela) ? o.jendela : [lb * .22, t * .58, 1.8, 1.5];
        this._b(geoKotak(jw + .16, jh + .16, .12, .03), o.warnaBingkai || '#F4EFE6', [jx, jy, -dl / 2 + .12]);
        const kaca = new THREE.Mesh(geoBidang(jw, jh), new THREE.MeshBasicMaterial({ map: teksturGradien(malam ? '#1A2766' : '#7FC3F2', malam ? '#3A4C9A' : '#DDF2FB'), toneMapped: false })); kaca.position.set(jx, jy, -dl / 2 + .19); this._induk().add(kaca);
        this._b(geoKotak(.06, jh, .05, .01), o.warnaBingkai || '#F4EFE6', [jx, jy, -dl / 2 + .2], { tepi: false }); this._b(geoKotak(jw, .06, .05, .01), o.warnaBingkai || '#F4EFE6', [jx, jy, -dl / 2 + .2], { tepi: false });
        if (!malam) { const s = new THREE.SpotLight(warna3('#FFF1C9').clone(), 1.6, 0, 30 * D2R, .6, 1); s.position.set(jx, jy + 1.5, -dl / 2 - 1); s.target.position.set(jx - .5, 0, dl * .1); s.castShadow = false; this.scene.add(s); this.scene.add(s.target); }
      }
      if (o.lampu !== false && (malam || o.lampu)) { const lx = typeof o.lampu === 'number' ? o.lampu : 0; this._b(geoSilinder(.01, .01, .7, 6), '#333', [lx, t - .35, 0], { tepi: false, bayang: false }); this._b(geoKerucut(.28, .22, 20), o.warnaKap || P.aksen, [lx, t - .78, 0], { bayang: false }); this.lampu({ posisi: [lx, t - .92, 0], warna: '#FFD08A', kuat: 2.2, jarak: 10, ukuran: .07, pendar: 1.3, bayang: true }); }
      if (o.foto !== false) [[-lb * .2, t * .62, .9, .7], [-lb * .2 + 1.1, t * .55, .55, .7]].forEach(([x, y, w, h], i) => { this._b(geoKotak(w, h, .05, .02), '#5A3E2B', [x, y, -dl / 2 + .13]); this._b(geoBidang(w - .1, h - .1), i ? P.aksen : P.kedua, [x, y, -dl / 2 + .17], { tepi: false }); });
    });
  },
  meja(o = {}) { const lb = o.lebar ?? 1.4, t = o.tinggi ?? .75, dl = o.dalam ?? .8, wr = o.warna || '#A86B3C'; const g = this.grup(o, () => { this._b(geoKotak(lb, .06, dl, .02), wr, [0, t - .03, 0]); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => this._b(geoSilinder(.03, .03, t - .06, 10), campur(wr, P.gelap, .3), [x * (lb / 2 - .08), (t - .06) / 2, z * (dl / 2 - .08)])); }); g.userData.atas = t; return g; },
  kursi(o = {}) { const wr = o.warna || '#B9784A', j = new THREE.Group(); const g = this.grup(o, () => { this._b(geoKotak(.5, .06, .5, .02), wr, [0, .39, 0]); this._b(geoKotak(.5, .55, .05, .02), wr, [0, .69, -.23]); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => this._b(geoSilinder(.025, .025, .39, 8), campur(wr, P.gelap, .3), [x * .21, .195, z * .21])); j.position.set(0, .42, .02); this._induk().add(j); }); g.userData.jok = j; return g; },
  sofa(o = {}) { const lb = o.lebar ?? 2.1, wr = o.warna || campur(P.kedua, P.terang, .2), j = new THREE.Group(); const g = this.grup(o, () => { this._b(geoKotak(lb, .4, .9, .12), wr, [0, .2, 0]); this._b(geoKotak(lb, .55, .25, .12), campur(wr, P.gelap, .08), [0, .67, -.34]); [-1, 1].forEach(s => this._b(geoKotak(.22, .62, .9, .1), campur(wr, P.gelap, .05), [s * (lb / 2 - .11), .31, 0])); for (let i = 0; i < 2; i++) this._b(geoKotak(lb / 2 - .26, .12, .7, .06), campur(wr, '#ffffff', .1), [(i - .5) * (lb / 2 - .2), .46, .06]); j.position.set(0, .44, .05); this._induk().add(j); }); g.userData.jok = j; return g; },
  kasur(o = {}) { const wr = o.warna || '#F2EEE6', sl = o.warnaSelimut || P.utama, j = new THREE.Group(); const g = this.grup(o, () => { this._b(geoKotak(1.6, .3, 2.2, .05), '#8B5A36', [0, .15, 0]); this._b(geoKotak(1.5, .22, 2.1, .1), wr, [0, .4, 0]); this._b(geoKotak(1.52, .08, 1.3, .04), sl, [0, .53, .4]); this._b(geoKotak(.7, .14, .4, .07), '#FFFFFF', [0, .58, -.75]); this._b(geoKotak(1.6, .9, .1, .04), '#8B5A36', [0, .45, -1.1]); j.position.set(0, .52, -.2); this._induk().add(j); }); g.userData.jok = j; return g; },
  rak(o = {}) { const wr = o.warna || '#9A6A42', t = o.tinggi ?? 1.8, lb = o.lebar ?? 1.2; return this.grup(o, () => { this._b(geoKotak(lb, t, .05, .01), campur(wr, P.gelap, .2), [0, t / 2, -.17]); [-1, 1].forEach(s => this._b(geoKotak(.05, t, .36, .01), wr, [s * lb / 2, t / 2, 0])); for (let i = 0; i < 4; i++) { const y = .05 + i * (t - .1) / 3; this._b(geoKotak(lb, .04, .36, .01), wr, [0, y, 0]); if (i < 3) for (let k = 0; k < 6; k++) { const h = .22 + acak(i * 9 + k) * .1; this._b(geoKotak(.07, h, .24, .01), [P.utama, P.kedua, P.aksen, '#3E6FB0', '#E0E0E0'][(i + k) % 5], [-lb / 2 + .12 + k * .16, y + .02 + h / 2, 0], { tepi: false }); } } }); },
  /* --- layar --- */
  /** tv/monitor: lebar, layar(g2, w, h, t, T) (API 2D di dalam layar), warnaLayar, kaki (bool) */
  tv(o = {}) { const lb = o.lebar ?? 1.6, t = lb * .58; return this.grup(o, () => { this._b(geoKotak(lb + .08, t + .08, .07, .03), '#1C1F27', [0, (o.kaki !== false ? .5 : 0) + t / 2, 0]); this._layar(lb, t, o, [0, (o.kaki !== false ? .5 : 0) + t / 2, .04], 640); if (o.kaki !== false) { this._b(geoSilinder(.04, .04, .45, 10), '#2A2D36', [0, .25, -.02]); this._b(geoKotak(.5, .03, .25, .01), '#2A2D36', [0, .015, 0]); } }); },
  laptop(o = {}) { const lb = o.lebar ?? .62, wr = o.warna || '#B8BCC6', sudut = o.buka ?? 105; return this.grup(o, () => { this._b(geoKotak(lb, .025, lb * .68, .01), wr, [0, .0125, 0]); this._b(geoBidang(lb * .86, lb * .38), '#2A2D36', [0, .027, .02], { r: [-Math.PI / 2, 0, 0], tepi: false }); const tutup = new THREE.Group(); tutup.position.set(0, .025, -lb * .34); tutup.rotation.x = -(sudut - 90) * D2R; this._induk().add(tutup); this._grup.push(tutup); try { this._b(geoKotak(lb, lb * .62, .018, .01), wr, [0, lb * .31, 0]); this._layar(lb * .9, lb * .54, o, [0, lb * .31, .011], 512); } finally { this._grup.pop(); } }); },
  /** hp tegak: tinggi (m), layar(g2, w, h, t, T), warna */
  hp(o = {}) { const t = o.tinggi ?? .32, lb = t * .48; return this.grup(o, () => { this._b(geoKotak(lb, t, .022, .03), o.warna || '#20232B', [0, t / 2, 0], { kasar: .3 }); this._layar(lb * .9, t * .92, o, [0, t / 2, .0115], 360); this._b(geoKapsul(.008, .03, 8), '#0B0C10', [0, t * .94, .012], { r: [0, 0, Math.PI / 2], tepi: false }); }); },
  /* --- tulisan --- */
  /** teks 3D bervolume: s ('\n' baris baru, *aksen* diabaikan), ukuran (tinggi huruf m), warna, sisi (warna badan huruf), tebal, lapis,
      font 'judul'|'teks'|'mono', berat, latar (pelat), hadapKamera (true | 'y'); posisi = TITIK TENGAH */
  teks(s, o = {}) {
    const px = 170, tt = teksturTeks(s, { px, berat: o.berat, font: o.font, latar: o.latar, garis: o.garis }), baris = String(s).split('\n').length;
    const h = (o.ukuran ?? .5) * (tt.h / (px * 1.12 * baris)) * baris, w = h * tt.w / tt.h, lapis = o.lapis ?? 9, tebal = o.tebal ?? (o.ukuran ?? .5) * .2;
    const wr = o.warna || P.terang, sisi = o.sisi || campur(wr === P.terang ? P.utama : wr, P.gelap, .55);
    const g = new THREE.Group(), geo = geoBidang(w, h);
    for (let i = lapis; i >= 0; i--) {
      const mt = new THREE.MeshBasicMaterial({ map: tt.tex, color: warna3(i ? campur(sisi, P.gelap, i / lapis * .35) : (o.latar ? '#ffffff' : wr)).clone(), alphaTest: .45, toneMapped: false, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mt); m.position.z = -tebal * i / lapis; m.castShadow = i === lapis && o.bayang !== false; g.add(m);
    }
    g.userData.tinggi = h; g.userData.lebar = w;
    this.pasang(g, o);
    if (o.hadapKamera) { const sumbuY = o.hadapKamera === 'y'; this.upd.push(() => { if (!g.visible) return; if (sumbuY) { const c = this.kamera.position, p = g.getWorldPosition(new THREE.Vector3()); g.rotation.y = Math.atan2(c.x - p.x, c.z - p.z); } else g.quaternion.copy(this.kamera.quaternion); }); }
    return g;
  },
  /** papan nama/spanduk: teks, lebar, tinggi, warna (papan), warnaTeks, tiang (panjang tiang ke tanah, 0 = menempel), lampu (bingkai bohlam) */
  papan(s, o = {}) {
    const lb = o.lebar ?? 2.4, t = o.tinggi ?? .9, tiang = o.tiang ?? 0, wr = o.warna || P.kedua, wt = o.warnaTeks || P.terang;
    return this.grup(o, () => {
      this._b(geoKotak(lb, t, .1, .05), wr, [0, tiang + t / 2, 0]);
      this._b(geoKotak(lb - .12, t - .12, .02, .02), campur(wr, '#ffffff', .12), [0, tiang + t / 2, .055], { tepi: false });
      const tt = teksturTeks(s, { px: 160, berat: o.berat || 900, warna: wt, font: o.font }), maksW = lb * .88, maksH = t * .78; let pw = maksW, ph = pw * tt.h / tt.w; if (ph > maksH) { ph = maksH; pw = ph * tt.w / tt.h; }
      const m = new THREE.Mesh(geoBidang(pw, ph), new THREE.MeshStandardMaterial({ map: tt.tex, transparent: true, roughness: .6, envMapIntensity: .3, depthWrite: false })); m.position.set(0, tiang + t / 2, .068); this._induk().add(m);
      if (tiang > 0) [-1, 1].forEach(s => this._b(geoSilinder(.04, .04, tiang + t * .5, 10), o.warnaTiang || '#5A5E6A', [s * lb * .38, (tiang + t * .5) / 2, -.06]));
      if (o.lampu) { const n = Math.round(lb / .22); for (let i = 0; i < n; i++) { const x = -lb / 2 + (i + .5) * lb / n; [tiang + .03, tiang + t - .03].forEach(y => this._b(geoBola(.03, 8, 6), '#FFE6A0', [x, y, .07], { dasar: true })); } }
    });
  },
  /* --- ikon, koin, uang, grafik --- */
  /** ikon 3D terekstrusi: bintang hati petir cek silang panah tetes plus pin peringatan; ukuran (m), warna, tebal */
  ikon(nama, o = {}) {
    const S = new THREE.Shape(), u = 1;
    const poli = pts => { pts.forEach(([x, y], i) => (i ? S.lineTo(x, y) : S.moveTo(x, y))); S.closePath(); };
    if (nama === 'bintang') poli(Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? .42 : 1, a = Math.PI / 2 + i * Math.PI / 5; return [Math.cos(a) * r, Math.sin(a) * r]; }));
    else if (nama === 'hati') { S.moveTo(0, -.9); S.bezierCurveTo(-.2, -.6, -1.05, -.2, -1, .3); S.bezierCurveTo(-.95, .85, -.25, .95, 0, .5); S.bezierCurveTo(.25, .95, .95, .85, 1, .3); S.bezierCurveTo(1.05, -.2, .2, -.6, 0, -.9); }
    else if (nama === 'petir') poli([[.15, 1], [-.6, -.1], [-.05, -.1], [-.3, -1], [.6, .2], [.05, .2]]);
    else if (nama === 'cek') poli([[-1, .05], [-.62, .45], [-.25, .05], [.62, .95], [1, .55], [-.25, -.75]]);
    else if (nama === 'silang') poli([[-.75, -1], [-1, -.75], [-.25, 0], [-1, .75], [-.75, 1], [0, .25], [.75, 1], [1, .75], [.25, 0], [1, -.75], [.75, -1], [0, -.25]]);
    else if (nama === 'panah') poli([[-1, -.25], [.2, -.25], [.2, -.65], [1, 0], [.2, .65], [.2, .25], [-1, .25]]);
    else if (nama === 'plus') poli([[-.3, -1], [.3, -1], [.3, -.3], [1, -.3], [1, .3], [.3, .3], [.3, 1], [-.3, 1], [-.3, .3], [-1, .3], [-1, -.3], [-.3, -.3]]);
    else if (nama === 'tetes') { S.moveTo(0, 1); S.bezierCurveTo(.3, .45, .75, .05, .75, -.3); S.absarc(0, -.3, .75, 0, Math.PI, true); S.bezierCurveTo(-.75, .05, -.3, .45, 0, 1); }
    else if (nama === 'pin') { S.moveTo(0, -1); S.bezierCurveTo(.3, -.5, .8, -.05, .8, .35); S.absarc(0, .35, .8, 0, Math.PI, false); S.bezierCurveTo(-.8, -.05, -.3, -.5, 0, -1); const l = new THREE.Path(); l.absarc(0, .35, .32, 0, Math.PI * 2, true); S.holes.push(l); }
    else if (nama === 'peringatan') { poli([[0, 1], [1, -.8], [-1, -.8]]); const l = new THREE.Path(); [[-.08, .35], [.08, .35], [.05, -.25], [-.05, -.25]].forEach(([x, y], i) => (i ? l.lineTo(x, y) : l.moveTo(x, y))); l.closePath(); S.holes.push(l); const l2 = new THREE.Path(); l2.absarc(0, -.48, .09, 0, Math.PI * 2, true); S.holes.push(l2); }
    else { S.absarc(0, 0, 1, 0, Math.PI * 2, false); }
    const uk = (o.ukuran ?? .6) / 2, wrBawaan = { hati: '#E8444D', bintang: '#FFC531', petir: '#FFC531', cek: '#3DBE6A', silang: '#E8444D', peringatan: '#FFB020', tetes: '#4AA8F0', pin: '#E8444D' }[nama] || P.aksen;
    const sk = uk * (o.skala || 1);   // bentuk ±1 satuan → ukuran meter; tebal ditulis dalam meter
    return this.ekstrusi(Object.assign({}, o, { shape: S, tebal: (o.tebal ?? uk * .5) / uk, bevel: .1, pusat: true, skala: [sk, sk, sk], warna: o.warna || wrBawaan }));
  },
  /** koin emas: r (m), tulisan (di muka) */
  koin(o = {}) {
    const r = o.r ?? .3, tb = r * .18, wr = o.warna || '#F4C430', kunci = `koin|${wr}|${o.tulisan || 'Rp'}`;
    let tex = M3.tekstur.get(kunci); if (!tex) { const cv = kanvasBaru(256, 256), c = cv.getContext('2d'); c.fillStyle = wr; c.fillRect(0, 0, 256, 256); c.strokeStyle = campur(wr, '#7A4A00', .55); c.lineWidth = 14; c.beginPath(); c.arc(128, 128, 104, 0, 7); c.stroke(); c.fillStyle = campur(wr, '#7A4A00', .6); c.font = `900 ${o.tulisan && o.tulisan.length > 2 ? 70 : 96}px ${FONT.judul}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.tulisan || 'Rp', 128, 136); tex = teksturKanvas(cv); tex.userData.bersama = true; M3.tekstur.set(kunci, tex); }
    return this.grup(o, () => { const g = geoSilinder(r, r, tb, 40); const sisi = bahan({ warna: campur(wr, '#B07800', .3), logam: .6, kasar: .35, env: 1.2 }), muka = bahan({ warna: '#ffffff', peta: tex, logam: .55, kasar: .35, env: 1.2 }); const m = new THREE.Mesh(g, [sisi, muka, muka]); m.castShadow = true; m.userData.padat = true; m.position.y = r; m.rotation.x = Math.PI / 2; this._induk().add(m); if (gaya3D().tepi) { const t = new THREE.Mesh(g, bahanTepi(campur(wr, P.gelap, .7))); m.add(t); } });
  },
  /** uang kertas generik (bukan uang asli): nilai ('100.000'), warna, tumpuk (jumlah lembar) */
  uang(o = {}) {
    const wr = o.warna || '#4FA36B', kunci = `uang|${wr}|${o.nilai || '100.000'}`;
    let tex = M3.tekstur.get(kunci); if (!tex) { const cv = kanvasBaru(512, 240), c = cv.getContext('2d'); c.fillStyle = wr; c.fillRect(0, 0, 512, 240); c.strokeStyle = campur(wr, '#ffffff', .5); c.lineWidth = 10; c.strokeRect(14, 14, 484, 212); c.fillStyle = campur(wr, '#ffffff', .25); c.beginPath(); c.arc(130, 120, 62, 0, 7); c.fill(); c.fillStyle = '#FFFFFF'; c.font = `900 64px ${FONT.judul}`; c.textAlign = 'right'; c.fillText(o.nilai || '100.000', 480, 150); c.font = `800 34px ${FONT.judul}`; c.fillText('RUPIAH', 480, 74); tex = teksturKanvas(cv); tex.userData.bersama = true; M3.tekstur.set(kunci, tex); }
    const n = o.tumpuk ?? 1;
    return this.grup(o, () => { const mt = bahan({ warna: '#ffffff', peta: tex, kasar: .85, env: .2 }), sisi = bahan({ warna: campur(wr, '#ffffff', .4) }); for (let i = 0; i < n; i++) { const m = new THREE.Mesh(geoKotak(.62, .006, .29, 0), [sisi, sisi, mt, sisi, sisi, sisi]); m.userData.padat = true; m.position.set((acak(i) - .5) * .03, .003 + i * .007, (acak(i + 4) - .5) * .02); m.rotation.y = (acak(i * 3) - .5) * .12; m.castShadow = true; m.receiveShadow = true; this._induk().add(m); } });
  },
  /** grafik batang 3D: data [{nilai, label, warna}], tinggi (m untuk nilai maks), lebar (m per batang), jarak, mulai, jeda (stagger), lama, akhiran, desimal,
      angka (bool), ukuranAngka, ukuranLabel */
  batang(data, o = {}) {
    const tMaks = o.tinggi ?? 2.4, lb = o.lebar ?? .55, jr = o.jarak ?? .85, maks = o.maks ?? Math.max(...data.map(d => d.nilai)), a = this.a, mulai = wl(o.mulai, a) ?? .2, jeda = o.jeda ?? .15;
    return this.grup(o, () => {
      const n = data.length, x0 = -(n - 1) * jr / 2;
      this._b(geoKotak(n * jr + .3, .08, lb + .5, .04), o.warnaAlas || campur(P.latar, P.gelap, .25), [0, .04, 0]);
      data.forEach((d, i) => {
        const h = Math.max(.02, d.nilai / maks * tMaks), wr = d.warna || [P.utama, P.aksen, P.kedua][i % 3];
        const g = new THREE.Group(); g.position.set(x0 + i * jr, .08, 0); this._induk().add(g);
        const m = mesh3(geoKotak(lb, h, lb, .05), { warna: wr }); m.position.y = h / 2; g.add(m);
        let tAngka = null;
        if (o.angka !== false) { tAngka = this.teks(ribuan(d.nilai, o.desimal || 0) + (o.akhiran || ''), { posisi: [x0 + i * jr, .08 + h + .25, 0], ukuran: o.ukuranAngka ?? .26, warna: P.terang, hadapKamera: 'y' }); }
        if (d.label) this.teks(d.label, { posisi: [x0 + i * jr, .22, lb / 2 + .3], ukuran: o.ukuranLabel ?? Math.min(.16, jr * .2), warna: P.terang, putar: [-12, 0, 0], lapis: 4 });
        this.upd.push(t => { const e = E.outCubic(jepit((t - mulai - i * jeda) / (o.lama ?? .9))); g.scale.y = Math.max(1e-3, e); if (tAngka) { tAngka.position.y = .08 + h * e + .25; tAngka.visible = e > .05; } });
      });
    });
  },
  /** diagram pai 3D: data [{nilai, warna}], r, tebal, mulai, lepas (indeks potongan yang keluar) */
  pai(data, o = {}) {
    const r = o.r ?? 1.2, tb = o.tebal ?? .35, total = data.reduce((s, d) => s + d.nilai, 0), a = this.a, mulai = wl(o.mulai, a) ?? .2;
    return this.grup(o, () => {
      let s0 = 0;
      data.forEach((d, i) => {
        const sudut = d.nilai / total * Math.PI * 2, tengah = s0 + sudut / 2, g = new THREE.Group(); this._induk().add(g);
        const m = mesh3(new THREE.CylinderGeometry(r, r, tb, 48, 1, false, s0, sudut), { warna: d.warna || [P.utama, P.aksen, P.kedua, P.terang][i % 4] }); m.position.y = tb / 2; g.add(m);
        const lepas = o.lepas === i;
        this.upd.push(t => { const e = E.outBack(jepit((t - mulai - i * .12) / .55)); g.scale.set(Math.max(1e-3, e), 1, Math.max(1e-3, e)); const k = lepas ? E.outCubic(jepit((t - mulai - .8) / .5)) * .28 : 0; g.position.set(Math.sin(tengah) * k, 0, Math.cos(tengah) * k); });
        s0 += sudut;
      });
    });
  },
  /** panah 3D dari → ke (titik dunia), tebal, warna, mulai + lama (tumbuh) */
  panah(o = {}) {
    const dari = new THREE.Vector3(...(o.dari || [0, 1, 0])), ke = new THREE.Vector3(...(o.ke || [1, 1, 0])), arah = ke.clone().sub(dari), L = arah.length(), tb = o.tebal ?? .07, wr = o.warna || P.aksen, a = this.a;
    const g = new THREE.Group(); g.position.copy(dari); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.clone().normalize()); this._induk().add(g);
    const bt = mesh3(geoSilinder(tb, tb, 1, 16), { warna: wr }), kp = mesh3(geoKerucut(tb * 2.4, tb * 5, 20), { warna: wr }); g.add(bt); g.add(kp);
    const mulai = wl(o.mulai, a) ?? 0, lama = o.lama ?? .6;
    this.upd.push(t => { const e = o.mulai === undefined && o.lama === undefined ? 1 : E.outCubic(jepit((t - mulai) / lama)), l = Math.max(.001, (L - tb * 5) * e); bt.scale.y = l; bt.position.y = l / 2; kp.position.y = l + tb * 2.5; g.visible = e > .01; });
    if (o.nama) this.nama[o.nama] = g; return g;
  },
  /* --- kendaraan & tempat cerita --- */
  /** motor: warna, laju (putaran roda rad/dtk walau motor diam di tempat; bawaan 0), lampu (nyala), getar; roda juga berputar sendiri bila motor
      bergerak (anim/ikutJalur); userData.jok untuk tokoh (naik) */
  motor(o = {}) {
    const wr = o.warna || P.kedua, gelap = '#24262E', laju = o.laju ?? 0, j = new THREE.Group(), roda = [];
    const g = this.grup(o, () => {
      [-1, 1].forEach(s => { const r = new THREE.Group(); r.position.set(0, .3, s * .62); this._induk().add(r); this._grup.push(r); try { this._b(geoTorus(.24, .075, 30), gelap, [0, 0, 0], { r: [0, Math.PI / 2, 0] }); this._b(geoSilinder(.15, .15, .07, 20), '#C9CDD6', [0, 0, 0], { r: [0, 0, Math.PI / 2], logam: .6, kasar: .3 }); for (let k = 0; k < 3; k++) this._b(geoKotak(.05, .27, .03, .01), '#8E939E', [0, 0, 0], { r: [k * Math.PI / 3, 0, 0], tepi: false }); } finally { this._grup.pop(); } roda.push(r); });
      this._b(geoKotak(.38, .44, .8, .16), wr, [0, .6, -.26]);                                   // bodi belakang (menutup roda belakang)
      this._b(geoKotak(.34, .11, .66, .05), '#2B2C33', [0, .87, -.22]);                           // jok
      this._b(geoKotak(.34, .08, .5, .03), '#3A3D47', [0, .38, .2]);                              // dek kaki
      this._b(geoKotak(.4, .66, .13, .08), wr, [0, .7, .5], { r: [-.22, 0, 0] });                 // tameng depan
      this._b(geoKotak(.22, .1, .42, .05), wr, [0, .6, .66], { r: [.25, 0, 0] });                 // spakbor depan
      this._b(geoSilinder(.035, .035, .42, 10), gelap, [0, .92, .58], { r: [-.22, 0, 0] });       // tiang setir
      this._b(geoKotak(.42, .13, .18, .06), wr, [0, 1.12, .62]);                                  // kepala setir
      this._b(geoKapsul(.025, .7, 8), gelap, [0, 1.13, .6], { r: [0, 0, Math.PI / 2] });         // stang
      this._b(geoKotak(.16, .09, .05, .03), '#FFF6D8', [0, 1.1, .72], { pancar: o.lampu ? '#FFF2C0' : null, pancarKuat: 2 });
      this._b(geoKotak(.14, .06, .04, .02), '#D8342E', [0, .78, -.67], { pancar: o.lampu ? '#FF3B30' : null, pancarKuat: 1.5 });
      this._b(geoSilinder(.04, .05, .42, 10), '#9EA3AE', [.2, .32, -.42], { r: [Math.PI / 2 - .2, 0, 0], logam: .7, kasar: .3 });
      j.position.set(0, .9, -.16); this._induk().add(j);
      if (o.lampu) { const l = this.sorot({ posisi: [0, 1.1, .9], ke: [0, 0, 6], warna: '#FFF0C8', kuat: 3, sudut: 22, kerucut: false, bayang: false }); }
    });
    g.userData.jok = j; j.userData.motor = g;
    const bn = g.userData.benih;
    this.upd.push((t, T) => { const tempuh = jarakTempuh(g); roda.forEach(r => (r.rotation.x = T * laju + tempuh / .3)); const hidup = laju || g.userData._gerak; if (o.getar !== 0 && hidup) j.position.y = .9 + Math.sin(T * 38 + bn) * (o.getar ?? .006); });
    return g;
  },
  /** mobil kecil membulat: warna, laju (roda), lampu; userData.jok (kursi sopir) */
  mobil(o = {}) {
    const wr = o.warna || P.kedua, gelap = '#22242C', laju = o.laju ?? 0, roda = [], j = new THREE.Group();
    const g = this.grup(o, () => {
      this._b(geoKotak(1.7, .6, 3.6, .25), wr, [0, .62, 0]);
      this._b(geoKotak(1.5, .62, 1.9, .3), wr, [0, 1.18, -.25]);
      [[0, 1.2, .72, 1.3, .5, .05, -.5], [0, 1.2, -1.22, 1.3, .48, .05, .45]].forEach(([x, y, z, w, h, d, rx]) => this._b(geoKotak(w, h, d, .02), '#2E3D56', [x, y, z], { r: [rx, 0, 0], kasar: .15, env: 1.3, tepi: false }));
      [-1, 1].forEach(s => this._b(geoKotak(.03, .45, 1.6, .02), '#2E3D56', [s * .76, 1.2, -.25], { kasar: .15, env: 1.3, tepi: false }));
      [[-1, 1.1], [1, 1.1], [-1, -1.15], [1, -1.15]].forEach(([s, z]) => { const r = new THREE.Group(); r.position.set(s * .78, .36, z); this._induk().add(r); this._grup.push(r); try { this._b(geoSilinder(.36, .36, .26, 24), gelap, [0, 0, 0], { r: [0, 0, Math.PI / 2] }); this._b(geoSilinder(.2, .2, .27, 16), '#C9CDD6', [0, 0, 0], { r: [0, 0, Math.PI / 2], logam: .6 }); } finally { this._grup.pop(); } roda.push(r); });
      [-1, 1].forEach(s => { this._b(geoKotak(.32, .14, .06, .04), '#FFF7DA', [s * .55, .78, 1.79], { pancar: o.lampu ? '#FFF2C0' : null, pancarKuat: 2 }); this._b(geoKotak(.3, .12, .06, .04), '#D8342E', [s * .58, .8, -1.79], { pancar: o.lampu ? '#FF3B30' : null, pancarKuat: 1.5 }); });
      j.position.set(-.38, .6, -.1); this._induk().add(j);
    });
    g.userData.jok = j; this.upd.push((t, T) => { const tempuh = jarakTempuh(g); roda.forEach(r => (r.rotation.x = T * laju + tempuh / .36)); }); return g;
  },
  /** warung/kios: lebar, warna (atap belang), tulisan (papan nama), warnaMeja */
  warung(o = {}) {
    const lb = o.lebar ?? 3.4, wr = o.warna || P.kedua, kayu = o.warnaKayu || '#9A6238';
    return this.grup(o, () => {
      this._b(geoKotak(lb, 1, .8, .05), kayu, [0, .5, .3]);
      this._b(geoKotak(lb + .1, .06, .95, .02), campur(kayu, '#ffffff', .2), [0, 1.03, .3]);
      [-1, 1].forEach(s => this._b(geoSilinder(.05, .05, 2.6, 10), kayu, [s * lb / 2, 1.3, .7]));
      [-1, 1].forEach(s => this._b(geoSilinder(.05, .05, 2.9, 10), kayu, [s * lb / 2, 1.45, -.6]));
      const n = 8; for (let i = 0; i < n; i++) this._b(geoKotak(lb / n + .01, .05, 1.9, .01), i % 2 ? wr : '#F7F2E8', [-lb / 2 + (i + .5) * lb / n, 2.75, .05], { r: [.22, 0, 0], tepi: i === 0 ? undefined : false });
      this._b(geoKotak(lb, .9, .1, .02), campur(P.latar, P.terang, .35), [0, 1.45, -.62], { tepi: false });
      if (o.tulisan !== false) this.papan(o.tulisan || 'WARUNG', { posisi: [0, 2.95, .95], lebar: lb * .8, tinggi: .6, warna: o.warnaPapan || P.aksen, warnaTeks: P.gelap, putar: [-8, 0, 0] });
      for (let i = 0; i < 4; i++) this._b(geoSilinder(.1, .1, .22, 12), ['#E8B04A', '#D9573B', '#8DBF5A', '#F2E0B6'][i], [-lb / 2 + .5 + i * .45, 1.17, .3]);
    });
  },
  /** jam dinding: r, jam (angka jam awal, mis. 7.5 = 07.30), laju (jam per detik video) */
  jam(o = {}) {
    const r = o.r ?? .4, a = this.a; let jarum = null;
    const g = this.grup(o, () => {
      this._b(geoSilinder(r, r, .08, 40), o.warna || P.aksen, [0, r, 0], { r: [Math.PI / 2, 0, 0] });
      this._b(geoSilinder(r * .88, r * .88, .02, 40), '#FBF7EE', [0, r, .045], { r: [Math.PI / 2, 0, 0], tepi: false });
      for (let i = 0; i < 12; i++) { const s = i / 12 * Math.PI * 2; this._b(geoKotak(.025, i % 3 ? .05 : .09, .01, 0), '#2A2A33', [Math.sin(s) * r * .75, r + Math.cos(s) * r * .75, .06], { r: [0, 0, -s], tepi: false }); }
      const jj = new THREE.Group(), mm = new THREE.Group(); jj.position.set(0, r, .07); mm.position.set(0, r, .075); this._induk().add(jj); this._induk().add(mm);
      const b1 = mesh3(geoKotak(.035, r * .5, .01, 0), { warna: '#2A2A33', tepi: false }); b1.position.y = r * .22; jj.add(b1);
      const b2 = mesh3(geoKotak(.025, r * .75, .01, 0), { warna: '#2A2A33', tepi: false }); b2.position.y = r * .34; mm.add(b2);
      jarum = [jj, mm];
    });
    this.upd.push(t => { const jam = (o.jam ?? 7) + t * (o.laju ?? .5); jarum[0].rotation.z = -jam / 12 * Math.PI * 2; jarum[1].rotation.z = -(jam % 1) * Math.PI * 2; });
    return g;
  },
  kardus(o = {}) { const [w, h, dl] = o.ukuran || [.6, .45, .45], wr = o.warna || '#C8955A'; return this.grup(o, () => { this._b(geoKotak(w, h, dl, .02), wr, [0, h / 2, 0]); this._b(geoKotak(w * 1.002, .01, .1, 0), '#E9D8A6', [0, h + .002, 0], { tepi: false }); }); },
  mangkuk(o = {}) { const r = o.r ?? .2; return this.grup(o, () => { const prof = [[0, 0], [r * .5, 0], [r * .85, r * .25], [r, r * .62], [r * .95, r * .64], [r * .8, r * .3], [r * .45, r * .06], [0, r * .06]].map(([x, y]) => new THREE.Vector2(x, y)); this._b(new THREE.LatheGeometry(prof, 32), o.warna || '#F4F1EA', [0, 0, 0], { ganda: true }); this._b(geoSilinder(r * .86, r * .86, .01, 32), o.warnaIsi || '#C9873E', [0, r * .52, 0], { tepi: false }); if (o.isi !== false) for (let i = 0; i < 4; i++) this._b(geoBola(r * .2, 12, 10), '#8C6A4E', [Math.sin(i * 1.7) * r * .4, r * .58, Math.cos(i * 1.7) * r * .4]); }); },
  gelas(o = {}) { const t = o.tinggi ?? .16; return this.grup(o, () => { this._b(geoSilinder(t * .36, t * .3, t, 24), o.warna || '#CFE8F5', [0, t / 2, 0], { tembus: .55, kasar: .1, env: 1.2 }); this._b(geoSilinder(t * .33, t * .28, t * .7, 24), o.warnaIsi || '#8A4B2A', [0, t * .36, 0], { tepi: false }); }); },
  buku(o = {}) { const wr = o.warna || P.kedua; return this.grup(o, () => { this._b(geoKotak(.22, .04, .3, .006), wr, [0, .02, 0]); this._b(geoKotak(.205, .032, .29, .003), '#FBF6E9', [.006, .02, 0], { tepi: false }); }); }
});

/* ------------------------------------------------------------- benda cerita tambahan (sejak 26 Nov 2026, dari uji "Timbangan Daging") */
/** tekstur butir nasi/beras (dibuat sekali): butir lonjong putih susu bertepi bayang tipis */
function teksturNasi(wr = '#F7F5EE') {
  const kunci = 'nasi|' + wr; let tx = M3.tekstur.get(kunci); if (tx) return tx;
  const S = 512, cv = kanvasBaru(S, S), c = cv.getContext('2d'); c.fillStyle = campur(wr, '#D9D2C0', .3); c.fillRect(0, 0, S, S);
  for (let i = 0; i < 900; i++) {
    const x = acak(i * 3 + 1) * S, y = acak(i * 7 + 2) * S, a = acak(i * 11 + 3) * Math.PI, w = 13 + acak(i * 5) * 5, h = 5.5 + acak(i * 13) * 2;
    for (const [dx, dy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) {
      if (x + dx < -20 || x + dx > S + 20 || y + dy < -20 || y + dy > S + 20) continue;
      c.save(); c.translate(x + dx, y + dy); c.rotate(a);
      c.fillStyle = campur(wr, '#A89C82', .45); c.beginPath(); c.ellipse(1.2, 1.8, w, h, 0, 0, 7); c.fill();   // bayang butir
      c.fillStyle = campur(wr, '#FFFFFF', acak(i) * .6); c.beginPath(); c.ellipse(0, 0, w, h, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(-w * .25, -h * .3, w * .45, h * .3, 0, 0, 7); c.fill();   // kilap
      c.restore();
    }
  }
  tx = teksturKanvas(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.userData.bersama = true; M3.tekstur.set(kunci, tx); return tx;
}
Object.assign(DP, {
  /** nasi/beras: gundukan berbutir (bukan bola-bola adonan). ukuran (jari-jari m), tinggi, piring (true | warna | false), warna, beras: true (butir lebih kecil, kekuningan) */
  nasi(o = {}) {
    const r = o.ukuran ?? .24, t = o.tinggi ?? r * .78, wr = o.warna || (o.beras ? '#EDE3C8' : '#F7F5EE');
    return this.grup(o, () => {
      let y0 = 0;
      if (o.piring !== false) { const wp = typeof o.piring === 'string' ? o.piring : '#F4F2EC'; this._b(geoSilinder(r * 1.5, r * 1.15, .035, 44), wp, [0, .0175, 0]); this._b(geoSilinder(r * 1.22, r * 1.22, .004, 44), campur(wp, '#000000', .07), [0, .037, 0], { tepi: false }); y0 = .036; }
      const prof = [new THREE.Vector2(0, 0)]; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI / 2; prof.push(new THREE.Vector2(Math.max(.001, Math.cos(a) * r), Math.sin(a) ** .75 * t)); }
      const g = new THREE.LatheGeometry(prof, segQ(40));
      const tx = teksturNasi(wr).clone(); tx.needsUpdate = true; const ul = o.beras ? 4 : 2; tx.repeat.set(ul * 2, ul);
      const mat = bahan({ warna: '#ffffff', peta: tx, unik: true, kasar: .55 }); mat.bumpMap = tx; mat.bumpScale = .0015;
      this._b(g, wr, [0, y0, 0], { bahan: mat, tepi: campur(wr, '#8A7A60', .55) });
      // butir 3D sungguhan di permukaan (InstancedMesh; tidak ikut cek tembus): siluet bergerigi + kilap per butir, bukan kubah licin/roti
      const nB = o.butir ?? Math.round((o.beras ? 1400 : 900) * (r / .24) ** 2), pj = o.beras ? .0055 : .0078, gb = geoKapsul(pj * .42, pj, 6);
      const im = new THREE.InstancedMesh(gb, bahan({ warna: campur(wr, '#ffffff', .35), kasar: .38, env: .5 }), nB); im.castShadow = false; im.receiveShadow = true;
      const mt = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1);
      for (let i = 0; i < nB; i++) {
        const a = acak(i * 3 + 5) * Math.PI * 2, th = Math.acos(1 - acak(i * 7 + 1)) * .98, x = Math.cos(th) * r, y = Math.sin(th) ** .75 * t;
        e.set(acak(i * 11) * 6.3, acak(i * 13) * 6.3, acak(i * 17) * 6.3); q.setFromEuler(e); sc.setScalar(.8 + acak(i * 19) * .45);
        mt.compose(new THREE.Vector3(Math.cos(a) * x * 1.005, y0 + y + .002, Math.sin(a) * x * 1.005), q, sc); im.setMatrixAt(i, mt);
      }
      im.instanceMatrix.needsUpdate = true; this._induk().add(im);
    });
  },
  /** karung goni: lebar, tinggi, warna, tulisan ('BERAS\nSUPER' | false), warnaTulisan, isi (0,5–1 kegembungan), ikat (bool) */
  karung(o = {}) {
    const lb = o.lebar ?? .58, t = o.tinggi ?? .82, wr = o.warna || '#CDB385', isi = o.isi ?? 1, tex = teksturMotif('goni', wr);
    const gk = this.grup(o, () => {
      const prof = [[0, 0], [lb * .44, 0], [lb * .52, t * .08], [lb * .55 * isi, t * .35], [lb * .54 * isi, t * .62], [lb * .48, t * .8], [lb * .3, t * .88], [lb * .1, t * .9], [0, t * .9]].map(([x, y]) => new THREE.Vector2(x, y));
      const g = geoSimpan(`karung|${lb}|${t}|${isi}`, () => new THREE.LatheGeometry(prof, segQ(26)));
      const m = this._b(g, wr, [0, 0, 0], { s: [1, 1, .72], warna: '#ffffff', peta: tex, unik: true, tepi: campur(wr, P.gelap, .75) });
      if (o.ikat !== false) { this._b(geoTorus(lb * .11, .016, 16), o.warnaIkat || '#8A5A2E', [0, t * .9, 0], { r: [Math.PI / 2, 0, 0], tepi: false }); const telinga = new THREE.LatheGeometry([[0, 0], [lb * .1, 0], [lb * .16, t * .06], [lb * .2, t * .1], [0, t * .08]].map(([x, y]) => new THREE.Vector2(x, y)), 12); this._b(telinga, wr, [0, t * .9, 0], { warna: '#ffffff', peta: tex, unik: true, ganda: true, tepi: campur(wr, P.gelap, .75) }); }
      if (o.tulisan !== false) { const tt = teksturTeks(o.tulisan || 'BERAS', { px: 120, berat: 900, warna: o.warnaTulisan || '#B83E2B' }), lw = lb * .78, lh = lw * tt.h / tt.w;
        const lab = new THREE.Mesh(geoBidang(lw, lh), new THREE.MeshStandardMaterial({ map: tt.tex, transparent: true, roughness: .9, depthWrite: false, envMapIntensity: .2 })); lab.position.set(0, t * .48, lb * .55 * isi * .72 + .014); this._induk().add(lab); }
    });
    gk.userData.lunak = true; return gk;   // karung lunak: boleh saling menekan saat ditumpuk
  },
  /** timbangan: jenis 'dacin' (tiang + palang + piring + bandul; nama + 'Palang' untuk digoyang) | 'digital' (alas + layar angka) | 'duduk' (timbangan badan berjarum);
      angka: teks layar atau fungsi t → teks; warna */
  timbangan(o = {}) {
    const jenis = o.jenis || 'digital', karat = o.warna || '#7A4A2A', a = this.a;
    if (jenis === 'dacin') return this.grup(o, () => {
      this._b(geoSilinder(.05, .07, 2.4, 14), '#4E3624', [0, 1.2, 0]); this._b(geoKotak(.5, .08, .1, .02), '#4E3624', [0, 2.36, 0]);
      const palang = new THREE.Group(); palang.position.set(0, 2.05, .12); this._induk().add(palang); this._grup.push(palang);
      try {
        this._b(geoSilinder(.024, .024, 1.3, 10), karat, [-.15, 0, 0], { r: [0, 0, Math.PI / 2], logam: .6, kasar: .45 });
        for (let i = 0; i < 7; i++) this._b(geoKotak(.006, .05, .03, 0), '#D8B060', [.05 + i * .07, 0, 0], { tepi: false, padat: false });
        this._b(geoSilinder(.006, .006, .7, 6), '#3A3A3A', [-.65, -.36, 0], { tepi: false, padat: false });
        this._b(geoSilinder(.22, .15, .05, 24), karat, [-.65, -.73, 0], { logam: .5 });
        this._b(geoBola(.09, 16, 12), '#2E2219', [.42, -.1, 0], { logam: .5 });
      } finally { this._grup.pop(); }
      if (o.nama) this.nama[o.nama + 'Palang'] = palang;
      if (o.ayun) { const bn = palang.id; this.upd.push((t, T) => { palang.rotation.z = Math.sin(T * (o.ayun.laju ?? 2.2) + bn) * (o.ayun.kuat ?? .05); }); }
    });
    if (jenis === 'duduk') return this.grup(o, () => {
      this._b(geoKotak(.36, .07, .42, .03), o.warna || '#D8DCE2', [0, .035, 0]); this._b(geoBidang(.16, .16), '#ffffff', [0, .072, .12], { r: [-Math.PI / 2, 0, 0], tepi: false });
      const jarum = this._b(geoKotak(.006, .006, .06, 0), '#D8342E', [0, .075, .12], { tepi: false, padat: false });
      this.upd.push(t => { jarum.rotation.y = typeof o.angka === 'function' ? o.angka(t) : 0; });
    });
    return this.grup(o, () => {   // digital
      this._b(geoKotak(.62, .14, .48, .03), o.warna || '#5A6A7A', [0, .07, 0]); this._b(geoKotak(.54, .03, .42, .02), '#A9B4C2', [0, .155, 0], { logam: .4, kasar: .35 });
      this._b(geoKotak(.3, .14, .05, .02), '#22262E', [0, .2, .27], { r: [-.3, 0, 0] });
      this._layar(.26, .1, { warnaLayar: '#100404', layar: (g2, w, h, t) => { g2.latar('polos', { warna: '#100404' }); const s = typeof o.angka === 'function' ? o.angka(t) : (o.angka ?? '0.00 KG'); g2.teks(String(s), w / 2, h / 2, { ukuran: h * .5, warna: '#FF3A2A', font: 'mono', cek: false }); } }, [0, .2, .3], 384).rotation.x = -.3;
    });
  },
  /** pintu: jenis 'kayu' (daun berengsel) | 'rolling' (rolling door turun-naik) | 'besi'; lebar, tinggi, warna, buka (0 tutup .. 1 buka; angka atau [[t, nilai], …]) */
  pintu(o = {}) {
    const lb = o.lebar ?? (o.jenis === 'rolling' ? 2.2 : 1), t = o.tinggi ?? (o.jenis === 'rolling' ? 2.6 : 2.1), wr = o.warna || (o.jenis === 'rolling' ? '#8E959E' : '#8A5A36'), a = this.a;
    const nilaiBuka = tt => Array.isArray(o.buka) ? kunci3(tt, o.buka, a) : (o.buka ?? 0);
    return this.grup(o, () => {
      this._b(geoKotak(lb + .16, .12, .2, .02), campur(wr, P.gelap, .35), [0, t + .06, 0]); [-1, 1].forEach(s => this._b(geoKotak(.08, t, .2, .02), campur(wr, P.gelap, .35), [s * (lb / 2 + .04), t / 2, 0]));
      if (o.jenis === 'rolling') {
        const daun = new THREE.Group(); this._induk().add(daun); this._grup.push(daun);
        try { const m = this._b(geoKotak(lb, t, .04, .005), wr, [0, t / 2, 0], { logam: .45, kasar: .5 }); const cv = kanvasBaru(64, 256), c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, 64, 256); for (let i = 0; i < 256; i += 16) { c.fillStyle = '#9aa0a8'; c.fillRect(0, i, 64, 4); } const tx = teksturKanvas(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(1, t / 1.2); m.material = bahan({ warna: wr, peta: tx, unik: true, logam: .45, kasar: .5 }); } finally { this._grup.pop(); }
        this._b(geoSilinder(.14, .14, lb + .1, 18), campur(wr, P.gelap, .2), [0, t + .02, .05], { r: [0, 0, Math.PI / 2] });
        this.upd.push(tt => { const b = jepit(nilaiBuka(tt)); daun.scale.y = Math.max(.02, 1 - b); daun.position.y = t * b; });
      } else {
        const engsel = new THREE.Group(); engsel.position.set(-lb / 2, 0, 0); this._induk().add(engsel); this._grup.push(engsel);
        try { this._b(geoKotak(lb, t, .06, .02), wr, [lb / 2, t / 2, 0], o.jenis === 'besi' ? { logam: .5, kasar: .4 } : {}); this._b(geoBola(.035, 10, 8), '#D8B060', [lb * .88, t * .48, .05], { logam: .7, tepi: false }); } finally { this._grup.pop(); }
        this.upd.push(tt => { engsel.rotation.y = -jepit(nilaiBuka(tt)) * 1.7; });
      }
    });
  },
  jeriken(o = {}) { const wr = o.warna || '#EEF2F4'; return this.grup(o, () => { this._b(geoKotak(.3, .42, .18, .05), wr, [0, .21, 0]); this._b(geoKotak(.1, .06, .05, .02), wr, [-.05, .45, 0]); this._b(geoSilinder(.035, .035, .06, 12), o.warnaTutup || '#2C6CC8', [.09, .45, 0]); if (o.tulisan) this.teks(o.tulisan, { posisi: [0, .22, .095], ukuran: .045, warna: o.warnaTulisan || '#2C6CC8', tebal: .005, lapis: 2 }); }); },
  ember(o = {}) { const wr = o.warna || P.kedua; return this.grup(o, () => { this._b(new THREE.CylinderGeometry(.17, .13, .26, 24, 1, true), wr, [0, .13, 0], { ganda: true }); this._b(geoSilinder(.13, .13, .01, 24), campur(wr, P.gelap, .3), [0, .005, 0], { tepi: false }); this._b(new THREE.TorusGeometry(.17, .012, 8, 24, Math.PI), '#9EA3AE', [0, .26, 0], { r: [0, 0, 0], logam: .6, tepi: false }); }); },
  drum(o = {}) { const wr = o.warna || '#2F6FB0'; return this.grup(o, () => { this._b(geoSilinder(.3, .3, .88, 28), wr, [0, .44, 0], { logam: .3, kasar: .5 }); [.2, .68].forEach(y => this._b(geoTorus(.3, .02, 28), campur(wr, P.gelap, .3), [0, y, 0], { r: [Math.PI / 2, 0, 0], tepi: false })); }); },
  gentong(o = {}) { const wr = o.warna || '#A65A34'; return this.grup(o, () => { const prof = [[0, 0], [.18, 0], [.3, .18], [.34, .4], [.28, .62], [.2, .7], [.22, .74], [0, .74]].map(([x, y]) => new THREE.Vector2(x, y)); this._b(geoSimpan('gentong', () => new THREE.LatheGeometry(prof, segQ(26))), wr, [0, 0, 0], { kasar: .85 }); }); },
  peti(o = {}) { const [w, h, dl] = o.ukuran || [.7, .5, .5], wr = o.warna || '#A87A48'; return this.grup(o, () => { this._b(geoKotak(w, h, dl, .015), wr, [0, h / 2, 0], { warna: '#ffffff', peta: teksturPola('kayu', wr), unik: true, tepi: campur(wr, P.gelap, .78) }); [-1, 1].forEach(s => this._b(geoKotak(w * 1.01, .05, .02, .005), campur(wr, P.gelap, .4), [0, h * (.5 + s * .3), dl / 2 + .005], { tepi: false })); }); },
  /** lampu gantung bohlam: tinggi kabel, warna, kuat, ayun (bool | {kuat, laju}), kedip, bayang */
  lampuGantung(o = {}) {
    const kab = o.kabel ?? .8, wr = o.warna || '#FFC870', a = this.a;
    const g = this.grup(Object.assign({}, o, { ayun: undefined }), () => {
      const ay = new THREE.Group(); this._induk().add(ay); this._grup.push(ay);
      try { this._b(geoSilinder(.006, .006, kab, 6), '#222', [0, -kab / 2, 0], { tepi: false, padat: false }); this._b(geoSilinder(.03, .03, .06, 10), '#333', [0, -kab - .02, 0], { tepi: false, padat: false });
        this.lampu({ posisi: [0, -kab - .1, 0], warna: wr, kuat: o.kuat ?? 1.8, jarak: o.jarak ?? 8, ukuran: .06, pendar: o.pendar ?? 1.2, bayang: o.bayang !== false, kedip: o.kedip }); } finally { this._grup.pop(); }
      if (o.ayun) { const y = o.ayun === true ? {} : o.ayun; this.upd.push((t, T) => { ay.rotation.z = Math.sin(T * (y.laju ?? 1.6)) * (y.kuat ?? .12); ay.rotation.x = Math.sin(T * (y.laju ?? 1.6) * .7 + 1) * (y.kuat ?? .12) * .5; }); }
    });
    return g;
  },
  /** rak barang toko/gudang: lebar, tinggi, susun (jumlah papan), isi: 'kardus' | 'toples' | 'karung' */
  rakBarang(o = {}) {
    const lb = o.lebar ?? 1.6, t = o.tinggi ?? 1.9, n = o.susun ?? 4, wr = o.warna || '#7E8A96';
    return this.grup(o, () => {
      [-1, 1].forEach(s => [-1, 1].forEach(z => this._b(geoKotak(.04, t, .04, .005), wr, [s * lb / 2, t / 2, z * .2], { logam: .4 })));
      for (let i = 0; i < n; i++) { const y = .1 + i * (t - .15) / (n - 1); this._b(geoKotak(lb, .03, .44, .005), wr, [0, y, 0], { logam: .3 });
        if (i < n - 1) for (let k = 0; k < 4; k++) { const x = -lb / 2 + .22 + k * (lb - .44) / 3, w = .24 + acak(i * 5 + k) * .1, h = .18 + acak(i * 3 + k) * .14;
          if ((o.isi || 'kardus') === 'toples') this._b(geoSilinder(.07, .07, h, 16), [P.aksen, P.kedua, '#E8E0C8'][(i + k) % 3], [x, y + .015 + h / 2, 0], { tembus: .85 });
          else this._b(geoKotak(w, h, .3, .01), ['#C8955A', '#B8844C', '#D8A868'][(i + k) % 3], [x, y + .015 + h / 2, 0]); } }
    });
  }
});

/** jarak tempuh kendaraan sejak posisi awalnya, searah hadapnya (+z lokal) → putaran roda tanpa selip */
function jarakTempuh(g) {
  const u = g.userData; if (!u._awal) { u._awal = g.position.clone(); return 0; }
  const d = g.position.clone().sub(u._awal), maju = new THREE.Vector3(0, 0, 1).applyQuaternion(g.quaternion);
  const v = d.dot(maju); u._gerak = Math.abs(v - (u._lalu ?? v)) > 1e-4; u._lalu = v; return v;
}
/** uap/asap mengepul: posisi (titik dunia), n, ukuran, tinggi (m naik), laju, warna, alfa */
DP.uap = function (o = {}) {
  const n = o.n ?? 6, p = o.posisi || [0, 0, 0], uk = o.ukuran ?? .25, tg = o.tinggi ?? .8, item = [];
  for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: teksturEfek('uap'), color: warna3(o.warna || '#FFFFFF').clone(), transparent: true, depthWrite: false, toneMapped: false })); this._induk().add(sp); item.push(sp); }
  this.upd.push((t, T) => item.forEach((sp, i) => { const f = ((T * (o.laju ?? .45) + i / n) % 1 + 1) % 1, s = uk * (.5 + f * 1.1); sp.position.set(p[0] + Math.sin(T * 1.7 + i * 2) * uk * .35 * f, p[1] + f * tg, p[2] + Math.cos(T * 1.3 + i) * uk * .2); sp.scale.set(s, s, s); sp.material.opacity = (o.alfa ?? .75) * Math.sin(f * Math.PI); }));
  return item;
};
/* ------------------------------------------------------------- properti di tangan tokoh (pegang / pegangKiri)
   Kerangka tangan: asal = pergelangan, −y = arah jari, telapak menghadap ke dalam. */
function bendaPegang(jenis, dn, tk) {
  const g = new THREE.Group(), b = (geo, wr, p, x = {}) => { const m = mesh3(geo, Object.assign({ warna: wr }, x)); m.position.set(...p); if (x.r) m.rotation.set(...x.r); g.add(m); return m; };
  g.position.set(0, -.08, .04);
  if (typeof jenis === 'function') { const o = jenis(g, dn, tk); if (o && o !== g) g.add(o); return g; }
  switch (jenis) {
    case 'hp': case 'tablet': { const t = jenis === 'hp' ? .16 : .28, l = t * (jenis === 'hp' ? .5 : .72); b(geoKotak(l, t, .016, .015), '#20232B', [0, -.03, .02], { r: [.2, 0, 0] }); const s = new THREE.Mesh(geoBidang(l * .88, t * .9), new THREE.MeshBasicMaterial({ color: warna3('#6FB7FF').clone(), toneMapped: false })); s.position.set(0, -.03, .029); s.rotation.x = .2; g.add(s); g.userData.layar = s; break; }
    case 'cangkir': b(geoSilinder(.05, .045, .1, 20), '#FFFFFF', [0, -.02, .05]); b(geoTorus(.03, .009, 12), '#FFFFFF', [0, -.02, -.005], { r: [0, Math.PI / 2, 0] }); b(geoSilinder(.045, .045, .005, 20), '#6B3A1F', [0, .03, .05], { tepi: false }); break;
    case 'gelas': b(geoSilinder(.045, .038, .14, 20), '#CFE8F5', [0, -.02, .05], { tembus: .6, kasar: .1 }); b(geoSilinder(.04, .034, .1, 20), '#E8A33C', [0, -.04, .05], { tepi: false }); break;
    case 'mangkuk': { const r = .13, prof = [[0, 0], [r * .5, 0], [r * .85, r * .25], [r, r * .62], [r * .95, r * .64], [r * .8, r * .3], [r * .45, r * .06], [0, r * .06]].map(([x, y]) => new THREE.Vector2(x, y)); b(new THREE.LatheGeometry(prof, 28), '#F4F1EA', [0, -.03, .1], { ganda: true }); b(geoSilinder(r * .85, r * .85, .01, 24), '#C9873E', [0, .05, .1], { tepi: false }); break; }
    case 'sendok': b(geoKapsul(.008, .16, 6), '#C9CDD6', [0, -.04, .02], { r: [.3, 0, 0], logam: .7 }); b(geoBola(.025, 10, 8), '#C9CDD6', [0, .05, .05], { s: [1, .4, 1.4], logam: .7 }); break;
    case 'roti': b(geoKapsul(.045, .14, 10), '#D9A15B', [0, -.03, .05], { r: [0, 0, Math.PI / 2] }); break;
    case 'buku': b(geoKotak(.17, .23, .035, .006), P.kedua, [0, -.05, .05]); break;
    case 'koran': b(geoKotak(.26, .34, .01, .002), '#ECE8DC', [0, -.05, .06]); break;
    case 'koin': b(geoSilinder(.05, .05, .012, 20), '#F4C430', [0, -.04, .03], { r: [Math.PI / 2, 0, 0], logam: .6, kasar: .3 }); break;
    case 'uang': b(geoKotak(.24, .11, .004, 0), '#4FA36B', [0, -.04, .04], { r: [0, 0, .3] }); break;
    case 'amplop': b(geoKotak(.22, .12, .01, .004), '#F2E3C0', [0, -.04, .04]); break;
    case 'kardus': b(geoKotak(.5, .38, .38, .02), '#C8955A', [0, -.1, .2]); break;
    case 'senter': b(geoSilinder(.03, .04, .2, 14), '#2B2F3A', [0, -.03, .05], { r: [Math.PI / 2, 0, 0] }); b(geoSilinder(.035, .035, .01, 14), '#FFF6D0', [0, -.03, .155], { r: [Math.PI / 2, 0, 0], dasar: true }); break;
    case 'payung': b(geoSilinder(.012, .012, 1, 8), '#3A3A44', [0, .4, 0]); b(new THREE.ConeGeometry(.65, .32, 20, 1, true), P.kedua, [0, .95, 0], { ganda: true }); break;
    case 'pensil': case 'stylus': case 'kuas': b(geoKapsul(.01, .16, 6), jenis === 'pensil' ? '#F2B134' : '#2B2F3A', [0, -.05, .03], { r: [.5, 0, 0] }); break;
    case 'mik': case 'mikrofon': b(geoSilinder(.02, .015, .16, 12), '#2B2F3A', [0, -.02, .04], { r: [-.3, 0, 0] }); b(geoBola(.035, 14, 10), '#8E939E', [0, .07, .07]); break;
    case 'tas': b(geoKotak(.32, .26, .12, .04), P.kedua, [0, -.2, 0]); b(geoTorus(.08, .012, 10), '#3A3A44', [0, -.05, 0], { r: [0, Math.PI / 2, 0] }); break;
    case 'jeriken': b(geoKotak(.22, .3, .13, .04), '#EEF2F4', [0, -.16, .04]); b(geoSilinder(.025, .025, .04, 10), '#2C6CC8', [.07, .01, .04], { tepi: false }); break;
    case 'sekop': b(geoKapsul(.016, .7, 8), '#6A5038', [0, -.25, .03]); b(geoKotak(.2, .26, .02, .01), '#8E939E', [0, -.68, .06], { r: [.25, 0, 0], logam: .6 }); break;
    case 'sapu': b(geoKapsul(.014, .9, 8), '#8A6A3A', [0, -.3, .03]); b(geoKerucut(.12, .3, 14), '#D8B060', [0, -.82, .03], { r: [Math.PI, 0, 0] }); break;
    case 'ember': b(new THREE.CylinderGeometry(.13, .1, .2, 20, 1, true), P.kedua, [0, -.2, .02], { ganda: true }); b(new THREE.TorusGeometry(.13, .008, 6, 20, Math.PI), '#9EA3AE', [0, -.08, .02], { tepi: false }); break;
    case 'karung': b(geoKotak(.3, .4, .2, .1), '#CDB385', [0, -.24, .08]); break;
    case 'piring': b(geoSilinder(.14, .1, .025, 24), '#F4F2EC', [0, -.05, .12], { r: [.2, 0, 0] }); break;
    case 'tongkat': b(geoKapsul(.018, 1.0, 8), '#6A4A2E', [0, -.4, .03]); break;
    case 'lentera': { b(geoKotak(.12, .16, .12, .02), '#2B2F3A', [0, -.14, .03], { logam: .5 }); const l = new THREE.PointLight(warna3('#FFC060').clone(), 1.2, 4, 1.5); l.position.set(0, -.14, .03); g.add(l); b(geoBola(.035, 10, 8), '#FFE2A0', [0, -.14, .03], { dasar: true }); break; }
    case 'kunci': b(geoTorus(.025, .007, 10), '#C9A23A', [0, -.03, .03], { logam: .7 }); b(geoKotak(.012, .06, .006, 0), '#C9A23A', [0, -.07, .03], { logam: .7 }); break;
    default: return null;
  }
  return g;
}
