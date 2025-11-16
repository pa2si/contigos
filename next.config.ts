import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use annotation mode so we can opt-in with the `'use memo'` directive
  // This keeps builds fast and lets us selectively annotate hooks/components.
  reactCompiler: {
    compilationMode: 'annotation',
  },

  // Security headers (additional to proxy.ts)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },

  // Server external packages for security
  serverExternalPackages: ['prisma'],
};

export default nextConfig;
