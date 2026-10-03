'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Item } from '@/lib/types';
import { cld } from '@/lib/utils';

type Brand = { name: string; logo: string | null; items: Item[] };

export default function BrandWall({ items }: { items: Item[] }) {
  const map = new Map<string, Brand>();
  for (const i of items) {
    if (!i.brand) continue;
    const k = i.brand.trim();
    const b = map.get(k) ?? { name: k, logo: null, items: [] };
    if (i.brand_logo && !b.logo) b.logo = i.brand_logo;
    b.items.push(i);
    map.set(k, b);
  }
  const brands = [...map.values()];
  const [open, setOpen] = useState<string | null>(null);
  if (!brands.length) return null;
  const sel = brands.find((b) => b.name === open);
  const camp = sel && (sel.items.find((i) => i.type === 'campaign') ?? sel.items[0]);

  return (
    <section className="sec alt" id="brands">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">Brands, boutiques &amp; businesses</div>
            <h2 className="h2">Brands I&apos;ve worked with</h2>
          </div>
        </div>
        <div className="logos">
          {brands.map((b) => (
            <button key={b.name} className="logo-cell" aria-pressed={open === b.name} onClick={() => setOpen(open === b.name ? null : b.name)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {b.logo ? <img src={cld(b.logo, 'image', 400)} alt={b.name} /> : <span>{b.name}</span>}
            </button>
          ))}
        </div>
        {sel && camp && (
          <div className="brandpop" aria-live="polite">
            <div className="kicker" style={{ marginBottom: 10 }}>{sel.name}</div>
            <dl>
              <dt>Campaign</dt><dd>{camp.title}</dd>
              {camp.role && (<><dt>Role</dt><dd>{camp.role}</dd></>)}
              {camp.deliverables && (<><dt>Deliverables</dt><dd>{camp.deliverables}</dd></>)}
              {sel.items.length > 1 && (<><dt>Projects</dt><dd>{sel.items.length}</dd></>)}
            </dl>
            <Link className="link" href={`/work/${camp.slug}`}>View campaign →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
