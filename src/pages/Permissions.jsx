import React from 'react'
import useRbacStore from '../store/rbacStore'
import { toast } from 'react-toastify'
import useAuthStore from '../store/authStore'
import TableContainer from '../components/TableContainer'

const Permissions = () => {
  const { roles, permissions, updateRole } = useRbacStore()
  const { user } = useAuthStore()
  const currentUserRole = roles.find(r => r.id === user?.roleId)

  const canEditRole = (targetRoleId) => {
    const targetRole = roles.find(r => r.id === targetRoleId)
    const userRole = roles.find(r => r.id === user?.roleId)

    if (!targetRole || !userRole) return false

    if (userRole.name === 'Admin') {
      return targetRole.id !== user.roleId
    }

    if (userRole.name === 'Manager') {
      return ['User', 'Manager'].includes(targetRole.name) && targetRole.id !== user.roleId
    }

    return false
  }

  const handlePermissionToggle = (roleId, permission) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    if (!canEditRole(roleId)) {
      toast.error("You don't have permission to modify this role")
      return
    }

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
    <div className="px-2 sm:px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Permissions Management</h1>
      
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Permission
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map(permission => (
                <tr key={permission}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{permission}</div>
                  </td>
                  {roles.map(role => (
                    <td key={`${role.id}-${permission}`} className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
      </TableContainer>
    </div>
  )
}

export default Permissions