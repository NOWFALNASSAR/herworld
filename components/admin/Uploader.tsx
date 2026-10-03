'use client';
import { CldUploadWidget } from 'next-cloudinary';
import type { MediaItem } from '@/lib/types';

type Props = {
  label: string;
  multiple?: boolean;
  accept?: 'image' | 'video' | 'any' | 'pdf';
  onUpload: (m: MediaItem) => void;
};

/** Opens Cloudinary's upload window (phone gallery, camera, or computer). */
export default function Uploader({ label, multiple, accept = 'any', onUpload }: Props) {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !preset)
    return <p className="note">Add your Cloudinary details to the environment variables to enable uploads.</p>;
  const resourceType = accept === 'video' ? 'video' : accept === 'image' || accept === 'pdf' ? 'image' : 'auto';
  const formats = accept === 'pdf' ? ['pdf'] : undefined;
  return (
    <CldUploadWidget
      uploadPreset={preset}
      options={{ multiple, sources: ['local', 'camera'], resourceType, clientAllowedFormats: formats, maxFileSize: 200_000_000 }}
      onSuccess={(r) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const info = r.info as any;
        if (!info || typeof info === 'string') return;
        onUpload({ url: info.secure_url, kind: info.resource_type === 'video' ? 'video' : 'image' });
      }}
    >
      {({ open }) => (
        <button type="button" className="btn sm" onClick={() => open()}>{label}</button>
      )}
    </CldUploadWidget>
  );
}
