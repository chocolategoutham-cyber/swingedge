/** @type {import('next').NextConfig} */
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

initOpenNextCloudflareForDev();
