CREATE TABLE teachers_sessions (
    t_sesID VARCHAR(50),
    teacher_id VARCHAR(30),
    PRIMARY KEY (t_sesID),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);