document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.getElementById("app");
  const socket = io();
  const { useState } = React;
  const { TextField, Button, Box, Typography } = mui/material; // Replace 'mui' with the correct Material-UI import

  let uname = "";

  const LoginPage = () => (
    <Box className="login-page" display="flex" alignItems="center" justifyContent="center" height="100vh">
      <Box className="form" textAlign="center" p={3} boxShadow={3} borderRadius={10} bgcolor="rgba(255, 255, 255, 0.8)">
        <form className="login-form" onSubmit={handleLogin}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );

  const Message = ({ type, message }) => {
    if (type === "my") {
      return (
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Box bgcolor="#dcf8c6" borderRadius={10} padding={1} maxWidth="80%">
            <Typography variant="body2" fontWeight="bold" marginBottom={1}>
              You
            </Typography>
            <Typography variant="body1">{message.text}</Typography>
          </Box>
        </Box>
      );
    } else if (type === "other") {
      return (
        <Box display="flex" justifyContent="flex-start" marginBottom={2}>
          <Box bgcolor="#fff" boxShadow={1} borderRadius={10} padding={1} maxWidth="80%">
            <Typography variant="body2" fontWeight="bold" marginBottom={1}>
              {message.username}
            </Typography>
            <Typography variant="body1">{message.text}</Typography>
          </Box>
        </Box>
      );
    } else if (type === "update") {
      return (
        <Typography variant="body2" fontStyle="italic" color="#888" textAlign="center" padding={1}>
          {message}
        </Typography>
      );
    }
  };

  const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const handleLogin = (event) => {
      event.preventDefault();

      if (uname.length >= 4) {
        socket.emit("newuser", uname);
        // Switch to the chat screen
        ReactDOM.render(<ChatScreen />, appContainer);
      } else {
        alert("Username should be four letters or more.");
      }
    };

    const handleExitChat = () => {
      socket.emit("exituser", uname);
      window.location.href = window.location.origin;
    };

    const handleSendMessage = () => {
      if (messageInput.trim() === "") {
        return;
      }

      const newMessage = {
        type: "my",
        text: messageInput,
      };

      socket.emit("chat", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessageInput("");
    };

    return (
      <Box className="chat-screen" backgroundImage="url('pics/aaa.jpg')" backgroundRepeat="no-repeat" backgroundSize="cover">
        <Box className="header" bgcolor="#075e54" color="#fff" padding={2} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Chatroom</Typography>
          <Button variant="outlined" onClick={handleExitChat}>
            Exit
          </Button>
        </Box>
        <Box className="messages" flex={1} padding={2} overflowY="auto">
          {messages.map((message, index) => (
            <Message key={index} type={message.type} message={message} />
          ))}
        </Box>
        <Box className="typebox" display="flex" alignItems="center" padding={2} backgroundColor="transparent">
          <TextField
            id="message-input"
            placeholder="Type Message"
            variant="outlined"
            fullWidth
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    );
  };

  ReactDOM.render(<LoginPage />, appContainer);
});
