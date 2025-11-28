import { useEffect, useState } from 'react'
import { courseApi } from '../api/courseApi'
import { gradesApi } from '../api/gradesApi'

export default function StudentDashboard() {
    const [enrolledCount, setEnrolledCount] = useState<number>(0)
    const [availableCourses, setAvailableCourses] = useState<number>(0)
    const [latestGrade, setLatestGrade] = useState('')
    const email = localStorage.getItem('email')

    

    useEffect(() => {
        let isMounted = true
        async function loadDashboardData() {
            try {
                const courses = await courseApi.get("/courses");
                const grades = await gradesApi.get("/grades");

                if (!isMounted) return;

                setAvailableCourses(courses.data.length);
                setEnrolledCount(grades.data.length);

                if (grades.data.length > 0) {
                    setLatestGrade(grades.data[0]); 
                }
            } catch (err) {
                console.error(err)
            }
        }

        loadDashboardData()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <div>
            {/* Title */}
            <h1>Welcome Back, {email}!</h1>

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                <DashboardCard
                    title="Available Courses"
                    value={availableCourses}
                />

                <DashboardCard
                    title="Your Enrollments"
                    value={enrolledCount}
                />

                <DashboardCard
                    title="Last Grade"
                    value={latestGrade ? latestGrade : "—"}
                />
            </div>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">
                Quick Actions
                </h2>

                <div className="flex flex-col space-y-3 max-w-sm">
                    <DashButton label="View Courses" to="/courses" />
                    <DashButton label="View Your Grades" to="/grades" />
                </div>
            </section>
        </div>
    )
}

// helper components
function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm">
      <p className="text-gray-600 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  )
}

import { Link } from 'react-router-dom'

function DashButton({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 bg-lavender-gray-700 text-white rounded-lg shadow hover:bg-lavender-gray-800 transition"
    >
      {label}
    </Link>
  )
}