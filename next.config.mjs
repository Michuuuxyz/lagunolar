/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.discordapp.com', 'i.imgur.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
    NEXT_PUBLIC_BOT_INVITE: process.env.NEXT_PUBLIC_BOT_INVITE,
  },
  // Permitir Pages Router junto com App Router
  experimental: {
    allowMiddlewareResponseBody: true,
  },
}

export default nextConfig
