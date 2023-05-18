const express = require("express");
const { createServer } = require("http");
const formatMessage = require("./formatMessage");
const path = require("path");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const {
  users,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./users");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    console.log(users);

    const user = userJoin(socket.id, data.username, data.room);
    // we can call join to subscribe a socket to given channel
    socket.join(user.room);
    socket.emit(
      "message",
      formatMessage(
        "Bot",
        `welcom <bold style="color:red"> ${data.username}</bold> to chat io`
      )
    );

    // Broadcast when a user connect to all the client except the one who actally connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          "Bot",
          `<bold style="color:red"> ${data.username}</bold> has joined the chat`
        )
      );

    // send users and room info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // runs when client disconnect
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(
            "Bot",
            `<bold style="color:red"> ${user.username}</bold> has left the chat`
          )
        );
      }

      // send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  });

  // send user name and room back to display it on client si

  // listen to chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    // send message back to  the client to display it
    io.to(user.room).emit(
      "message",
      formatMessage(user.username, msg.msg, socket.id)
    );
  });
});

httpServer.listen(port);
