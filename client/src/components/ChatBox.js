import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { FaPaperPlane } from 'react-icons/fa';

const ChatBox = ({ messages, onSend, currentUser, onTyping, canSend = true }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debug: log sender for each message
  useEffect(() => {
    messages.forEach(msg => {
      console.log('Message sender:', msg.sender && (msg.sender.username || msg.sender), msg.sender && msg.sender._id);
    });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, idx) => (
          <MessageBubble key={msg._id || idx} message={msg} isOwn={msg.sender?._id === currentUser?._id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t bg-white/80 shadow-lg rounded-t-2xl">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all shadow-sm bg-white/90"
          placeholder="Type a message..."
          value={input}
          onChange={e => {
            setInput(e.target.value);
            if (onTyping) onTyping();
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canSend || !input.trim()}
          type="submit"
          aria-label="Send"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox; 