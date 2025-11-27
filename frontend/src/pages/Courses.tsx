import { useEffect, useState } from "react";
import { courseApi } from "../api/courseApi";

interface Course {
  id: string;
  code: string;
  title: string;
  faculty: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const res = await courseApi.get("/courses");
      setCourses(res.data);
    }
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Available Courses</h1>

      <div className="space-y-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 bg-white shadow rounded-lg border">
            <h2 className="font-semibold">{c.code}</h2>
            <p>{c.title}</p>
            <p className="text-sm text-gray-600">Faculty: {c.faculty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}