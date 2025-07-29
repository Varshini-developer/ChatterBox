import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';                                          
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Groups from './pages/Groups';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (loggedOut) {
      navigate('/login');
      setLoggedOut(false);
    }
  }, [loggedOut, navigate]);

  const handleLogout = () => {
    logout();
    setLoggedOut(true);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg px-6 py-3 flex items-center gap-4 text-white">
      <span className="font-bold text-2xl tracking-tight mr-6">💬 ChatterBox</span>
      <Link to="/chat" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Chat</Link>
      {/* <Link to="/groups" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Groups</Link> */}
      <Link to="/friends" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Friends</Link>
      {user && <Link to="/profile" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Profile</Link>}
      <div className="flex-1" />
      {!user && <Link to="/login" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Login</Link>}
      {!user && <Link to="/register" className="px-4 py-2 rounded-full hover:bg-blue-700/60 transition-all font-medium">Register</Link>}
      {user && (
        <div className="flex items-center gap-2">
          {/* User avatar/profile dropdown placeholder */}
          <img src={user.avatar || '/avatar.png'} alt="avatar" className="w-9 h-9 rounded-full border-2 border-white shadow-md" />
          <span className="font-semibold text-base">{user.username}</span>
          <button onClick={handleLogout} className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full font-medium transition-all">Logout</button>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
