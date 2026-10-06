const User = require('../models/User');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

/**
 * @desc    Get all registered users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user and associated records
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    // If guide, clean up their experiences, bookings on those experiences, and reviews
    if (user.role === 'guide') {
      const guideExperiences = await Experience.find({ guide: user._id }).select('_id');
      const expIds = guideExperiences.map((e) => e._id);

      await Booking.deleteMany({ experience: { $in: expIds } });
      await Review.deleteMany({ experience: { $in: expIds } });
      await Experience.deleteMany({ guide: user._id });
    }

    // Clean up bookings and reviews created by this user
    await Booking.deleteMany({ user: user._id });
    await Review.deleteMany({ user: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User '${user.name}' and all associated records have been removed`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  deleteUser
};
