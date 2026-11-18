const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async create({ email, password, businessName, defaultCurrency = 'KES' }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, business_name, default_currency)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, email, business_name, default_currency, created_at`,
      [email, passwordHash, businessName, defaultCurrency]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById(userId) {
    const result = await db.query(
      'SELECT user_id, email, business_name, default_currency, created_at FROM users WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  async comparePassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  },
};

module.exports = User;