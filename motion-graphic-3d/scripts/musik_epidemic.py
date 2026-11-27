"""Musik latar per babak dari Epidemic Sound untuk skill motion-graphic-3d (sejak 27 Nov 2026, permintaan "tambahkan musik pengiring
yang bagus dan cocok dari Epidemic"). Satu lagu datar sepanjang video (uji Timbangan Daging: "Dead Silence" + hening ±20 dtk di
tengah) terasa kosong; film memakai musik yang BERGANTI mengikuti babak cerita.

  cari  "<kata kunci>" [jumlah=8] [durasi_min_dtk=60]   lagu tanpa vokal: id | judul - artis | durasi | bpm | mood/genre
  edit  <id> <durasi_dtk> <keluar.mp3>                  versi resmi Epidemic sepanjang durasi babak (akhir alami), lalu unduh
  ukur  <berkas.mp3> …                                  LUFS, puncak, kurva energi per 2 dtk (cari hentakan, hening, puncak)
  latar <keluar.mp3> <durasi_video> <berkas@mulai[@lufs]> …   rakit satu musik latar: tiap potongan disamakan kekerasannya
                                                        (bawaan -20 LUFS), masuk/keluar crossfade, dipotong sepanjang video
  cek   <film.html>                                     render audio saja (tanpa ekspor video): kejelasan tiap kalimat (suara vs
                                                        musik+SFX, target rata-rata ≥ +10 dB, terburuk 0,5 dtk ≥ +6 dB) dan musik di sela

Kunci API: variabel lingkungan EPIDEMIC_SOUND_MCP_API_KEY, atau dibaca dari D:\\Sound\\mcpsound.md / D:\\automation\\Video AI\\epedemic.md
(rahasia: tidak pernah dicetak). Unduhan memakai langganan Epidemic pengguna (lisensi langganan itu). Di PowerShell 5.1 jangan
mengirim JSON sebagai argumen (tanda kutip hilang); skrip ini hanya menerima argumen biasa.
Alur di skill: SKILL.md Tahap 3 + references/mesin-2d.md §7b.
"""
import base64, io, json, os, re, subprocess, sys, time, urllib.error, urllib.request, wave
from pathlib import Path

URL = 'https://www.epidemicsound.com/a/mcp-service/mcp'
BERKAS_KUNCI = [r'D:\Sound\mcpsound.md', r'D:\automation\Video AI\epedemic.md']


def ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return 'ffmpeg'


def kunci():
    k = os.environ.get('EPIDEMIC_SOUND_MCP_API_KEY', '').strip()
    for f in BERKAS_KUNCI:
        if k:
            break
        if os.path.exists(f):
            m = re.search(r'epidemic_live_[A-Za-z0-9_\-]+', open(f, encoding='utf-8', errors='replace').read())
            k = m.group(0) if m else ''
    if not k:
        sys.exit('kunci Epidemic tidak ditemukan (EPIDEMIC_SOUND_MCP_API_KEY atau D:\\Sound\\mcpsound.md)')
    return k


class Sesi:
    def __init__(self):
        self.k, self.sid, self.n = kunci(), None, 0
        self.kirim('initialize', {'protocolVersion': '2025-03-26', 'capabilities': {}, 'clientInfo': {'name': 'motion-graphic-3d', 'version': '1.0'}})
        self.kirim('notifications/initialized', None, notif=True)

    def kirim(self, metode, params, notif=False):
        badan = {'jsonrpc': '2.0', 'method': metode}
        if params is not None:
            badan['params'] = params
        if not notif:
            self.n += 1; badan['id'] = self.n
        h = {'Authorization': 'Bearer ' + self.k, 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream'}
        if self.sid:
            h['Mcp-Session-Id'] = self.sid
        try:
            with urllib.request.urlopen(urllib.request.Request(URL, data=json.dumps(badan).encode(), headers=h), timeout=120) as r:
                self.sid = r.headers.get('Mcp-Session-Id') or self.sid
                teks, tipe = r.read().decode('utf-8', 'replace'), r.headers.get('Content-Type', '')
        except urllib.error.HTTPError as e:
            sys.exit(f'Epidemic menolak ({e.code}): {e.read()[:300].decode("utf-8", "replace")}')
        if notif or not teks.strip():
            return None
        if 'text/event-stream' in tipe:
            data = [l[5:].strip() for l in teks.splitlines() if l.startswith('data:')]
            teks = next((d for d in reversed(data) if d.startswith('{')), '{}')
        j = json.loads(teks)
        if 'error' in j:
            sys.exit('galat MCP: ' + json.dumps(j['error'], ensure_ascii=False)[:400])
        return j.get('result')

    def panggil(self, nama, argumen):
        h = self.kirim('tools/call', {'name': nama, 'arguments': argumen}) or {}
        t = ''.join(c.get('text', '') for c in h.get('content', []) if c.get('type') == 'text')
        try:
            return json.loads(t)
        except Exception:
            return {'teks': t}


def cari(kata, n=8, durmin=60):
    j = Sesi().panggil('SearchRecordings', {'query': {'term': kata}, 'first': n, 'filter': {'vocals': False, 'duration': {'min': int(durmin * 1000)}}})
    for nd in j.get('data', {}).get('recordings', {}).get('nodes', []) or j.get('nodes', []):
        r = nd.get('recording', nd); tg = {}
        for t in r.get('tags', []):
            tg.setdefault(t['dimension']['name'], []).append(t['displayName'])
        art = ', '.join(c['artist']['name'] for c in r.get('credits', []) if c.get('role') == 'MAIN_ARTIST')
        tags = ' | '.join(f"{k}: {', '.join(v[:5])}" for k, v in tg.items() if k in ('mood', 'mood advanced', 'production genre', 'genre'))
        print(f"{r['id']} | {r['title']} - {art} | {r['audioFile']['durationInMilliseconds'] / 1000:.0f}s | {r.get('bpm')}bpm | {tags}")


def edit(rid, dur, keluar):
    s = Sesi()
    h = s.panggil('EditRecording', {'id': rid, 'input': {'targetDurationMs': int(float(dur) * 1000), 'downloadAudioFormat': 'MP3', 'skipStems': True, 'maxResults': 1, 'forceDuration': True, 'loopable': False}})
    jid = (re.search(r'"id"\s*:\s*"([0-9a-f-]{36})"', json.dumps(h)) or [None, None])[1]
    if not jid:
        sys.exit('edit gagal: ' + json.dumps(h)[:800])
    st = ''
    for _ in range(90):
        st = json.dumps(s.panggil('PollEditRecordingJob', {'id': jid}))
        if '"COMPLETED"' in st or '"FAILED"' in st:
            break
        time.sleep(4)
    if '"COMPLETED"' not in st:
        sys.exit('edit gagal/terlalu lama: ' + st[:800])
    eid = next(x for x in re.findall(r'"id"\s*:\s*"([0-9a-f-]{36})"', st) if x != jid)
    d = s.panggil('DownloadRecordingEdit', {'input': {'jobId': jid, 'editId': eid}})
    urllib.request.urlretrieve(re.search(r'https://[^"\s]+', json.dumps(d)).group(0), keluar)
    print('ok', keluar)


def durasi_berkas(f):
    t = re.search(r'Duration: (\d+):(\d+):([\d.]+)', subprocess.run([ffmpeg(), '-hide_banner', '-i', f], capture_output=True, text=True, errors='replace').stderr)
    return int(t[1]) * 3600 + int(t[2]) * 60 + float(t[3])


def lufs(f):
    r = subprocess.run([ffmpeg(), '-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, errors='replace').stderr
    I, P = re.findall(r'I:\s+(-?[\d.]+) LUFS', r), re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)
    return float(I[-1]) if I else None, float(P[-1]) if P else None


def ukur(*fs):
    import numpy as np
    for f in fs:
        raw = subprocess.run([ffmpeg(), '-v', 'error', '-i', f, '-ac', '1', '-ar', '22050', '-f', 's16le', '-'], capture_output=True).stdout
        x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; b = 44100
        env = [20 * np.log10(np.sqrt(np.mean(x[i:i + b] ** 2)) + 1e-9) for i in range(0, len(x) - b + 1, b)]
        I, P = lufs(f)
        print(f'{Path(f).name}: {len(x) / 22050:.1f} dtk | {I} LUFS | puncak {P} dBFS')
        print('   energi/2 dtk (dB):', ' '.join(f'{e:.0f}' for e in env))


def latar(keluar, durasi, *seg):
    """seg = 'berkas@mulai[@lufs]' (mulai = detik di video). Crossfade: potongan berikutnya masuk 1,2 dtk, sebelumnya keluar 1,5–2 dtk."""
    durasi = float(durasi); bag = []
    for x in seg:
        p = x.split('@'); f, t0 = p[0], float(p[1]); tgt = float(p[2]) if len(p) > 2 else -20.0
        I, _ = lufs(f); dur = durasi_berkas(f)
        bag.append((f, t0, (tgt - I) if I is not None else 0.0, dur))
    fc, ins = [], []
    for i, (f, t0, g, dur) in enumerate(bag):
        ins += ['-i', f]; ms = int(t0 * 1000)
        fc.append(f'[{i}:a]aresample=48000,volume={g:.1f}dB,afade=t=in:st=0:d={0.8 if i == 0 else 1.2},afade=t=out:st={max(0, dur - 2):.2f}:d=2,adelay={ms}|{ms}[s{i}]')
    fc.append(''.join(f'[s{i}]' for i in range(len(bag))) + f'amix=inputs={len(bag)}:normalize=0:dropout_transition=0,atrim=0:{durasi:.2f},alimiter=limit=0.9[o]')
    subprocess.run([ffmpeg(), '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(fc), '-map', '[o]', '-ac', '2', '-ar', '48000', '-b:a', '192k', keluar], check=True)
    print('ok', keluar, [(Path(f).name, t0, f'{g:+.1f} dB') for f, t0, g, _ in bag]); ukur(keluar)


def cek(html):
    import numpy as np
    sys.path.insert(0, str(Path(__file__).parent)); import jalankan
    js = """async (mode) => {
      const s = { n: K.normalisasi, vs: K.volumeSuara, vf: K.volumeSfx, vm: MUSIK_FILE && MUSIK_FILE.vol };
      if (mode !== 'campur') { K.normalisasi = false; K.volumeSuara = mode === 'suara' ? (s.vs ?? 1.1) : 0; K.volumeSfx = mode === 'sfx' ? (s.vf ?? 1) : 0; if (MUSIK_FILE) MUSIK_FILE.vol = mode === 'musik' ? (s.vm ?? .35) : 0; }
      const buf = await renderAudio(16000);
      K.normalisasi = s.n; K.volumeSuara = s.vs; K.volumeSfx = s.vf; if (MUSIK_FILE) MUSIK_FILE.vol = s.vm;
      const a = buf.getChannelData(0), b = buf.getChannelData(1), o = new Int16Array(a.length);
      for (let i = 0; i < a.length; i++) o[i] = Math.max(-32767, Math.min(32767, Math.round((a[i] + b[i]) * .5 * 32767)));
      const u = new Uint8Array(o.buffer); let t = ''; for (let i = 0; i < u.length; i += 0x8000) t += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return [btoa(t), (SUARA && SUARA.baris || []).map(x => [x.id, x.mulai, x.durasi])]; }"""
    pw, br, pg, log = jalankan.buka(html); st = {}; baris = []
    for m in ['campur', 'suara', 'musik', 'sfx']:
        b64, baris = pg.evaluate(js, m); st[m] = np.frombuffer(base64.b64decode(b64), np.int16).astype(np.float32) / 32768
    jalankan.tutup(pw, br, log)
    sr = 16000; db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9); lat = st['musik'] + st['sfx']; mask = np.zeros(len(lat), bool); buruk = 0
    for i, t0, d in baris:
        a, z = int(t0 * sr), int((t0 + d) * sr); mask[a:z] = True; sv, lv = db(st['suara'][a:z]), db(lat[a:z]); mn = 99
        for k in range(a, z - 8000, 8000):
            if db(st['suara'][k:k + 8000]) > sv - 10:
                mn = min(mn, db(st['suara'][k:k + 8000]) - db(lat[k:k + 8000]))
        ok = sv - lv >= 10 and mn >= 6; buruk += not ok
        print(f'{i}: suara {sv:.1f} dB, latar {lv:.1f} dB, selisih {sv - lv:+.1f} (terburuk 0,5 dtk {mn:+.1f}){"" if ok else "  <-- TENGGELAM"}')
    sela = ~mask; sela[:sr // 2] = False
    print(f'musik di sela dialog {db(st["musik"][sela]) - db(st["suara"][mask]):+.1f} dB dari suara (bagus: -8 … -12)')
    w = io.BytesIO()
    with wave.open(w, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes((st['campur'] * 32767).astype(np.int16).tobytes())
    tmp = Path(html).with_suffix('.campuran.wav'); tmp.write_bytes(w.getvalue()); I, P = lufs(str(tmp)); tmp.unlink()
    print(f'campuran akhir {I} LUFS, puncak {P} dBFS — {"BERES" if not buruk else f"{buruk} kalimat tenggelam: turunkan --vol-musik atau --redam-musik"}')
    sys.exit(1 if buruk else 0)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    c, a = sys.argv[1], sys.argv[2:]
    {'cari': lambda: cari(a[0], int(a[1]) if len(a) > 1 else 8, float(a[2]) if len(a) > 2 else 60), 'edit': lambda: edit(*a[:3]), 'ukur': lambda: ukur(*a),
     'latar': lambda: latar(a[0], a[1], *a[2:]), 'cek': lambda: cek(a[0])}.get(c, lambda: sys.exit(__doc__))()
