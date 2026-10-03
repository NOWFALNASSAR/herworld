import Link from 'next/link';
import type { Item } from '@/lib/types';
import { TYPES } from '@/lib/types';
import { fmtDate } from '@/lib/utils';
import Media from './Media';

export default function CaseStudy({ i }: { i: Item }) {
  const facts = [
    ['Type', TYPES[i.type]], ['Brand', i.brand], ['Role', i.role],
    ['Deliverables', i.deliverables], ['Date', fmtDate(i.published_at)],
  ].filter((f) => f[1]) as [string, string][];
  const block = (t: string, v: string | null) => (v ? (<><h4>{t}</h4><p>{v}</p></>) : null);
  return (
    <article className="wrap case">
      <Link className="link" href="/#work">← All work</Link>
      <div className="kicker" style={{ marginTop: 28 }}>{i.brand || TYPES[i.type]}</div>
      <h1>{i.title}</h1>
      {facts.length > 0 && (
        <div className="facts">
          {facts.map(([k, v]) => <div className="fact" key={k}><small>{k}</small>{v}</div>)}
        </div>
      )}
      <div className="prose">
        {i.description && <p>{i.description}</p>}
        {block('The concept', i.concept)}
        {block('What I created', i.created_what)}
        {block('Results', i.results)}
      </div>
      {i.media.length > 0 && (
        <div className="gallery">
          {i.media.map((m, k) => <Media key={k} m={m} title={i.title} controls width={1600} />)}
        </div>
      )}
      <div className="cbtns">
        {i.instagram_url && <a className="btn" href={i.instagram_url} target="_blank" rel="noopener">View on Instagram →</a>}
        <Link className="btn pink" href="/#contact">Work with me →</Link>
      </div>
    </article>
  );
}
