const Client = require('./client');
const Model = require('./Model');

let lectures = new Model('lectures');
lectures.checkIns = new Model('check_ins');

lectures.addLecture = async (teacher_id, number, course_code) => {
    const lecture_id = (await lectures.create({teacher_id: teacher_id, number: number, course_code: course_code})).insertId;
    const studs = await courses.getStudents(course_code);

    for (let val of studs) {
        await lectures.checkIns.create({student_id: val.student_id, lecture_id: lecture_id});
    }
}

module.exports = lectures;