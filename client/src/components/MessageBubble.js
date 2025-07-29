import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  // Placeholder for timestamp (replace with actual time if available)
  const timestamp = message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div className={`flex items-end mb-3 transition-all duration-300 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <img src={message.sender?.avatar || '/avatar.png'} alt="avatar" className="w-9 h-9 rounded-full shadow-md mr-3 border-2 border-white" />
      )}
      <div className={`relative px-5 py-3 rounded-2xl max-w-md break-words shadow-lg transition-all duration-300
        ${isOwn ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}
        style={{ minWidth: '60px' }}>
        <span className="block text-base">{message.content}</span>
        <span className={`block text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>{timestamp}</span>
        {/* Bubble tail */}
        <span className={`absolute bottom-0 ${isOwn ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} w-3 h-3 bg-inherit rounded-full z-0`}></span>
      </div>
      {isOwn && (
        <img src={message.sender?.avatar || '/avatar.png'} alt="avatar" className="w-9 h-9 rounded-full shadow-md ml-3 border-2 border-white" />
      )}
    </div>
  );
};

export default MessageBubble; 