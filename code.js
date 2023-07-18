document.addEventListener("DOMContentLoaded", function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let usernameInput = app.querySelector("#username");
    let username = usernameInput.value.trim();

    if (username.length >= 4) {
      uname = username;
      socket.emit("newuser", uname);
      app.querySelector(".login-page").style.display = "none";
      app.querySelector(".chat-screen").style.display = "flex";
    } else {
      alert("Username should be four letters or more.");
    }

    usernameInput.value = "";
  });

  // Hide the chat screen initially
  app.querySelector(".chat-screen").style.display = "none";
  
  // Show the login page by default
  app.querySelector(".login-page").style.display = "block";

  function sendMessage() {
    let messageInput = app.querySelector("#message-input");
    let message = messageInput.value.trim();

    if (message.length === 0) {
      return;
    }

    renderMessage("my", {
      username: uname,
      text: message,
    });

    socket.emit("chat", {
      username: uname,
      text: message,
    });

    messageInput.value = "";
    messageInput.focus(); // Keep focus on the input field after sending a message
  }

  app.querySelector("#send-message").addEventListener("click", sendMessage);
  app.querySelector("#message-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default Enter key behavior (e.g., line break in textarea)
      sendMessage();
    }
  });

  app.querySelector("#exit-chat").addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.origin;
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".messages");
    let messageElement = document.createElement("div");
    messageElement.className = "message";
    if (type === "my") {
      messageElement.classList.add("my-message");
      messageElement.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
        </div>
      `;
    } else if (type === "other") {
      messageElement.classList.add("other-message");
      messageElement.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
        </div>
      `;
    } else if (type === "update") {
      messageElement.classList.add("update");
      messageElement.innerText = message;
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  socket.on("update", function (message) {
    renderMessage("update", message);
  });
});
