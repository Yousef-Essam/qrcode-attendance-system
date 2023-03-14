const video = document.getElementById('cam-container');
const mainPage = document.getElementById('main-page');
const camPage = document.getElementById('camPage');
const resultPage = document.getElementById('resultPage');
const scan = document.getElementById('scan');
const camClose = document.getElementById('cam-close');
const next = document.getElementById('next');
const status = document.getElementById('status');
const resultImg = document.getElementById('resultImg');

// Toggle Addition
const toggleCam = document.getElementById('toggleCam');
let cams;
let chosenCam = 0;

// End Toggle Code

const transTime = 1000;

let crd;

scan.onclick = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        crd = pos.coords;
        
        camPage.style.display = 'block';
        await qrScanner.start();
        setTimeout(() => {
            camPage.style.left = 0;
            mainPage.style.left = '-100vw';
            setTimeout(() => {
                mainPage.style.display = 'none';
            }, transTime);
        }, 100)

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    }, (err) => {
        console.log(err);
    }, {
        enableHighAccuracy: true
    });
};

camClose.onclick = () => {
    mainPage.style.display = 'block';
    setTimeout(() => {
        mainPage.style.left = 0;
        camPage.style.left = '-100vw';
        setTimeout(() => {
            qrScanner.stop();
            camPage.style.display = 'none';
        }, transTime);
    }, 50)
};

// navigator.mediaDevices.getUserMedia({
//     audio: false,
//     video: { width: 1280, height: 720, facingMode: 'environment' }
// })
// .then((mediaStream) => {
//     video.srcObject = mediaStream;
//     video.onloadedmetadata = () => {
//         video.play();
//     };
// })
// .catch((err) => {
//     console.error(`${err.name}: ${err.message}`);
// });

const qrScanner = new QrScanner(video, (result) => {
    qrScanner.stop();
    // let body = {qr: result.data};
        // Start Location
    let body = {};
    body.qr = result.data;
    body.location = {};
    body.location.longitude = crd.longitude;
    body.location.latitude = crd.latitude;
    body.location.accuracy = crd.accuracy;
    console.log(JSON.stringify(body))
    fetch('/students/scanRes', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json"}})
    .then((response) => {
        if (response.status === 200) {
            next.innerHTML = 'Sounds Nice!';
            status.innerHTML = 'Attendance recorded successfully!';
            status.style.color = 'black';
            resultImg.src = '/images/success.svg';
            next.onclick = backToMain;
        } else if (response.status === 404) {
            console.log('QR code does not exist')
            next.innerHTML = 'Try Again';
            status.innerHTML = 'Invalid scan';
            status.style.color = '#E21E2C';
            resultImg.src = '/images/failure.svg';
            next.onclick = backToCam;
        } else if (response.status === 400) {
            next.innerHTML = 'Rest Assured!';
            status.innerHTML = 'Attendance already recorded!';
            status.style.color = 'black';
            resultImg.src = '/images/already.png';
            next.onclick = backToMain;
        }

        setTimeout(() => {
            resultPage.style.display = 'block';
            setTimeout(() => {
                resultPage.style.left = 0;
                camPage.style.left = '-100vw';
                setTimeout(() => {
                    camPage.style.display = 'none';
                }, transTime);
            }, 50)
        }, 50)
        
    })
    }, {
        highlightScanRegion: true
    });

window.onload = () => {
    qrScanner.start().then(() => qrScanner.stop());
}

// Start Toggle Again
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
})
.then((mediaStream) => {
    qrScanner.start().then(() => qrScanner.stop());
    mediaStream.getTracks().forEach(track => {track.stop();});

    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
        cams = devices.filter((val) => val.kind === 'videoinput');
        startCamera(chosenCam);
    })
})
.catch((err) => {
    console.error(`${err.name}: ${err.message}`);
});

toggleCam.onclick = () => {
    if (chosenCam === -1) chosenCam = 0;
    else if (chosenCam === cams.length - 1) chosenCam = 0;
    else chosenCam++;

    startCamera(chosenCam)
}
// End Toggle Again

function startCamera(index) {
    if (window.stream)
        window.stream.getTracks().forEach(track => {track.stop();});
    
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: 1280, height: 720, deviceId: {exact: cams[index].deviceId} }
    })
    .then((mediaStream) => {
        window.stream = mediaStream;
        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
            video.play();
        };
    })
    .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
    });
}

function backToMain() {
    mainPage.style.display = 'block';
    mainPage.style.left = 0;
    resultPage.style.left = '-100vw';
    setTimeout(() => {
        resultPage.style.display = 'none';
    }, transTime);
}

function backToCam() {
    navigator.geolocation.getCurrentPosition((pos) => {
        crd = pos.coords;
        
        camPage.style.display = 'block';
        qrScanner.start();
        setTimeout(() => {
            camPage.style.left = 0;
            resultPage.style.left = '-100vw';
            setTimeout(() => {
                resultPage.style.display = 'none';
            }, transTime);
        }, 100)

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