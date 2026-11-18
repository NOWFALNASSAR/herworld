'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Muted looping video that only downloads once it is close to the screen and only plays while visible
 * (saves visitors' data and keeps storage bandwidth low).
 */
export default function AutoVideo({ src, poster, eager }: { src: string; poster?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(!!eager);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: '300px 0px' });
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    near.observe(v);
    seen.observe(v);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [load, visible]);

  return (
    <video
      ref={ref}
      src={load ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={load ? 'auto' : 'none'}
    />
  );
}
