import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentApi } from '../api/enrollmentApi';
import { gradesApi } from '../api/gradesApi';
import { courseApi } from '../api/courseApi';

interface Grade {
  id: number;
  createdAt: string;
  courseCode: string;
  courseTitle: string;
  courseSection: string;
  grade: string;
  term: string;
  faculty: string;
}

interface Enrollment {
  courseId: number;
  code: string;
  title: string;
  section: string;
  faculty: string;
}

export default function StudentDashboard() {
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [availableCourses, setAvailableCourses] = useState<number>(0);
  const [latestGrade, setLatestGrade] = useState<Grade | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('email');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);

        const coursesRes = await courseApi.get("/");
        const enrollmentsRes = await enrollmentApi.get<Enrollment[]>("/mine");
        const gradesRes = await gradesApi.get<Grade[]>("/grades");

        if (!isMounted) return;

        setAvailableCourses(coursesRes.data.length);
        setEnrolledCount(enrollmentsRes.data.length);
        setRecentEnrollments(enrollmentsRes.data.slice(0, 3));

        if (gradesRes.data.length > 0) {
          const sortedGrades = gradesRes.data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setLatestGrade(sortedGrades[0]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">{email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <DashboardCard title="Available Courses" value={availableCourses} />
        <DashboardCard title="Your Enrollments" value={enrolledCount} />
        <DashboardCard title="Latest Grade" value={latestGrade ? latestGrade.grade : "—"} />
      </div>

      {recentEnrollments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div 
                key={enrollment.courseId} 
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <h3 className="font-semibold">
                  {enrollment.code}-{enrollment.section}: {enrollment.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Faculty: {enrollment.faculty}
                </p>
              </div>
            ))}
          </div>
          {enrolledCount > 3 && (
            <Link 
              to="/my-courses" 
              className="inline-block mt-3 text-lavender-gray-700 hover:underline text-sm font-medium"
            >
              View all {enrolledCount} enrolled courses →
            </Link>
          )}
        </section>
      )}

      {latestGrade && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Grade</h2>
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {latestGrade.courseCode}-{latestGrade.courseSection}: {latestGrade.courseTitle}
                </h3>
                <p className="text-sm text-gray-600">
                  {latestGrade.term} - Faculty: {latestGrade.faculty}
                </p>
              </div>
              <span className={`px-3 py-1 font-bold rounded-lg text-lg ${getGradeColor(latestGrade.grade)}`}>
                {latestGrade.grade}
              </span>
            </div>
          </div>
        </section>
      )}

      {recentEnrollments.length === 0 && (
        <section className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">You're not enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-lavender-gray-700 text-white rounded-lg hover:bg-lavender-gray-800 transition"
            >
              Browse Available Courses
            </Link>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <DashButton label="Browse Courses" to="/courses" />
          <DashButton label="My Enrollments" to="/my-courses" />
          <DashButton label="View Grades" to="/grades" />
        </div>
      </section>
    </div>
  );
}

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
      className="px-4 py-2 bg-lavender-gray-700 text-white rounded-lg shadow hover:bg-lavender-gray-800 transition text-center"
    >
      {label}
    </Link>
  );
}

function getGradeColor(grade: string): string {
  const firstChar = grade.charAt(0);
  
  switch (firstChar) {
    case 'A':
      return 'bg-green-100 text-green-800';
    case 'B':
      return 'bg-blue-100 text-blue-800';
    case 'C':
      return 'bg-yellow-100 text-yellow-800';
    case 'D':
      return 'bg-orange-100 text-orange-800';
    case 'F':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}