const express = require('express');
const router = express.Router();
const {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { userStats } = require('../controllers/taskController');

router.get('/stats', userStats); // GET /api/tasks/stats

router.use(authMiddleware); // tất cả các route dưới đây đều cần xác thực

router.get('/', getUserTasks);           // GET /api/tasks
router.post('/', createTask);           // POST /api/tasks
router.put('/:id', updateTask);         // PUT /api/tasks/:id
router.delete('/:id', deleteTask);      // DELETE /api/tasks/:id

module.exports = router;
