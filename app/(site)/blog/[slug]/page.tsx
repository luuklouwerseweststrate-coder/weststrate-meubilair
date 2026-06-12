import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/data";
import { siteUrl, jsonLdScript } from "@/lib/seo";

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
  return {
    title: post.title,
    description: post.samenvatting,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.samenvatting,
      publishedTime: post.datum,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

// Artikel-structured-data (schema.org/BlogPosting).
function artikelJsonLd(post: Awaited<ReturnType<typeof getPost>>) {
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.samenvatting,
    datePublished: post.datum,
    image: post.image || undefined,
    articleSection: post.thema,
    inLanguage: "nl-NL",
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Weststrate" },
    publisher: { "@type": "Organization", name: "Weststrate" },
  };
}

// FAQ-structured-data (schema.org/FAQPage): hiermee kunnen de vragen en
// antwoorden rechtstreeks in zoekresultaten en AI-antwoorden verschijnen.
function faqJsonLd(post: Awaited<ReturnType<typeof getPost>>) {
  if (!post?.faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "nl-NL",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.vraag,
      acceptedAnswer: { "@type": "Answer", text: f.antwoord },
    })),
  };
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(artikelJsonLd(post))}
      />
      {post.faq && post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(post))}
        />
      )}
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
        {alineas.map((a, i) =>
          // Een blok dat met "## " begint is een tussenkop, geen alinea.
          a.startsWith("## ") ? (
            <h2 key={i} className="pt-4 text-2xl">
              {a.slice(3)}
            </h2>
          ) : (
            <p key={i}>{a}</p>
          )
        )}
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl">Veelgestelde vragen</h2>
          <dl className="mt-6 divide-y divide-rule rounded-2xl border border-rule bg-white">
            {post.faq.map((f) => (
              <div key={f.vraag} className="p-6">
                <dt className="font-semibold text-ink">{f.vraag}</dt>
                <dd className="mt-2 text-ink-2">{f.antwoord}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-12 rounded-2xl border border-rule bg-paper-2 p-8">
        <h2 className="text-xl">Hulp nodig bij je inrichting?</h2>
        <p className="mt-2 text-sm text-ink-2">
          Onze specialisten denken mee over de inrichting van jouw pand.
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
