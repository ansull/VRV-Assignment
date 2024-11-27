import React from 'react'
import useRbacStore from '../store/rbacStore'
import { toast } from 'react-toastify'
import useAuthStore from '../store/authStore'

const Permissions = () => {
  const { roles, permissions, updateRole } = useRbacStore()
  const { user } = useAuthStore()
  const currentUserRole = roles.find(r => r.id === user?.roleId)

  const canEditRole = (targetRoleId) => {
    const targetRole = roles.find(r => r.id === targetRoleId)
    const userRole = roles.find(r => r.id === user?.roleId)

    if (!targetRole || !userRole) return false

    // Admin can edit all except their own role
    if (userRole.name === 'Admin') {
      return targetRole.id !== user.roleId
    }

    // Manager can edit user roles and other manager roles
    if (userRole.name === 'Manager') {
      return ['User', 'Manager'].includes(targetRole.name) && targetRole.id !== user.roleId
    }

    // Users can't edit any roles
    return false
  }

  const handlePermissionToggle = (roleId, permission) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    if (!canEditRole(roleId)) {
      toast.error("You don't have permission to modify this role")
      return
    }

    // Prevent removing critical permissions from admin
    if (role.name === 'Admin' && permission === 'manage_roles') {
      toast.error("Cannot remove critical permissions from Admin role")
      return
    }

    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter(p => p !== permission)
      : [...role.permissions, permission]

    updateRole(roleId, { ...role, permissions: updatedPermissions })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl  font-bold mb-6 text-center lg:text-left">Permissions Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              {roles.map(role => (
                <th key={role.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map(permission => (
              <tr key={permission}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{permission}</div>
                </td>
                {roles.map(role => (
                  <td key={`${role.id}-${permission}`} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(role.id, permission)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        role.name === 'Admin' && permission === 'manage_roles' ||
                        !currentUserRole?.permissions.includes('manage_permissions') ||
                        !canEditRole(role.id)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Permissions