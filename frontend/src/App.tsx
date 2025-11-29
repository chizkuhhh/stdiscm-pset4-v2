import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupStart from './pages/SignupStart'
import VerifyEmail from './pages/VerifyEmail'
import SetPassword from './pages/SetPassword'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import DashboardLayout from './layouts/DashboardLayout'
import Grades from './pages/Grades'
import OwnCourses from './pages/OwnCourses'
import CourseStudents from './pages/CourseStudents'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignupStart />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/password" element={<SetPassword />} />
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="grades" element={<Grades />} />
          <Route path="my-courses" element={<OwnCourses />}/>
          <Route path="course/:courseId/students" element={<CourseStudents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App