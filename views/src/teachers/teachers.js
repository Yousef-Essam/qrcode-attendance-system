const qrC = document.getElementById('qr-container');
const start = document.getElementById('generate');
const stop = document.getElementById('stop');
const modal = document.getElementById('modal');
const courseSelect = document.getElementById('courseSelect');
const lecSelect = document.getElementById('lecSelect');
const newLecForm = document.getElementById('newLecForm');
const downloadBut = document.getElementById('download');
const downloadLink = document.getElementById('downloadLink');

let socket = io();

downloadBut.onclick = () => {
    if (courseSelect.value === 'title' || lecSelect.value === 'title') {
        alert('Please Choose a Valid Course and Lecture Number.');
        return;
    }
    if (lecSelect.value === 'new') {
        alert('Please Add the lecture first.');
        return;
    }
    downloadLink.href = `/teachers/download?course=${courseSelect.value}&lecture=${lecSelect.value}`;
    downloadLink.hidden = false;
    downloadLink.click();
    downloadLink.hidden = true;
    socket.connect();
    socket.connect();
}

courseSelect.onchange = () => {
    lecSelect.disabled = false;
}

lecSelect.onchange = () => {
    if (lecSelect.value === 'new') {
        newLecForm.hidden = false;
    } else {
        newLecForm.hidden = true;
    }
}

start.onclick = (e) => {
    if (courseSelect.value === 'title' || lecSelect.value === 'title') {
        alert('Please Choose a Valid Course and Lecture Number.');
        return;
    }
    if (lecSelect.value === 'new') {
        alert('Please Add the lecture first.');
        return;
    }
    showModal();
    socket.emit('start', courseSelect.value, lecSelect.value);
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