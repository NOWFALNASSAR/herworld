'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Nav({ name }: { name: string }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav${solid ? ' solid' : ''}`}>
      <div className="wrap">
        <Link className="logo" href="/">{name}</Link>
        <nav className="navlinks" aria-label="Sections">
          <a href="/#work">Work</a>
          <a href="/#brands">Brands</a>
          <a href="/#services">Services</a>
          <a href="/#pov">My POV</a>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
