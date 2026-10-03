import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap case">
      <h1>This page moved or was hidden.</h1>
      <Link className="btn pink" href="/">Back to the home page</Link>
    </main>
  );
}
