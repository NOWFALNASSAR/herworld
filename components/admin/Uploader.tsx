'use client';
import { useRef, useState } from 'react';
import type { MediaItem } from '@/lib/types';
import { compressImage, compressVideo, videoPosterFrom } from '@/lib/compress';

type Props = {
  label: string;
  multiple?: boolean;
  accept?: 'image' | 'video' | 'any' | 'pdf';
  onUpload: (m: MediaItem) => void;
};

const ACCEPT = { image: 'image/*', video: 'video/*', any: 'image/*,video/*', pdf: 'application/pdf' };
const MAX_BYTES = 150_000_000;

async function put(blob: Blob, type: string): Promise<string> {
  const r = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Could not start the upload.');
  const up = await fetch(j.uploadUrl, { method: 'PUT', body: blob, headers: { 'Content-Type': type } });
  if (!up.ok) throw new Error(`Upload failed (${up.status}). Check the R2 CORS setting.`);
  return j.url as string;
}

const mb = (n: number) => (n / 1_000_000).toFixed(1) + ' MB';

/** Picks photos/videos from the phone or computer, shrinks them, and uploads to Cloudflare R2. */
export default function Uploader({ label, multiple, accept = 'any', onUpload }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const list = [...files];
    try {
      for (const [n, f] of list.entries()) {
        const tag = list.length > 1 ? `(${n + 1}/${list.length}) ` : '';
        const isVideo = f.type.startsWith('video/') || /\.(mov|mp4|m4v|webm)$/i.test(f.name);
        const isPdf = f.type === 'application/pdf';
        if (isPdf) {
          setStatus(`${tag}Uploading PDF…`);
          onUpload({ url: await put(f, 'application/pdf'), kind: 'image' });
          continue;
        }
        if (isVideo) {
          setStatus(`${tag}Making the video smaller…`);
          const small = await compressVideo(f, (p) => setStatus(`${tag}Making the video smaller… ${Math.round(p * 100)}%`));
          if (small.size > MAX_BYTES) throw new Error(`"${f.name}" is too big (${mb(small.size)}). Trim it and try again.`);
          const type = small === f ? f.type || 'video/mp4' : 'video/mp4';
          setStatus(`${tag}Uploading video (${mb(small.size)})…`);
          const url = await put(small, type);
          const frame = await videoPosterFrom(small);
          const poster = frame ? await put(frame, 'image/jpeg').catch(() => undefined) : undefined;
          onUpload({ url, kind: 'video', poster });
          continue;
        }
        setStatus(`${tag}Making the photo smaller…`);
        const small = await compressImage(f);
        setStatus(`${tag}Uploading photo (${mb(small.size)})…`);
        onUpload({ url: await put(small, small.type || f.type || 'image/jpeg'), kind: 'image' });
      }
      setStatus('Uploaded ✓');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <div className="uploader">
      <input ref={ref} type="file" hidden accept={ACCEPT[accept]} multiple={multiple} onChange={(e) => handle(e.target.files)} />
      <button type="button" className="btn sm" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? 'Working…' : label}
      </button>
      {status && <p className="note" role="status">{status}</p>}
    </div>
  );
}
