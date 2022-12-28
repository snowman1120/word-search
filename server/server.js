const express = require('express');
const connectDB = require('./utils/db');
const path = require('path');
const {connectSocket} = require('./utils/socket');
const cors = require('cors');

const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "*"
  }
});

// Connect Database
connectDB();
// Connect Socket
connectSocket(socketIO);
// Init Middleware
app.use(express.json());
app.use(cors({origin: '*'}));
//app.use(fileUpload());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/word', require('./routes/api/word'));

process.env.NODE_ENV = "production";

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 80;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));