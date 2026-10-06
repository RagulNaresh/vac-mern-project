const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: [true, 'Booking must be for an experience']
    },
    date: {
      type: Date,
      required: [true, 'Please provide a booking date']
    },
    guests: {
      type: Number,
      required: [true, 'Please provide the number of guests'],
      min: [1, 'Number of guests must be at least 1']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required']
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
