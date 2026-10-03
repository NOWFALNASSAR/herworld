'use client';
import { useEffect, useState } from 'react';

export default function StickyCta() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => {
      const c = document.getElementById('contact');
      const nearContact = c ? c.getBoundingClientRect().top < window.innerHeight : false;
      setOn(window.scrollY > window.innerHeight * 0.8 && !nearContact);
    };
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <div className={`sticky${on ? ' on' : ''}`}>
      <a className="btn pink" href="#contact">Work with me →</a>
    </div>
  );
}
