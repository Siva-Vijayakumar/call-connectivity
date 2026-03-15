const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let clients = [];

wss.on("connection", (ws) => {
    console.log("Client connected");

    clients.push(ws);

    ws.on("message", (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        clients = clients.filter(c => c !== ws);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});