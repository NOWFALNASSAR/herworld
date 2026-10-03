import type { Metadata } from 'next';
import { getItems, getSettings } from '@/lib/data';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ReelRail from '@/components/ReelRail';
import WorkGrid from '@/components/WorkGrid';
import BrandWall from '@/components/BrandWall';
import { Footer, Services } from '@/components/Sections';
import Contact from '@/components/Contact';
import StickyCta from '@/components/StickyCta';

export const revalidate = 60;
export const metadata: Metadata = { robots: { index: false, follow: false } };
type P = { params: Promise<{ tag: string }> };

/** Private, curated portfolio: /client/fashion, /client/beauty ... */
export default async function ClientView({ params }: P) {
  const tag = decodeURIComponent((await params).tag).toLowerCase();
  const [s, items] = await Promise.all([getSettings(), getItems({ tag })]);
  const reels = items.filter((i) => ['reel', 'video', 'vlog'].includes(i.type)).slice(0, 9);
  return (
    <>
      <div className="clientbar">A curated selection of my {tag} work</div>
      <Nav name={s.name} />
      <main>
        <Hero s={s} exploreHref={reels.length ? '#latest' : '#work'} />
        <ReelRail items={reels} instagram={s.instagram} />
        <WorkGrid items={items} />
        <BrandWall items={items} />
        <Services s={s} />
        <Contact s={s} />
      </main>
      <Footer s={s} />
      <StickyCta />
    </>
  );
}
