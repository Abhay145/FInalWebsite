import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [activeTab, setActiveTab] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.post(
        `https://openelectivenitkkr.vercel.app/api/${activeTab}/login`,
        { email, password }
      )
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userType', activeTab)
      navigate(`/${activeTab}/dashboard`)
    } catch (error) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ================= GUIDELINES (LEFT) ================= */}
<div className="order-2 md:order-1 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 text-sm text-gray-700 h-fit">
  <h2 className="text-lg font-semibold mb-3 text-gray-900">
    Open Elective Allocation Guidelines
    <span className="block text-xs font-normal text-gray-500">
      5th & 7th Semester • Academic Year 2025–26
    </span>
  </h2>

  <div className="space-y-4">
    
    {/* Subject Choice */}
    <div>
      <h3 className="font-semibold">1. Subject Choice Submission</h3>
      <ul className="list-disc ml-5 mt-1 space-y-1">
        <li>Submit elective choices priority-wise before the deadline.</li>
        <li>Detailed syllabus is available on the website.</li>
      </ul>
    </div>

    {/* Eligibility */}
    <div>
      <h3 className="font-semibold">2. Eligibility Criteria</h3>
      <ul className="list-disc ml-5 mt-1 space-y-1">
        <li>
          <strong>5th Semester (including re-appears):</strong> Allocation based on average SGPA (1st–3rd semesters).
        </li>
        <li>
          <strong>7th Semester (Regular):</strong> Allocation based on 5th semester CGPA.
        </li>
        <li>
          <strong>7th Semester (with Re-appear):</strong> Allocation based on average SGPA (1st–5th semesters).
        </li>
        <li>Allocation is strictly merit-based.</li>
        <li>CGPA-based students get priority over SGPA-based cases.</li>
      </ul>
    </div>

    {/* Instructions */}
    <div>
      <h3 className="font-semibold">3. Important Instructions</h3>
      <ul className="list-disc ml-5 mt-1 space-y-1">
        <li>Choices can be edited before the deadline.</li>
        <li>
          <strong>Window:</strong> 15 April 2026 – 27 April 2026 (till 5:00 PM).
        </li>
        <li>No submissions/changes after deadline.</li>
        <li>Once allocated, changes are not permitted.</li>
        <li className="font-bold text-red-600">Verify your submitted choices on the Home Page.</li>
      </ul>
    </div>

  </div>
</div>

        {/* ================= LOGIN (RIGHT) ================= */}
        <div className="order-1 md:order-2">
          <div className="mb-6">
            <div className="flex border-b">
              {['student', 'professor', 'admin'].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 capitalize ${
                    activeTab === tab ? 'border-b-2 border-blue-500 font-semibold' : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-200 focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-200 focus:border-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center">
            Don&apos;t have an account or forgot password?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

