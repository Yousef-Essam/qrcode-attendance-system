const video = document.getElementById('cam-container');
const mainPage = document.getElementById('main-page');
const camPage = document.getElementById('camPage');
const resultPage = document.getElementById('resultPage');
const scan = document.getElementById('scan');
const camClose = document.getElementById('cam-close');
const next = document.getElementById('next');
const status = document.getElementById('status');

const transTime = 1000;

scan.onclick = () => {
    camPage.style.display = 'block';
    qrScanner.start();
    setTimeout(() => {
        camPage.style.left = 0;
        mainPage.style.left = '-100vw';
        setTimeout(() => {
            mainPage.style.display = 'none';
        }, transTime);
    }, 100)
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

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1280, height: 720, facingMode: 'environment' }
})
.then((mediaStream) => {
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
        video.play();
    };
})
.catch((err) => {
    console.error(`${err.name}: ${err.message}`);
});

const qrScanner = new QrScanner(video, (result) => {
    qrScanner.stop();
    let body = {qr: result.data};
    fetch('/students/scanRes', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json"}})
    .then((response) => {
        if (response.status === 200) {
            next.innerHTML = 'Sounds Nice!';
            status.innerHTML = 'recorded';
            next.onclick = backToMain;
        } else if (response.status === 404) {
            console.log('QR code does not exist')
            next.innerHTML = 'Try Again';
            status.innerHTML = 'failed';
            next.onclick = backToCam;
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

navigator.geolocation.getCurrentPosition((pos) => {
    const crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
}, (err) => {
    console.log(err);
}, {
    enableHighAccuracy: true
});

function backToMain() {
    mainPage.style.display = 'block';
    mainPage.style.left = 0;
    resultPage.style.left = '-100vw';
    setTimeout(() => {
        resultPage.style.display = 'none';
    }, transTime);
}

function backToCam() {
    camPage.style.display = 'block';
    qrScanner.start();
    setTimeout(() => {
        camPage.style.left = 0;
        resultPage.style.left = '-100vw';
        setTimeout(() => {
            resultPage.style.display = 'none';
        }, transTime);
    }, 100)
}