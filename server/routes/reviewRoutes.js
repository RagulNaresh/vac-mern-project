const express = require('express');
const router = express.Router();
const { addReview, getReviewsByExperience } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/:experienceId', getReviewsByExperience);

module.exports = router;
