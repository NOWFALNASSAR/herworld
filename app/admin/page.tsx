'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/client';
import type { Item } from '@/lib/types';
import { TYPES } from '@/lib/types';
import { fmtDate } from '@/lib/utils';
import { refreshSite } from './actions';

export default function ContentList() {
  const sb = createClient();
  const [items, setItems] = useState<Item[] | null>(null);
  const [armed, setArmed] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data, error } = await sb.from('content').select('*').order('published_at', { ascending: false });
    if (error) setMsg('Could not load content: ' + error.message);
    setItems((data ?? []) as Item[]);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggle(i: Item) {
    const { error } = await sb.from('content').update({ status: i.status === 'hidden' ? 'published' : 'hidden' }).eq('id', i.id);
    setMsg(error ? 'Could not update: ' + error.message : i.status === 'hidden' ? 'Shown on site' : 'Hidden from site');
    await refreshSite(); load();
  }
  async function remove(i: Item) {
    if (armed !== i.id) return setArmed(i.id);
    const { error } = await sb.from('content').delete().eq('id', i.id);
    setMsg(error ? 'Could not delete: ' + error.message : 'Deleted');
    setArmed(null); await refreshSite(); load();
  }

  return (
    <>
      <AdminNav />
      <Link className="btn pink" href="/admin/content/new">+ Add new content</Link>
      {msg && <p className="msg" role="status" style={{ marginTop: 16 }}>{msg}</p>}
      <div className="tablewrap" style={{ marginTop: 18 }}>
        <table>
          <thead><tr><th>Content</th><th>Type</th><th>Brand</th><th>Date</th><th>Status</th><th /></tr></thead>
          <tbody>
            {items === null && <tr><td colSpan={6}>Loading…</td></tr>}
            {items?.length === 0 && <tr><td colSpan={6}>No content yet. Add your first reel, shoot or collab.</td></tr>}
            {items?.map((i) => (
              <tr key={i.id}>
                <td>{i.title}{i.trending ? ' 🔥' : ''}</td>
                <td>{TYPES[i.type]}</td>
                <td>{i.brand || '—'}</td>
                <td>{fmtDate(i.published_at)}</td>
                <td><span className={`status${i.status === 'hidden' ? '' : ' pub'}`}>{i.status === 'hidden' ? 'Hidden' : 'Published'}</span></td>
                <td>
                  <div className="acts">
                    <Link className="btn sm" href={`/admin/content/${i.id}`}>Edit</Link>
                    <a className="btn sm" href={`/${i.type === 'pov' ? 'pov' : 'work'}/${i.slug}`} target="_blank">Preview</a>
                    <button className="btn sm" onClick={() => toggle(i)}>{i.status === 'hidden' ? 'Show' : 'Hide'}</button>
                    <button className="btn sm" style={armed === i.id ? { borderColor: 'var(--pink)', color: 'var(--pink)' } : undefined} onClick={() => remove(i)}>
                      {armed === i.id ? 'Tap to confirm' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">New content appears on the home page automatically: latest work, brands, reels and My POV update on publish.</p>
    </>
  );
}
