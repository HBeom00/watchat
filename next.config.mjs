/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'image.tmdb.org',
      'img1.kakaocdn.net',
      't1.kakaocdn.net',
      'lh3.googleusercontent.com',
      'mdwnojdsfkldijvhtppn.supabase.co'
    ],
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
    ],
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;
