const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
import { AstraDB } from "@datastax/astra-db-ts";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

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
async function main() {
  // Initialize the client
  const astraDb = new AstraDB(
  "YOUR_TOKEN", "AstraCS:ngmjrKyMancIblRIYBIzoXmQ:086e04eee70926ee7d68350aa0113bb746e6d6fb6f9b1aa266248862b9335f8b")
}
main().catch(console.error);

httpServer.listen(4000);