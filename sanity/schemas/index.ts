import settings from "./settings";
import project from "./project";
import post from "./post";
import productOverride from "./productOverride";

// Producten zelf komen uit de Swan-data (data/*.json), niet uit Sanity.
// productOverride is de bijstuur-laag: offline halen + prijzen aanpassen.
export const schemaTypes = [settings, project, post, productOverride];
