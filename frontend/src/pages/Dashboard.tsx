import StudentDashboard from "./StudentDashboard"
import FacultyDashboard from './FacultyDashboard'

export default function Dashboard() {
  const role = localStorage.getItem('role')

  return (
    role === "faculty" ? <FacultyDashboard /> : <StudentDashboard />
  )
}