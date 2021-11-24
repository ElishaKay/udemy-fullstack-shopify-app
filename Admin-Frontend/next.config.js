//https://www.leighhalliday.com/secrets-env-vars-nextjs-now
//const nextEnv = require('next-env');
//const dotenvLoad = require('dotenv-load');
//dotenvLoad();
//const withNextEnv = nextEnv();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withCSS = require('@zeit/next-css');

module.exports = withBundleAnalyzer(
  withCSS({
    publicRuntimeConfig: {
    APP_NAME: 'Shopify Tribe',
    API_DEVELOPMENT: 'http://localhost:8000/api',
    API_PRODUCTION: 'https://socialking.app/api',
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: 'http://localhost:3000',
    DOMAIN_PRODUCTION: 'https://socialking.app',
    FB_APP_ID: '305241670454834',
    DISQUS_SHORTNAME: 'ampitup-io',
    GOOGLE_CLIENT_ID:'299145764723-o5k1tr51r339gua3cja4o02r0l2g4lkb.apps.googleusercontent.com'
  },
  webpack(config, options) {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty'
      }
      return config
    },
    // WARNING: exposed client side
    env: {
      BASE_URL: process.env.BASE_URL,
      SHOPIFY_REDIRECT_URL: process.env.SHOPIFY_REDIRECT_URL,
      SNJS_DEBUG: process.env.SNJS_DEBUG
    }
  }));