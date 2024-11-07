/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "source.unsplash.com",
      "picsum.photos",
    ],
  },
};

export default nextConfig;
