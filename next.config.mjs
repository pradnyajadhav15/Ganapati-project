/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/checkout": ["./public/fonts/**", "./public/images/logo.png"],
      "/admin/orders/*": ["./public/fonts/**", "./public/images/logo.png"],
    },
  },
};
export default nextConfig;
