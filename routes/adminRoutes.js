const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { systemStats } = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', systemStats); // GET /api/admin/stats

module.exports = router;
