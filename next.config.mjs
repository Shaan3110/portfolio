/** @type {import('next').NextConfig} */
const isGHPages = process.env.STATIC_EXPORT === 'true';
const customDomain = process.env.CUSTOM_DOMAIN === 'true';
const repoName = process.env.REPO_NAME || '';

// With a custom domain the site is served from / so no basePath needed.
// Only set basePath when deploying to github.io/<repo> without a custom domain.
const needsBasePath = isGHPages && repoName && !customDomain;

const nextConfig = {
  ...(isGHPages && { output: 'export' }),
  ...(needsBasePath && { basePath: `/${repoName}` }),
  ...(needsBasePath && { assetPrefix: `/${repoName}/` }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;