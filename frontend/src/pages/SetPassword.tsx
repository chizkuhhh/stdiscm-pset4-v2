import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardUser, faLock } from '@fortawesome/free-solid-svg-icons'

function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { email, role } = location.state;


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">

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
            Set your password
          </h2>
          <p className="text-gray-600 mt-1">Enter a new password to complete your account.</p>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
            <input
              type="password"
              id="password"
              className="
                w-full py-2.5 px-4 ps-11 
                border border-lavender-gray-300 rounded-lg 
                focus:border-lavender-gray-500 focus:ring-lavender-gray-500
                text-sm
              "
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon 
              icon={faLock}
              className="absolute left-0 inset-y-0 ml-4 my-auto text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative mt-1">
            <input
              type="password"
              id="confirm"
              className="
                w-full py-2.5 px-4 ps-11 
                border border-lavender-gray-300 rounded-lg 
                focus:border-lavender-gray-500 focus:ring-lavender-gray-500
              "
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <FontAwesomeIcon 
              icon={faLock}
              className="absolute left-0 inset-y-0 ml-4 my-auto text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        <button 
          onClick={async () => {
            try {
              if (!password || !confirm)
                return alert("Please fill out both fields.")
              
              if (password !== confirm)
                return alert("Passwords do not match!")

              const res = await authApi.post('/signup/complete', {
                email,
                password,
                role
              })

              console.log("Signup complete: ", res.data)

              navigate('/login')
            } catch (err) {
              console.error(err)
              alert("Error completing signup.")
            }
          }}
          className="
            w-full rounded-xl py-2.5 
            bg-lavender-gray-700 hover:bg-lavender-gray-800 
            text-white font-medium transition
          "
        >
          Set Password
        </button>
      </div>
    </div>
  )
}

export default SetPassword