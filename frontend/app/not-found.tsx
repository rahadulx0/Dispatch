import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-news py-24 text-center">
      <span className="kicker">404</span>
      <h1 className="mt-4 font-serif text-6xl font-black tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-4 font-serif text-lg text-ink-500">
        The story you are looking for may have been moved or no longer exists.
      </p>
      <div className="mt-8">
        <Link href="/" className="btn-primary">
          Return to home
        </Link>
      </div>
    </section>
  );
}
