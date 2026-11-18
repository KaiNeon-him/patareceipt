const db = require('../config/database');

const Analytics = {
  async getStats(userId) {
    const totalResult = await db.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(total_amount), 0) as total_amount FROM receipts WHERE user_id = $1',
      [userId]
    );
    const viewedResult = await db.query(
      "SELECT COUNT(*) as viewed FROM receipts WHERE user_id = $1 AND status = 'VIEWED'",
      [userId]
    );
    const sentResult = await db.query(
      "SELECT COUNT(*) as sent FROM receipts WHERE user_id = $1 AND status = 'SENT'",
      [userId]
    );
    const recentResult = await db.query(
      'SELECT * FROM receipts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );
    return {
      totalReceipts: parseInt(totalResult.rows[0].total, 10),
      totalAmount: parseFloat(totalResult.rows[0].total_amount),
      viewedReceipts: parseInt(viewedResult.rows[0].viewed, 10),
      sentReceipts: parseInt(sentResult.rows[0].sent, 10),
      recentReceipts: recentResult.rows,
    };
  },
};

module.exports = Analytics;