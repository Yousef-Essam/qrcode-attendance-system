const generateRandomString = require('../utilities/generateRandomString');
const Client = require('./client');
const Model = require('./Model');

let teachersSessions = new Model('teachers_sessions');

teachersSessions.createSession = async (teacher_id) => {
    let newID = generateRandomString(30);
    await teachersSessions.create({teacher_id: teacher_id, t_sesID: newID});
    return newID;
}

teachersSessions.check = async (t_sesID) => {
    return (await Model.query(`SELECT * FROM teachers_sessions INNER JOIN teachers ON teachers.teacher_id = teachers_sessions.teacher_id WHERE teachers_sessions.t_sesID = '${t_sesID}'`))[0]
}

teachersSessions.destroySession = async (t_sesID) => {
    try {
        await teachersSessions.delete({t_sesID: t_sesID});
        return true;
    } catch (err) {
        return false;
    }
}

teachersSessions.destroyTeacherSession = async (teacher_id) => {
    try {
        await teachersSessions.delete({teacher_id: teacher_id});
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = teachersSessions;