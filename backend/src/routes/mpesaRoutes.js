const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Mpesa = require('../services/mpesaService');

// Phase 3: M-Pesa payment endpoints (stubbed)
router.post('/mpesa/stk-push', authenticate, async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const result = await Mpesa.stkPush({
      phoneNumber,
      amount,
      accountReference: 'PATARECEIPT',
      transactionDesc: 'Subscription payment',
    });
    res.json(result);
  } catch (err) {
    res.status(501).json({ error: err.message });
  }
});

router.post('/mpesa/callback', async (req, res) => {
  // M-Pesa callback URL - Safaricom posts payment results here
  console.log('M-Pesa callback:', req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;