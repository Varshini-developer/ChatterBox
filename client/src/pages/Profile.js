import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const defaultAvatars = [
  '/avatar1.png',
  '/avatar2.png',
  '/avatar3.png',
  '/avatar4.png',
  '/avatar5.png'
];

const Profile = () => {
  const { user, token, login } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatars[0]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAvatar(user?.avatar || defaultAvatars[0]);
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.patch('/api/users/profile', { avatar }, { headers: { Authorization: `Bearer ${token}` } });
      login(res.data, token); // Update user in context/localStorage
      setSuccess('Profile updated!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <form onSubmit={handleSave} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
};

export default Profile; 