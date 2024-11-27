import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useRbacStore from '../store/rbacStore'

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user } = useAuthStore()
  const { roles } = useRbacStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredPermissions.length > 0) {
    const userRole = roles.find(role => role.id === user.roleId)
    const hasRequiredPermissions = requiredPermissions.every(
      permission => userRole?.permissions.includes(permission)
    )

    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

export default ProtectedRoute