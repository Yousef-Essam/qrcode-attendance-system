const Client = require('./client');
const Model = require('./Model');
const courses = require('./course')

let students = new Model('students');

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

module.exports = students;