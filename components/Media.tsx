import type { MediaItem } from '@/lib/types';
import { cld, videoPoster } from '@/lib/utils';
import AutoVideo from './AutoVideo';

function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/** Soft branded tile shown when an item has no photo/video yet. */
export function Placeholder({ title }: { title: string }) {
  const h = hue(title || '·');
  const bg = `radial-gradient(80% 60% at ${20 + (h % 60)}% ${30 + (h % 40)}%, hsl(${338 + (h % 30)} 90% ${18 + (h % 14)}%), hsl(340 20% 6%))`;
  return (
    <div className="ph" style={{ background: bg }} aria-hidden="true">
      {(title || '·')[0]}
    </div>
  );
}

type Props = { m: MediaItem | null; title: string; auto?: boolean; controls?: boolean; width?: number; eager?: boolean };

export default function Media({ m, title, auto, controls, width = 1200, eager }: Props) {
  if (!m) return <Placeholder title={title} />;
  if (m.kind === 'video') {
    if (auto) return <AutoVideo src={cld(m.url, 'video')} poster={videoPoster(m.url)} />;
    return <video src={cld(m.url, 'video')} poster={videoPoster(m.url)} controls={controls} playsInline preload="metadata" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={cld(m.url, 'image', width)} alt={title} loading={eager ? 'eager' : 'lazy'} />;
}
