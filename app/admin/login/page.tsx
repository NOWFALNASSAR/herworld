'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(f.get('email')),
      password: String(f.get('password')),
    });
    setBusy(false);
    if (error) return setErr('Email or password is wrong. Try again.');
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div style={{ maxWidth: 420, margin: '10vh auto 0' }}>
      <h1 className="h2">Sign in</h1>
      <form onSubmit={onSubmit}>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        {err && <p className="msg" role="alert">{err}</p>}
        <button className="btn pink" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
