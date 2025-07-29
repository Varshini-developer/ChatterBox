import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const defaultAvatars = [
  '/avatar1.png',
  '/avatar2.png',
  '/avatar3.png',
  '/avatar4.png',
  '/avatar5.png'
];

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatars[0]);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', { username, email, password, avatar });
      register(res.data.user, res.data.token);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register for ChatterBox</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Choose an Avatar</label>
          <div className="flex gap-2">
            {defaultAvatars.map(src => (
              <img
                key={src}
                src={src}
                alt="avatar"
                className={`w-12 h-12 rounded-full cursor-pointer border-2 ${avatar === src ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setAvatar(src)}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">Register</button>
      </form>
    </div>
  );
};

export default Register; 