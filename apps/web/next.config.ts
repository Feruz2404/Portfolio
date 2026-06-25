import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // FIX: removed hardcoded '192.168.20.244' – use env var if needed
  ...(process.env.ALLOWED_DEV_ORIGINS
    ? { allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS.split(",") }
    : {}),
  experimental: {
    typedRoutes: true,
  },
};

export default withNextIntl(nextConfig);
