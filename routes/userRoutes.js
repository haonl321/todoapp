const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware); // xác thực mọi route

router.get('/all-users', adminMiddleware, async (req, res) => {
  // ví dụ: trả về danh sách tất cả user (admin-only)
});

module.exports = router;
