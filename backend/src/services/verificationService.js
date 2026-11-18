const crypto = require('crypto');
const Receipt = require('../models/Receipt');
const User = require('../models/User');

const Verification = {
  async generateHash(receiptId, totalAmount, clientName, createdAt) {
    const payload = `${receiptId}|${totalAmount}|${clientName}|${createdAt}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  },

  async verifyReceipt(receiptId) {
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      return { valid: false, error: 'Receipt not found' };
    }
    const user = await User.findById(receipt.user_id);
    if (!user) {
      return { valid: false, error: 'User not found' };
    }
    const items = await Receipt.getItems(receiptId);
    const hash = await this.generateHash(
      receipt.receipt_id,
      receipt.total_amount,
      receipt.client_name,
      receipt.created_at
    );
    return {
      valid: true,
      receiptId: receipt.receipt_id,
      clientName: receipt.client_name,
      totalAmount: receipt.total_amount,
      status: receipt.status,
      createdAt: receipt.created_at,
      businessName: user.business_name,
      currency: user.default_currency,
      items,
      hash,
      verifiedAt: new Date().toISOString(),
    };
  },

  async generateQrData(receiptId) {
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) return null;
    const verificationUrl = `${process.env.APP_URL || 'https://patareceipt.com'}/verify/${receiptId}`;
    return {
      receiptId: receipt.receipt_id,
      verificationUrl,
      qrPayload: JSON.stringify({
        receiptId: receipt.receipt_id,
        totalAmount: receipt.total_amount,
        clientName: receipt.client_name,
      }),
    };
  },
};

module.exports = Verification;