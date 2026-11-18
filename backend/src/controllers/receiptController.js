const Receipt = require('../models/Receipt');
const pdfService = require('../services/pdfService');

const createReceipt = async (req, res) => {
  try {
    const { clientName, clientPhone, items, termsAndNotes } = req.body;
    const receipt = await Receipt.create({
      userId: req.user.userId,
      clientName,
      clientPhone,
      items,
      termsAndNotes,
    });
    res.status(201).json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create receipt' });
  }
};

const listReceipts = async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    const receipts = await Receipt.listByUser(req.user.userId, {
      status,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    const enriched = await Promise.all(receipts.map(async (r) => {
      const items = await Receipt.getItems(r.receipt_id);
      return { ...r, items };
    }));
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list receipts' });
  }
};

const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id, req.user.userId);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    const items = await Receipt.getItems(receipt.receipt_id);
    res.json({ ...receipt, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
};

const getReceiptPdf = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id, req.user.userId);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    const items = await Receipt.getItems(receipt.receipt_id);
    const pdfBuffer = await pdfService.generateReceiptPdf({ ...receipt, items });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${receipt.receipt_id}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

const markViewed = async (req, res) => {
  try {
    const receipt = await Receipt.markViewed(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark receipt as viewed' });
  }
};

module.exports = { createReceipt, listReceipts, getReceipt, getReceiptPdf, markViewed };