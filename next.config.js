const { execSync } = require('node:child_process');

const getVersion = () => {
  const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' });
  return `${(new Date()).toISOString().replace(/-/g, '').replace(/\..*/, '')
    .replace(/:/g, '')
    .replace('T', '.')}.${hash.trim()}`;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VERSION: getVersion(),
  },
  // We already run linting as a separate step
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: async () => [{
    source: '/',
    headers: [
      {
        key: 'Cross-Origin-Embedder-Policy',
        value: 'require-corp',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
    ],
  }],
};

module.exports = nextConfig;
