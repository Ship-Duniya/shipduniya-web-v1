/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'storage.googleapis.com'], // Add the external domain her
  },
  output: 'export',
};

export default nextConfig;
