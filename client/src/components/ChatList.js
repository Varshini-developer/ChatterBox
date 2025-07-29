import React from 'react';

const ChatList = ({ conversations, onSelect, selectedId, onlineUsers = [], user }) => {
  if (!user || !user._id) {
    return <div className="p-4 text-gray-400">Loading user info...</div>;
  }
  return (
    <div>
      {conversations.map(conv => {
        const isGroup = conv.isGroup;
        let displayName = '';
        let debugInfo = '';
        if (isGroup) {
          displayName = conv.name;
        } else {
          // Find the other member
          const other = conv.members.find(m => String(m._id) !== String(user._id));
          displayName = other ? other.username : '';
          // Debug info: show all member IDs and user ID
          // debugInfo = `user._id: ${String(user._id)} | members: [${conv.members.map(m => String(m._id)).join(', ')}]`;
          // console.log('DEBUG: user._id:', user._id, 'conv.members:', conv.members.map(m => m._id));
        }
        const otherUser = !isGroup ? conv.members.find(m => String(m._id) !== String(user._id)) : null;
        const isOnline = otherUser && onlineUsers.includes(otherUser._id);
        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`p-3 cursor-pointer border-b hover:bg-blue-50 ${selectedId === conv._id ? 'bg-blue-100' : ''}`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {displayName}
              {!isGroup && isOnline && <span className="w-2 h-2 bg-green-500 rounded-full inline-block" title="Online"></span>}
            </div>
            <div className="text-xs text-gray-500 truncate">{conv.lastMessage?.content || 'No messages yet'}</div>
            {!isGroup && (
              <div className="text-xs text-red-500 mt-1">{debugInfo}</div>
            )}
            {/* Fallback: show all members and highlight current user */}
            
          </div>
        );
      })}
    </div>
  );
};

export default ChatList; 