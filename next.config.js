const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: '/sw.js',
  buildExcludes: [/middleware-manifest\.json$/],
  mode: 'production'
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/api/qr/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/qr/**',
      },
    ],
    dangerouslyAllowSVG: true, // Allow SVG images
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      }
    ];
  }
};

module.exports = withPWA(nextConfig);
