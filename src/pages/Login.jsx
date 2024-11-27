import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const success = login(formData.username, formData.password)
      if (success) {
        toast.success('Login successful!')
        navigate('/')
      } else {
        toast.error('Invalid credentials')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Welcome Back
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-center text-sm font-medium text-gray-700 mb-2">
              Demo Credentials
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between items-center px-3 py-2 bg-white rounded-md">
                <span className="font-medium">Admin:</span>
                <span>admin / admin123</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-white rounded-md">
                <span className="font-medium">Manager:</span>
                <span>manager / manager123</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-white rounded-md">
                <span className="font-medium">User:</span>
                <span>user / user123</span>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform duration-200 hover:scale-105"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login