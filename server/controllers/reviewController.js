const mongoose = require('mongoose');
const Review = require('../models/Review');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');

/**
 * Helper to update avgRating and numReviews on Experience
 */
const recalculateExperienceRating = async (experienceId) => {
  const stats = await Review.aggregate([
    {
      $match: { experience: new mongoose.Types.ObjectId(experienceId) }
    },
    {
      $group: {
        _id: '$experience',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Experience.findByIdAndUpdate(experienceId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await Experience.findByIdAndUpdate(experienceId, {
      avgRating: 0,
      numReviews: 0
    });
  }
};

/**
 * @desc    Add review for an experience (only if user has a booking)
 * @route   POST /api/reviews
 * @access  Private (Tourist, Auth user)
 */
const addReview = async (req, res, next) => {
  try {
    const { experienceId, rating, comment } = req.body;

    if (!experienceId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide experience ID, rating (1-5), and a comment'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // Verify experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Guides cannot review their own experience
    if (experience.guide.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Guides cannot review their own experiences'
      });
    }

    // Verify user has booked this experience
    const booking = await Booking.findOne({
      user: req.user.id,
      experience: experienceId
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'You can only review experiences you have booked'
      });
    }

    // Check if user has already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      experience: experienceId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this experience'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      experience: experienceId,
      rating: numRating,
      comment: comment.trim()
    });

    // Recalculate average rating & review count for the experience
    await recalculateExperienceRating(experienceId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for an experience
 * @route   GET /api/reviews/:experienceId
 * @access  Public
 */
const getReviewsByExperience = async (req, res, next) => {
  try {
    const reviews = await Review.find({ experience: req.params.experienceId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getReviewsByExperience,
  recalculateExperienceRating
};
