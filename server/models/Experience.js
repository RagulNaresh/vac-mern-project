const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an experience title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an experience description']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide a location (e.g. city, address)'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide price per person'],
      min: [0, 'Price cannot be negative']
    },
    duration: {
      type: String,
      required: [true, 'Please provide duration (e.g. 2 hours, Half-day)'],
      trim: true
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Please specify max group size'],
      min: [1, 'Max group size must be at least 1']
    },
    images: {
      type: [String],
      default: []
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Experience must belong to a guide']
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for search and filter performance
experienceSchema.index({ title: 'text', description: 'text', location: 'text' });
experienceSchema.index({ category: 1, price: 1, avgRating: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
