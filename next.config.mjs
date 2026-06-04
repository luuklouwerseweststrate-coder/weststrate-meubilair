/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Sanity afbeelding CDN
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Swan-snelleverprogramma productfoto's
      { protocol: "https", hostname: "v2.portal.swan-products.nl" },
      // Projectfoto's van weststrate.nl (/media/media_cached/...)
      { protocol: "https", hostname: "weststrate.nl" }
    ]
  }
};

export default nextConfig;
