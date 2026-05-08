/** @type {import('next').NextConfig} */
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;

initOpenNextCloudflareForDev();
