const qrC = document.getElementById('qr-container');
const start = document.getElementById('generate');
const stop = document.getElementById('stop');
const modal = document.getElementById('modal');
const courseSelect = document.getElementById('courseSelect');
const lecSelect = document.getElementById('lecSelect');
const newLecForm = document.getElementById('newLecForm');
const downloadBut = document.getElementById('download');
const downloadLink = document.getElementById('downloadLink');
const modal_lecture_number = document.getElementById('modal_lecture_number');
const modal_course_code = document.getElementById('modal_course_code');
const modal_course_name = document.getElementById('modal_course_name');
const col = document.getElementById('col');

let socket = io();

// navigator.geolocation.getCurrentPosition((pos) => {
//     const crd = pos.coords;
  
//     console.log('Your current position is:');
//     console.log(`Latitude : ${crd.latitude}`);
//     console.log(`Longitude: ${crd.longitude}`);
//     console.log(`More or less ${crd.accuracy} meters.`);
// }, (err) => {
//     console.log(err);
// }, {
//     enableHighAccuracy: true
// });

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

    navigator.geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;

        if (pos.coords.accuracy > 50) {
            alert('Device not located accurately:\n- Please make sure location services are turned on in this device.\n- Restart the internet connection on this device then refresh the application.')
            return;
        }
        
        showModal();
        socket.emit('start', courseSelect.value, lecSelect.value, crd.latitude, crd.longitude, crd.accuracy);
      
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    }, (err) => {
        console.log(err);
    }, {
        enableHighAccuracy: true
    });
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
    modal_lecture_number.innerHTML = lecSelect.value;
    modal_course_code.innerHTML = courseSelect.value;
    modal_course_name.innerHTML = courseSelect.options[courseSelect.selectedIndex].text;
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