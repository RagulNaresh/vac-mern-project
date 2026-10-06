const express = require('express');
const router = express.Router();
const {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(getExperiences)
  .post(protect, authorizeRoles('guide', 'admin'), upload.array('images', 5), createExperience);

router
  .route('/:id')
  .get(getExperienceById)
  .put(protect, authorizeRoles('guide', 'admin'), upload.array('images', 5), updateExperience)
  .delete(protect, authorizeRoles('guide', 'admin'), deleteExperience);

module.exports = router;
