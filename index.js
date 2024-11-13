const express = require('express');

const {execSync, execFileSync} = require('child_process'); 
const cors = require('cors');
const authTokenInstance = require('./routes/authentication');

const { start } = require('repl');
const cookieParser = require('cookie-parser');
const http = require('http');
const app = express();
const ws = require('ws');
const { client } = require('websocket');
const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

class SocketService {
    constructor() {
        console.log("Socket service started");
        this.wss = new ws.Server({server}); // Attach WebSocket server to the existing HTTP server
        this.setupSocket();
    }
    getPublicKey(flag){
        if(flag){
            return 3873050293;
        }
        return 8467212529;
    }

    getPrivateKey(flag){
        if(flag){
            return 557810486223;
        }
        return 557506775170;
    }

    #encryptMssg(data){
        try{
            // execfileSync because execSync can't handle space separated value;
            let private_key=this.getPrivateKey(1);
            let publicKey=this.getPublicKey(1);
            console.log("Private key: ", private_key);
            let stdout=execFileSync('python3', ['./python_utility/check.py', 'send_message', data, private_key, publicKey] , { encoding: 'utf-8' }); 
            console.log("Successfully executed");
            let val=JSON.parse(stdout);
            console.log(val);   
            return val;
        }
        catch(err){
            console.log(err);
        }
    }

    #decryptMssg(data){
        try{
            // execfileSync because execSync can't handle space separated value;
            let private_key=this.getPrivateKey(0);
            let publicKey=this.getPublicKey(0);
            console.log("Private key: ", private_key);
            let stdout=execFileSync('python3', ['./python_utility/check.py', 'receive_message', data, private_key, publicKey] , { encoding: 'utf-8' }); 
            console.log("Successfully executed");
            let val=JSON.parse(stdout);
            console.log(val);   
            return val;
        }
        catch(err){
            console.log(err);
        }
    }

    setupSocket() {
        this.wss.on("connection", (ws,req) => {
            let friendId=0;
            if(req.headers.cookie){
                let authToken = req.headers.cookie.replace('authToken=', '');
                if(authToken && authTokenInstance.verifyToken(authToken)){
                    let data=authTokenInstance.verifyGetToken(authToken);
                    console.log(data);
                    ws.user_id=data.user_id;
                }
                friendId=79;
                console.log("WebSocket connected");
                
            }
            ws.on('message', (data) => {
                console.log(`Client message: ${data}`);
                let val=this.#encryptMssg(data);
                console.log("Message encrypted");
                val=this.#decryptMssg(val['encrypt_mssg']);
                // Broadcast message to all connected clients
                console.log(this.wss.clients.size);
                this.wss.clients.forEach((client) => {
                    if (client.readyState === ws.OPEN && client.user_id === friendId) {
                        console.log(client.user_id);
                        const message = typeof val['decrypt_mssg'] === 'string' ? val['decrypt_mssg'] : val['decrypt_mssg'].toString('utf-8');
                        client.send(message);
                    }
                });
            });

            ws.on('close', () => {
                console.log("Connection closed");
            });
        });
    }
}

const socketService = new SocketService();


class EncryptedService{
    constructor(){
        if(!EncryptedService.instance){
            this.PORTNUMBER=3009;
            this.#startServer();
            this.User();
            return EncryptedService.instance=this;
        }
        console.log("Server already started");
        return EncryptedService.instance=this;
    }

    #startServer(){
        server.listen(this.PORTNUMBER, () => {
            console.log(`Server started on http://localhost:${this.PORTNUMBER}`);
        });
    }

    #execute(pwd){
        try{
            // execfileSync because execSync can't handle space separated value
            let stdout=execFileSync('python3', ['./python_utility/check.py', 'hash_string_256', pwd] , { encoding: 'utf-8' }); 
            console.log("Successfully executed");
            val=JSON.parse(stdout);
        }
        catch(err){
            console.log(err);
        }
    }

    User(){
        app.use('/user', require('./routes/user'));
    }

    getDetails(req, res){
        console.log("Request received");
        res.send(`Hello World. you are sucessfully connected to the server`);
    }
}

let EncryptedServiceInstance=new EncryptedService();
app.get('/', EncryptedServiceInstance.getDetails);

module.exports=server;