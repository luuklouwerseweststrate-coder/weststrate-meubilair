import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import OfferteClient from "./OfferteClient";

export const metadata: Metadata = {
  title: "Mijn offerte",
  description: "Bekijk je samengestelde offerte en vraag hem aan.",
};

export default async function OffertePage() {
  const settings = await getSettings();
  return <OfferteClient ontvangerEmail={settings.email} />;
}
