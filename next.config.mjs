/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
      }
    ]
  }
};

export default nextConfig;
