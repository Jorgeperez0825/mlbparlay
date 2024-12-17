/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.mlbstatic.com', 'statsapi.mlb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mlbstatic.com',
        pathname: '/team-logos/**',
      },
    ],
  },
}

module.exports = nextConfig 