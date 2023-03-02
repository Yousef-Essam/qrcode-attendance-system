const qrC = document.getElementById('qr-container');
const start = document.getElementById('generate');
const stop = document.getElementById('stop');
const modal = document.getElementById('modal');
let socket = io();

start.onclick = (e) => {
    showModal();
    socket.emit('start');
}

stop.onclick = (e) => {
    hideModal();
    socket.emit('stop');
    qrC.src = '';
}

socket.on('qr-change', (newSrc) => {
    qrC.src = newSrc;
})

function showModal() {
    modal.style.visibility = 'visible';
    modal.style.opacity = 1;
}

function hideModal() {
    setTimeout(() => {modal.style.visibility = 'hidden';}, 500)
    modal.style.opacity = 0;
}