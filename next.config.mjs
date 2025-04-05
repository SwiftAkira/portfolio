/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during build, since we have some warnings
    ignoreDuringBuilds: true,
  },

  // Add redirects configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        permanent: true, // Use true for permanent redirect (308 status code)
      },
    ]
  },
};

export default nextConfig; 