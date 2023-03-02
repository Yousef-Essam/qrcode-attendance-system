const fs = require('fs/promises');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const file = await fs.readFile('views/src/students/index.html', 'utf-8');
    res.end(file);
})

router.get('/script', async (req, res) => {
    const file = await fs.readFile('views/src/students/students.js', 'utf-8');
    res.setHeader('Content-Type', 'text/javascript')
    res.send(file);
})

router.post('/', async (req, res) => {
    const file = await fs.readFile('views/src/students/index.html', 'utf-8');
    res.end(file);
})

router.get('/login', async (req, res) => {
    const file = await fs.readFile('views/src/students/login.html', 'utf-8');
    res.end(file);
})

router.post('/scanRes', (req, res) => {
    if (req.currentQRs.search(req.body.qr)) {
        console.log(`Attendance is successful with ${req.body.qr}`)
        res.status(200);
    }
    else {
        console.log(`Attendance failed with ${req.body.qr}`)
        res.status(404);
    }
    res.send();
})

module.exports = router;