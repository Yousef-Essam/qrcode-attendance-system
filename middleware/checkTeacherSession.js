const teachersSessions = require('../models/teacherSession');

const checkTeacherSession = async (req, res, next) => {
    if (!req.cookies.t_sesID)
        req.logged = false
    else {
        let teacher = await teachersSessions.check(req.cookies.t_sesID);

        if (!teacher) {
            res.clearCookie('t_sesID');
            req.logged = false;
        } else {
            req.teacher = teacher;
            req.logged = true;
        }
    }

    next();
};

module.exports = checkTeacherSession;