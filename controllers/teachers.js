const fs = require('fs/promises');
const express = require('express');
const router = express.Router();
const checkTeacherSession = require('../middleware/checkTeacherSession');

router.get('/', checkTeacherSession, async (req, res) => {
    const file = await fs.readFile('views/src/teachers/index.html', 'utf-8');
    res.end(file);
})

router.get('/script', checkTeacherSession, async (req, res) => {
    const file = await fs.readFile('views/src/teachers/teachers.js', 'utf-8');
    res.setHeader('Content-Type', 'text/javascript')
    res.send(file);
})

router.get('/addLecture', checkTeacherSession, (req, res) => {
    console.log(`Lecture ${req.query.lecture} is to be added`)
    res.redirect('/teachers');
})

router.get('/download', checkTeacherSession, async (req, res) => {
    console.log(req.query)
    res.download('../file.json');
})

router.get('/logout', checkTeacherSession, async (req, res) => {
    res.redirect('/teachers')
})

module.exports = router;