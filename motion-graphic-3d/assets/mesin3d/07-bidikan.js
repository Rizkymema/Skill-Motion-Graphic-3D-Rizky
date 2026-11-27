/* ------------------------------------------------------------- BIDIKAN OTOMATIS + cek wajah (sejak 26 Nov 2026)
   Keluhan uji "Timbangan Daging": kamera ditulis manual dengan koordinat → tokoh yang bicara tidak terlihat (hanya kaki, membelakangi kamera,
   wajah tertutup kardus), wajah terlalu dekat, tokoh terpotong tepi. Sekarang kamera boleh ditulis sebagai BIDIKAN:
     kamera: { bidik: 'darmo', jenis: 'dekat', sudut: 20, tinggi: 'mata', gerak: 'dorong' }
     kamera: [[0, { dua: ['darmo', 'mbok'] }], ['L05', { atasBahu: ['mbok', 'darmo'] }], ['L06', { bidik: 'darmo', jenis: 'wajah' }, 'potong'], …]
   jenis: wajah (close-up) · dekat (kepala-bahu) · setengah (pinggang ke atas) · lutut · penuh (seluruh badan) · lebar (tokoh + tempat)
   bidik/dua/atasBahu/benda/pov dihitung ulang tiap bingkai dari posisi + arah hadap tokoh, ruang kepala 16 %, dan kamera berputar sendiri
   (±15°…±60°) bila ada benda padat yang menghalangi wajah. Daftar bidikan: tiap entri berlaku sampai entri berikutnya; perpindahan = potong
   (bawaan) atau ease ('inOutSine' …) selama `pindah` dtk. */
const BIDIKAN = { wajah: .44, dekat: .62, setengah: .82, lutut: 1.1, penuh: 1.42, lebar: 2.7 };
function adaBidikan(k) { return !!(k && typeof k === 'object' && !Array.isArray(k) && (k.bidik || k.dua || k.atasBahu || k.benda || k.pov)); }
function fovBawaan() { return POTRET ? 40 : 30; }
function hadapDunia(tk) { const q = new THREE.Quaternion(); tk.akar.getWorldQuaternion(q); const f = new THREE.Vector3(0, 0, 1).applyQuaternion(q); f.y = 0; return f.lengthSq() > 1e-6 ? f.normalize() : new THREE.Vector3(0, 0, 1); }
/* metrik subjek DIBEKUKAN di awal tiap bidikan (arah hadap, arah kepala, skala): kamera ikut posisi tokoh tetapi tidak ikut berputar saat tokoh
   berbalik dan tidak ikut membesar-mengecil (efek menyusut terlihat). Dihitung dengan menyetel dunia ke t0 bidikan → deterministik. */
let BEKU = null;
function infoTokoh(dn, id) {
  const tk = dn.para[id]; if (!tk) { if (!infoTokoh._lapor) { infoTokoh._lapor = 1; catatan.push(`bidikan: tokoh "${id}" tidak ada di adegan ${dn.a.id}`); } return null; }
  tk.akar.updateWorldMatrix(true, true);
  const H = new THREE.Vector3(...tk.titik('kepala')), sk = tk.akar.getWorldScale(new THREE.Vector3()).y, tinggi = 1.86 * sk * (tk.R / .2 * .3 + .7);
  const q = new THREE.Quaternion(); tk.kepalaIsi.getWorldQuaternion(q); const fk = new THREE.Vector3(0, 0, 1).applyQuaternion(q).normalize();   // arah wajah sebenarnya (menunduk/menoleh)
  const b = BEKU && BEKU[id];
  if (b) return { tk, H, f: b.f.clone(), fk: b.fk.clone(), sk: b.sk, h: b.h, atas: H.y + tk.R * b.sk * 1.15, kaki: new THREE.Vector3(...tk.titik('kaki')) };
  return { tk, H, f: hadapDunia(tk), fk, sk, h: tinggi, atas: H.y + tk.R * sk * 1.15, kaki: new THREE.Vector3(...tk.titik('kaki')) };
}
const _yUp = new THREE.Vector3(0, 1, 0);
function putarY(v, derajat) { return v.clone().applyAxisAngle(_yUp, derajat * D2R); }
/** kamera {dari, ke, fov} dari satu bidikan; p = kemajuan 0..1 di dalam bidikan (untuk gerak) */
function resolBidikan(dn, s, p, a) {
  const fov = s.fov ?? fovBawaan(), tanH = Math.tan(fov * D2R / 2), asp = W / H, e = E.inOutSine(jepit(p));
  const gerak = s.gerak ?? 'dorong';
  let jarakK = 1, sudutTambah = 0, naik = 0, geser = 0;
  if (gerak === 'dorong') jarakK = lerp(1.07, .95, e); else if (gerak === 'tarik') jarakK = lerp(.95, 1.1, e);
  else if (gerak === 'orbit') sudutTambah = lerp(-9, 9, e); else if (gerak === 'naik') naik = lerp(-.08, .22, e); else if (gerak === 'geser') geser = lerp(-.14, .14, e);
  jarakK *= s.jarak ?? 1;
  let ke, arah, cov, subjek = [];
  if (s.pov) {   // sudut pandang tokoh: dari mata, melihat ke arah hadap (atau s.ke)
    const A = infoTokoh(dn, s.pov); if (!A) return null;
    const mata = A.H.clone().add(A.f.clone().multiplyScalar(A.tk.R * A.sk * 1.2)).add(new THREE.Vector3(0, -A.tk.R * A.sk * .05, 0));
    const tuju = s.ke ? new THREE.Vector3(...dn.titik(s.ke)) : mata.clone().add(putarY(A.f, (s.sudut || 0) + sudutTambah).multiplyScalar(3)).add(new THREE.Vector3(0, -.25, 0));
    return { dari: mata.toArray(), ke: tuju.toArray(), fov: s.fov ?? (POTRET ? 52 : 40) };
  }
  if (s.atasBahu) {   // di atas bahu A, melihat wajah B
    const A = infoTokoh(dn, s.atasBahu[0]), B = infoTokoh(dn, s.atasBahu[1]); if (!A || !B) return null;
    const ab = B.H.clone().sub(A.H); ab.y = 0; const L = ab.length() || 1; ab.normalize();
    const buat = sisi => { const kanan = new THREE.Vector3(ab.z, 0, -ab.x).multiplyScalar(sisi);
      const dari = A.H.clone().add(ab.clone().multiplyScalar(-(1.85 + .3 * (jarakK - 1)) * A.sk)).add(kanan.clone().multiplyScalar(.95 * A.sk)).add(new THREE.Vector3(0, -.05 * A.sk + naik, 0));
      const ke = B.H.clone().add(new THREE.Vector3(0, -B.tk.R * B.sk * .35, 0)).add(kanan.clone().multiplyScalar(-.12 + geser));   // A di tepi bingkai (bahu + belakang kepala), wajah B di tengah
      return hindariHalangan(dn, { dari: dari.toArray(), ke: ke.toArray(), fov: s.fov ?? (POTRET ? 36 : 30) }, [B], Object.assign({ jenis: 'atasBahu' }, s, { _sisi: sisi }), [A.tk]); };
    const sisi0 = s.sisi === 'kiri' ? -1 : s.sisi === 'kanan' ? 1 : (BEKU && BEKU._sisi) || 1;
    let c = buat(sisi0);
    if (!s.sisi && c._skor > 0) { const c2 = buat(-sisi0); if (c2._skor < c._skor) { c = c2; if (BEKU) BEKU._sisi = -sisi0; } }   // lengan/badan tokoh bahu menutupi tengah → pindah ke bahu sebelah
    else if (BEKU && !BEKU._sisi) BEKU._sisi = sisi0;
    if (c._skor >= 1 && s.cadangan !== false) { const s2 = Object.assign({}, s, { atasBahu: undefined, bidik: s.atasBahu[1], jenis: 'dekat' }); return resolBidikan(dn, s2, p, a) || c; }   // kedua bahu bermasalah (tokoh bahu besar/berhiasan kepala lebar menutupi tengah, mulut tertutup) → close-up yang bicara
    return c;
  }
  if (s.benda) {   // sisipan benda: kotak batas benda, sudut tiga-perempat sedikit dari atas
    const o = dn.nama[s.benda]; if (!o) { catatan.push(`bidikan: benda "${s.benda}" tidak ada (beri nama: '${s.benda}')`); return null; }
    const bx = new THREE.Box3().setFromObject(o), c = bx.getCenter(new THREE.Vector3()), r = Math.max(.08, bx.getSize(new THREE.Vector3()).length() / 2);
    cov = r * 2.3; const jarak = cov / 2 / tanH / Math.min(1, asp * 1.6) * jarakK;
    arah = putarY(new THREE.Vector3(0, 0, 1), (s.sudut ?? 18) + sudutTambah); const tinggiK = s.tinggi === 'rendah' ? -.15 : s.tinggi === 'mata' ? .05 : .45;
    const dari = c.clone().add(arah.clone().multiplyScalar(jarak)).add(new THREE.Vector3(0, jarak * tinggiK + naik * cov, 0));
    return hindariHalangan(dn, { dari: dari.toArray(), ke: c.toArray(), fov }, [{ H: c }], s, [], o);
  }
  if (s.dua) {   // dua tokoh dalam satu bingkai (wajah keduanya terlihat)
    const A = infoTokoh(dn, s.dua[0]), B = infoTokoh(dn, s.dua[1]); if (!A || !B) return null;
    subjek = [A, B];
    const ab = B.H.clone().sub(A.H); ab.y = 0; const L = ab.length();
    let n = new THREE.Vector3(-ab.z, 0, ab.x); if (n.lengthSq() < 1e-6) n.set(0, 0, 1); n.normalize();
    const muka = A.f.clone().add(B.f); if (n.dot(muka) < 0 || (Math.abs(n.dot(muka)) < .2 && n.z < 0)) n.negate();
    arah = putarY(n, (s.sudut ?? (POTRET ? 28 : 12)) + sudutTambah);
    const lebarPerlu = L * Math.abs(arah.clone().cross(ab.clone().normalize()).y) + 1.3 * Math.max(A.sk, B.sk);   // jarak kedua kepala yang terlihat dari arah kamera + bahu
    cov = Math.max((BIDIKAN[s.jenis || 'setengah'] || .78) * Math.max(A.h, B.h), lebarPerlu / asp * .92);
    ke = A.H.clone().add(B.H).multiplyScalar(.5); ke.y = Math.max(A.atas, B.atas) - cov * (POTRET ? .3 : .34);   // 9:16: ruang kepala ±20 % (di bawah zona teks atas)
  } else {   // satu tokoh
    const A = infoTokoh(dn, s.bidik); if (!A) return null;
    subjek = [A];
    cov = (BIDIKAN[s.jenis || 'setengah'] || .78) * A.h;
    const dekat = s.jenis === 'wajah' || s.jenis === 'dekat', pakaiKepala = dekat || s.jenis === 'setengah' || !s.jenis, fh = pakaiKepala ? new THREE.Vector3(A.fk.x, 0, A.fk.z) : A.f.clone(); if (fh.lengthSq() < 1e-4) fh.copy(A.f); fh.normalize();
    arah = putarY(fh, (s.sudut ?? 18) + sudutTambah);
    if (dekat) naik += jepit(A.fk.y, -.6, .3) * .9;   // wajah menunduk → kamera lebih rendah, tetap menatap wajah
    ke = A.H.clone(); ke.y = A.atas - cov * (POTRET ? .3 : .34);
    if (s.jenis === 'penuh' || s.jenis === 'lebar') ke.y = Math.max(ke.y, A.kaki.y + cov * .5 - cov * .08);
    if (s.posisi === 'kiri' || s.posisi === 'kanan') { const kn = new THREE.Vector3(arah.z, 0, -arah.x); ke.add(kn.multiplyScalar((s.posisi === 'kiri' ? 1 : -1) * cov * asp * .17)); }
  }
  const jarak = cov / 2 / tanH * jarakK;
  const tinggiOff = s.tinggi === 'rendah' ? -cov * .32 : s.tinggi === 'tinggi' ? cov * .45 : s.tinggi === 'atas' ? jarak * 1.2 : 0;
  const kn = new THREE.Vector3(arah.z, 0, -arah.x);
  const dari = ke.clone().add(arah.clone().multiplyScalar(jarak)).add(new THREE.Vector3(0, tinggiOff + naik * cov, 0)).add(kn.multiplyScalar(geser * cov));
  return hindariHalangan(dn, { dari: dari.toArray(), ke: ke.toArray(), fov }, subjek, s);
}
/** bila benda padat menghalangi garis kamera → wajah, putar kamera mengelilingi subjek (±15°…±60°); bila tetap terhalang, majukan kamera ke depan halangan */
const _ray = new THREE.Raycaster();
function badanTokoh(dn, kecuali = []) { const out = []; for (const id in dn.para) { const tk = dn.para[id]; if (kecuali.includes(tk) || !tk.akar.visible) continue; [tk.mBadan, tk.mKepala, tk.mJubah, tk.mPinggul].forEach(m => m && out.push(m)); } return out; }
function terhalang(dn, dari, tuju, tambahan = [], abai = null) {
  const d = tuju.clone().sub(dari), L = d.length(); if (L < 1e-3) return null;
  _ray.set(dari, d.normalize()); _ray.near = .02; _ray.far = L - .12;
  const kena = _ray.intersectObjects([...(dn.padat || []), ...tambahan], false).filter(h => !abai || !(h.object === abai || abai.getObjectById && abai.getObjectById(h.object.id))); return kena.length ? kena[0] : null;   // dinding ruang ikut menghalangi: bidikan otomatis tetap DI DALAM ruang (kamera di balik dinding melihat kusen pintu/jendela/rak yang menempel di dinding melayang di depan lensa)
}
function diDalamPadat(dn, pos) { const cap = dn._cap; for (const m of dn.padat || []) { const u = siapRintang(m, cap); if (u._pusat.distanceTo(pos) > u._jari + .3) continue; if (jarakKe(m, pos, cap) < .15) return true; } return false; }
/* penalti lunak sebuah posisi kamera (sejak 27 Nov 2026, uji Timbangan Daging v2): tangan/lengan tokoh lain menggantung masuk close-up dari
   tepi bingkai, lengan tokoh bahu (atasBahu) menutupi tengah bingkai, tokoh lain tersembunyi tepat di balik subjek di bidikan lebar. */
const _camUji = new THREE.PerspectiveCamera(40, 1, .05, 400);
function jagaLantai(dn, v) { if (dn._adaLantai) { const yl = dn.lantaiDi(v.x, v.z) + .12; if (v.y < yl) v.y = yl; } return v; }   // kamera selalu di atas lantai
function skorKamera(dn, d, ke, fov, subjek, s, kecualiTokoh) {
  const c = _camUji; c.fov = fov ?? fovBawaan(); c.aspect = W / H; c.position.copy(d); c.up.set(0, 1, 0); c.lookAt(ke); c.updateProjectionMatrix(); c.updateMatrixWorld();
  const tkSubjek = subjek.map(x => x.tk).filter(Boolean); if (!tkSubjek.length) return 0;
  const dSub = Math.min(...subjek.map(x => x.H.distanceTo(d))), jenis = s.jenis || 'setengah', dekat = ['wajah', 'dekat', 'setengah', 'atasBahu'].includes(jenis), lebar = !dekat;
  let skor = 0; const v = new THREE.Vector3();
  for (const t of tkSubjek) { v.set(...t.titik('kepala')).project(c); if (v.z > 1 || Math.abs(v.x) > .78 || v.y > .9 || v.y < -.6) skor += 2; }   // kepala subjek terpotong tepi bingkai (mis. 'dua' setelah kamera diputar)
  for (const t of tkSubjek) for (const o of [t.dada, t.pinggul]) {   // badan subjek tertutup benda padat (tiang/rak di depan kamera) walau wajahnya terlihat
    const p = o.getWorldPosition(new THREE.Vector3()); v.copy(p).project(c); if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) continue;
    if (Math.abs(v.x) > .9) skor += .5;   // badan terpotong tepi
    const h = terhalang(dn, d, p); if (h && !h.object.userData.tokoh) skor += .8; }
  if (dekat && s.halanganMulut !== false) for (const t of tkSubjek) if (!t.o.tutupBoleh && t.def.wajah !== false && mulutTertutup(dn, t, d, c)) skor += 1.2;   // mulut subjek tertutup tangan/properti/tokoh lain dari sudut ini
  for (const id in dn.para) {
    const tk = dn.para[id]; if (!tk.akar.visible || tkSubjek.includes(tk)) continue;
    const bahu = kecualiTokoh.includes(tk), titik = [tk.lengan.Ka.tangan, tk.lengan.Ki.tangan, tk.lengan.Ka.siku, tk.lengan.Ki.siku].map(o => o.getWorldPosition(new THREE.Vector3()));
    titik.push(new THREE.Vector3(...tk.titik('kepala')));
    for (const p of titik) { v.copy(p).project(c); if (v.z > 1 || Math.abs(v.x) > 1.06 || Math.abs(v.y) > 1.04) continue;   // sedikit di luar tepi pun dihitung: bola tangan/kepala menyusup masuk
      const depan = p.distanceTo(d) < dSub - .12;
      if (bahu) { if (depan && Math.abs(v.x) < .34 && v.y > -.7) skor += 1; }   // bahu boleh di tepi, bukan di tengah
      else if (depan && dekat) skor += 1;   // anggota tubuh tokoh lain di depan subjek, di dalam close-up
    }
    if (lebar && !bahu) { const h = new THREE.Vector3(...tk.titik('kepala')); v.copy(h).project(c);
      if (v.z < 1 && Math.abs(v.x) < .95 && Math.abs(v.y) < .95 && h.distanceTo(d) > dSub) { const hit = terhalang(dn, d, h, badanTokoh(dn, [tk])); if (hit && hit.object.userData.tokoh && tkSubjek.some(t => t.id === hit.object.userData.tokoh)) skor += .6; } }   // tokoh lain bersembunyi di balik subjek
  }
  return skor;
}
function hindariHalangan(dn, cam, subjek, s, kecualiTokoh = [], bendaSubjek = null) {
  if (s.halangan === false || !subjek.length) { const d = jagaLantai(dn, new THREE.Vector3(...cam.dari)); return Object.assign(cam, { dari: d.toArray(), _skor: 0 }); }
  const ke = new THREE.Vector3(...cam.ke), dari0 = new THREE.Vector3(...cam.dari), wajah = subjek.map(x => x.H);
  const lain = badanTokoh(dn, [...subjek.map(x => x.tk).filter(Boolean), ...kecualiTokoh]);   // tokoh lain juga penghalang (bukan subjek, bukan bahu di atasBahu)
  const bebas = d => !diDalamPadat(dn, d) && !wajah.some(w => terhalang(dn, d, w, lain, bendaSubjek));
  const jadi = (d, sk, sd) => { if (BEKU) BEKU['_sd' + (s.jenis || '') + (s._sisi || '')] = sd; return { dari: d.toArray(), ke: cam.ke, fov: cam.fov, _skor: sk }; };
  const putar = sd => jagaLantai(dn, sd ? ke.clone().add(putarY(dari0.clone().sub(ke), sd)) : dari0.clone());
  const ingat = BEKU && BEKU['_sd' + (s.jenis || '') + (s._sisi || '')];   // sudut yang dipilih di awal bidikan dipertahankan selama masih bebas (kamera tidak melompat di tengah bidikan)
  if (ingat !== undefined && ingat !== null) { const d = putar(ingat); if (bebas(d)) {
    const skKini = skorKamera(dn, d, ke, cam.fov, subjek, s, kecualiTokoh); if (skKini < .75 || !dn._bolehBeku) return jadi(d, skKini, ingat);
    // masalah muncul di TENGAH bidikan (kamera dolly mendekat ke tiang, pose berubah menutup mulut): cari sudut lain, pindah hanya bila jauh lebih baik (tidak bergoyang)
    let baik = { d, sk: skKini, sd: ingat, nilai: skKini };
    for (const sd of [0, 15, -15, 30, -30, 45, -45, 60, -60]) { if (sd === ingat) continue; const d2 = putar(sd); if (!bebas(d2)) continue; const sk = skorKamera(dn, d2, ke, cam.fov, subjek, s, kecualiTokoh), nilai = sk + Math.abs(sd - ingat) / 120; if (nilai < baik.nilai - .5) baik = { d: d2, sk, sd, nilai }; }
    return jadi(baik.d, baik.sk, baik.sd); } }
  let terbaik = null;
  for (const sd of [0, 15, -15, 30, -30, 45, -45, 60, -60]) {
    const d = putar(sd); if (!bebas(d)) continue;
    const sk = skorKamera(dn, d, ke, cam.fov, subjek, s, kecualiTokoh);
    if (sk === 0) return jadi(d, 0, sd);
    const nilai = sk + Math.abs(sd) / 120; if (!terbaik || nilai < terbaik.nilai) terbaik = { d, sk, sd, nilai };
  }
  if (terbaik) return jadi(terbaik.d, terbaik.sk, terbaik.sd);
  // ruang sempit / tetap terhalang: majukan kamera ke depan halangan pertama (dinding/benda) dan lebarkan lensa supaya bingkai tetap sama
  const arah = dari0.clone().sub(ke), L0 = arah.length(); arah.normalize();
  let L = L0; for (let k = 0; k < 24 && L > .6; k++) { const d = ke.clone().add(arah.clone().multiplyScalar(L)); if (bebas(d)) break; L *= .9; }
  const fov0 = cam.fov ?? fovBawaan(), fov = Math.min(75, 2 * Math.atan(Math.tan(fov0 * D2R / 2) * L0 / Math.max(.3, L)) / D2R);
  return { dari: jagaLantai(dn, ke.clone().add(arah.multiplyScalar(L))).toArray(), ke: cam.ke, fov, _skor: 0 };
}
/** metrik subjek di awal bidikan (t0): setel dunia ke t0 sebentar (bila boleh), catat arah + skala, kembalikan. Disimpan per dunia per bidikan. */
function metrikBeku(dn, a, idx, t0, spek, t1) {
  t0 = Math.min(t0 + .5, t0 + Math.max(0, ((t1 ?? (t0 + 1)) - t0) * .5));   // dibekukan saat tokoh sudah 'mapan' (perpindahan pose/hadap ±0,4 dtk selesai)
  const kunci = idx + '|' + t0.toFixed(3); dn._beku = dn._beku || new Map();
  if (dn._beku.has(kunci)) return dn._beku.get(kunci);
  const ids = [spek.bidik, ...(spek.dua || []), ...(spek.atasBahu || [])].filter(id => id && dn.para[id]);
  if (!ids.length) return null;
  const tKini = dn.t, TKini = dn.T, samaWaktu = Math.abs(tKini - t0) < 1e-6;
  if (!samaWaktu && !dn._bolehBeku) return null;   // belum boleh menyetel ulang dunia (panggilan sebelum perbarui) → metrik hidup
  if (!samaWaktu) dn.perbarui(t0, a.mulai + t0);
  const m = {}; for (const id of ids) { BEKU = null; const I = infoTokoh(dn, id); if (I) m[id] = { f: I.f, fk: I.fk, sk: I.sk, h: I.h }; }
  BEKU = m; try { resolBidikan(dn, spek, 0, a); } catch (e) { } finally { BEKU = null; }   // sudut/sisi penghindar halangan diputuskan SEKALI di awal bidikan (deterministik: pratinjau = ekspor)
  if (!samaWaktu) dn.perbarui(tKini, TKini);
  dn._beku.set(kunci, m); return m;
}
/** daftar bidikan [[t, bidikan, perpindahan], …]: tiap entri berlaku sampai entri berikutnya */
function kameraDaftarBidikan(dn, a, t) {
  const kf = a.kamera;
  if (!kf._siapB) { kf.forEach(e => { e[0] = wl(e[0], a) ?? 0; }); kf._siapB = true; }
  let i = 0; while (i + 1 < kf.length && t >= kf[i + 1][0]) i++;
  const t0 = kf[i][0], t1 = i + 1 < kf.length ? kf[i + 1][0] : a.d, p = jepit((t - t0) / Math.max(.01, t1 - t0));
  const resol = (spek, pp, idx, tAwal) => { if (!adaBidikan(spek)) return Object.assign({}, kameraBawaan(), spek); BEKU = metrikBeku(dn, a, idx, tAwal, spek, idx + 1 < kf.length ? kf[idx + 1][0] : a.d); try { return resolBidikan(dn, spek, pp, a); } finally { BEKU = null; } };
  let cam = resol(kf[i][1], p, i, t0) || kameraBawaan();
  const nx = kf[i + 1];
  if (nx && nx[2] && nx[2] !== 'potong') {
    const lama = Math.min(nx[1].pindah ?? .8, (t1 - t0) * .6);
    if (t > t1 - lama) { const k = fe(nx[2])(jepit((t - (t1 - lama)) / lama)), c2 = resol(nx[1], 0, i + 1, t1) || cam; cam = { dari: cam.dari.map((v, j) => lerp(v, c2.dari[j], k)), ke: cam.ke.map((v, j) => lerp(v, c2.ke[j], k)), fov: lerp(cam.fov ?? fovBawaan(), c2.fov ?? fovBawaan(), k) }; }
  }
  return cam;
}

/* --- CEK: tokoh yang sedang bicara wajib terlihat wajahnya (kecuali suaraLuar: true) --- */
Dunia3D.prototype.periksaBidikan = function () {
  const out = [], cam = this.kamera, cp = cam.position;
  for (const id in this.para) {
    const tk = this.para[id], o = tk.o;
    if (!tk.akar.visible || o.suaraLuar || !sedangBicara3(o, this.a, this.T)) continue;
    const I = infoTokoh(this, id); if (!I) continue;
    const q = I.H.clone().project(cam), x = (q.x + 1) / 2, y = (1 - q.y) / 2;
    const keKamera = cp.clone().sub(I.H); keKamera.y = 0; keKamera.normalize();
    const fkH = new THREE.Vector3(I.fk.x, 0, I.fk.z).normalize(), sudut = Math.acos(jepit(fkH.dot(keKamera), -1, 1)) / D2R;   // arah KEPALA (menoleh) yang menentukan wajah terlihat
    const ujung = I.H.clone().add(new THREE.Vector3(0, tk.R * I.sk, 0)).project(cam), tinggiLayar = Math.abs(ujung.y - q.y) / 2;   // jari-jari kepala di layar (bagian dari tinggi layar)
    if (q.z > 1 || x < .03 || x > .97 || y < .05 || y > (POTRET ? .8 : .9)) out.push(`tokoh "${id}" sedang bicara tapi kepalanya di luar bingkai — pakai kamera { bidik: '${id}' }`);
    else if (sudut > 95) out.push(`tokoh "${id}" sedang bicara tapi membelakangi kamera — putar hadap/lihat ke kamera atau pakai { bidik: '${id}' } / { atasBahu: [lawan, '${id}'] }`);
    else if (!o.tutupBoleh && (h2 => h2 && out.push(`${h2.bag} tokoh "${id}" yang sedang bicara tertutup ${h2.apa} — ganti pose/pegangan, atau pakai kamera { bidik: '${id}' }/sudut lain; bila disengaja beri tutupBoleh: true`))(mulutTertutup(this, tk, cp))) {}
    else { const h = terhalang(this, cp, I.H, badanTokoh(this, [tk])); if (h) out.push(`wajah tokoh "${id}" yang sedang bicara tertutup ${h.object.userData.tokoh ? 'tokoh "' + h.object.userData.tokoh + '"' : namaBenda(h.object.userData.benda)} — pakai kamera { bidik: '${id}' } (otomatis menghindari halangan) atau geser benda`); }
    if (tinggiLayar < .022) out.push(`tokoh "${id}" sedang bicara tapi terlalu kecil di layar — dekatkan kamera (jenis 'setengah'/'dekat')`);
  }
  return out;
};
Dunia3D.prototype.saranBidikan = function () {
  const out = [], cam = this.kamera;
  for (const id in this.para) { const tk = this.para[id]; if (!tk.akar.visible || tk.o.tutupBoleh || sedangBicara3(tk.o, this.a, this.T) || tk.def.wajah === false) continue;   // wajah tokoh diam (close-up) tertutup tangan/benda sendiri
    const I = infoTokoh(this, id); if (!I) continue; const q = I.H.clone().project(cam), u = I.H.clone().add(new THREE.Vector3(0, tk.R * I.sk, 0)).project(cam);
    if (q.z < 1 && Math.abs(u.y - q.y) > .09 && Math.abs(q.x) < .95 && Math.abs(q.y) < .95) { const h = mulutTertutup(this, tk, cam.position); if (h && h.bag === 'wajah') out.push(`wajah tokoh "${id}" tertutup ${h.apa} (close-up)`); } }
  for (const id in this.para) { const tk = this.para[id]; if (!tk.akar.visible || !sedangBicara3(tk.o, this.a, this.T)) continue;   // badan tokoh yang bicara tersembunyi di balik benda (rak/tiang)
    const ps = [tk.dada, tk.pinggul].map(o => o.getWorldPosition(new THREE.Vector3())), hs = ps.map(p => { const q = p.clone().project(cam); return q.z < 1 && Math.abs(q.x) < 1 && Math.abs(q.y) < 1 ? terhalang(this, cam.position, p) : null; });
    if (hs[0] && hs[1] && !hs[0].object.userData.tokoh) out.push(`badan tokoh "${id}" yang sedang bicara tersembunyi di balik ${namaBenda(hs[0].object.userData.benda)} — geser benda/tokoh atau bidikan lain`); }
  for (const id in this.para) { const tk = this.para[id]; if (!tk.akar.visible || !sedangBicara3(tk.o, this.a, this.T)) continue; const I = infoTokoh(this, id); if (!I) continue;
    const q = I.H.clone().project(cam), u = I.H.clone().add(new THREE.Vector3(0, tk.R * I.sk, 0)).project(cam);
    if (q.z < 1 && Math.abs(u.y - q.y) > .6) out.push(`wajah tokoh "${id}" memenuhi layar (terlalu dekat) — pakai jenis 'wajah'/'dekat'`); }
  return out;
};
/** mulut/wajah tokoh tertutup dari kamera (sejak 27 Nov 2026): 6 titik daerah mulut + 2 titik mata dibandingkan dengan bayangan LAYAR lengan atas,
   lengan bawah, tangan (kapsul bertebal) dan bola batas properti yang dipegang (milik sendiri, harus di depan wajah); tokoh lain + benda padat lewat
   sinar. Satu sinar ke tengah mulut dulu lolos padahal lengan Mbok melintang tepat di bawah hidung. ≥ 2 titik mulut tertutup = mulut tertutup.
   → { bag: 'mulut'|'wajah', apa } atau null. kam = kamera untuk proyeksi (bawaan kamera adegan; skorKamera memakai kamera uji). */
function mulutTertutup(dn, tk, cp, kam = dn.kamera) {
  tk.akar.updateWorldMatrix(true, true); const R = tk.R, ki = tk.kepalaIsi.matrixWorld, sk = tk.akar.scale.x;
  const titikWajah = (x, y) => new THREE.Vector3(x * R, y * R, Math.sqrt(Math.max(0, 1 - x * x - y * y)) * R).applyMatrix4(ki);
  const mulutP = [[-.2, -.34], [0, -.36], [.2, -.34], [-.14, -.48], [0, -.5], [.14, -.48]].map(([x, y]) => titikWajah(x, y));
  const mataP = [[-.3, .1], [.3, .1]].map(([x, y]) => titikWajah(x, y));
  const fokus = (H / 2) / Math.tan((kam.fov ?? fovBawaan()) * D2R / 2), kp = new THREE.Vector3(), keL = p => { kp.copy(p).project(kam); return [kp.x * W / 2, kp.y * H / 2, kp.z]; };
  const pen = [], AKU = 'tangan/lengannya sendiri';
  for (const n of ['Ka', 'Ki']) {
    const L = tk.lengan[n], b = L.bahu.getWorldPosition(new THREE.Vector3()), s = L.siku.getWorldPosition(new THREE.Vector3()), tg = new THREE.Vector3(0, -.06, 0).applyMatrix4(L.tangan.matrixWorld);
    pen.push({ a: b, b: s, r: .056 * sk, apa: AKU }, { a: s, b: tg, r: .05 * sk, apa: AKU }, { a: tg, b: tg, r: .068 * sk, apa: AKU });
    const ob = tk.pegangan[n] && tk.pegangan[n].obj;
    if (ob) { const bx = new THREE.Box3().setFromObject(ob); if (!bx.isEmpty()) { const sp = bx.getBoundingSphere(new THREE.Sphere()); pen.push({ a: sp.center, b: sp.center, r: sp.radius * .75, apa: 'properti yang dipegangnya' }); } }
  }
  const lain = []; for (const id in dn.para) { const t2 = dn.para[id]; if (t2 === tk || !t2.akar.visible) continue; t2.akar.traverse(m => { if (m.isMesh && !m.userData.tepi && m.visible && m.material && !m.material.transparent) lain.push(m); }); }
  const tutupSendiri = p => {
    const q = keL(p), dp = p.distanceTo(cp);
    for (const c of pen) {
      const A = keL(c.a), B = keL(c.b); if (A[2] > 1 || B[2] > 1) continue;
      const vx = B[0] - A[0], vy = B[1] - A[1], ll = vx * vx + vy * vy, u = ll > 1e-6 ? jepit(((q[0] - A[0]) * vx + (q[1] - A[1]) * vy) / ll) : 0;
      const dw = c.a.clone().lerp(c.b, u).distanceTo(cp); if (dw > dp - .03) continue;   // penutup harus di depan wajah
      if (Math.hypot(q[0] - (A[0] + vx * u), q[1] - (A[1] + vy * u)) < c.r / dw * fokus) return c.apa;
    }
    return null;
  };
  const tutupLain = p => { const d = p.clone().sub(cp), L = d.length(); _ray.set(cp, d.normalize()); _ray.near = .02; _ray.far = L - .015;
    const h = _ray.intersectObjects([...lain, ...(dn.padat || [])], false).filter(x => !x.object.userData.dindingRuang)[0]; if (!h) return null;
    const ud = h.object.userData; return ud.tokoh ? `tokoh "${ud.tokoh}"` : namaBenda(ud.benda); };
  const hitung = ps => { let n = 0, apa = null; for (const p of ps) { const a = tutupSendiri(p) || tutupLain(p); if (a) { n++; apa = apa || a; } } return { n, apa }; };
  const m = hitung(mulutP); if (m.n < 2) return null;
  const e = hitung(mataP); return { bag: e.n >= 1 ? 'wajah' : 'mulut', apa: m.apa };
}
/** bagian bingkai yang kosong (sinar dari kamera tidak mengenai apa pun) di adegan ber-ruang: kamera melihat ke luar ruang/di balik dinding */
Dunia3D.prototype.periksaLatar = function () {
  if (!this._tertutup) return 0;
  const ms = []; this.scene.traverse(o => { if (!o.isMesh || o.userData.tepi || !o.visible) return; for (let q = o.parent; q; q = q.parent) if (q.visible === false) return; ms.push(o); });
  const r = new THREE.Raycaster(); r.far = 300; let kosong = 0, n = 0;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 10; j++) { n++; r.setFromCamera({ x: -1 + (i + .5) / 3, y: -1 + (j + .5) / 5 }, this.kamera); if (!r.intersectObjects(ms, false).length) kosong++; }
  return kosong / n;
};
function periksaBidikan3D() { const out = { salah: [], saran: [] }; for (const dn of M3.digambar || []) { dn.periksaBidikan().forEach(s => out.salah.push(`adegan "${dn.a.id}": ${s}`)); dn.saranBidikan().forEach(s => out.saran.push(`adegan "${dn.a.id}": ${s}`));
  const ks = dn.periksaLatar(); if (ks > .04) out.salah.push(`adegan "${dn.a.id}": latar kosong ±${Math.round(ks * 20) * 5} % bingkai (kamera melihat ke luar ruang) — pakai ruang() bawaan (tertutup 4 sisi + plafon), perbesar ruang, atau ubah sudut kamera`); }
  return out; }
