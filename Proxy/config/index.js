const env = process.env.NODE_ENV;
const production = require('./production');
const development = require('./development');

// You should put any global variables in here.
const config = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || '',
  SHOPIFY_SHARED_SECRET: process.env.SHOPIFY_SHARED_SECRET || '',
  APP_NAME: process.env.APP_NAME,
  APP_STORE_NAME: process.env.APP_STORE_NAME,
  APP_SCOPE: 'read_products,write_products,read_customers,write_customers',
  DATABASE_NAME: process.env.DATABASE_NAME,
};

if (env !== 'PRODUCTION') {
  module.exports = Object.assign({}, config, development);
} else {
  module.exports = Object.assign({}, config, production);
}
