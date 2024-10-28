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
      }
    ]
  }
};

export default nextConfig;
