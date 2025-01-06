/** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      images: {
        domains: ['your-supabase-url.supabase.co'],
      },
      webpack: (config) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@': __dirname,
        }
        return config
      }
    }

    module.exports = nextConfig
