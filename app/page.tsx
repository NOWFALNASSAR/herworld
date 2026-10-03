import { getItems, getSettings } from '@/lib/data';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ReelRail from '@/components/ReelRail';
import About from '@/components/About';
import WorkGrid from '@/components/WorkGrid';
import BrandWall from '@/components/BrandWall';
import { BtsGallery, Footer, NextChapter, PovList, Services, Trending } from '@/components/Sections';
import Contact from '@/components/Contact';
import StickyCta from '@/components/StickyCta';

export const revalidate = 60;

export default async function Home() {
  const [s, items] = await Promise.all([getSettings(), getItems()]);
  const reels = items.filter((i) => ['reel', 'video', 'vlog'].includes(i.type)).slice(0, 9);
  return (
    <>
      <Nav name={s.name} />
      <main>
        <Hero s={s} exploreHref={reels.length ? '#latest' : '#work'} />
        <ReelRail items={reels} instagram={s.instagram} />
        <About s={s} />
        <WorkGrid items={items} />
        <BrandWall items={items} />
        <Services s={s} />
        <Trending items={items.filter((i) => i.trending).slice(0, 8)} instagram={s.instagram} />
        <PovList items={items.filter((i) => i.type === 'pov').slice(0, 3)} />
        <BtsGallery items={items.filter((i) => i.type === 'bts')} />
        <NextChapter s={s} items={items.filter((i) => i.type === 'acting')} />
        <Contact s={s} />
      </main>
      <Footer s={s} />
      <StickyCta />
    </>
  );
}
