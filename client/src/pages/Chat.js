import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import GroupCreationModal from '../components/GroupCreationModal';

const Chat = () => {
  const { user, token } = useAuth();
  const socket = useSocket();
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const typingTimeout = useRef();
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  // Fetch friends
  const fetchFriends = useCallback(() => {
    if (!token) return;
    axios.get('/api/users/friends', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFriends(res.data));
  }, [token]);

  // Fetch conversations
  const fetchConversations = useCallback(() => {
    if (!token) return;
    axios.get('/api/conversations', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setConversations(res.data));
  }, [token]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback((convo) => {
    if (!convo || !token) return;
    axios.get(`/api/messages/${convo._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data.reverse()));
  }, [token]);

  useEffect(() => {
    fetchFriends();
    fetchConversations();
  }, [fetchFriends, fetchConversations]);

  // When a conversation is selected, fetch its messages and join the socket room
  useEffect(() => {
    fetchMessages(selected);
    if (selected && socket) {
      socket.emit('join', selected._id);
    }
  }, [selected, socket, fetchMessages]);

  // Handle clicking a friend: find or create a 1-on-1 conversation, then select it and fetch messages
  const handleFriendClick = async (friend) => {
    // Find an existing 1-on-1 conversation (exactly two members: you and friend, any order)
    let convo = conversations.find(c =>
      !c.isGroup &&
      c.members.length === 2 &&
      c.members.some(m => m._id === friend._id) &&
      c.members.some(m => m._id === user._id)
    );
    if (!convo) {
      // Create new conversation
      const res = await axios.post('/api/conversations', { userId: friend._id }, { headers: { Authorization: `Bearer ${token}` } });
      convo = res.data;
      // Refetch conversations to avoid duplicates
      await fetchConversations();
    }
    setSelected(convo);
    fetchMessages(convo);
  };

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.roomId === selected?._id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('message', handler);
    return () => socket.off('message', handler);
  }, [socket, selected]);

  // Listen for presence updates
  useEffect(() => {
    if (!socket) return;
    const handler = (users) => setOnlineUsers(users);
    socket.on('presence', handler);
    return () => socket.off('presence', handler);
  }, [socket]);

  // Listen for typing events
  useEffect(() => {
    if (!socket) return;
    const handler = ({ userId }) => {
      if (selected && userId && userId !== user._id) {
        setTypingUser(userId);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };
    socket.on('typing', handler);
    return () => socket.off('typing', handler);
  }, [socket, selected, user]);

  // Send message
  const handleSend = useCallback((content) => {
    if (!selected || !socket) return;
    const msg = {
      roomId: selected._id,
      content,
      sender: user,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    socket.emit('message', msg);
    axios.post('/api/messages', { conversationId: selected._id, content }, { headers: { Authorization: `Bearer ${token}` } });
  }, [selected, socket, user, token]);

  // Emit typing event
  const handleTyping = () => {
    if (socket && selected) {
      socket.emit('typing', selected._id);
    }
  };

  // Handle group creation
  const handleCreateGroup = async ({ name, members }) => {
    if (!token) return;
    try {
      const res = await axios.post('/api/groups', { name, members }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchConversations();
      setGroupModalOpen(false);
      // Select the new group
      setSelected(res.data);
      fetchMessages(res.data);
    } catch (err) {
      alert('Failed to create group.');
    }
  };

  // Filter out self from friends
  const filteredFriends = friends.filter(f => f._id !== user._id);

  // In the main chat area header:
  const otherMember = selected && !selected.isGroup
    ? selected.members.find(m => String(m._id) !== String(user._id))
    : null;

  useEffect(() => {
    // Reset all chat state when user changes (login/logout)
    setSelected(null);
    setMessages([]);
    setConversations([]);
    setFriends([]);
    console.log('Current user:', user && user.username, user && user._id);
  }, [user]);

  // Add debug logging for sender in message rendering
  // In ChatBox or here, for each message:
  // {messages.map(msg => console.log('Message sender:', msg.sender && (msg.sender.username || msg.sender), msg.sender && msg.sender._id))}

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Sidebar */}
      <aside className="w-72 max-w-xs min-w-[220px] m-4 rounded-2xl shadow-xl bg-white/90 border flex flex-col overflow-hidden">
        <div className="p-5 font-bold text-2xl border-b bg-gradient-to-r from-blue-100 to-blue-50">Chats</div>
        {/* Friends list */}
        <div className="p-4 border-b bg-gray-50/80">
          <div className="font-semibold mb-3 text-lg">Friends</div>
          <div className="flex flex-wrap gap-3">
            {filteredFriends.length === 0 ? <span className="text-gray-400 text-sm">No friends yet</span> : filteredFriends.map(friend => (
              <button
                key={friend._id}
                className="flex flex-col items-center w-16 group hover:scale-105 transition-transform"
                title={friend.username}
                onClick={() => handleFriendClick(friend)}
              >
                <img src={friend.avatar || '/avatar.png'} alt="avatar" className="w-12 h-12 rounded-full mb-1 border-2 border-blue-300 shadow group-hover:border-blue-500 group-hover:shadow-lg transition-all" />
                <span className="text-xs truncate w-full font-medium group-hover:text-blue-600 transition-all">{friend.username}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatList conversations={conversations} onSelect={setSelected} selectedId={selected?._id} onlineUsers={onlineUsers} user={user} />
        </div>
        <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-blue-100">
          <button className="w-full py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-all" onClick={() => setGroupModalOpen(true)}>+ New Group</button>
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col m-4 ml-0 rounded-2xl shadow-xl bg-white/80 overflow-hidden">
        <div className="p-5 border-b bg-gradient-to-r from-white to-blue-50 flex items-center gap-4 shadow-sm min-h-[64px]">
          {selected ? (
            <>
              {selected.isGroup ? (
                <span className="font-bold text-xl">{selected.name}</span>
              ) : (
                <>
                  <img src={otherMember?.avatar || '/avatar.png'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-300 shadow" />
                  <span className="font-bold text-lg">{otherMember ? otherMember.username : ''}</span>
                  {onlineUsers.includes(otherMember?._id) && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block" title="Online"></span>
                  )}
                </>
              )}
            </>
          ) : <span className="text-gray-400 font-medium">Select a chat</span>}
        </div>
        <div className="flex-1">
          {selected ? (
            <>
              <ChatBox messages={messages} onSend={handleSend} currentUser={user} onTyping={handleTyping} canSend={!!socket} />
              {/* Typing indicator */}
              {typingUser && (
                <div className="px-4 pb-2 text-sm text-blue-500 animate-pulse">Someone is typing...</div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">Select a conversation to start chatting</div>
          )}
        </div>
      </main>
      <GroupCreationModal open={groupModalOpen} onClose={() => setGroupModalOpen(false)} onCreate={handleCreateGroup} users={friends} />
    </div>
  );
};

export default Chat; 