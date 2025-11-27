import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons'

function VerifyCode() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()
  const location = useLocation()
  const { email, role } = location.state;


  console.log("Verifying email:", email)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">

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

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-lavender-gray-900">
            Check your inbox
          </h2>
          <p className="text-gray-600 mt-1">
            Enter the 6-digit verification code we sent to your email.
          </p>
        </div>

        {/* Code Input */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              maxLength={1}
              className="
                w-12 h-12 text-center text-xl 
                border border-lavender-gray-300 rounded-lg
                focus:border-lavender-gray-500 focus:ring-lavender-gray-500
              "
              value={code[i]}
              onChange={(e) => {
                const val = e.target.value.slice(0, 1)
                const newCode = [...code]
                newCode[i] = val
                setCode(newCode);

                // auto-focus next input if it's not the last one
                if (val && i < 5) {
                  const next = document.getElementById(`code-${i+1}`)
                  next?.focus()
                }
              }}
              id={`code-${i}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button 
          onClick={async () => {
            try {
              const finalCode = code.join('')
              const res = await authApi.post('/signup/verify', {
                email,
                code: finalCode
              })
              console.log(res.data)

              // move to next step (setPassword)
              navigate('/password', { state: {email, role} })
            } catch (err) {
              console.error(err)
              alert("Invalid code!")
            }
          }}
          className="
            w-full py-2.5 
            bg-lavender-gray-700 hover:bg-lavender-gray-800 
            text-white font-medium rounded-xl
            transition mb-4
          "
        >
          Verify Code
        </button>

        {/* Resend */}
        <div className="text-center text-sm mt-2">
          Didn’t receive the code?{" "}
          <button className="text-lavender-gray-700 font-medium hover:underline">
            Resend
          </button>
        </div>

      </div>
    </div>
  )
}

export default VerifyCode