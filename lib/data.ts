import { createClient as createPlain } from '@supabase/supabase-js';
import { DEFAULT_SETTINGS } from './defaults';
import type { Item, Settings } from './types';

const configured = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const publicClient = () =>
  createPlain(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

export async function getSettings(): Promise<Settings> {
  if (!configured()) return DEFAULT_SETTINGS;
  const { data } = await publicClient().from('settings').select('data').eq('id', 1).maybeSingle();
  const saved = (data?.data ?? {}) as Partial<Settings>;
  const merged = { ...DEFAULT_SETTINGS, ...saved };
  if (!merged.stats?.length) merged.stats = DEFAULT_SETTINGS.stats;
  return merged;
}

export async function getItems(opts: { tag?: string } = {}): Promise<Item[]> {
  if (!configured()) return [];
  let q = publicClient()
    .from('content')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false });
  if (opts.tag) q = q.contains('tags', [opts.tag]);
  const { data, error } = await q;
  if (error) console.error(error.message);
  return (data ?? []) as Item[];
}

export async function getItem(slug: string): Promise<Item | null> {
  if (!configured()) return null;
  const { data } = await publicClient().from('content').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
  return (data as Item) ?? null;
}
