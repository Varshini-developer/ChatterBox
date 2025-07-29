require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
// const { initSocket } = require('./sockets');
const { initSocket } = require('../sockets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatterbox', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('ChatterBox API is running');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');
const conversationRoutes = require('./routes/conversation');
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/conversations', conversationRoutes);

// TODO: Add auth, user, message, group routes
// TODO: Integrate Socket.IO

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 