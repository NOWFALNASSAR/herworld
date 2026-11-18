'use client';
/**
 * Shrinks photos and videos in the browser before they are uploaded, so the site stays fast
 * and storage/bandwidth stay small. If anything fails, the original file is used instead.
 */

const MEDIABUNNY = 'https://cdn.jsdelivr.net/npm/mediabunny@1/+esm';
const MAX_VIDEO_SIDE = 1280; // 720p for vertical reels (720×1280) and landscape (1280×720)
const VIDEO_BITRATE = 1_800_000;
const MAX_IMAGE_SIDE = 2000;

const canvasBlob = (c: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob | null>((res) => c.toBlob(res, type, q));

/** Resize to at most 2000px on the longest side and re-encode as WebP (or JPEG). */
export async function compressImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp|heic|heif|avif)$/.test(file.type) && !/\.(jpe?g|png|webp|heic)$/i.test(file.name)) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    let out = await canvasBlob(c, 'image/webp', 0.82);
    if (!out || out.type !== 'image/webp') {
      // Older Safari cannot make WebP. JPEG would lose transparency, so keep small PNGs as they are.
      if (file.type === 'image/png' && file.size < 1_500_000) return file;
      out = await canvasBlob(c, 'image/jpeg', 0.85);
    }
    return out && out.size < file.size ? out : file;
  } catch {
    return file;
  }
}

/** Re-encode a video to H.264 MP4, max 1280px on the longest side. */
export async function compressVideo(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  try {
    if (typeof VideoEncoder === 'undefined') return file;
    // Loaded from a CDN only inside the admin, so visitors never download it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mb: any = await import(/* webpackIgnore: true */ MEDIABUNNY as string);
    const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS });
    const track = await input.getPrimaryVideoTrack();
    if (!track) return file;
    const w = track.displayWidth as number;
    const h = track.displayHeight as number;
    const video: Record<string, unknown> = { codec: 'avc', bitrate: VIDEO_BITRATE };
    if (Math.max(w, h) > MAX_VIDEO_SIDE) {
      if (h >= w) video.height = MAX_VIDEO_SIDE;
      else video.width = MAX_VIDEO_SIDE;
    }
    const output = new mb.Output({ format: new mb.Mp4OutputFormat({ fastStart: 'in-memory' }), target: new mb.BufferTarget() });
    const conversion = await mb.Conversion.init({ input, output, video, audio: { codec: 'aac', bitrate: 96_000 } });
    if (!conversion.isValid) return file;
    if (onProgress) conversion.onProgress = (p: number) => onProgress(p);
    await conversion.execute();
    const buf = output.target.buffer as ArrayBuffer | null;
    if (!buf) return file;
    const out = new Blob([buf], { type: 'video/mp4' });
    return out.size < file.size ? out : file;
  } catch (e) {
    console.warn('Video compression skipped:', e);
    return file;
  }
}

/** Grab a still from ~0.5s into the video as a small JPEG cover. */
export function videoPosterFrom(blob: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const v = document.createElement('video');
    let done = false;
    const finish = (b: Blob | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      resolve(b);
    };
    const timer = setTimeout(() => finish(null), 15000);
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadeddata = () => {
      v.currentTime = Math.min(0.5, (v.duration || 1) / 2);
    };
    v.onseeked = async () => {
      const scale = Math.min(1, 720 / Math.max(v.videoWidth, v.videoHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(v.videoWidth * scale);
      c.height = Math.round(v.videoHeight * scale);
      c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height);
      clearTimeout(timer);
      finish(await canvasBlob(c, 'image/jpeg', 0.8));
    };
    v.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    v.src = url;
  });
}
