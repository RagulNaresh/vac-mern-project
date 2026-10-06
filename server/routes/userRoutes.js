const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');

// All routes here are admin only
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;
