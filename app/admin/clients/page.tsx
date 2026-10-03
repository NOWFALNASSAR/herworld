'use client';
import { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { TAGS } from '@/lib/types';

export default function ClientLinks() {
  const [copied, setCopied] = useState('');
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return (
    <>
      <AdminNav />
      <p className="lede">Send a brand a portfolio that shows only what they care about. Only content with that tag appears.</p>
      {TAGS.map((t) => {
        const url = `${base}/client/${t}`;
        return (
          <div key={t} className="admin-top" style={{ borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
            <div><b style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem' }}>{t[0].toUpperCase() + t.slice(1)}</b><div className="note">{url}</div></div>
            <div className="acts">
              <button className="btn sm" onClick={async () => { await navigator.clipboard.writeText(url); setCopied(t); }}>{copied === t ? 'Copied' : 'Copy link'}</button>
              <a className="btn sm" href={url} target="_blank">Preview</a>
            </div>
          </div>
        );
      })}
    </>
  );
}
