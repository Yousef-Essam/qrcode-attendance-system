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
const students = require('./models/students')
const teachers = require('./models/teachers')
const courses = require('./models/courses')

let currentQRs = {};

app.use(logger);
app.use(express.static('public'))

const port = 80;
const host = require('os').networkInterfaces()['Wi-Fi'][1].address;

// Periodic Generation of QR Code for teachers API
io.on('connection', (socket) => {
    console.log('Connection Established!!');

    socket.on('start', async () => {
        if (currentQRs[socket.id]) return;

        currentQRs[socket.id] = {};
        console.log(`${socket.id} started generating QR codes!!`)
        currentQRs[socket.id].qr = generateRandomString(50)
        socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))

        currentQRs[socket.id].timer = setInterval(async () => {
            currentQRs[socket.id].qr = generateRandomString(50)
            socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))
            console.log(`QR Code Changed for ${socket.id}!`)
        }, 5000);
    });

    socket.on('stop', () => {
        if (!currentQRs[socket.id]) return;

        clearInterval(currentQRs[socket.id].timer);
        delete currentQRs[socket.id];
        console.log(`${socket.id} stopped generating QR codes!!`)
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!!`)
        if (!currentQRs[socket.id]) return;

        clearInterval(currentQRs[socket.id].timer);
        delete currentQRs[socket.id];
    });
})

server.listen(port, () => {
    console.log(`Server Listening at 127.0.0.1`)
})