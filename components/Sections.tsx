import Link from 'next/link';
import type { Item, Settings } from '@/lib/types';
import { cover, fmtDate, parseServices } from '@/lib/utils';
import Media from './Media';
import { ReelCard } from './ReelRail';

export function Services({ s }: { s: Settings }) {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">What I can do for your brand</div>
            <h2 className="h2">Services</h2>
          </div>
          <a className="btn pink" href="#contact">Collaborate with me →</a>
        </div>
        <div className="services">
          {parseServices(s.services).map((x) => (
            <div className="svc" key={x.title}><h3>{x.title}</h3><p>{x.text}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Trending({ items, instagram }: { items: Item[]; instagram?: string }) {
  if (!items.length) return null;
  return (
    <section className="sec trend" id="trending">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">Trending</div>
            <h2 className="h2">What everyone&apos;s watching</h2>
          </div>
          {instagram && <a className="link" href={instagram} target="_blank" rel="noopener">Follow the journey →</a>}
        </div>
        <div className="rail">{items.map((i) => <ReelCard key={i.id} i={i} />)}</div>
      </div>
    </section>
  );
}

export function PovList({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="sec" id="pov">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">Inside my mind</div>
            <h2 className="h2">My POV</h2>
          </div>
        </div>
        <div className="posts">
          {items.map((p) => (
            <Link className="post" key={p.id} href={`/pov/${p.slug}`}>
              <div className="thumb"><Media m={cover(p)} title={p.title} width={800} /></div>
              <div className="kicker">{fmtDate(p.published_at)}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BtsGallery({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="sec alt" id="bts">
      <div className="wrap">
        <div className="sechead">
          <div>
            <div className="kicker">Behind the scenes</div>
            <h2 className="h2">The part you don&apos;t see</h2>
          </div>
        </div>
        <div className="masonry">
          {items.flatMap((b) =>
            (b.media.length ? b.media : [null]).map((m, k) => (
              <Link className="m-item" key={b.id + k} href={`/work/${b.slug}`}>
                <Media m={m} title={b.title} auto width={700} />
                <span className="mcap">{b.title}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function NextChapter({ s, items }: { s: Settings; items: Item[] }) {
  return (
    <section className="sec chapter" id="chapter">
      <div className="wrap">
        <div className="kicker">Next chapter</div>
        <h2 className="big">{s.chapterA}<em>{s.chapterB}</em></h2>
        <p className="lede">{s.chapterText}</p>
        {items.length > 0 && (
          <div className="rail" style={{ marginTop: 36 }}>{items.map((i) => <ReelCard key={i.id} i={i} />)}</div>
        )}
      </div>
    </section>
  );
}

export function Footer({ s }: { s: Settings }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <span>© {new Date().getFullYear()} {s.name}</span>
        <span>{s.roles}</span>
      </div>
    </footer>
  );
}
