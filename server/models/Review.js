const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: [true, 'Review must be for an experience']
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Enforce one review per user per experience
reviewSchema.index({ user: 1, experience: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
