/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
<<<<<<< HEAD
    domains: ['image.tmdb.org', 'mdwnojdsfkldijvhtppn.supabase.co'],
=======
    domains: ['image.tmdb.org', 'img1.kakaocdn.net', 't1.kakaocdn.net', 'lh3.googleusercontent.com'],
>>>>>>> 7381b1505c323d2418d269134e30e4ccca8a9017
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

export default nextConfig;
