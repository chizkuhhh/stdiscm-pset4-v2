import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardUser, faLock, faInbox } from '@fortawesome/free-solid-svg-icons'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleLogin() {
        try {
            const res = await authApi.post('/login', { email, password })

            // Save auth info
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('role', res.data.user.role)
            localStorage.setItem('email', res.data.user.email)

            navigate("/dashboard")
        } catch (err) {
            alert("Invalid email or password")
            console.log(err)
        }
    }

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
                        Login
                    </h2>
                    <p className="text-gray-600 mt-1">Enter your credentials to continue.</p>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative mt-1">
                        <input
                        type="email"
                        className="
                            w-full py-2.5 px-4 ps-11 
                            border border-lavender-gray-300 rounded-lg 
                            focus:border-lavender-gray-500 focus:ring-lavender-gray-500
                            text-sm
                        "
                        placeholder='you@site.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <FontAwesomeIcon 
                        icon={faInbox}
                        className="absolute left-0 inset-y-0 ml-4 my-auto text-gray-500 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative mt-1">
                        <input
                        type="password"
                        className="
                            w-full py-2.5 px-4 ps-11 
                            border border-lavender-gray-300 rounded-lg 
                            focus:border-lavender-gray-500 focus:ring-lavender-gray-500
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

                <button 
                    onClick={handleLogin}
                    className="
                        w-full rounded-xl py-2.5 
                        bg-lavender-gray-700 hover:bg-lavender-gray-800 
                        text-white font-medium transition mb-6
                    "
                >
                    Login
                </button>

                {/* Don't have an account */}
                <div className="text-center text-sm mb-6">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a 
                    href="/signup" 
                    className="text-lavender-gray-700 font-medium hover:text-lavender-gray-800 transition"
                    >
                    Sign up
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login