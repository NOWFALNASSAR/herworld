export type ContentType = 'campaign' | 'photo' | 'reel' | 'video' | 'vlog' | 'pov' | 'bts' | 'acting';
export type MediaItem = { url: string; kind: 'image' | 'video' };
export type Item = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  brand: string | null;
  brand_logo: string | null;
  tags: string[];
  description: string | null;
  role: string | null;
  deliverables: string | null;
  concept: string | null;
  created_what: string | null;
  results: string | null;
  media: MediaItem[];
  instagram_url: string | null;
  trending: boolean;
  status: 'published' | 'hidden';
  published_at: string;
};
export type Stat = { v: string; l: string };
export type Settings = {
  name: string;
  roles: string;
  tagline: string;
  statement: string;
  bio: string;
  stats: Stat[];
  services: string;
  chapterA: string;
  chapterB: string;
  chapterText: string;
  whatsapp: string;
  email: string;
  instagram: string;
  youtube: string;
  hero: MediaItem | null;
  portrait: MediaItem | null;
  mediakit: string;
};

export const TYPES: Record<ContentType, string> = {
  campaign: 'Brand collab',
  photo: 'Photo shoot',
  reel: 'Reel',
  video: 'Video',
  vlog: 'Vlog',
  pov: 'My POV post',
  bts: 'Behind the scenes',
  acting: 'Acting',
};
export const TAGS = ['fashion', 'beauty', 'jewellery', 'lifestyle', 'product', 'travel', 'saree', 'western'];
