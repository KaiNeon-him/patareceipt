const Verification = require('../services/verificationService');

const verifyReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const result = await Verification.verifyReceipt(receiptId);
    if (!result.valid) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

const qrData = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const data = await Verification.generateQrData(receiptId);
    if (!data) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR data' });
  }
};

module.exports = { verifyReceipt, qrData };