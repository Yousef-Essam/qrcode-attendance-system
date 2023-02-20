CREATE TABLE courses_teachers (
    ID integer PRIMARY KEY AUTO_INCREMENT,
    teacher_id VARCHAR(30),
    course_code VARCHAR(20),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);