import React, { useState } from 'react';

const GroupCreationModal = ({ open, onClose, onCreate, users }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selected.length > 1) {
      onCreate({ name, members: selected });
      setName('');
      setSelected([]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            placeholder="Group Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div className="mb-3">
            <div className="font-semibold mb-1">Select Members</div>
            <div className="max-h-32 overflow-y-auto">
              {users.map(user => (
                <label key={user._id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={selected.includes(user._id)}
                    onChange={e => {
                      if (e.target.checked) setSelected([...selected, user._id]);
                      else setSelected(selected.filter(id => id !== user._id));
                    }}
                    className="mr-2"
                  />
                  {user.username}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCreationModal; 