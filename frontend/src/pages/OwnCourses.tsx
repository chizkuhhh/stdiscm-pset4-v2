import { useEffect, useState } from "react";
import { enrollmentApi } from "../api/enrollmentApi";
import { courseApi } from "../api/courseApi";
import { Link } from "react-router-dom";
import axios from "axios";

interface StudentCourse {
  courseId: number;
  code: string;
  title: string;
  section: string;
  faculty: string;
  enrolledAt: string;
}

interface FacultyCourse {
  id: number;
  code: string;
  title: string;
  section: string;
  capacity?: number | null;
  enrolledCount?: number;
}

export default function OwnCourses() {
  const role = localStorage.getItem("role");
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [facultyCourses, setFacultyCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);

        if (role === "student") {
          const res = await enrollmentApi.get<StudentCourse[]>("/mine");
          if (isMounted) setStudentCourses(res.data);
        } else if (role === "faculty") {
          const res = await courseApi.get<FacultyCourse[]>("/my-courses");
          
          if (!isMounted) return;

          const coursesWithCounts = await Promise.all(
            res.data.map(async (course) => {
              try {
                const studentsRes = await courseApi.get(`${course.id}/students`);
                return {
                  ...course,
                  enrolledCount: studentsRes.data.totalEnrolled
                };
              } catch (err) {
                console.log(err)
                return { ...course, enrolledCount: 0 };
              }
            })
          );

          if (isMounted) setFacultyCourses(coursesWithCounts);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [role]);

  async function drop(courseId: number, courseName: string) {
    if (!window.confirm(`Are you sure you want to drop ${courseName}?`)) return;

    try {
      await enrollmentApi.delete(`/drop/${courseId}`);
      setStudentCourses((prev) => prev.filter((c) => c.courseId !== courseId));
      alert("Course dropped successfully!");
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to drop course.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      alert(errorMsg);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {role === "student" ? "My Enrolled Courses" : "Courses You Teach"}
        </h1>
        <p className="text-gray-600 mt-1">
          {role === "student" 
            ? `You are enrolled in ${studentCourses.length} course${studentCourses.length !== 1 ? 's' : ''}`
            : `You are teaching ${facultyCourses.length} course${facultyCourses.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {role === "student" && (
        <StudentCoursesView courses={studentCourses} onDrop={drop} />
      )}

      {role === "faculty" && <FacultyCoursesView courses={facultyCourses} />}
    </div>
  );
}

function StudentCoursesView({
  courses,
  onDrop,
}: {
  courses: StudentCourse[];
  onDrop: (id: number, name: string) => void;
}) {
  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">You are not enrolled in any courses yet.</p>
        <Link
          to="/courses"
          className="inline-block px-6 py-3 bg-lavender-gray-700 text-white rounded-lg hover:bg-lavender-gray-800 transition"
        >
          Browse Available Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((c) => (
        <div 
          key={c.courseId} 
          className="p-5 bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
        >
          <div className="mb-3">
            <h2 className="font-bold text-lg mb-1">
              {c.code}-{c.section}: {c.title}
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Faculty:</span> {c.faculty}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Enrolled: {new Date(c.enrolledAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => onDrop(c.courseId, `${c.code}-${c.section}`)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
          >
            Drop Course
          </button>
        </div>
      ))}
    </div>
  );
}

function FacultyCoursesView({ courses }: { courses: FacultyCourse[] }) {
  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">You are not assigned to any courses yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => {
        const isFull = c.capacity ? (c.enrolledCount || 0) >= c.capacity : false;

        return (
          <div 
            key={c.id} 
            className="p-5 bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">
                  {c.code}-{c.section}
                </h2>
                <h3 className="text-gray-900 font-medium mb-2">
                  {c.title}
                </h3>
              </div>
              {c.capacity && (
                <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                  isFull 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isFull ? 'FULL' : 'OPEN'}
                </span>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Enrolled:</span> {c.enrolledCount || 0}
                {c.capacity && ` / ${c.capacity}`}
              </p>
              {!c.capacity && (
                <p className="text-xs text-gray-500 italic">No capacity limit</p>
              )}
            </div>

            <Link
              to={`/course/${c.id}/students`}
              className="block text-center px-4 py-2 bg-lavender-gray-700 text-white rounded-lg hover:bg-lavender-gray-800 transition font-medium text-sm"
            >
              View Students
            </Link>
          </div>
        );
      })}
    </div>
  );
}