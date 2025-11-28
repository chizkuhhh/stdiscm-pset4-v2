import { useEffect, useState } from "react";
import { courseApi } from "../api/courseApi";
import { Link } from "react-router-dom";

interface Course {
  id: number;
  code: string;
  title: string;
  capacity?: number | null;
  isOpen: boolean;
}

export default function FacultyDashboard() {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        // Fetch faculty courses
        const res = await courseApi.get("/my-courses");

        if (!isMounted) return;
        setMyCourses(res.data);

        // Fetch total enrolled students across all courses
        let studentCount = 0;
        for (const course of res.data) {
          try {
            const studentsRes = await courseApi.get(`${course.id}/students`);
            studentCount += studentsRes.data.totalEnrolled;
          } catch (err) {
            console.error(`Failed to fetch students for course ${course.id}:`, err);
          }
        }

        if (!isMounted) return;
        setTotalStudents(studentCount);

      } catch (err) {
        console.error(err);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Courses You Teach"
          value={myCourses.length}
        />

        <DashboardCard
          title="Total Students"
          value={totalStudents}
        />

        <DashboardCard
          title="Open Courses"
          value={myCourses.filter(c => c.isOpen).length}
        />
      </div>

      {/* Courses teaching */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>

        <div className="space-y-3">
          {myCourses.map((c) => (
            <div key={c.id} className="p-4 bg-white border rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.code} — {c.title}</h3>
                  <p className="text-sm text-gray-600">
                    {c.capacity ? `Capacity: ${c.capacity}` : 'No capacity limit'} • 
                    {c.isOpen ? ' Open for enrollment' : ' Closed'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  c.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {c.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>

              <div className="mt-3 flex space-x-2">
                <DashButton label="Upload Grades" to={`/upload-grades?course=${c.id}`} />
                <DashButton label="View Enrolled Students" to={`/course/${c.id}/students`} />
              </div>
            </div>
          ))}

          {myCourses.length === 0 && (
            <p className="text-gray-600">You are not assigned to any courses yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

/* -----------------------------------------------------
   SMALL COMPONENTS
----------------------------------------------------- */

function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm">
      <p className="text-gray-600 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function DashButton({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 bg-lavender-gray-700 text-white rounded-lg shadow hover:bg-lavender-gray-800 transition"
    >
      {label}
    </Link>
  );
}