import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Inspiratie",
  description:
    "Artikelen over het inrichten van ruimtes: ergonomie, akoestiek en slim inrichten.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-content px-5 py-16">
      <header className="max-w-2xl">
        <p className="kicker mb-3">Inspiratie</p>
        <h1 className="text-4xl md:text-5xl">Kennis over inrichten</h1>
        <p className="mt-4 text-lg text-ink-2">
          Praktische artikelen over ergonomie, akoestiek en het inrichten van
          ruimtes. Geschreven vanuit wat we dagelijks tegenkomen.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
