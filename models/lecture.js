const Client = require('./client');
const Model = require('./Model');
const courses = require('./course');

let lectures = new Model('lectures');
lectures.checkIns = new Model('check_ins');

lectures.addLecture = async (teacher_id, number, course_code) => {
    const lecture_id = (await lectures.create({teacher_id: teacher_id, number: number, course_code: course_code})).insertId;
    console.log(`Lecture of id ${lecture_id} was added to DB`)
    const studs = await courses.students.read(['student_id'], {course_code: course_code})

        let myMap = studs.map((val) => `('${val.student_id}',${lecture_id})`)
        await Model.query(`INSERT INTO check_ins (student_id, lecture_id) VALUES ${myMap.join(',')};`);
}

lectures.exist = async (teacher_id, number, course_code) => {
    return (await lectures.read(['lecture_id'], {teacher_id: teacher_id, course_code: course_code, number: number})).length !== 0
}

lectures.getLectures = async (course_code, teacher_id) => {
    return await lectures.read(['number'], {course_code: course_code, teacher_id: teacher_id})
}

lectures.getID = async (teacher_id, number, course_code) => {
    return (await lectures.read(['lecture_id'], {teacher_id: teacher_id, number: number, course_code: course_code}))[0].lecture_id;
}

lectures.getAttendance = async (lecture_id) => {
    return await Model.query(`SELECT students.student_id, students.name, students.section, students.bn, check_ins.attended FROM students INNER JOIN check_ins ON students.student_id = check_ins.student_id WHERE check_ins.lecture_id = ${lecture_id} ORDER BY section, bn;`)
}

lectures.setAttended = async (student_id, lecture_id) => {
    return await lectures.checkIns.update({attended: 1}, {student_id: student_id, lecture_id: lecture_id});
}

module.exports = lectures;