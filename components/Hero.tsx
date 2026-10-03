import { Fragment } from 'react';
import type { Settings } from '@/lib/types';
import { cld, videoPoster } from '@/lib/utils';

export default function Hero({ s, exploreHref = '#latest' }: { s: Settings; exploreHref?: string }) {
  const roles = s.roles.split('•').map((r) => r.trim()).filter(Boolean);
  return (
    <section className="hero" id="top">
      <div className="hero-media">
        {s.hero?.kind === 'video' ? (
          <video src={cld(s.hero.url, 'video')} poster={videoPoster(s.hero.url)} autoPlay muted loop playsInline />
        ) : s.hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cld(s.hero.url, 'image', 2000)} alt={s.name} />
        ) : (
          <div className="hero-glow" />
        )}
      </div>
      <nav className="side" aria-label="Social">
        {s.instagram && <a href={s.instagram} target="_blank" rel="noopener">Instagram</a>}
        {s.youtube && <a href={s.youtube} target="_blank" rel="noopener">YouTube</a>}
        <a href="#contact">Contact</a>
      </nav>
      <div className="wrap hero-inner reveal">
        <h1 className="name">{s.name}</h1>
        <div className="roles">
          {roles.map((r, i) => (
            <Fragment key={r}>
              {i > 0 && <span> • </span>}
              {r}
            </Fragment>
          ))}
        </div>
        <p className="tag">{s.tagline}</p>
        <div className="ctas">
          <a className="btn pink" href="#contact">Work with me →</a>
          <a className="btn" href={exploreHref}>Explore my world ↓</a>
        </div>
      </div>
    </section>
  );
}
