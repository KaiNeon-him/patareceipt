require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  pdf: {
    watermark: 'Secured by PataReceipt',
    defaultCurrency: 'KES',
    currencySymbol: 'KSh',
  },
};