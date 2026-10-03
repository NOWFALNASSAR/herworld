import type { MetadataRoute } from 'next';
import { getItems } from '@/lib/data';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems();
  const base = siteUrl();
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...items.map((i) => ({
      url: `${base}/${i.type === 'pov' ? 'pov' : 'work'}/${i.slug}`,
      lastModified: i.published_at,
      priority: 0.7,
    })),
  ];
}
