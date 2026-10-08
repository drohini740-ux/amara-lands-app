
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

// =====================================================
// INITIALIZE SOCKET.IO
// =====================================================

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
      ],
      credentials: true,
    },
  });

  // ===================================================
  // SOCKET JWT AUTHENTICATION
  // ===================================================

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(
          "Bearer ",
          ""
        );

      if (!token) {
        console.log(
          "❌ Socket connection rejected: No token"
        );

        return next(
          new Error("Unauthorized: No token provided.")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      console.log(
        "🔐 Socket authenticated:",
        {
          id: decoded.id,
          role: decoded.role,
        }
      );

      next();
    } catch (error) {
      console.log(
        "❌ Socket JWT Error:",
        error.message
      );

      next(
        new Error("Unauthorized socket connection.")
      );
    }
  });

  // ===================================================
  // CONNECTION
  // ===================================================

  io.on("connection", (socket) => {
    console.log(
      "✅ User Connected:",
      socket.id,
      "User:",
      socket.user?.id,
      "Role:",
      socket.user?.role
    );

    // ================================================
    // JOIN USER NOTIFICATION ROOM
    // ================================================

    socket.on("joinUserRoom", (userId) => {
      // User can only join their own notification room.
      if (
        String(userId) !==
        String(socket.user?.id)
      ) {
        console.log(
          `⚠️ User ${socket.user?.id} attempted to join user_${userId}`
        );

        return;
      }

      const roomName = `user_${userId}`;

      socket.join(roomName);

      console.log(
        `👤 User ${userId} joined room ${roomName}`
      );

      console.log(
        `🏠 Socket ${socket.id} joined ${roomName}`
      );
    });

    // ================================================
    // FIELD EXECUTIVE LOCATION ROOM
    // ================================================

    socket.on(
      "joinFieldLocationRoom",
      (userId) => {
        // Field Executive can only join
        // their own location room.
        if (
          String(userId) !==
          String(socket.user?.id)
        ) {
          console.log(
            `⚠️ User ${socket.user?.id} attempted to join field_location_${userId}`
          );

          return;
        }

        if (
          socket.user?.role !==
          "field_executive"
        ) {
          console.log(
            `⚠️ User ${socket.user?.id} is not a Field Executive`
          );

          return;
        }

        const roomName =
          `field_location_${userId}`;

        socket.join(roomName);

        console.log(
          `📍 Field Executive ${userId} joined ${roomName}`
        );

        console.log(
          `🏠 Socket ${socket.id} joined ${roomName}`
        );
      }
    );

    // ================================================
    // LEAVE FIELD EXECUTIVE LOCATION ROOM
    // ================================================

    socket.on(
      "leaveFieldLocationRoom",
      (userId) => {
        if (
          String(userId) !==
          String(socket.user?.id)
        ) {
          return;
        }

        const roomName =
          `field_location_${userId}`;

        socket.leave(roomName);

        console.log(
          `📍 Field Executive ${userId} left ${roomName}`
        );
      }
    );

    // ================================================
    // ADMIN / SUPER ADMIN LIVE LOCATION ROOM
    // ================================================

    socket.on(
      "joinLiveLocationMonitor",
      () => {
        const allowedRoles = [
          "admin",
          "super_admin",
        ];

        if (
          !allowedRoles.includes(
            socket.user?.role
          )
        ) {
          console.log(
            `⚠️ Unauthorized live location monitor attempt by user ${socket.user?.id}`
          );

          socket.emit(
            "live-location:monitor:error",
            {
              message:
                "You are not authorized to monitor Field Executive locations.",
            }
          );

          return;
        }

        const roomName =
          "live_location_monitors";

        socket.join(roomName);

        console.log(
          `🖥️ ${socket.user.role} ${socket.user.id} joined ${roomName}`
        );

        socket.emit(
          "live-location:monitor:joined",
          {
            success: true,
            message:
              "Live location monitoring enabled.",
          }
        );
      }
    );

    // ================================================
    // LEAVE ADMIN / SUPER ADMIN MONITOR
    // ================================================

    socket.on(
      "leaveLiveLocationMonitor",
      () => {
        const roomName =
          "live_location_monitors";

        socket.leave(roomName);

        console.log(
          `🖥️ User ${socket.user?.id} left ${roomName}`
        );
      }
    );

    // ================================================
    // DISCONNECT
    // ================================================

    socket.on("disconnect", (reason) => {
      console.log(
        "❌ User Disconnected:",
        socket.id,
        "Reason:",
        reason
      );
    });
  });
};

// =====================================================
// GET SOCKET.IO INSTANCE
// =====================================================

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized!"
    );
  }

  return io;
};

// =====================================================
// EMIT FIELD LIVE LOCATION
// =====================================================

const emitFieldLiveLocation = (
  userId,
  location
) => {
  if (!io) {
    console.warn(
      "Socket.io not initialized. Unable to emit live location."
    );

    return;
  }

  const locationData = {
    user_id: userId,
    ...location,
  };

  // ================================================
  // FIELD EXECUTIVE'S OWN ROOM
  // ================================================

  const fieldRoom =
    `field_location_${userId}`;

  io.to(fieldRoom).emit(
    "field:location:update",
    locationData
  );

  // ================================================
  // ADMIN / SUPER ADMIN MONITOR ROOM
  // ================================================

  io.to("live_location_monitors").emit(
    "field:location:update",
    locationData
  );

  console.log(
    `📍 Live location emitted for Field Executive ${userId}`
  );
};

// =====================================================
// EMIT FIELD LOCATION STOP
// =====================================================

const emitFieldLocationStopped = (
  userId,
  location
) => {
  if (!io) {
    console.warn(
      "Socket.io not initialized. Unable to emit location stop."
    );

    return;
  }

  const locationData = {
    user_id: userId,
    ...location,
  };

  // ================================================
  // FIELD EXECUTIVE'S OWN ROOM
  // ================================================

  const fieldRoom =
    `field_location_${userId}`;

  io.to(fieldRoom).emit(
    "field:location:stop",
    locationData
  );

  // ================================================
  // ADMIN / SUPER ADMIN MONITOR ROOM
  // ================================================

  io.to("live_location_monitors").emit(
    "field:location:stop",
    locationData
  );

  console.log(
    `🛑 Live location stopped for Field Executive ${userId}`
  );
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  initSocket,
  getIO,
  emitFieldLiveLocation,
  emitFieldLocationStopped,
};

