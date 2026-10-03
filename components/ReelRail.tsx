import Link from 'next/link';
import type { Item } from '@/lib/types';
import { TYPES } from '@/lib/types';
import { cover } from '@/lib/utils';
import Media from './Media';

export function ReelCard({ i }: { i: Item }) {
  const hasVideo = i.media.some((m) => m.kind === 'video');
  return (
    <Link className="reel" href={`/work/${i.slug}`}>
      <Media m={cover(i, true)} title={i.title} auto width={600} />
      {hasVideo && <span className="play" aria-hidden="true" />}
      <span className="cap">
        <small>{TYPES[i.type]}{i.brand ? ` / ${i.brand}` : ''}</small>
        <b>{i.title}</b>
      </span>
    </Link>
  );
}

export default function ReelRail({ items, instagram }: { items: Item[]; instagram?: string }) {
  if (!items.length) return null;
  return (
    <section className="sec" id="latest">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">Latest from me</div>
            <h2 className="h2">On camera</h2>
          </div>
          {instagram && <a className="link" href={instagram} target="_blank" rel="noopener">Follow my journey →</a>}
        </div>
        <div className="rail">{items.map((i) => <ReelCard key={i.id} i={i} />)}</div>
      </div>
    </section>
  );
}
