import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Images and DAM assets are served from *.optimizely.com domains
    remotePatterns: [{ protocol: 'https', hostname: '**.optimizely.com', pathname: '/**' }],
  },
  async headers() {
    // Allow the CMS to embed the /preview route in its editing iframe.
    const cms = process.env.OPTIMIZELY_CMS_URL ?? '';
    return [
      {
        source: '/preview',
        headers: [
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${cms}`.trim() },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
