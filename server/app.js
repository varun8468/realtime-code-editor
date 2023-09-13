const express = require("express");
const { json, urlencoded } = express;
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

// port
const port = process.env.PORT || 8080;

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id + "on" + new Date());

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({socketId})=> {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id
      })
    })
  });
});

// listener
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
