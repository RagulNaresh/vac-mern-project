const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

/**
 * @desc    Create a new booking (calculate totalPrice server-side, validate guests and date)
 * @route   POST /api/bookings
 * @access  Private (Tourist, Auth user)
 */
const createBooking = async (req, res, next) => {
  try {
    const { experienceId, date, guests } = req.body;

    if (!experienceId || !date || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide experience ID, booking date, and number of guests'
      });
    }

    const numGuests = Number(guests);
    if (isNaN(numGuests) || numGuests < 1) {
      return res.status(400).json({
        success: false,
        message: 'Guests count must be at least 1'
      });
    }

    // Verify date is in the future
    const bookingDate = new Date(date);
    const today = new Date();
    // Reset hours to start of day for comparison
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime()) || bookingDate <= today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be a valid future date'
      });
    }

    // Find experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Validate group size
    if (numGuests > experience.maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed group size for this experience is ${experience.maxGroupSize}`
      });
    }

    // Calculate total price on server (never trust client)
    const totalPrice = experience.price * numGuests;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      experience: experience._id,
      date: bookingDate,
      guests: numGuests,
      totalPrice,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('experience')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully (Pay at venue)',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'experience',
        populate: { path: 'guide', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel own booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify ownership or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const populated = await Booking.findById(booking._id).populate('experience');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bookings for experiences owned by the logged-in guide
 * @route   GET /api/bookings/guide
 * @access  Private (Guide, Admin)
 */
const getGuideBookings = async (req, res, next) => {
  try {
    // Find all experiences belonging to this guide
    const myExperiences = await Experience.find({ guide: req.user.id }).select('_id');
    const experienceIds = myExperiences.map((exp) => exp._id);

    const bookings = await Booking.find({ experience: { $in: experienceIds } })
      .populate('experience', 'title location price duration')
      .populate('user', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getGuideBookings
};
