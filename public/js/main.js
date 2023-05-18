import { getQueryData } from "./getQueryData.js";
const socket = io();

const chatForm = document.getElementById("chat-form");
const chatBox = document.getElementById("chatBox");
const msgs = document.getElementById("msgs");
const roomName = document.getElementById("roomName");
const usersList = document.querySelector("#users");

const urlDataObj = getQueryData(location.search);

// send user name and room from url
socket.emit("joinRoom", urlDataObj);

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users, "from sevrverhhhhhhhhh");
  outputRoomName(room);
  outputUsers(users);
});

// this will catch all the message that send from the server side
socket.on("message", (message) => {
  // message is all the massages recieved from the server
  outputMessage(message);

  msgs.scrollTop = msgs.scrollHeight;

  // clear input after send it
  chatBox.value = "";
  chatBox.focus();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatBox.value;
  //   console.log(msg);

  // emitting a message to the server
  socket.emit("chatMessage", { msg });
});

// out but message to the dom
function outputMessage(message) {
  const newMsg = document.createElement("div");
  newMsg.innerHTML = `<span>${
    message.user
  } : </span><span style="color:#e4ff00;">${message.time}</span>
  <p ${
    message.id === socket.id
      ? (newMsg.style.backgroundColor = "rgb(93 41 73)")
      : (newMsg.style.backgroundColor = "#14213d")
  } >${message.text}</p>`;
  const main = document.getElementById("msgs");
  main.append(newMsg);
}

// Add room name to Dom
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// add users name to the list
function outputUsers(users) {
  usersList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join(" ")}`;
}
