'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import Uploader from '@/components/admin/Uploader';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SETTINGS } from '@/lib/defaults';
import type { Settings } from '@/lib/types';
import { cld } from '@/lib/utils';
import { refreshSite } from '../actions';

export default function SettingsPage() {
  const sb = createClient();
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sb.from('settings').select('data').eq('id', 1).maybeSingle().then(({ data }) => {
      const merged = { ...DEFAULT_SETTINGS, ...((data?.data as Partial<Settings>) ?? {}) };
      if (!merged.stats?.length) merged.stats = DEFAULT_SETTINGS.stats;
      setS(merged);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!s) return (<><AdminNav /><p>Loading…</p></>);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });
  const f = (k: keyof Settings, label: string, ph = '', area = false) => (
    <label>{label}
      {area
        ? <textarea value={s[k] as string} placeholder={ph} onChange={(e) => set(k, e.target.value as never)} />
        : <input value={s[k] as string} placeholder={ph} onChange={(e) => set(k, e.target.value as never)} />}
    </label>
  );
  const mediaSlot = (k: 'hero' | 'portrait', label: string) => (
    <div>
      <div className="kicker" style={{ marginBottom: 8 }}>{label}</div>
      {s[k] && (
        <div className="thumbs" style={{ marginBottom: 8 }}>
          <div className="t">
            {s[k]!.kind === 'video' ? <video src={cld(s[k]!.url, 'video')} muted /> : <img src={cld(s[k]!.url, 'image', 200)} alt="" />}
            <button type="button" className="x" aria-label="Remove" onClick={() => set(k, null)}>×</button>
          </div>
        </div>
      )}
      <Uploader label={s[k] ? 'Replace' : 'Upload'} accept={k === 'portrait' ? 'image' : 'any'} onUpload={(m) => setS((p) => p && { ...p, [k]: m })} />
    </div>
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await sb.from('settings').upsert({ id: 1, data: s });
    setBusy(false);
    if (error) return setMsg('Could not save: ' + error.message);
    await refreshSite();
    setMsg('Settings saved. The site is updated.');
  }

  return (
    <>
      <AdminNav />
      <form onSubmit={save}>
        <fieldset><legend>Hero</legend>
          {f('name', 'Name')}{f('roles', 'Roles line (separate with •)', 'Model • Creator • Influencer')}{f('tagline', 'Tagline')}
          {mediaSlot('hero', 'Hero video or photo (video: 10–20 seconds, under 10 MB)')}
        </fieldset>
        <fieldset><legend>Who I am</legend>
          {f('statement', 'Big statement')}{f('bio', 'Short intro', '', true)}
          {mediaSlot('portrait', 'Portrait photo')}
          <div className="kicker">Numbers</div>
          {s.stats.map((st, k) => (
            <div className="row2" key={k}>
              <label>Number<input value={st.v} onChange={(e) => set('stats', s.stats.map((x, j) => (j === k ? { ...x, v: e.target.value } : x)))} /></label>
              <label>Label<input value={st.l} onChange={(e) => set('stats', s.stats.map((x, j) => (j === k ? { ...x, l: e.target.value } : x)))} /></label>
            </div>
          ))}
        </fieldset>
        <fieldset><legend>Services</legend>{f('services', 'One per line as: Title | description', '', true)}</fieldset>
        <fieldset><legend>Next chapter</legend>
          <div className="row2">{f('chapterA', 'Line one')}{f('chapterB', 'Line two')}</div>{f('chapterText', 'Text', '', true)}
        </fieldset>
        <fieldset><legend>Contact</legend>
          {f('whatsapp', 'WhatsApp number with country code', '+91 98765 43210')}
          {f('email', 'Email', 'hello@rahana.com')}
          {f('instagram', 'Instagram URL', 'https://instagram.com/…')}
          {f('youtube', 'YouTube URL', 'https://youtube.com/@…')}
          {f('mediakit', 'Media kit link (upload a PDF or paste a Google Drive link)', 'https://…')}
          <Uploader label="Upload media kit PDF" accept="pdf" onUpload={(m) => setS((p) => p && { ...p, mediakit: m.url })} />
        </fieldset>
        {msg && <p className="msg" role="status">{msg}</p>}
        <div className="cbtns"><button className="btn pink" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>
      </form>
    </>
  );
}
