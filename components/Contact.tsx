'use client';
import { useRef, useState } from 'react';
import type { Settings } from '@/lib/types';

export default function Contact({ s }: { s: Settings }) {
  const form = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState('');
  const wa = s.whatsapp.replace(/\D/g, '');

  function send(via: 'wa' | 'mail') {
    const f = new FormData(form.current!);
    const name = String(f.get('name') || '').trim();
    if (!name) { setErr('Add your name so I know who is writing.'); return; }
    setErr('');
    const brand = String(f.get('brand') || '').trim();
    const text = `Hi ${s.name}, I'm ${name}${brand ? ' from ' + brand : ''}.\nCampaign type: ${f.get('type')}\nBudget: ${f.get('budget')}\n\n${f.get('msg') || ''}`;
    const url = via === 'wa'
      ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}`
      : `mailto:${s.email}?subject=${encodeURIComponent('Collaboration enquiry' + (brand ? ' — ' + brand : ''))}&body=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  }

  return (
    <section className="sec" id="contact">
      <div className="wrap contact">
        <div>
          <div className="kicker">Contact &amp; booking</div>
          <h2 className="h2">Let&apos;s create something.</h2>
          <p className="lede">Have a campaign, product or story you want to bring to life?</p>
          <div className="cbtns">
            {wa && <a className="btn pink" href={`https://wa.me/${wa}`} target="_blank" rel="noopener">WhatsApp</a>}
            {s.email && <a className="btn" href={`mailto:${s.email}`}>Email</a>}
            {s.instagram && <a className="btn" href={s.instagram} target="_blank" rel="noopener">Instagram</a>}
          </div>
          <div className="kit">
            <h3>Media kit</h3>
            <p className="lede" style={{ margin: '0 0 16px' }}>
              Audience, reach, engagement, past collaborations and rates in one PDF for your marketing team.
            </p>
            {s.mediakit ? (
              <a className="btn" href={s.mediakit} target="_blank" rel="noopener">Download media kit ↓</a>
            ) : (
              <p className="note">Media kit available on request.</p>
            )}
          </div>
        </div>
        <form ref={form} onSubmit={(e) => { e.preventDefault(); send(wa ? 'wa' : 'mail'); }} noValidate>
          <div className="row2">
            <label>Your name<input name="name" autoComplete="name" /></label>
            <label>Brand<input name="brand" /></label>
          </div>
          <div className="row2">
            <label>Campaign type
              <select name="type">
                <option>Brand campaign</option><option>Modeling / shoot</option><option>Reels &amp; social content</option>
                <option>Product promotion</option><option>Event / vlog coverage</option><option>UGC</option>
                <option>Acting / casting</option><option>Something else</option>
              </select>
            </label>
            <label>Budget range
              <select name="budget">
                <option>Let&apos;s discuss</option><option>Under ₹25,000</option><option>₹25,000 – ₹75,000</option>
                <option>₹75,000 – ₹2,00,000</option><option>₹2,00,000+</option>
              </select>
            </label>
          </div>
          <label>Message<textarea name="msg" placeholder="Tell me about the product, timeline and what you'd like to create." /></label>
          {err && <p className="msg" role="alert">{err}</p>}
          <div className="cbtns" style={{ margin: '4px 0 0' }}>
            {wa && <button className="btn pink" type="button" onClick={() => send('wa')}>Send on WhatsApp</button>}
            {s.email && <button className="btn" type="button" onClick={() => send('mail')}>Send by email</button>}
            {!wa && !s.email && <p className="note">Enquiries open soon.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
