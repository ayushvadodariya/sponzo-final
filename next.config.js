/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'www.influencer.in',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fdel45-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // "storage.googleapis.com",
      // "t4.ftcdn.net",
      // "www.influencer.in",
      // "utfs.io",
      // "instagram.fdel45-1.fna.fbcdn.net",
      // "yt3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
