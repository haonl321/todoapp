const User = require('../models/User');
const Task = require('../models/Task');

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

module.exports = { systemStats };
