CREATE TABLE students (
    student_id VARCHAR(30) PRIMARY KEY,
    name text,
    password VARCHAR(30),
    logged BOOL DEFAULT 0,
    year VARCHAR(10),
    department VARCHAR(30),
    section integer,
    bn integer
);