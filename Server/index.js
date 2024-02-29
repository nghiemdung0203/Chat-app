const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const UserRoutes = require('./routes/UserRoutes');


app.use(express.json())
app.use(cors());
app.use('/User', UserRoutes);



const io = new Server(httpServer, { 
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log(data);
    io.emit('messageRes', data)
  })

  socket.on('joinRoom', (data) => {
    console.log(`${socket.id} joined ${data}`)
    socket.join(data);
    io.to(data).emit('joinedRoom', `${socket.id} joined ${data}`)
  })

  socket.on('disconnect', () => {
    console.log(`🔥:${socket.id} user disconnected`);
  });
});




httpServer.listen(4000);