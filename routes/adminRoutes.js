const express = require('express');
const router = express.Router();
const {
  systemStats,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/stats', authMiddleware, adminMiddleware, systemStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
