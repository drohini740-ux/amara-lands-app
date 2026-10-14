
import { io } from "socket.io-client";

// =====================================================
// SOCKET SERVER URL
// =====================================================

const SOCKET_URL = "http://localhost:4000";

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getToken = () => {
  return localStorage.getItem("token");
};

// =====================================================
// INITIALIZE SOCKET
// =====================================================

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,

  // Send JWT token during Socket.IO authentication
  auth: (callback) => {
    callback({
      token: getToken(),
    });
  },
});

// =====================================================
// CONNECT
// =====================================================

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

// =====================================================
// CONNECTION ERROR
// =====================================================

socket.on("connect_error", (error) => {
  console.error(
    "❌ Socket connection error:",
    error.message
  );
});

// =====================================================
// DISCONNECT
// =====================================================

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

// =====================================================
// CONNECT AFTER TOKEN IS AVAILABLE
// =====================================================

if (getToken()) {
  socket.connect();
}

// =====================================================
// EXPORT
// =====================================================

export default socket;
