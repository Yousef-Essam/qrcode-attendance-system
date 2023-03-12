const fs = require('fs/promises');
const express = require('express');
const router = express.Router();
const checkStudentSession = require('../middleware/checkStudentSession');
const studentsSessions = require('../models/studentSession');
const students = require('../models/student');
const lectures = require('../models/lecture');

router.use((req, res, next) => {
    console.log(req.headers['user-agent']);
    next()
})
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
        res.cookie('s_sesID', s_sesID, {
            maxAge: 1000*60*60*24*365
        });
        await students.setLogged(req.body.student_id);
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
    // const file = await fs.readFile('views/src/students/index.html', 'utf-8');
    // res.end(file);
    res.render('src/students/index.ejs', {student_name: req.student.name, student_id: req.student.student_id})
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

router.post('/scanRes', async (req, res) => {
    if (!req.logged) {
        res.status(401).send('Student Not logged in!')
        return;
    }
    // console.log(req.body.location);
    let qrObj = req.currentQRs.search(req.body.qr);
    if (qrObj) {
        console.log(`Teacher Location is: Latitude=${req.currentQRs[qrObj].location.latitude}, Longitude=${req.currentQRs[qrObj].location.longitude}`)
        console.log(`Student Location is: Latitude=${req.body.location.latitude}, Longitude=${req.body.location.longitude}`)
        let d = distance(req.currentQRs[qrObj].location.latitude, req.currentQRs[qrObj].location.longitude, req.body.location.latitude, req.body.location.longitude)
        console.log(`Distance is ${d}m`)
        
        if (d > 200) {
            console.log(`Attendance failed with ${req.body.qr}`)
            res.status(404);
            res.send();
            return;
        }

        let queryResult = await lectures.setAttended(req.student.student_id, req.currentQRs[qrObj].lecture_id);
        if (queryResult.affectedRows === 0) {
            console.log(`Attendance failed with ${req.body.qr}`)
            res.status(404);
            res.send();
            return;
        }
        if (queryResult.changedRows === 0) {
            console.log(`Attendance was already recorded!`);
            res.status(400);
            res.send();
            return;
        }
        console.log(`Attendance is successful with ${req.body.qr}`)
        res.status(200);
    } else {
        console.log(`Attendance failed with ${req.body.qr}`)
        res.status(404);
    }
    res.send();
})

module.exports = router;

function deg2rad(deg) {
    return deg * (Math.PI / 180.0);
}
function distance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * 1000 * c; // Distance in m
return d;
}