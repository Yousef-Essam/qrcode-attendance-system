const Client = require('./client');
const Model = require('./Model');
const courses = require('./course')

let students = new Model('students');

students.authenticate = async (student_id, password) => {
    return (await students.read('*', {student_id: student_id, password: password}))[0];
}

students.addCourse = async (student_id, course_code) => {
    return await courses.students.create({course_code: course_code, student_id: student_id})
}

students.deleteCourse = async (student_id, course_code) => {
    return await courses.students.delete({course_code: course_code, student_id: student_id})
}

students.getCourses = async (student_id) => {
    return await courses.students.read([course_code], {student_id: student_id})
}

students.isEnrolled = async (student_id, course_code) => {
    return (await students.getCourses(student_id)).indexOf(course_code) !== -1;
}

students.isLogged = async (student_id) => {
    return Boolean((await students.read([logged], {student_id: student_id})).logged);
}

students.setLogged = async (student_id) => {
    try {
        await students.update({logged: 1}, {student_id: student_id});
    } catch (err) {
        throw err;
    }
}

students.resetLogged = async (student_id) => {
    try {
        await students.update({logged: 0}, {student_id: student_id});
    } catch (err) {
        throw err;
    }
}

module.exports = students;