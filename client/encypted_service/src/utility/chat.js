import React, { useState, useEffect } from "react";
import MessageBlock from "./message";
import axios from 'axios';
function Chat() {
    const [serverMessages, setServerMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [chatMssg, setChatMssg] = useState('');
    const [chatUser, setChatUser] = useState('');
    // Create WebSocket connection once when component mounts
    useEffect(() => {
        // Make the GET request to initialize WebSocket connection
                
                // Initialize WebSocket connection
                const webSocket = new WebSocket('ws://localhost:3009/message');
    
                // Handle WebSocket open event
                webSocket.onopen = () => {
                    console.log('Connected to server');
                    setWs(webSocket);
                };
    
                // Handle incoming messages from WebSocket
                webSocket.onmessage = (message) => {
                    console.log('Message received from server:', message.data);
                    setServerMessages(prevMessages => prevMessages.concat(message.data));
                    document.querySelector('.chatMssg').value="";
                };
    
                // Handle WebSocket close event
                webSocket.onclose = () => {
                    console.log('WebSocket connection closed');
                };
    
                // Handle WebSocket error event
                webSocket.onerror = (error) => {
                    console.log('WebSocket error:', error);
                };
    
                // Cleanup WebSocket connection when component unmounts or dependency changes
                return () => {
                    console.log('Cleanup: Closing WebSocket');
                    webSocket.close(); // Properly close the WebSocket connection
                };
            }, []); // Empty dependency array ensures it runs only once when the component mounts

    function selectUser() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            // console.log(`chat mssg is ${chatMssg}`);
            ws.send(`${chatMssg}`); // Send message to the server
          } else {
            console.log("WebSocket is not open yet.");
          }
    }

    // useEffect(() => {
    //     console.log(serverMessages);
    // },[serverMessages]);
    return (
        <div>
            <div>
                <h3>Select a User:</h3>
                <input className="chatMssg" type="text" name="chatMssg" placeholder="messgae" 
                onChange={(evt)=>setChatMssg(evt.target.value)}>
                </input>
                <button onClick={() => selectUser()}>Send</button>
            </div>
            <div>
            {serverMessages.slice().reverse().map((msg, index) => (
                    <MessageBlock key={index} message={msg} />
                ))}
            </div>    
        </div>
    );
}

export default Chat;
