import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((message) => [...message, data]);
    });
    return () => socket.off("receive-message");
  }, [socket]);
console.log(messages);
  const userJoinedRoom = () => {
    socket.emit("join-room",room);
    setJoinedRoom("");
  }

  const sendMessage = () => {
    if(!message || !joinedRoom) return;
    socket.emit("send-message",{
      roomId:joinedRoom,
      message,
      user:user || 'Anonymous'    
    })
    setMessage("")
  }

  return <>
  <div style={{ padding: 20 }}>
      <h2>Socket.IO Room Chat</h2>

      {/* USER */}
      <input
        placeholder="Enter name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <br /><br />

      {/* ROOM JOIN */}
      <input
        placeholder="Enter room id (e.g. room1)"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={userJoinedRoom}>Join Room</button>

      <h3>Joined Room: {joinedRoom}</h3>

      <hr />

      {/* CHAT */}
      <input
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      {/* MESSAGES */}
      <div style={{ marginTop: 20 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.user}:</b> {msg.message}
          </div>
        ))}
      </div>
    </div>  
  </>;
};

export default App;
