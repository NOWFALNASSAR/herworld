'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import Uploader from '@/components/admin/Uploader';
import { createClient } from '@/lib/supabase/client';
import type { ContentType, Item, MediaItem } from '@/lib/types';
import { TAGS, TYPES } from '@/lib/types';
import { cld, slugify } from '@/lib/utils';
import { refreshSite } from '../../actions';

type Draft = Omit<Item, 'id' | 'slug'> & { id?: string; slug?: string };
const blank = (): Draft => ({
  type: 'reel', title: '', brand: '', brand_logo: null, tags: [], description: '', role: '', deliverables: '',
  concept: '', created_what: '', results: '', media: [], instagram_url: '', trending: false, status: 'published',
  published_at: new Date().toISOString().slice(0, 10),
});

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const sb = createClient();
  const router = useRouter();
  const [d, setD] = useState<Draft | null>(isNew ? blank() : null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isNew) return;
    sb.from('content').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error) setMsg('Could not load this item.');
      else setD(data as Item);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!d) return (<><AdminNav /><p>{msg || 'Loading…'}</p></>);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD({ ...d, [k]: v });
  const field = (k: keyof Draft, label: string, ph = '', area = false) => {
    const v = (d[k] as string) ?? '';
    return (
      <label>{label}
        {area
          ? <textarea value={v} placeholder={ph} onChange={(e) => set(k, e.target.value as never)} />
          : <input value={v} placeholder={ph} onChange={(e) => set(k, e.target.value as never)} />}
      </label>
    );
  };
  const move = (k: number, dir: -1) => {
    const m = [...d.media];
    [m[k + dir], m[k]] = [m[k], m[k + dir]];
    set('media', m);
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!d!.title.trim()) return setMsg('Add a title before publishing.');
    setBusy(true);
    const clean = (v: string | null) => (v && v.trim() ? v.trim() : null);
    const row = {
      ...d!,
      title: d!.title.trim(),
      slug: d!.slug || slugify(d!.title),
      brand: clean(d!.brand), description: clean(d!.description), role: clean(d!.role),
      deliverables: clean(d!.deliverables), concept: clean(d!.concept), created_what: clean(d!.created_what),
      results: clean(d!.results), instagram_url: clean(d!.instagram_url),
    };
    const { error } = isNew ? await sb.from('content').insert(row) : await sb.from('content').update(row).eq('id', id);
    setBusy(false);
    if (error) return setMsg('Could not publish: ' + error.message);
    await refreshSite();
    router.push('/admin');
  }

  return (
    <>
      <AdminNav />
      <form onSubmit={save}>
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>Choose type</div>
          <div className="typegrid">
            {(Object.keys(TYPES) as ContentType[]).map((t) => (
              <button type="button" key={t} aria-pressed={d.type === t} onClick={() => set('type', t)}>{TYPES[t]}</button>
            ))}
          </div>
        </div>
        {field('title', 'Title', 'Summer Collection')}
        <div className="row2">
          {field('brand', 'Brand (leave empty if self created)', 'XYZ Fashion')}
          <label>Date<input type="date" value={d.published_at} onChange={(e) => set('published_at', e.target.value)} /></label>
        </div>
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>Tags (used for client links)</div>
          <div className="chips">
            {TAGS.map((t) => (
              <label key={t}>
                <input type="checkbox" checked={d.tags.includes(t)}
                  onChange={(e) => set('tags', e.target.checked ? [...d.tags, t] : d.tags.filter((x) => x !== t))} />
                {t}
              </label>
            ))}
          </div>
        </div>
        <fieldset>
          <legend>Photos &amp; videos</legend>
          <div className="thumbs">
            {d.media.map((m: MediaItem, k) => (
              <div className="t" key={m.url}>
                {m.kind === 'video' ? <video src={cld(m.url, 'video')} muted /> : <img src={cld(m.url, 'image', 200)} alt="" />}
                <button type="button" className="x" aria-label="Remove" onClick={() => set('media', d.media.filter((_, j) => j !== k))}>×</button>
                {k > 0 && <button type="button" className="l" aria-label="Move earlier" onClick={() => move(k, -1)}>‹</button>}
              </div>
            ))}
          </div>
          <Uploader label="Upload photos / videos" multiple onUpload={(m) => setD((prev) => prev && { ...prev, media: [...prev.media, m] })} />
          <p className="note">The first item is the cover. Use ‹ to move one earlier.</p>
        </fieldset>
        {field('instagram_url', 'Instagram link', 'https://instagram.com/reel/…')}
        {field('description', 'Description', 'A short line about this piece.', true)}
        <fieldset>
          <legend>Case study (optional)</legend>
          <div className="row2">{field('role', 'My role', 'Model + Content Creator')}{field('deliverables', 'Deliverables', '3 Reels + 10 Photos')}</div>
          {field('concept', 'Concept', '', true)}
          {field('created_what', 'What I created', '', true)}
          {field('results', 'Results', 'e.g. 1.2M views, 8% engagement', true)}
          <div>
            <div className="kicker" style={{ marginBottom: 8 }}>Brand logo (shows on the brand wall)</div>
            {d.brand_logo && (
              <div className="thumbs" style={{ marginBottom: 8 }}>
                <div className="t"><img src={cld(d.brand_logo, 'image', 200)} alt="" style={{ objectFit: 'contain' }} />
                  <button type="button" className="x" aria-label="Remove logo" onClick={() => set('brand_logo', null)}>×</button></div>
              </div>
            )}
            <Uploader label="Upload logo" accept="image" onUpload={(m) => setD((p) => p && { ...p, brand_logo: m.url })} />
          </div>
        </fieldset>
        <div className="chips">
          <label><input type="checkbox" checked={d.trending} onChange={(e) => set('trending', e.target.checked)} />Show in Trending 🔥</label>
          <label><input type="checkbox" checked={d.status === 'hidden'} onChange={(e) => set('status', e.target.checked ? 'hidden' : 'published')} />Hide from site</label>
        </div>
        {msg && <p className="msg" role="alert">{msg}</p>}
        <div className="cbtns">
          <button className="btn pink" disabled={busy}>{busy ? 'Publishing…' : 'Publish'}</button>
          <button type="button" className="btn" onClick={() => router.push('/admin')}>Cancel</button>
        </div>
      </form>
    </>
  );
}
