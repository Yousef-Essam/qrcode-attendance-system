const fs = require('fs/promises');
const express = require('express');
const router = express.Router();
const checkStudentSession = require('../middleware/checkStudentSession');
const studentsSessions = require('../models/studentSession');
const students = require('../models/student')

router.use(checkStudentSession);

router.get('/login', async (req, res) => {
    if (!req.logged) {
        const file = await fs.readFile('views/src/students/login.html', 'utf-8');
        res.end(file);
    }
    else res.redirect('/students');
})

router.post('/login', async (req, res) => {
    if (req.logged) {
        res.status(403).send('Student is already Logged in!');
        return;
    }

    let student = await students.authenticate(req.body.student_id, req.body.password);
    // Authentication
    if (student && !student.logged) {
        let s_sesID = await studentsSessions.createSession(req.body.student_id)
        res.cookie('s_sesID', s_sesID);
        res.redirect('/students')
    } else {
        res.redirect('/students/login')
    }
})

router.get('/', async (req, res) => {
    if (!req.logged) {
        res.redirect('/students/login');
        return;
    }
    const file = await fs.readFile('views/src/students/index.html', 'utf-8');
    res.end(file);
})

router.get('/script', async (req, res) => {
    if (!req.logged) {
        res.status(401).send('Student Not logged in!')
        return;
    }
    const file = await fs.readFile('views/src/students/students.js', 'utf-8');
    res.setHeader('Content-Type', 'text/javascript')
    res.send(file);
})

router.post('/scanRes', (req, res) => {
    if (!req.logged) {
        res.status(401).send('Student Not logged in!')
        return;
    }
    
    if (req.currentQRs.search(req.body.qr)) {
        console.log(`Attendance is successful with ${req.body.qr}`)
        res.status(200);
    } else {
        console.log(`Attendance failed with ${req.body.qr}`)
        res.status(404);
    }
    res.send();
})

module.exports = router;