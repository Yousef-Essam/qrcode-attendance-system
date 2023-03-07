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
const studentsSessions = require('./models/studentSession');
const checkTeacherSession = require('./middleware/checkTeacherSession');

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
        await studentsSessions.destroySession(req.query.student_id)
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
io.on('connection', (socket) => {
    console.log('Connection Established!!');

    socket.on('start', async (course, lecture) => {
        if (currentQRs[socket.id]) return;

        currentQRs[socket.id] = {};
        console.log(`${socket.id} started generating QR codes for ${course} Lecture ${lecture}`)
        currentQRs[socket.id].qr = generateRandomString(50);
        currentQRs[socket.id].teacher = '';
        currentQRs[socket.id].course = course;
        currentQRs[socket.id].lecture = lecture;
        console.log(`QR string is ${currentQRs[socket.id].qr}`)
        socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))

        currentQRs[socket.id].timer = setInterval(async () => {
            currentQRs[socket.id].qr = generateRandomString(50)
            socket.emit('qr-change', await qrcode.toDataURL(currentQRs[socket.id].qr))
            console.log(`QR Code Changed for ${socket.id}!`)
            console.log(`QR string is ${currentQRs[socket.id].qr}`)
        }, 5000);
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

server.listen(port, () => {
    console.log(`Server Listening at 127.0.0.1`)
})