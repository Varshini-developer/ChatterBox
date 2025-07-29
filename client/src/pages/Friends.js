import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Friends = () => {
  const { user, token } = useAuth();
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('/api/users/friends', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFriends(res.data))
      .finally(() => setLoading(false));
    axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
  }, [token]);

  const handleAddFriend = async (id) => {
    setAdding(prev => ({ ...prev, [id]: true }));
    await axios.post(`/api/users/${id}/add-friend`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setFriends(prev => [...prev, users.find(u => u._id === id)]);
    setAdding(prev => ({ ...prev, [id]: false }));
  };

  const handleRemoveFriend = async (id) => {
    await axios.delete(`/api/users/${id}/remove-friend`, { headers: { Authorization: `Bearer ${token}` } });
    setFriends(prev => prev.filter(f => f._id !== id));
  };

  const isFriend = (id) => friends.some(f => f._id === id);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
        {loading ? <div>Loading...</div> : (
          <div className="mb-6">
            {friends.length === 0 ? <div>No friends yet.</div> : (
              <ul>
                {friends.map(friend => (
                  <li key={friend._id} className="flex items-center gap-2 mb-2">
                    <img src={friend.avatar || '/avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span>{friend.username}</span>
                    <button
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        <ul>
          {users.filter(u => u._id !== user._id).map(u => (
            <li key={u._id} className="flex items-center gap-2 mb-2">
              <img src={u.avatar || '/avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
              <span>{u.username}</span>
              {isFriend(u._id) ? (
                <span className="text-green-500 ml-2">Friend</span>
              ) : (
                <button
                  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  onClick={() => handleAddFriend(u._id)}
                  disabled={adding[u._id]}
                >
                  {adding[u._id] ? 'Adding...' : 'Add Friend'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Friends; 