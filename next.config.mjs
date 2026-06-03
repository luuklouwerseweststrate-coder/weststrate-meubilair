/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Sanity afbeelding CDN
      { protocol: "https", hostname: "cdn.sanity.io" }
    ]
  }
};

export default nextConfig;
