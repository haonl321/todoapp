import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Đăng ký thành công, vui lòng đăng nhập');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Họ tên" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" className="w-full p-2 border rounded" onChange={handleChange} required />
        <button className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">Đăng ký</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
