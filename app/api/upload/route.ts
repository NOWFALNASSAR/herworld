import { NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';
import { presignUrl, r2Config } from '@/lib/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
  'image/svg+xml': 'svg', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm', 'application/pdf': 'pdf',
};

/** Gives the logged-in admin a short-lived link to upload one file straight to Cloudflare R2. */
export async function POST(req: Request) {
  const sb = await createAuthClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const cfg = r2Config();
  if (!cfg) return NextResponse.json({ error: 'Storage is not set up yet (R2 environment variables missing).' }, { status: 500 });

  const body = (await req.json().catch(() => null)) as { type?: string } | null;
  const type = body?.type ?? '';
  const ext = EXT[type];
  if (!ext) return NextResponse.json({ error: 'This file type is not allowed.' }, { status: 400 });

  const now = new Date();
  const folder = type.startsWith('video/') ? 'videos' : type === 'application/pdf' ? 'docs' : 'images';
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const key = `media/${folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${id}.${ext}`;

  const uploadUrl = presignUrl({
    host: cfg.host, path: `/${cfg.bucket}/${key}`, method: 'PUT',
    accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey, expires: 900,
  });
  return NextResponse.json({ uploadUrl, url: `${cfg.publicUrl}/${key}` });
}
