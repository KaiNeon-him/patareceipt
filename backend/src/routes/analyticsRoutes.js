const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Analytics = require('../controllers/analyticsController');

router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await Analytics.getStats(req.user.userId);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;