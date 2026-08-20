const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // ============================================
    // JOIN USER NOTIFICATION ROOM
    // ============================================

    socket.on("joinUserRoom", (userId) => {
      const roomName = `user_${userId}`;

      socket.join(roomName);

      console.log(`👤 User ${userId} joined room ${roomName}`);
      console.log(`🏠 Socket ${socket.id} joined ${roomName}`);
    });

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);
    });
  });
};

// ================================================
// GET SOCKET.IO INSTANCE
// ================================================

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};