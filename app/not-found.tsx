import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream)] px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-[var(--accent)] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">
          Page not found
        </h1>
        <p className="text-[var(--ink)]/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="cta-primary px-6 py-3 text-white rounded-lg font-medium inline-block"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
