import Link from "next/link";
import { getSettings } from "@/lib/data";
import Logo from "./Logo";

export default async function Footer() {
  const s = await getSettings();

  return (
    <footer className="mt-24 border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-content gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-2">{s.payoff}.</p>
        </div>

        <div>
          <p className="kicker mb-3">Menu</p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li>
              <Link href="/catalogus" className="hover:text-brand">
                Catalogus
              </Link>
            </li>
            <li>
              <Link href="/offerte" className="hover:text-brand">
                Mijn offerte
              </Link>
            </li>
            <li>
              <Link href="/over" className="hover:text-brand">
                Over ons
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li>{s.adres}</li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:text-brand">
                {s.email}
              </a>
            </li>
            <li>{s.telefoon}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-content px-5 py-5 text-xs text-ink-2">
          <p>{s.footerTekst}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {s.bedrijfsnaam}
          </p>
        </div>
      </div>
    </footer>
  );
}
