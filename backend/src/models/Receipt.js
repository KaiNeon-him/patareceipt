const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Receipt = {
  async create({ userId, clientName, clientPhone, items, termsAndNotes }) {
    const receiptId = 'PR-' + uuidv4().substring(0, 8).toUpperCase();
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const receiptResult = await client.query(
        `INSERT INTO receipts (receipt_id, user_id, client_name, client_phone, total_amount, terms_and_notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'SENT')
         RETURNING *`,
        [receiptId, userId, clientName, clientPhone, totalAmount, termsAndNotes || '']
      );

      for (const item of items) {
        await client.query(
          `INSERT INTO line_items (receipt_id, description, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [receiptId, item.description, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
      return { ...receiptResult.rows[0], items };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async listByUser(userId, { status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM receipts WHERE user_id = $1';
    const params = [userId];
    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(receiptId, userId) {
    const result = await db.query(
      'SELECT * FROM receipts WHERE receipt_id = $1 AND user_id = $2',
      [receiptId, userId]
    );
    return result.rows[0];
  },

  async getItems(receiptId) {
    const result = await db.query(
      'SELECT * FROM line_items WHERE receipt_id = $1 ORDER BY item_id',
      [receiptId]
    );
    return result.rows;
  },

  async markViewed(receiptId) {
    const result = await db.query(
      'UPDATE receipts SET status = $1 WHERE receipt_id = $2 RETURNING *',
      ['VIEWED', receiptId]
    );
    return result.rows[0];
  },
};

module.exports = Receipt;