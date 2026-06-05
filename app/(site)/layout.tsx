import { OfferteProvider } from "@/lib/offerte";
import { getCategorieStructuur, getZoekIndex } from "@/lib/data";
import { ordenNav } from "@/lib/categorieen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Categorie-structuur en zoekindex server-side afleiden en als lichte data aan
  // de Header doorgeven (de zware catalogus-JSON blijft op de server).
  const [structuur, zoekIndex] = await Promise.all([
    getCategorieStructuur(),
    getZoekIndex(),
  ]);
  const categorieen = ordenNav(structuur);

  return (
    <OfferteProvider>
      <Header categorieen={categorieen} zoekIndex={zoekIndex} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </OfferteProvider>
  );
}
