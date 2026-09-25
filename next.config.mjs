/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'okshop.com.co'],
    unoptimized: true, // Allows smooth local asset delivery and offline/portable usage
  },
};

export default nextConfig;
