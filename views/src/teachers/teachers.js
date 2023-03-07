const qrC = document.getElementById('qr-container');
const start = document.getElementById('generate');
const stop = document.getElementById('stop');
const modal = document.getElementById('modal');
const courseSelect = document.getElementById('courseSelect');
const lecSelect = document.getElementById('lecSelect');
const newLecForm = document.getElementById('newLecForm');
const downloadBut = document.getElementById('download');
const downloadLink = document.getElementById('downloadLink');
const col = document.getElementById('col');

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
    downloadLink.href = `/teachers/download?course_code=${courseSelect.value}&lecture=${lecSelect.value}`;
    downloadLink.hidden = false;
    downloadLink.click();
    downloadLink.hidden = true;
    socket.connect();
    socket.connect();
}

courseSelect.onchange = () => {
    fetch(`/teachers/getCourseLectures?course_code=${courseSelect.value}`)
    .then((response) => response.json())
    .then((obj) => {
        console.log('Got message');
        console.log(obj);
        overwriteLecSelect(obj)
        lecSelect.disabled = false;
    })
}

lecSelect.onchange = () => {
    if (lecSelect.value === 'new') {
        newLecForm.hidden = false;
        col.value = courseSelect.value;
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

function overwriteLecSelect(newElements) {
    while (lecSelect.children > 2) {
        let children = lecSelect.children;
        lecSelect.removeChild(children[children.length - 2])
    }

    for (let val of newElements) {
        let option = document.createElement('option');
        option.value = val;
        option.innerHTML = `Lecture ${val}`;
        lecSelect.insertBefore(option, lecSelect.children[lecSelect.children.length - 1]);
    }
}