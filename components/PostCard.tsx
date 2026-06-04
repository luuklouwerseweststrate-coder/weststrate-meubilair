import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";

// Datum in NL-notatie, bv. "12 mei 2026".
function datumNL(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-rule bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-paper-2" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="kicker">
          {post.thema} · {post.leestijd} min lezen
        </p>
        <h3 className="mt-2 text-lg leading-snug group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-2">
          {post.samenvatting}
        </p>
        <p className="mt-4 font-mono text-xs text-ink-2">{datumNL(post.datum)}</p>
      </div>
    </Link>
  );
}
