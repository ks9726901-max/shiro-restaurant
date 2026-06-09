const express = require('express');
const router = express.Router();
const {
  getSummary,
  getTrends,
  getTimeSlots,
  getMenuSplit,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getSummary);
router.get('/trends', protect, getTrends);
router.get('/time-slots', protect, getTimeSlots);
router.get('/menu-split', protect, getMenuSplit);

module.exports = router;
