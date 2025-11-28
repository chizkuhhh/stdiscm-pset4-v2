import { useEffect, useState } from "react";
import { enrollmentApi } from "../api/enrollmentApi";
import { courseApi } from "../api/courseApi";
import { Link } from "react-router-dom";

interface StudentCourse {
  courseId: number;
  code: string;
  title: string;
  faculty: string;
}

interface FacultyCourse {
  id: number;
  code: string;
  title: string;
  capacity?: number | null;
  isOpen: boolean;
}

export default function OwnCourses() {
  const role = localStorage.getItem("role");
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [facultyCourses, setFacultyCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (role === "student") {
          const res = await enrollmentApi.get<StudentCourse[]>("/mine");
          setStudentCourses(res.data);
        } else if (role === "faculty") {
          const res = await courseApi.get<FacultyCourse[]>("/my-courses");
          setFacultyCourses(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [role]);

  async function drop(courseId: number) {
    if (!confirm("Are you sure you want to drop this course?")) return;

    try {
      await enrollmentApi.delete(`/drop/${courseId}`);
      alert("Course dropped.");

      // refresh
      setStudentCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    } catch (err) {
      console.error(err);
      alert("Failed to drop course.");
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {role === "student" ? "My Enrolled Courses" : "Courses You Teach"}
      </h1>

      {role === "student" && (
        <StudentCoursesView courses={studentCourses} onDrop={drop} />
      )}

      {role === "faculty" && <FacultyCoursesView courses={facultyCourses} />}
    </div>
  );
}

/* ----------------------------------------------------------
   STUDENT VIEW COMPONENT
---------------------------------------------------------- */
function StudentCoursesView({
  courses,
  onDrop,
}: {
  courses: StudentCourse[];
  onDrop: (id: number) => void;
}) {
  if (courses.length === 0)
    return <p className="text-gray-600">You are not enrolled in any courses.</p>;

  return (
    <div className="space-y-4">
      {courses.map((c) => (
        <div key={c.courseId} className="p-4 bg-white shadow rounded-lg border">
          <h2 className="font-semibold text-lg">
            {c.code} — {c.title}
          </h2>
          <p className="text-gray-600 text-sm">Faculty: {c.faculty}</p>

          <button
            onClick={() => onDrop(c.courseId)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Drop Course
          </button>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------
   FACULTY VIEW COMPONENT
---------------------------------------------------------- */
function FacultyCoursesView({ courses }: { courses: FacultyCourse[] }) {
  if (courses.length === 0)
    return <p className="text-gray-600">You are not assigned to any courses.</p>;

  return (
    <div className="space-y-4">
      {courses.map((c) => (
        <div key={c.id} className="p-4 bg-white shadow rounded-lg border">
          <h2 className="font-semibold text-lg">
            {c.code} — {c.title}
          </h2>

          <div className="mt-3">
            <Link
              to={`/course/${c.id}/students`}
              className="px-4 py-2 bg-lavender-gray-700 text-white rounded hover:bg-lavender-gray-800"
            >
              View Students
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
