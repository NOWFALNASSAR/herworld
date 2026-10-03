'use client';
import { useEffect, useRef } from 'react';

/** Muted looping video that only plays while on screen (saves phone data + battery). */
export default function AutoVideo({ src, poster, eager }: { src: string; poster?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload={eager ? 'auto' : 'metadata'} />;
}
