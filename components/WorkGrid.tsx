'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Item } from '@/lib/types';
import { TYPES } from '@/lib/types';
import { cover, isWork } from '@/lib/utils';
import Media from './Media';

const TABS: [string, string][] = [
  ['all', 'All work'], ['brand', 'Brand collaborations'], ['fashion', 'Fashion & modeling'],
  ['reels', 'Reels & social'], ['vlogs', 'Vlogs'], ['self', 'Self created'],
];
const FASHION = ['fashion', 'saree', 'western', 'jewellery', 'beauty'];

function match(i: Item, tab: string) {
  if (!isWork(i)) return false;
  switch (tab) {
    case 'brand': return !!i.brand;
    case 'fashion': return i.type === 'photo' || i.tags.some((t) => FASHION.includes(t));
    case 'reels': return i.type === 'reel' || i.type === 'video';
    case 'vlogs': return i.type === 'vlog';
    case 'self': return !i.brand;
    default: return true;
  }
}

export default function WorkGrid({ items }: { items: Item[] }) {
  const [tab, setTab] = useState('all');
  const list = items.filter((i) => match(i, tab));
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">My work</div>
            <h2 className="h2">Campaigns, shoots <i>&amp;</i> stories</h2>
          </div>
        </div>
        <div className="tabs" role="group" aria-label="Filter work">
          {TABS.map(([k, l]) => (
            <button key={k} className="tab" aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        {list.length ? (
          <div className="grid">
            {list.map((i) => (
              <Link className="card" key={i.id} href={`/work/${i.slug}`}>
                <div className="media"><Media m={cover(i, i.type !== 'photo')} title={i.title} auto /></div>
                <div className="info">
                  <div className="meta">{i.brand || 'Self created'} / {TYPES[i.type]}</div>
                  <h3>{i.title}</h3>
                  <span className="cta">{i.type === 'campaign' ? 'Watch case study →' : 'View →'}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">Nothing in this category yet.</div>
        )}
      </div>
    </section>
  );
}
