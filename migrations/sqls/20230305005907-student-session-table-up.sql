CREATE TABLE students_sessions (
    s_sesID VARCHAR(50),
    student_id VARCHAR(30),
    PRIMARY KEY (s_sesID),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);