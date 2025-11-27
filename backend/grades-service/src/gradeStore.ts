interface GradeRecord {
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  faculty: string;
  grade: string;
}

export const grades: GradeRecord[] = [
  {
    studentEmail: "charlie@student.edu",
    courseId: "CS101",
    courseTitle: "Intro to Computer Science",
    faculty: "prof1@mail.com",
    grade: "A"
  },
  {
    studentEmail: "bob@student.edu",
    courseId: "MATH201",
    courseTitle: "Discrete Math",
    faculty: "prof2@mail.com",
    grade: "B+"
  },
  {
    studentEmail: "alice@student.edu",
    courseId: "IT200",
    courseTitle: "Web Development",
    faculty: "prof3@mail.com",
    grade: "A-"
  }
];

export function getGradesForStudent(email: string) {
  return grades.filter(g => g.studentEmail === email);
}