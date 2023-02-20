const video = document.querySelector('video');
const constraints = {
    audio: true,
    video: { width: 1280, height: 720 }
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
    qrScanner.start();
}