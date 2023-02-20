const qrC = document.getElementById('qr-container')
let socket = io();

socket.on('qr-change', (newSrc) => {
    qrC.src = newSrc;
})