import { OfferteProvider } from "@/lib/offerte";
import { getCategorieStructuur } from "@/lib/data";
import { ordenNav } from "@/lib/categorieen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Categorie-structuur server-side afleiden uit de Swan-catalogus en als lichte
  // navigatie-data doorgeven aan de Header (de zware JSON blijft op de server).
  const structuur = await getCategorieStructuur();
  const categorieen = ordenNav(structuur);

  return (
    <OfferteProvider>
      <Header categorieen={categorieen} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </OfferteProvider>
  );
}
