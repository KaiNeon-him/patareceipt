require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'patareceipt-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};