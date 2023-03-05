const studentsSessions = require('../models/studentSession');

const checkStudentSession = async (req, res, next) => {
    if (!req.cookies.s_sesID)
        req.logged = false
    else {
        let student = await studentsSessions.check(req.cookies.s_sesID);

        if (!student) {
            res.clearCookie('s_sesID');
            req.logged = false;
        } else {
            req.student = student;
            req.logged = true;
        }
    }

    next();
};

module.exports = checkStudentSession;