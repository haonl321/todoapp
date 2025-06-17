const User = require('../models/User');
const Task = require('../models/Task');

// GET /api/admin/stats
const systemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thống kê hệ thống', error: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng', error: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Không thể xoá admin' });

    await user.deleteOne();
    res.json({ message: 'Xoá người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xoá người dùng', error: err.message });
  }
};

module.exports = {
  systemStats,
  getAllUsers,
  deleteUser
};
