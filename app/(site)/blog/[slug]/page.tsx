import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/data";

export const revalidate = 3600;

function datumNL(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Artikel niet gevonden" };
  return { title: post.title, description: post.samenvatting };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const alineas = post.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <nav className="mb-8 text-sm text-ink-2">
        <Link href="/blog" className="hover:text-brand">
          Inspiratie
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{post.thema}</span>
      </nav>

      <p className="kicker">
        {post.thema} · {post.leestijd} min lezen · {datumNL(post.datum)}
      </p>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-5 text-xl leading-relaxed text-ink-2">
        {post.samenvatting}
      </p>

      {post.image && (
        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink">
        {alineas.map((a, i) => (
          <p key={i}>{a}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-rule bg-paper-2 p-8">
        <h2 className="text-xl">Hulp nodig bij je inrichting?</h2>
        <p className="mt-2 text-sm text-ink-2">
          Onze specialisten denken mee over de werkplekken in jouw pand.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Neem contact op
        </Link>
      </div>
    </article>
  );
}
