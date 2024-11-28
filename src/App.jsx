import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Permissions from './pages/Permissions'
import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import useAuthStore from './store/authStore'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <div className="mx-4 md:mx-8 my-16 lg:my-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute requiredPermissions={['view_dashboard']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredPermissions={['view_dashboard']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute requiredPermissions={['view_dashboard']}>
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/permissions"
                element={
                  <ProtectedRoute requiredPermissions={['view_dashboard']}>
                    <Permissions />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

export default App