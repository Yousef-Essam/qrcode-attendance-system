const Client = require('./client');
const Model = require('./Model');
const courses = require('./course')

let teachers = new Model('teachers');

teachers.authenticate = async (username, password) => {
    return (await teachers.read('*', {username: username, password: password}))[0];
}

teachers.addCourse = async (teacher_id, course_code) => {
    return await courses.teachers.create({course_code: course_code, teacher_id: teacher_id})
}

teachers.deleteCourse = async (teacher_id, course_code) => {
    return await courses.teachers.delete({course_code: course_code, teacher_id: teacher_id})
}

teachers.getCourses = async (teacher_id) => {
    return (await Model.query(`SELECT courses.course_code, courses.name FROM courses INNER JOIN courses_teachers ON courses.course_code = courses_teachers.course_code WHERE courses_teachers.teacher_id = '${teacher_id}';`))
}

teachers.teaches = async (teacher_id, course_code) => {
    myMap = (await teachers.getCourses(teacher_id)).map((val) => val.course_code)
    return myMap.indexOf(course_code) !== -1;
}

module.exports = teachers;