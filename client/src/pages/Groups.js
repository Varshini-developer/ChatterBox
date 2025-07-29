import React from 'react';

const Groups = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Group Management</h2>
        <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded ">Create New Group</button>
        {/* TODO: List of groups */}
        <div className="mb-4">Groups List</div>
        {/* TODO: Group details modal or section */}
        <div>Group Details</div>
      </div>
    </div>
  );
};

export default Groups; 