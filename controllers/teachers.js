const fs = require('fs/promises');
const express = require('express');
const router = express.Router();
const checkTeacherSession = require('../middleware/checkTeacherSession');
const teachers = require('../models/teacher');
const teachersSessions = require('../models/teacherSession');
const lectures = require('../models/lecture');
const excelJSON = require('excel2json_converter');

router.use(checkTeacherSession);

router.post('/login', async (req, res) => {
    let teacher = await teachers.authenticate(req.body.username, req.body.password);
    // Authentication
    if (teacher) {
        let t_sesID = await teachersSessions.createSession(teacher.teacher_id)
        res.cookie('t_sesID', t_sesID);
        res.redirect('/teachers')
    } else {
        res.redirect('/')
    }
})

router.get('/', async (req, res) => {
    // Check login session
    if (!req.logged) {
        res.redirect('/');
        return;
    }
    let t_courses = await teachers.getCourses(req.teacher.teacher_id);
    const file = await fs.readFile('views/src/teachers/index.ejs', 'utf-8');
    res.render('src/teachers/index.ejs', {teacher: req.teacher, courses: t_courses});
})

router.get('/script', async (req, res) => {
    // Check login session
    if (!req.logged) {
        res.status(403).send('Unauthorized Teacher Operation!');
        return;
    }
    const file = await fs.readFile('views/src/teachers/teachers.js', 'utf-8');
    res.setHeader('Content-Type', 'text/javascript')
    res.send(file);
})

router.get('/addLecture', async (req, res) => {
    // Check login session
    if (!req.logged) {
        res.status(403).send('Unauthorized Teacher Operation!');
        return;
    }
    // Check if teacher teaches this course
    if (!(await teachers.teaches(req.teacher.teacher_id, req.query.course_code))) {
        res.status(403).send('You are not allowed to access this course.');
        return;
    }
    // Check if the lecture already exists so as not to add it again in the DB
    if (await lectures.exist(req.teacher.teacher_id, req.query.lecture, req.query.course_code)) {
        console.log('Lecture Already Exists!')
        res.redirect('/');
        return;
    }
    await lectures.addLecture(req.teacher.teacher_id, req.query.lecture, req.query.course_code);
    console.log(`Lecture ${req.query.lecture} is to be added to course ${req.query.course_code} by teacher ${req.teacher.name}`)
    res.redirect('/teachers');
})

router.get('/getCourseLectures', async (req, res) => {
    // Check login session
    if (!req.logged) {
        res.status(403).send('Unauthorized Teacher Operation!');
        return;
    }
    // Check if teacher teaches this course
    if (!(await teachers.teaches(req.teacher.teacher_id, req.query.course_code))) {
        res.status(403).send('You are not allowed to access this course.');
        return;
    }
    let v = await lectures.getLectures(req.query.course_code, req.teacher.teacher_id);
    res.send(v.map((val) => val.number))
})

router.get('/download', async (req, res) => {
    // Check login session
    if (!req.logged) {
        res.status(403).send('Unauthorized Teacher Operation!');
        return;
    }
    // Check if teacher teaches this course
    if (!(await teachers.teaches(req.teacher.teacher_id, req.query.course_code))) {
        res.status(403).send('You are not allowed to access this course.');
        return;
    }
    console.log(req.query)
    let lecture_id = await lectures.getID(req.teacher.teacher_id, req.query.lecture, req.query.course_code);
    let attData = await lectures.getAttendance(lecture_id);
    await fs.writeFile('attendance.xlsx', excelJSON.jsonToXLSX(attData, 'Attendance'));
    res.download('attendance.xlsx');
    await fs.unlink('attendance.xlsx');
})

router.get('/logout', async (req, res) => {
    if (!req.logged) {
        res.status(403).send('Unauthorized Teacher Operation!');
        return;
    }
    res.clearCookie('t_sesID');
    teachersSessions.destroySession(req.teacher.t_sesID);
    res.redirect('/')
})

async function download() {

}

module.exports = router;