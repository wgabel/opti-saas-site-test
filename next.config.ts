import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Images and DAM assets are served from *.optimizely.com domains
    remotePatterns: [{ protocol: 'https', hostname: '**.optimizely.com', pathname: '/**' }],
  },
  async headers() {
    // Allow the CMS to embed the /preview route in its editing iframe.
    // Only the origin is used (paths/trailing slashes in the env var are ignored);
    // *.optimizely.com covers the CMS UI if it runs on a sibling host.
    let cms = '';
    try {
      cms = process.env.OPTIMIZELY_CMS_URL ? new URL(process.env.OPTIMIZELY_CMS_URL).origin : '';
    } catch {}
    return [
      {
        source: '/preview',
        headers: [
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${cms} https://*.optimizely.com`.replace(/\s+/g, ' ') },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
