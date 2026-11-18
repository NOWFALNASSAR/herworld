import type { Item, MediaItem } from './types';

/** Old files on the disabled Cloudinary account no longer load; treat them as missing. */
export const isOldCloudinary = (url?: string | null) => !!url && url.includes('res.cloudinary.com');

/** Cover image for a video: the saved poster, or (for old Cloudinary files) a generated frame. */
export const posterOf = (m: MediaItem) => m.poster || videoPoster(m.url);

/** Adds Cloudinary auto-format/quality/size to an upload URL. Other URLs are returned as-is. */
export function cld(url: string, kind: 'image' | 'video' = 'image', width = 1400) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const t = kind === 'video' ? 'q_auto,vc_auto' : `f_auto,q_auto,c_limit,w_${width}`;
  return url.replace('/upload/', `/upload/${t}/`);
}
export function videoPoster(url: string) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) return undefined;
  return url.replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_900/').replace(/\.\w+$/, '.jpg');
}
export const cover = (i: Item, preferVideo = false): MediaItem | null =>
  (preferVideo && i.media.find((m) => m.kind === 'video')) || i.media[0] || null;

export function slugify(s: string) {
  return (
    s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 60) +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}
export function fmtDate(d?: string | null) {
  if (!d) return '';
  const x = new Date(d + 'T00:00:00');
  return isNaN(+x) ? '' : x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
export const isWork = (i: Item) => ['campaign', 'photo', 'reel', 'video', 'vlog'].includes(i.type);
export function parseServices(s: string) {
  return s
    .split('\n')
    .map((l) => l.split('|'))
    .filter((p) => p[0].trim())
    .map((p) => ({ title: p[0].trim(), text: (p[1] || '').trim() }));
}
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
