const Client = require('./client');
const Model = require('./Model');

let courses = new Model('courses');
courses.students = new Model('courses_students');
courses.teachers = new Model('courses_teachers');

courses.addStudent = async (student_id, course_code) => {
    return await courses.students.create({course_code: course_code, student_id: student_id})
}

courses.deleteStudent = async (student_id, course_code) => {
    return await courses.students.delete({course_code: course_code, student_id: student_id})
}

courses.addTeacher = async (teacher_id, course_code) => {
    return await courses.teachers.create({course_code: course_code, teacher_id: teacher_id})
}

courses.deleteTeacher = async (teacher_id, course_code) => {
    return await courses.teachers.delete({course_code: course_code, teacher_id: teacher_id})
}

courses.getStudents = async (course_code) => {
    return await courses.students.read(['student_id'], {course_code: course_code})
}

courses.getTeachers = async (course_code) => {
    return await courses.students.read(['teacher_id'], {course_code: course_code})
}

module.exports = courses;