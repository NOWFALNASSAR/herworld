import type { Settings } from '@/lib/types';
import Media from './Media';

export default function About({ s }: { s: Settings }) {
  return (
    <section className="sec" id="about">
      <div className="wrap about">
        <div className="portrait"><Media m={s.portrait} title={s.name} width={900} /></div>
        <div>
          <div className="kicker">Who I am</div>
          <p className="statement">{s.statement}</p>
          <p className="lede">{s.bio}</p>
          <div className="stats">
            {s.stats.filter((x) => x.v).map((x) => (
              <div className="stat" key={x.l}><b>{x.v}</b><span>{x.l}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
