import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddTaskModal from '../components/AddTaskModal';

export default function Dashboard() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  const handleEdit = task => {
  setForm({
    title: task.title,
    priority: task.priority,
    scheduledDate: task.scheduledDate,
    startTime: task.startTime,
    duration: task.duration,
  });
  setTaskBeingEdited(task);
  setIsModalOpen(true);
  };


  const [form, setForm] = useState({
    title: '',
    priority: 'medium',
    scheduledDate: '',
    startTime: '',
    duration: '',
  });

  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter.status === 'all' || task.status === filter.status;
    const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;
    return statusMatch && priorityMatch;
  });

  const pendingTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Lỗi tải task:', err));
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
  e.preventDefault();
  try {
    if (taskBeingEdited) {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${taskBeingEdited._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
    } else {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
    }

    // Reset form
    setForm({
      title: '',
      priority: 'medium',
      scheduledDate: '',
      startTime: '',
      duration: '',
    });
    setTaskBeingEdited(null);
    setIsModalOpen(false);
  } catch (err) {
    console.error('Lỗi tạo/cập nhật task:', err);
  }
  };


  const handleDelete = async id => {
    const ok = window.confirm('Bạn có chắc chắn muốn xoá công việc này?');
    if (!ok) return;

    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const toggleStatus = async task => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: task.status === 'completed' ? 'pending' : 'completed',
      }),
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
  };

  const getColor = task => {
    if (task.status === 'completed') return 'bg-purple-400';
    if (task.priority === 'high') return 'bg-pink-400';
    if (task.priority === 'medium') return 'bg-blue-400';
    return 'bg-gray-400';
  };

  const getEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    const [hour, minute] = startTime.split(':').map(Number);
    const start = new Date();
    start.setHours(hour);
    start.setMinutes(minute);
    start.setSeconds(0);
    const end = new Date(start.getTime() + duration * 60000);
    const hh = end.getHours().toString().padStart(2, '0');
    const mm = end.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">📋 Danh sách công việc</h2>
            <p className="text-sm text-gray-500">👤 {user?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-blue-600 hover:underline"
              >
                Quản trị
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition mb-4"
        >
          + Thêm công việc
        </button>

        <div className="flex gap-4 mb-4">
          <select
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang làm</option>
            <option value="completed">Đã hoàn thành</option>
          </select>

          <select
            value={filter.priority}
            onChange={e => setFilter({ ...filter, priority: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="all">Tất cả ưu tiên</option>
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>

        {/* 🟡 DANH SÁCH CÔNG VIỆC ĐANG LÀM */}
        <ul className="space-y-3 mb-6">
          {filteredTasks
            .filter(task => task.status !== 'completed')
            .map(task => (
              <li
                key={task._id}
                className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded shadow-sm"
              >
                <div className="w-5 text-lg">
                  {task.priority === 'high' && <span title="Ưu tiên cao">🔥</span>}
                  {task.priority === 'medium' && <span title="Ưu tiên trung bình">😤</span>}
                  {task.priority === 'low' && <span title="Ưu tiên thấp">😎</span>}
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                    {task.title || '(Không có tiêu đề)'}
                  </h3>
                  {task.scheduledDate && task.startTime && (
                    <p className="text-xs text-gray-500">
                      🕒 Làm lúc: {format(new Date(task.scheduledDate), 'dd/MM/yyyy')}
                      {' từ ' + task.startTime}
                      {' đến ' + getEndTime(task.startTime, task.duration)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleStatus(task)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer transition-colors duration-300"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                  </label>

                  <button onClick={() => handleDelete(task._id)} title="Xoá" className="text-xl text-red-500">🗑</button>
                  <button onClick={() => handleEdit(task)} title="Sửa" className="text-xl text-yellow-500">✏️</button>
                </div>
              </li>
            ))}
        </ul>

        {/* ✅ DANH SÁCH CÔNG VIỆC ĐÃ HOÀN THÀNH */}
        {filteredTasks.some(task => task.status === 'completed') && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">✅ Công việc đã hoàn thành</h3>

            <ul className="space-y-3">
              {filteredTasks
                .filter(task => task.status === 'completed')
                .map(task => (
                  <li
                    key={task._id}
                    className="flex items-center gap-4 bg-white px-4 py-3 rounded shadow-sm"
                  >
                    <div className="w-5 text-lg">
                      {task.priority === 'high' && <span title="Ưu tiên cao">🔥</span>}
                      {task.priority === 'medium' && <span title="Ưu tiên trung bình">😤</span>}
                      {task.priority === 'low' && <span title="Ưu tiên thấp">😎</span>}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold line-through text-gray-400">
                        {task.title || '(Không có tiêu đề)'}
                      </h3>
                      {task.scheduledDate && task.startTime && (
                        <p className="text-xs text-gray-500">
                          🕒 Làm lúc: {format(new Date(task.scheduledDate), 'dd/MM/yyyy')}
                          {' từ ' + task.startTime}
                          {' đến ' + getEndTime(task.startTime, task.duration)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => toggleStatus(task)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-green-500 peer-checked:bg-green-500 rounded-full peer transition-colors duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>

                      <button onClick={() => handleDelete(task._id)} title="Xoá" className="text-xl text-red-500">🗑</button>
                      <button onClick={() => handleEdit(task)} title="Sửa" className="text-xl text-yellow-500">✏️</button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal thêm công việc */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        handleChange={handleChange}
        handleCreate={e => {
          handleCreate(e);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
