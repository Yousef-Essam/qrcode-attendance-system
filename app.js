const fs = require('fs/promises');
const express = require('express');
const {Server} = require('socket.io');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const logger = require('./middleware/logger');
const qrcode = require('qrcode')
const generateRandomString = require('./utilities/generateRandomString')
const studentsController = require('./controllers/students');
const teachersController = require('./controllers/teachers');
const cookieParser = require('cookie-parser');
const students = require('./models/student');
const teachers = require('./models/teacher');
const courses = require('./models/course');
const lectures = require('./models/lecture');
const studentsSessions = require('./models/studentSession');
const checkTeacherSession = require('./middleware/checkTeacherSession');
const teachersSessions = require('./models/teacherSession');

const qrValidTime = 3000;

let currentQRs = {};
currentQRs.search = function (qr) {
    for (let id in this)
        if (this[id].qr === qr) return id;
}

// app.use((req, res, next) => {
//     req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
// })

app.set('view engine', 'ejs') 

app.use(logger);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())
app.use('/students', (req, res, next) => {
    req.currentQRs = currentQRs;
    next()
});
app.use('/students', studentsController);
app.use('/teachers', teachersController);

const port = process.env.PORT || 80;
// const host = require('os').networkInterfaces()['Wi-Fi'][1].address;

app.get('/showIP', (req, res) => {
    console.log(req.ip);
    console.log(req.headers['x-forwarded-for'])
    res.send(req.ip);
})

app.get('/', checkTeacherSession, async (req, res) => {
    if (req.logged) {
        res.redirect('/teachers');
        return;
    }
    const file = await fs.readFile('views/src/home.html', 'utf-8');
    res.setHeader('Content-Type', 'text/html')
    res.send(file);
})

app.get('/tailwind', async (req, res) => {
    const file = await fs.readFile('views/build/tailwind.css', 'utf-8');
    res.setHeader('Content-Type', 'text/css')
    res.send(file);
})

app.get('/basic', async (req, res) => {
    const file = await fs.readFile('views/src/basic.css', 'utf-8');
    res.setHeader('Content-Type', 'text/css')
    res.send(file);
})

// For development purposes
// Start Dev
app.get('/resetStudent', async (req, res) => {
    if (req.query.username === 'qrcatt_admin' && req.query.password === 'iamtheadmin_pleaseletmein') {
        await students.resetLogged(req.query.student_id);
        await studentsSessions.destroyStudentSession(req.query.student_id)
        res.send('Student Account Reset Successfully!!');
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.get('/getStudents', async (req, res) => {
    if (req.query.username === 'qrcatt_admin' && req.query.password === 'iamtheadmin_pleaseletmein') {
        res.send(await students.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.get('/getTeachers', async (req, res) => {
    if (req.query.username === 'qrcatt_admin' && req.query.password === 'iamtheadmin_pleaseletmein') {
        res.send(await teachers.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.get('/getCourses', async (req, res) => {
    if (req.query.username === 'qrcatt_admin' && req.query.password === 'iamtheadmin_pleaseletmein') {
        res.send(await courses.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.post('/getStudents', async (req, res) => {
    if (req.body.username === 'qrcatt_admin' && req.body.password === 'iamtheadmin_pleaseletmein') {
        res.send(await students.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.post('/getTeachers', async (req, res) => {
    if (req.body.username === 'qrcatt_admin' && req.body.password === 'iamtheadmin_pleaseletmein') {
        res.send(await teachers.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})

app.post('/getCourses', async (req, res) => {
    if (req.body.username === 'qrcatt_admin' && req.body.password === 'iamtheadmin_pleaseletmein') {
        res.send(await courses.read());
    } else {
        res.status(403).send('7aramyyyyyyyyyyyy');
    }
})
// End Dev

// Periodic Generation of QR Code for teachers API
io.on('connection', async (socket) => {
    console.log('Connection Established!!');
    // Check Session Existence
    let t_sesID = parseCookie(socket.handshake.headers.cookie).t_sesID;
    if (await teachersSessions.check(t_sesID))
        console.log(`${t_sesID} is allowed to connect!`)
    else {
        console.log('Not Allowed. Disconnected!!');
        socket.disconnect();
        return;
    }

    socket.on('start', async (course, lecture, latitude, longitude, accuracy) => {
        if (currentQRs[socket.id]) return;
        let teacher = await teachersSessions.check(parseCookie(socket.handshake.headers.cookie).t_sesID);
        if (!teachers.teaches(teacher.teacher_id, course)) return;
        let location = {
            longitude: longitude,
            latitude: latitude,
            accuracy: accuracy
        }
        currentQRs[socket.id] = {};
        console.log(`${socket.id} started generating QR codes for ${course} Lecture ${lecture}`)
        currentQRs[socket.id].teacher_id = teacher.teacher_id;
        currentQRs[socket.id].course = course;
        currentQRs[socket.id].lecture = lecture;
        currentQRs[socket.id].lecture_id = await lectures.getID(teacher.teacher_id, lecture, course);
        currentQRs[socket.id].qr = `${currentQRs[socket.id].course}-${currentQRs[socket.id].lecture}-${generateRandomString(50)}`;
        console.log(location);
        currentQRs[socket.id].location = location;
        console.log(`QR string is ${currentQRs[socket.id].qr}`)
        socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))

        currentQRs[socket.id].timer = setInterval(async () => {
            currentQRs[socket.id].qr = `${currentQRs[socket.id].course}-${currentQRs[socket.id].lecture}-${generateRandomString(50)}`;
            socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))
            console.log(`QR Code Changed for ${socket.id}!`)
            console.log(`QR string is ${currentQRs[socket.id].qr}`)
        }, qrValidTime);
    });

    socket.on('stop', () => {
        if (!currentQRs[socket.id]) return;

        clearInterval(currentQRs[socket.id].timer);
        delete currentQRs[socket.id];
        console.log(`${socket.id} stopped generating QR codes!!`)
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!!`)
        if (!currentQRs[socket.id]) return;

        clearInterval(currentQRs[socket.id].timer);
        delete currentQRs[socket.id];
    });
})

function parseCookie(cookie) {
    let cookies = cookie.split('; ');
    let parsedCookies = {};
    for (let val of cookies) {
        let splitVal = val.split('=')
        parsedCookies[splitVal[0]] = splitVal[1];
    }

    return parsedCookies;
}

server.listen(port, () => {
    console.log(`Server Listening at 127.0.0.1`)
})