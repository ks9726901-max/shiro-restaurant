const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  approveReservation,
  cancelReservation,
  rejectReservation,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createReservation);
router.get('/', protect, getReservations);
router.put('/:id/approve', protect, approveReservation);
router.put('/:id/cancel', protect, cancelReservation);
router.put('/:id/reject', protect, rejectReservation);
router.delete('/:id', protect, deleteReservation);

module.exports = router;
