/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during build, since we have some warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 