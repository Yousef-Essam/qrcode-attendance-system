const video = document.getElementById('cam-container');
const mainPage = document.getElementById('main-page');
const camPage = document.getElementById('camPage');
const resultPage = document.getElementById('resultPage');
const scan = document.getElementById('scan');
const transTime = 1000;



scan.onclick = () => {
    camPage.classList.toggle('hidden');
    setTimeout(() => {
        qrScanner.start();
        camPage.style.left = 0;
        mainPage.style.left = '-100vw';
        setTimeout(() => {
            mainPage.classList.toggle('hidden');
        }, transTime);
    }, 50)
};

const constraints = {
    audio: false,
    video: { width: 1280, height: 720, facingMode: 'environment' }
};

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
        alert(result.data);
    },
    {
        highlightScanRegion: true
    }
);

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