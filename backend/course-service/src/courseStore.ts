export interface Course {
    id: string;
    code: string;
    title: string;
    faculty: string;
}

const courses = new Map<string, Course>()

// --- PRELOADED SAMPLE DATA ---
const SAMPLE_DATA: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    title: "Introduction to Computer Science",
    faculty: "dr.santos@school.edu"
  },
  {
    id: "cs201",
    code: "CS201",
    title: "Data Structures & Algorithms",
    faculty: "prof.delacruz@school.edu"
  },
  {
    id: "it110",
    code: "IT110",
    title: "Web Development Fundamentals",
    faculty: "ms.reyes@school.edu"
  },
  {
    id: "math121",
    code: "MATH121",
    title: "Discrete Mathematics",
    faculty: "mr.lopez@school.edu"
  }
];

// Load sample data into Map
for (const c of SAMPLE_DATA) {
  courses.set(c.id, c);
}

export function getAllCourses() {
    return Array.from(courses.values())
}

export function createCourse(code: string, title: string, faculty: string) {
    const id = Math.random().toString(36).substring(2, 9)

    const course: Course = { id, code, title, faculty }
    courses.set(id, course)

    return course
}