import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import Header from './header';
import AuthService from "./components/AuthService";
import './App.css';

const SOCKET_SERVER_URL = 'http://65.2.127.205:8000'; // Adjust the port if needed

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(''); // To track the username
  const [room, setRoom] = useState('room-id'); 
  const socket = io(SOCKET_SERVER_URL);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [uname, setCurrentUsername] = useState(undefined);

 


  const joinRoom = (room) => {
    socket.emit('joinRoom', room);
    console.log(`Joined room: ${room}`);
  };
 

  useEffect(() => {
   
    
    joinRoom(room);
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [room, socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('event:message', { message: message, username, room });
      setMessage(''); 
    }
  };

  return (
        
    <div>
   <Header/>
      <div>
        
        </div>          
     
     <div  className='all'>
     <div>
        <h2>Messages:</h2>
        <ul>
        <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}</strong>: {msg.text}</p>
        ))}
      </div>
        </ul>
      </div>
      <textarea
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
            <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
                    

      <button onClick={sendMessage}>Send</button>
      <p>You can open new tab or share it to someone</p>
      <a href="/" target="_blank" class="btn btn-primary">
           Create a Test socket
          </a>


     </div>      
   
    
    </div> 
  );
};

export default App;
