/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── 1. DISABLE SOURCE MAPS IN PRODUCTION
  productionBrowserSourceMaps: false,

  // ── 2. SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://res.cloudinary.com https://nexus-workspace-backend.vercel.app http://localhost:4000 https://kiit-nexus-chatbot-final-2.onrender.com",
              "frame-src 'self' https://www.google.com/",
              "object-src 'none'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ]
  },

  // ── 3. IMAGE OPTIMISATION
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── 4. Strip console.* in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── 5. Bypass ESLint for Vercel Deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
