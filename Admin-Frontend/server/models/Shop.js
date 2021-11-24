const mongoose = require('mongoose');

const Shop = mongoose.Schema({
	  shopId: Number,
	  shopify_domain: String,
	  name: String,
	  domain: String,
	  supportEmail: String,
	  nonce: String,
	  accessToken: String,
	  isActive: { type: Boolean, default: false },
	  // tribe-squared fields
	  shopUrl: String,
	  shopifyToken: String,
	  shopifyScope: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', Shop);
