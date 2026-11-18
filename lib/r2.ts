import { createHash, createHmac } from 'crypto';

/** RFC 3986 encoding used by AWS Signature V4. */
const enc = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const hmac = (key: Buffer | string, s: string) => createHmac('sha256', key).update(s, 'utf8').digest();

type PresignInput = {
  host: string;
  path: string; // "/bucket/key", unencoded
  method: 'GET' | 'PUT';
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  service?: string;
  expires?: number; // seconds
  date?: Date;
};

/** Builds a query-string-signed (presigned) S3 URL. Works with Cloudflare R2. */
export function presignUrl({
  host, path, method, accessKeyId, secretAccessKey, region = 'auto', service = 's3', expires = 900, date = new Date(),
}: PresignInput) {
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const day = amzDate.slice(0, 8);
  const scope = `${day}/${region}/${service}/aws4_request`;
  const canonicalUri = path.split('/').map(enc).join('/');
  const params: [string, string][] = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${accessKeyId}/${scope}`],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(expires)],
    ['X-Amz-SignedHeaders', 'host'],
  ];
  const query = params
    .map(([k, v]) => [enc(k), enc(v)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  const canonical = [method, canonicalUri, query, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonical)].join('\n');
  const kDate = hmac('AWS4' + secretAccessKey, day);
  const kSigning = hmac(hmac(hmac(kDate, region), service), 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(toSign, 'utf8').digest('hex');
  return `https://${host}${canonicalUri}?${query}&X-Amz-Signature=${signature}`;
}

export function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/+$/, '');
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { host: `${accountId}.r2.cloudflarestorage.com`, accessKeyId, secretAccessKey, bucket, publicUrl };
}
