const app = () => {
  const socket = io();

  // todo: declare currentRoom object
  let currentRoom = {};

  // submit form event
  // onsubmit event -> https://www.geeksforgeeks.org/html-dom-onsubmit-event/
  document.getElementById("msg").onsubmit = () => {
    const messageInput = document.getElementById("m");
    const message = messageInput.value;
    const username = document.getElementById("username").value;
    // todo: send back current room
    socket.emit("chatMessage", [message, username, currentRoom]);
    messageInput.value = "";
    return false;
  };

  socket.on("chatMessage", (data) => {
    // DOM manipulation (new)
    const messageList = document.getElementById("messages");
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `${data[1]} : ${data[0]}`;
    messageList.appendChild(newMessage);
  });

  // join chat room logic
  const joinChatRoomButton = document.getElementById("join");
  joinChatRoomButton.addEventListener("click", (e) => {
    // alert("this is an alert");
    const room = prompt("Which room would you like to join???");

    // * if you are already in a room, "leave" the current room first before joining the new room
    if (currentRoom !== {}) {
      socket.emit("unsubscribe", currentRoom.name);
    }
    socket.emit("subscribe", room);
  });

  // todo: return data
  socket.on("joinRoom", (data) => {
    const { room, messages } = data;
    // todo: no longer just room number/name
    $("#room").html(`You are in Room: ${room.name}`);

    const messageList = document.getElementById("messages");
    messageList.innerHTML = "";
    // todo: display chat history
    messages.forEach((message) => {
      const newMessage = document.createElement("li");
      newMessage.innerHTML = `${message.sender} : ${message.message}`;
      messageList.appendChild(newMessage);
    });

    currentRoom = room;
  });
};