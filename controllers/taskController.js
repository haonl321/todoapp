const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, priority, scheduledDate, startTime, duration } = req.body;

    const task = new Task({
      userId: req.user.id,
      title,
      priority,
      scheduledDate,
      startTime,
      duration,
      status: 'pending'
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo task', error: err.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy task', error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá', error: err.message });
  }
};

const userStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ userId: req.user.id });
    const completed = await Task.countDocuments({ userId: req.user.id, status: 'completed' });
    const pending = total - completed;

    res.json({ total, completed, pending });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thống kê', error: err.message });
  }
};

module.exports = {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  userStats
};
