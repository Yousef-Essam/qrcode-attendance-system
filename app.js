const fs = require('fs/promises');
const express = require('express');
const {Server} = require('socket.io');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const logger = require('./middleware/logger');
const qrcode = require('qrcode')
const generateRandomString = require('./utilities/generateRandomString')

let currentQR = '';

app.use(logger);
app.use(express.static('public'))

const port = 80;
const host = require('os').networkInterfaces()['Wi-Fi'][1].address;

io.on('connection', (socket) => {
    setInterval(async () => {
        currentQR = generateRandomString(50)
        socket.emit('qr-change', await qrcode.toDataURL(currentQR))
        console.log('QR Code Changed!')
    }, 5000);
    console.log('Connection Established!!');
})

server.listen(port, () => {
    console.log(`Server Listening at 127.0.0.1`)
})