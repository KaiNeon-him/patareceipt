const express = require('express');
const router = express.Router();
const { verifyReceipt, qrData } = require('../controllers/verificationController');

router.get('/verify/:receiptId', verifyReceipt);
router.get('/verify/:receiptId/qr', qrData);

module.exports = router;