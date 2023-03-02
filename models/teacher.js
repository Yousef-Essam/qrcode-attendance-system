const Client = require('./client');
const Model = require('./Model');
const courses = require('./course')

let teachers = new Model('teachers');

teachers.addCourse = async (teacher_id, course_code) => {
    return await courses.teachers.create({course_code: course_code, teacher_id: teacher_id})
}

teachers.deleteCourse = async (teacher_id, course_code) => {
    return await courses.teachers.delete({course_code: course_code, teacher_id: teacher_id})
}

teachers.getCourses = async (teacher_id) => {
    return await courses.teachers.read([course_code], {teacher_id: teacher_id})
}

teachers.teaches = async (teacher_id, course_code) => {
    return (await teachers.getCourses(teacher_id)).indexOf(course_code) !== -1;
}

module.exports = teachers;