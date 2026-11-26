"""Alat bantu Claude untuk skill motion-graphic-3d (turunan alat motion-graphic).

Videonya sendiri tetap SATU file HTML mandiri: animasi, cek kualitas, dan encoder MP4 (WebCodecs) ada di
dalam HTML, jadi pengguna cukup membukanya di Chrome/Edge lalu menekan "Ekspor MP4". Skrip ini hanya
merakit file itu (menanam Three.js r147 + mesin 3D assets/mesin3d/*.js) dan "menekan tombolnya" di browser tanpa layar (Playwright), supaya Claude bisa melihat
bingkai sendiri dan mengunggah otomatis. Tidak memakai ffmpeg.

  rakit     <konfig.js> <keluar.html> [--narasi narasi.mp3 --naskah naskah.txt] [--baris DIR] [--musik musik.mp3 --vol-musik 0.3] [--sfx DIR]
  cek       <film.html>                      cek kualitas (JSON), kode keluar 0 = BERES
  kontak    <film.html> <keluar.jpg> [--n 24 | --t 1,2.5,4]
  bingkai   <film.html> <detik> <keluar.png>
  thumbnail <film.html> <keluar.png>
  ekspor    <film.html> <keluar.mp4> [--fps 30]

naskah.txt: satu baris narasi per baris, boleh diawali id ("L01 | Teks …"); urutannya = urutan di rekaman;
            baris berawalan # = catatan (sumber, arahan), tidak ikut.
--baris DIR: berkas L01.mp3, L02.mp3, … (satu berkas per baris) dipasangkan ke id yang sama di naskah.
--sfx DIR:   semua berkas audio di DIR ditanam sebagai SFX berkas (nama = nama berkas tanpa ekstensi); dipanggil di konfig lewat
             sfx: [{ t: 'L04.w9', jenis: 'berkas', berkas: 'hantam', vol: .8, lama, dari, ulang }] (references/mesin.md §SFX berkas).
"""
import argparse, base64, io, json, mimetypes, re, sys, time
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
TEMPLAT = AKAR / 'assets' / 'templat.html'
THREE = AKAR / 'assets' / 'three.min.js'          # Three.js r147 (MIT), ditanam utuh
MESIN3D = AKAR / 'assets' / 'mesin3d'              # 01-inti.js … 05-efek.js, digabung urut nama


def data_uri(berkas):
    p = Path(berkas)
    tipe = mimetypes.guess_type(p.name)[0] or 'audio/mpeg'
    return f'data:{tipe};base64,' + base64.b64encode(p.read_bytes()).decode('ascii')


def baca_naskah(berkas):
    baris = []
    isi = [x.strip() for x in Path(berkas).read_text(encoding='utf-8').splitlines()]
    for s in [x for x in isi if x and not x.startswith('#')]:   # baris '#' = catatan (sumber, arahan)
        m = re.match(r'^\s*([A-Za-z]{1,4}\d{1,3})\s*[|:]\s*(.+)$', s)
        baris.append({'id': m.group(1), 'teks': m.group(2).strip()} if m else {'id': f'L{len(baris) + 1:02d}', 'teks': s})
    return baris


def rakit(a):
    tpl = TEMPLAT.read_text(encoding='utf-8')
    konfig = Path(a.konfig).read_text(encoding='utf-8')
    if '</script' in konfig.lower():
        sys.exit('konfig tidak boleh berisi </script>')
    awal = tpl.index('\n<script id="konfig">') + len('\n<script id="konfig">')
    akhir = tpl.index('</script>', awal)
    html = tpl[:awal] + '\n' + konfig.strip() + '\n' + tpl[akhir:]
    mesin = '\n'.join(f.read_text(encoding='utf-8') for f in sorted(MESIN3D.glob('*.js')))
    for nama, penanda, isi in (('three-js', 'THREE', THREE.read_text(encoding='utf-8')), ('inti3d', 'MESIN3D', mesin)):
        if '</script' in isi.lower():
            sys.exit(f'{nama} tidak boleh berisi </script>')
        tanda = f'<script id="{nama}">/*{penanda}*/</script>'
        if tanda not in html:
            sys.exit(f'templat rusak: penanda {tanda} tidak ada')
        html = html.replace(tanda, f'<script id="{nama}">\n' + isi.strip() + '\n</script>', 1)
    suara = None
    if a.naskah:
        suara = {'mulai': a.mulai, 'baris': baca_naskah(a.naskah)}
        if a.narasi:
            suara['narasi'] = {'src': data_uri(a.narasi), 'mulai': a.mulai}
        if a.baris:
            d = Path(a.baris)
            for b in suara['baris']:
                cocok = [f for f in d.iterdir() if f.stem.lower() == b['id'].lower()]
                if cocok:
                    b['src'] = data_uri(cocok[0])
    if a.musik:
        suara = suara or {}
        suara['musik'] = {'src': data_uri(a.musik), 'vol': a.vol_musik}
    if a.sfx:   # semua berkas audio di DIR ditanam sebagai SFX berkas (nama = nama berkas tanpa ekstensi)
        suara = suara or {}
        suara['sfxBerkas'] = {f.stem: data_uri(f) for f in sorted(Path(a.sfx).iterdir()) if f.suffix.lower() in ('.mp3', '.wav', '.ogg', '.m4a')}
    if suara is not None:
        blok = json.dumps(suara, ensure_ascii=False).replace('</', '<\\/')
        html = re.sub(r'<script id="data-suara" type="application/json">.*?</script>',
                      lambda _: f'<script id="data-suara" type="application/json">{blok}</script>', html, count=1, flags=re.S)
    judul = re.search(r"judul:\s*'([^']+)'", konfig)
    if judul:
        html = re.sub(r'<title>.*?</title>', lambda _: f'<title>{judul.group(1)}</title>', html, count=1)
    Path(a.keluar).write_text(html, encoding='utf-8')
    print(f'ok {a.keluar} ({len(html) / 1e6:.1f} MB)')


def buka(html, lebar=600, tinggi=1000):
    from playwright.sync_api import sync_playwright
    pw = sync_playwright().start()
    br = None
    for opsi in ({}, {'channel': 'chrome'}, {'channel': 'msedge'}, {'executable_path': '/opt/pw-browsers/chromium'}):
        try:
            br = pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'], **opsi)
            break
        except Exception:
            continue
    if br is None:
        sys.exit('Browser tidak ditemukan. Buka file HTML-nya di Chrome/Edge lalu tekan tombol di bawah video.')
    pg = br.new_page(viewport={'width': lebar, 'height': tinggi})
    log = []
    pg.on('console', lambda m: m.type in ('error', 'warning') and log.append(f'[{m.type}] {m.text}'))
    pg.on('pageerror', lambda e: log.append(f'[galat] {e}'))
    pg.goto(Path(html).resolve().as_uri() + '?render')
    try:
        pg.wait_for_function('window.SIAP === true', timeout=60000)
    except Exception:
        print('\n'.join(log) or 'Halaman tidak siap (cek galat JavaScript di blok konfig).')
        raise
    return pw, br, pg, log


def tutup(pw, br, log):
    if log:
        print('\n'.join(log[:20]))
    br.close(); pw.stop()


def ambil_kanvas(pg, t):
    d = pg.evaluate("t => { seek(t); return document.getElementById('kanvas').toDataURL('image/png') }", t)
    from PIL import Image
    return Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGB')


def cek(a):
    pw, br, pg, log = buka(a.html)
    r = pg.evaluate('hasilCek()')
    print(json.dumps(r, ensure_ascii=False, indent=1))
    print('BERES' if r['beres'] else 'BELUM BERES')
    tutup(pw, br, log)
    sys.exit(0 if r['beres'] else 1)


def kontak(a):
    from PIL import Image, ImageDraw
    pw, br, pg, log = buka(a.html)
    dur = pg.evaluate('DURATION')
    waktu = [float(x) for x in a.t.split(',')] if a.t else [dur * (i + .5) / a.n for i in range(a.n)]
    ubin = []
    for t in waktu:
        im = ambil_kanvas(pg, t)
        lb = 300 if im.height > im.width else 480
        im = im.resize((lb, round(im.height * lb / im.width)))
        ImageDraw.Draw(im).text((8, 6), f'{t:.1f}s', fill=(255, 255, 0))
        ubin.append(im)
    w, h = ubin[0].size
    kol = min(6 if h > w else 4, len(ubin)); bar = (len(ubin) + kol - 1) // kol
    L = Image.new('RGB', (w * kol, h * bar), (17, 17, 17))
    for i, im in enumerate(ubin):
        L.paste(im, ((i % kol) * w, (i // kol) * h))
    L.save(a.keluar, quality=86)
    print('ok', a.keluar, f'durasi {dur:.2f} dtk')
    tutup(pw, br, log)


def bingkai(a):
    pw, br, pg, log = buka(a.html)
    ambil_kanvas(pg, float(a.detik)).save(a.keluar)
    print('ok', a.keluar)
    tutup(pw, br, log)


def thumbnail(a):
    pw, br, pg, log = buka(a.html)
    d = pg.evaluate('thumbnail()')
    Path(a.keluar).write_bytes(base64.b64decode(d.split(',')[1]))
    from PIL import Image
    if Path(a.keluar).stat().st_size > 1.9e6:   # batas thumbnail YouTube/Balasin 2 MB
        Image.open(a.keluar).convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(a.keluar, optimize=True)
    print('ok', a.keluar, f'({Path(a.keluar).stat().st_size / 1e6:.1f} MB)')
    tutup(pw, br, log)


def ekspor(a):
    pw, br, pg, log = buka(a.html)
    t0 = time.time()
    tipe, isi = pg.evaluate("""async fps => {
      const blob = await eksporMP4({ fps: fps || undefined });
      const buf = new Uint8Array(await blob.arrayBuffer()); let s = '';
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return [blob.type, btoa(s)];
    }""", a.fps)
    keluar = Path(a.keluar)
    if 'webm' in tipe:
        keluar = keluar.with_suffix('.webm')
    keluar.write_bytes(base64.b64decode(isi))
    print(f'ok {keluar} ({keluar.stat().st_size / 1e6:.1f} MB, {time.time() - t0:.0f} dtk, {tipe})')
    tutup(pw, br, log)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='perintah', required=True)
    p = sub.add_parser('rakit'); p.add_argument('konfig'); p.add_argument('keluar')
    p.add_argument('--naskah'); p.add_argument('--narasi'); p.add_argument('--baris'); p.add_argument('--mulai', type=float, default=0.3)
    p.add_argument('--musik'); p.add_argument('--vol-musik', type=float, default=0.3); p.add_argument('--sfx'); p.set_defaults(f=rakit)
    p = sub.add_parser('cek'); p.add_argument('html'); p.set_defaults(f=cek)
    p = sub.add_parser('kontak'); p.add_argument('html'); p.add_argument('keluar'); p.add_argument('--n', type=int, default=24); p.add_argument('--t'); p.set_defaults(f=kontak)
    p = sub.add_parser('bingkai'); p.add_argument('html'); p.add_argument('detik'); p.add_argument('keluar'); p.set_defaults(f=bingkai)
    p = sub.add_parser('thumbnail'); p.add_argument('html'); p.add_argument('keluar'); p.set_defaults(f=thumbnail)
    p = sub.add_parser('ekspor'); p.add_argument('html'); p.add_argument('keluar'); p.add_argument('--fps', type=int, default=0); p.set_defaults(f=ekspor)
    a = ap.parse_args()
    a.f(a)


if __name__ == '__main__':
    main()
