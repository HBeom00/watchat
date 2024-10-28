/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
<<<<<<< HEAD
    domains: ['image.tmdb.org'],
=======
>>>>>>> 4a601dd7eb9ea673d287f1887391a9a93575dc8b
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mdwnojdsfkldijvhtppn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/profile_image/**'
<<<<<<< HEAD
=======
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
>>>>>>> 4a601dd7eb9ea673d287f1887391a9a93575dc8b
      }
    ]
  }
};

export default nextConfig;
