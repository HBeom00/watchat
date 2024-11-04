import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const withSvgr = require('next-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mdwnojdsfkldijvhtppn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/profile_image/**'
      },
      {
        protocol: 'https',
        hostname: 'mdwnojdsfkldijvhtppn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/team_user_profile_image/**'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/original/**'
      }
    ]
  }
};

// SVG 지원 추가
export default withSvgr(nextConfig);
