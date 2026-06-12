import settings from "./settings";
import homepage from "./homepage";
import project from "./project";
import post from "./post";
import productOverride from "./productOverride";

// Producten zelf komen uit de Swan-data (data/*.json), niet uit Sanity.
// productOverride is de bijstuur-laag: offline halen + prijzen aanpassen.
export const schemaTypes = [settings, homepage, project, post, productOverride];
