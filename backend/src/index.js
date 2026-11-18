require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const appConfig = require('./config/app');

const authRoutes = require('./routes/authRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigin }));
app.use(express.json());
app.use(rateLimit(appConfig.rateLimit));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'patareceipt-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api', verificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mpesa', mpesaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = appConfig.port;
app.listen(PORT, () => {
  console.log(`PataReceipt backend running on port ${PORT}`);
});

module.exports = app;