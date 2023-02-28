const video = document.querySelector('video');
const box = document.getElementById('box');
const constraints = {
    audio: false,
    video: { width: 1280, height: 1000, facingMode: 'environment' }
};

fetch('/showIP', {method: 'GET'})
.then(response => response.text())
.then(text => {box.innerHTML = text;})

navigator.mediaDevices.getUserMedia(constraints)
.then((mediaStream) => {
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
        video.play();
    };
})
.catch((err) => {
    console.error(`${err.name}: ${err.message}`);
});

const qrScanner = new QrScanner(
    video,
    (result) => {
        box.innerHTML = result.data;
    },
    {
        highlightScanRegion: true
    }
);

window.onload = () => {
    qrScanner.start();
}

navigator.geolocation.getCurrentPosition(success, error, options);

function success(pos) {
    const crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }