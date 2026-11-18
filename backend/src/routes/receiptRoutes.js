const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { createReceipt, listReceipts, getReceipt, getReceiptPdf, markViewed } = require('../controllers/receiptController');

router.post('/', authenticate, validate(schemas.createReceipt), createReceipt);
router.get('/', authenticate, listReceipts);
router.get('/:id', authenticate, getReceipt);
router.get('/:id/pdf', authenticate, getReceiptPdf);
router.post('/:id/viewed', authenticate, markViewed);

module.exports = router;