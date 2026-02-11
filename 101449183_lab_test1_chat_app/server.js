const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "view", "login.html"))
);

app.get("/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "view", "signup.html"))
);

app.get("/join", (req, res) =>
  res.sendFile(path.join(__dirname, "view", "join.html"))
);

app.get("/chat", (req, res) =>
  res.sendFile(path.join(__dirname, "view", "chat.html"))
);

const users = new Map();

function formatDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  let hh = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const hour = String(hh).padStart(2, "0");
  return `${mm}-${dd}-${yyyy} ${hour}:${min} ${ampm}`;
}

function roomUsers(room) {
  const list = [];
  for (const u of users.values()) {
    if (u.room === room) list.push(u.username);
  }
  return Array.from(new Set(list));
}

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    users.set(socket.id, { username, room });
    socket.join(room);

    io.to(room).emit("message", {
      from_user: "",
      room,
      message: `${username} has joined the chat`,
      date_sent: formatDate(new Date())
    });

    io.to(room).emit("roomUsers", { room, users: roomUsers(room) });
  });

  socket.on("chatMessage", ({ room, message }) => {
    const u = users.get(socket.id);
    if (!u || !u.room) return;

    io.to(u.room).emit("message", {
      from_user: u.username,
      room: u.room,
      message,
      date_sent: formatDate(new Date())
    });

    io.to(u.room).emit("stopTyping", {});
  });

  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing", { username });
  });

  socket.on("stopTyping", ({ room }) => {
    socket.to(room).emit("stopTyping", {});
  });

  socket.on("leaveRoom", () => {
    const u = users.get(socket.id);
    if (!u) return;

    socket.leave(u.room);
    users.delete(socket.id);

    io.to(u.room).emit("message", {
      from_user: "",
      room: u.room,
      message: `${u.username} has left the chat`,
      date_sent: formatDate(new Date())
    });

    io.to(u.room).emit("roomUsers", { room: u.room, users: roomUsers(u.room) });
  });

  socket.on("disconnect", () => {
    const u = users.get(socket.id);
    if (!u) return;

    users.delete(socket.id);
    io.to(u.room).emit("roomUsers", { room: u.room, users: roomUsers(u.room) });
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

async function start() {
  if (MONGO_URI) {
    await mongoose.connect(MONGO_URI);
    const User = require("./models/User");
    await User.init();
  }
  server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

start();

