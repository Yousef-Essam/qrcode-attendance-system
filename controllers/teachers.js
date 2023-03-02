const fs = require('fs/promises');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const file = await fs.readFile('views/src/teachers/index.html', 'utf-8');
    res.end(file);
})

router.get('/script', async (req, res) => {
    const file = await fs.readFile('views/src/teachers/teachers.js', 'utf-8');
    res.setHeader('Content-Type', 'text/javascript')
    res.send(file);
})

module.exports = router;