const qrC = document.getElementById('qr-container');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
let socket = io();

start.onclick = (e) => {
    socket.emit('start');
}

stop.onclick = (e) => {
    socket.emit('stop');
    qrC.src = '';
}

socket.on('qr-change', (newSrc) => {
    qrC.src = newSrc;
})