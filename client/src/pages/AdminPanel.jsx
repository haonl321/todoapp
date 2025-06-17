import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
    fetchUsers();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError('Không thể tải thống kê');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá user này không?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setError('Không thể xoá user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Bảng điều khiển Quản trị viên</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Về Dashboard
            </button>
            <button
              onClick={logout}
              className="text-red-500 hover:underline text-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Số người dùng</h3>
            <p className="text-2xl font-semibold">{stats.totalUsers || 0}</p>
          </div>
          <div className="p-4 border rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Số công việc</h3>
            <p className="text-2xl font-semibold">{stats.totalTasks || 0}</p>
          </div>
          <div className="p-4 border rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Đã hoàn thành</h3>
            <p className="text-2xl font-semibold">{stats.completedTasks || 0}</p>
          </div>
          <div className="p-4 border rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Đang làm</h3>
            <p className="text-2xl font-semibold">{stats.pendingTasks || 0}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Danh sách người dùng</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Vai trò</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border capitalize">{u.role}</td>
                  <td className="p-2 border">
                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Xoá
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Admin</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
