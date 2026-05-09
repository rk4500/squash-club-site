/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next/dev' : '.next',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
