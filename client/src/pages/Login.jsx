import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Đăng nhập</h2>

        {/* ✅ Cảnh báo mở backend nếu đang sleep */}
        <p className="text-sm text-gray-500 text-center mb-4">
          ⚠️ Nếu không đăng nhập được, hãy mở{' '}
          <a
            href="https://todoapp-backend-y12v.onrender.com"
            target="_blank"
            className="text-blue-600 underline"
          >
            backend API
          </a>{' '}
          trước để đánh thức server (mất khoảng 10–30 giây).
        </p>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Đăng nhập
          </button>
        </form>

        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <button
            onClick={() => navigate('/register')}
            className="hover:underline text-blue-500"
          >
            Đăng ký
          </button>
          <button
            onClick={() => alert('Chức năng này đang phát triển')}
            className="hover:underline text-gray-500"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
}
