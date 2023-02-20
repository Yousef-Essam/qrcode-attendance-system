CREATE TABLE lectures (
    lecture_id integer PRIMARY KEY AUTO_INCREMENT,
    number integer,
    teacher_id VARCHAR(30),
    course_code VARCHAR(20),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);