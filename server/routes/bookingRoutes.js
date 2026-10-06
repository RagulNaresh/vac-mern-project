const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getGuideBookings
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/guide', protect, authorizeRoles('guide', 'admin'), getGuideBookings);

module.exports = router;
