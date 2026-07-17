/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ── Odoo server images (base64 data URIs don't need this, but external Odoo CDN URLs do) ──
      // Add your Odoo server hostname here when you configure the live Odoo instance
      // { protocol: 'https', hostname: 'your-odoo-server.com' },

      // ── Placeholder / dev fallback ──
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },

      // ── Temporary: stock images during pre-launch (replace with real product photos) ──
      // TODO: Remove these once real Marda & Sons product photography is uploaded to Odoo
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },

      // ── Emergent agent static assets ──
      { protocol: 'https', hostname: 'static.prod-images.emergentagent.com' },
    ],
  },

  // Performance: enable SWC minification (default in Next.js 13+)
  swcMinify: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
