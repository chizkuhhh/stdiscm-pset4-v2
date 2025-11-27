import { useEffect, useState } from "react";
import { courseApi } from "../api/courseApi";
import { enrollmentApi } from "../api/enrollmentApi";

interface Course {
  id: number;
  code: string;
  title: string;
  faculty: string;
}

interface Enrollment {
  courseId: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      // fetch courses
      const res = await courseApi.get<Course[]>("/courses");
      setCourses(res.data);

      // fetch student's enrollments
      const my = await enrollmentApi.get<Enrollment[]>("/mine");
      setMyEnrollments(my.data.map((e) => e.courseId));
    }

    loadData();
  }, []);

  async function enroll(courseId: number) {
    try {
      await enrollmentApi.post("/", { courseId });
      alert("Enrolled successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Available Courses</h1>

      <div className="space-y-4">
        {courses.map((c) => {
          const alreadyEnrolled = myEnrollments.includes(c.id);

          return (
            <div key={c.id} className="p-4 bg-white shadow rounded-lg border">
              <h2 className="font-semibold">{c.code}</h2>
              <p>{c.title}</p>
              <p className="text-sm text-gray-600">Faculty: {c.faculty}</p>

              {alreadyEnrolled ? (
                <p className="text-green-600 mt-2 font-medium">
                  ✓ Already Enrolled
                </p>
              ) : (
                <button
                  onClick={() => enroll(c.id)}
                  className="mt-3 px-4 py-2 bg-lavender-gray-600 text-white rounded hover:bg-lavender-gray-700"
                >
                  Enroll
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
