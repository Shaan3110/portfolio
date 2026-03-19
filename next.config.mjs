/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages deployment (set STATIC_EXPORT=true in CI)
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
