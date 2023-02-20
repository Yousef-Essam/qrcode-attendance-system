CREATE TABLE check_ins (
    ID integer PRIMARY KEY AUTO_INCREMENT,
    lecture_id integer,
    student_id VARCHAR(30),
    attended BOOL DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
);