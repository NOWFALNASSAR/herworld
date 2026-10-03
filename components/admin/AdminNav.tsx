'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const tab = (href: string, label: string) => (
    <Link className={`tab${path === href ? ' on' : ''}`} href={href}>{label}</Link>
  );
  return (
    <>
      <div className="admin-top">
        <h1 className="h2" style={{ margin: 0 }}>Your dashboard</h1>
        <div className="acts">
          <a className="btn sm" href="/" target="_blank">View site</a>
          <button className="btn sm" onClick={async () => { await createClient().auth.signOut(); router.replace('/admin/login'); }}>Sign out</button>
        </div>
      </div>
      <div className="tabs">
        {tab('/admin', 'Content')}
        {tab('/admin/settings', 'Site settings')}
        {tab('/admin/clients', 'Client links')}
      </div>
    </>
  );
}
