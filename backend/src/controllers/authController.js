const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const register = async (req, res) => {
  try {
    const { email, password, businessName, defaultCurrency } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await User.create({ email, password, businessName, defaultCurrency });
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    res.status(201).json({ token, user: { userId: user.user_id, email: user.email, businessName: user.business_name, defaultCurrency: user.default_currency } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await User.comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    res.json({ token, user: { userId: user.user_id, email: user.email, businessName: user.business_name, defaultCurrency: user.default_currency } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { userId: user.user_id, email: user.email, businessName: user.business_name, defaultCurrency: user.default_currency } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = { register, login, me };