import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupStart from './pages/SignupStart'
import VerifyEmail from './pages/VerifyEmail'
import SetPassword from './pages/SetPassword'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import DashboardLayout from './layouts/DashboardLayout'
import Grades from './pages/Grades'
import UploadGrades from './pages/UploadGrades'

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
          <Route path="upload-grades" element={<UploadGrades />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App