CREATE TABLE courses_students (
    ID integer PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(30),
    course_code VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);