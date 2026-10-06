const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get all experiences with search, filter, and sorting
 * @route   GET /api/experiences
 * @access  Public
 */
const getExperiences = async (req, res, next) => {
  try {
    const { keyword, category, location, minPrice, maxPrice, sort, guide } = req.query;

    const query = {};

    // Filter by specific guide (e.g., in Guide Dashboard)
    if (guide) {
      query.guide = guide;
    }

    // Keyword search across title, description, and location
    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { location: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category.trim();
    }

    // Location filter
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { avgRating: -1, numReviews: -1 };
    }

    const experiences = await Experience.find(query)
      .populate('guide', 'name email role')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      count: experiences.length,
      experiences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single experience by ID
 * @route   GET /api/experiences/:id
 * @access  Public
 */
const getExperienceById = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('guide', 'name email role');

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.status(200).json({
      success: true,
      experience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new experience
 * @route   POST /api/experiences
 * @access  Private (Guide, Admin)
 */
const createExperience = async (req, res, next) => {
  try {
    const { title, description, category, location, price, duration, maxGroupSize } = req.body;

    if (!title || !description || !category || !location || !price || !duration || !maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Process uploaded images via Multer
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      // Support pre-populated or array of image URLs
      if (Array.isArray(req.body.images)) {
        imagePaths = req.body.images;
      } else if (typeof req.body.images === 'string') {
        try {
          const parsed = JSON.parse(req.body.images);
          imagePaths = Array.isArray(parsed) ? parsed : [req.body.images];
        } catch (e) {
          imagePaths = [req.body.images];
        }
      }
    }

    const experience = await Experience.create({
      title,
      description,
      category,
      location,
      price: Number(price),
      duration,
      maxGroupSize: Number(maxGroupSize),
      images: imagePaths,
      guide: req.user.id
    });

    const populated = await Experience.findById(experience._id).populate('guide', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      experience: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update experience
 * @route   PUT /api/experiences/:id
 * @access  Private (Guide owns, Admin)
 */
const updateExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Ensure guide owns experience or user is admin
    if (experience.guide.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this experience'
      });
    }

    const updates = { ...req.body };

    if (updates.price) updates.price = Number(updates.price);
    if (updates.maxGroupSize) updates.maxGroupSize = Number(updates.maxGroupSize);

    // If new files were uploaded, add them to existing images or replace
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      let existingImages = experience.images || [];
      if (req.body.keepExisting === 'false') {
        updates.images = newImages;
      } else {
        updates.images = [...existingImages, ...newImages];
      }
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('guide', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      experience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete experience
 * @route   DELETE /api/experiences/:id
 * @access  Private (Guide owns, Admin)
 */
const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Ensure guide owns experience or user is admin
    if (experience.guide.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this experience'
      });
    }

    // Clean up local uploaded files if any
    if (experience.images && experience.images.length > 0) {
      experience.images.forEach((imgUrl) => {
        if (imgUrl.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', imgUrl);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to delete image: ${filePath}`, err);
            }
          }
        }
      });
    }

    // Delete associated bookings & reviews
    await Booking.deleteMany({ experience: experience._id });
    await Review.deleteMany({ experience: experience._id });
    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Experience and associated records deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
};
