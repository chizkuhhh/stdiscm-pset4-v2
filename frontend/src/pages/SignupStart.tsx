import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox, faChalkboardUser } from '@fortawesome/free-solid-svg-icons'

function SignupStart() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'student' | 'faculty'>('student')
  const navigate = useNavigate()

  return (
    <>
      {/* Background */}
      <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-4">
        
        {/* Card Container */}
        <div className="
          w-full 
          max-w-sm sm:max-w-md md:max-w-lg 
          rounded-2xl 
          bg-white 
          px-8 sm:px-16
          py-16
          shadow"
        >

          {/* Logo */}
          <div className="flex items-center justify-center space-x-2.5 mb-6">
            <FontAwesomeIcon icon={faChalkboardUser} className="text-3xl text-lavender-gray-700" />
            <h1 className="text-3xl font-bold text-lavender-gray-900">courselane</h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-lavender-gray-900">
              Create an account
            </h2>
            <p className="text-gray-600 mt-1">Join the online enrollment service.</p>
          </div>

          {/* Email Input */}
          <div className="w-full space-y-2 mb-6">
            <label htmlFor="email-input" className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                id="email-input"
                name="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  py-2.5 px-4 ps-11 block w-full 
                  border border-lavender-gray-300 
                  rounded-lg 
                  focus:z-10 focus:border-lavender-gray-500 focus:ring-lavender-gray-500
                  bg-white text-sm
                "
                placeholder="jane_doe@site.com"
              />

              {/* Icon */}
              <FontAwesomeIcon
                icon={faInbox}
                className="
                  absolute inset-y-0 left-0 my-auto ml-4 
                  text-gray-500 pointer-events-none
                "
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="w-full space-y-2 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Account Type
            </label>

            <div className="flex items-center space-x-6">

              {/* Student */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="text-lavender-gray-600 focus:ring-lavender-gray-500"
                />
                <span className="text-sm text-gray-700">Student</span>
              </label>

              {/* Faculty */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="faculty"
                  checked={role === "faculty"}
                  onChange={() => setRole("faculty")}
                  className="text-lavender-gray-600 focus:ring-lavender-gray-500"
                />
                <span className="text-sm text-gray-700">Faculty</span>
              </label>

            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={async () => {
              try {
                const res = await authApi.post("/signup/start", { email });
                console.log(res.data);

                // Pass the email to the verify route
                navigate("/verify", { state: { email, role } });
              } catch (err) {
                console.error("Signup error:", err);
              }
            }}

            className="
              w-full rounded-xl py-2.5 
              bg-lavender-gray-700 hover:bg-lavender-gray-800 
              text-white font-medium 
              transition
              mb-6
            "
          >
            Create account
          </button>

          {/* Already have an account */}
          <div className="text-center text-sm mb-6">
            <span className="text-gray-600">Already have an account? </span>
            <a 
              href="/login" 
              className="text-lavender-gray-700 font-medium hover:text-lavender-gray-800 transition"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupStart