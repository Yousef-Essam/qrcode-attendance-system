const generateRandomString = require('../utilities/generateRandomString');
const Client = require('./client');
const Model = require('./Model');

let studentsSessions = new Model('students_sessions');

studentsSessions.createSession = async (student_id) => {
    let newID = generateRandomString(30);
    await studentsSessions.create({student_id: student_id, s_sesID: newID});
    return newID;
}

studentsSessions.check = async (s_sesID) => {
    return (await Model.query(`SELECT * FROM students_sessions INNER JOIN students ON students.student_id = students_sessions.student_id WHERE students_sessions.s_sesID = '${s_sesID}'`))[0]
}

studentsSessions.destroySession = async (s_sesID) => {
    try {
        await studentsSessions.delete({s_sesID: s_sesID});
        return true;
    } catch (err) {
        return false;
    }
}

studentsSessions.destroyStudentSession = async (student_id) => {
    try {
        await studentsSessions.delete({student_id: student_id});
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = studentsSessions;