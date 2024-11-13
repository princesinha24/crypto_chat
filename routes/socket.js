// SocketService.js
const { Router } = require('express');
const ws = require('ws');
const { server } = require('../index'); // Import the server instance

class SocketService {
    constructor() {
        console.log("Socket service started");
        this.wss = new ws.Server({server}); // Attach WebSocket server to the existing HTTP server
        this.setupSocket();
    }

    setupSocket() {
        this.wss.on("connection", (ws) => {
            console.log("WebSocket connected");

            ws.on('message', (data) => {
                console.log(`Client message: ${data}`);

                // Broadcast message to all connected clients
                this.wss.clients.forEach((client) => {
                    if (client.readyState === ws.OPEN) {
                        client.send(data);
                    }
                });
            });

            ws.on('close', () => {
                console.log("Connection closed");
            });
        });
    }
}

// Initialize WebSocket service


const router = Router();
router.get('/', (req, res) => {
    console.log("HTTP request received on /");
    const webconnection = new SocketService();
    res.send("WebSocket server is running");
});

// module.exports = router;
