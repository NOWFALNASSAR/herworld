import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getItem, getSettings } from '@/lib/data';
import Nav from '@/components/Nav';
import CaseStudy from '@/components/CaseStudy';
import { Footer } from '@/components/Sections';

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const i = await getItem((await params).slug);
  if (!i) return {};
  const img = i.media.find((m) => m.kind === 'image');
  return { title: i.title, description: i.description ?? undefined, openGraph: { images: img ? [img.url] : [] } };
}

export default async function Page({ params }: P) {
  const [i, s] = await Promise.all([getItem((await params).slug), getSettings()]);
  if (!i) notFound();
  return (<><Nav name={s.name} /><main><CaseStudy i={i} /></main><Footer s={s} /></>);
}
