/** @type {import('next').NextConfig} */
const isGHPages = process.env.STATIC_EXPORT === 'true';
const repoName = process.env.REPO_NAME || '';

const nextConfig = {
  // Static export for GitHub Pages deployment (set STATIC_EXPORT=true in CI)
  ...(isGHPages && { output: 'export' }),
  // basePath + assetPrefix for GitHub Pages subpath (e.g. /repo-name)
  ...(isGHPages && repoName && { basePath: `/${repoName}` }),
  ...(isGHPages && repoName && { assetPrefix: `/${repoName}/` }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;