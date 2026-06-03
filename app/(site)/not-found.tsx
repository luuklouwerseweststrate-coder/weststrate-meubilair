import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-5 py-24 text-center">
      <p className="kicker mb-3">404</p>
      <h1 className="text-3xl">Deze pagina bestaat niet</h1>
      <p className="mt-4 text-ink-2">
        Misschien is de pagina verplaatst of verwijderd.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        Terug naar home
      </Link>
    </div>
  );
}
