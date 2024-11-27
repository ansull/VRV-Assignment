import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: ['view_dashboard', 'manage_users', 'manage_roles', 'manage_permissions', 'view_reports', 'edit_settings']
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manage users and view reports',
    permissions: ['view_dashboard', 'manage_users', 'view_reports', 'manage_roles', 'manage_permissions'] // Added permissions for manager
  },
  {
    id: 3,
    name: 'User',
    description: 'Basic access',
    permissions: ['view_dashboard']
  }
]

const useRbacStore = create(
  persist(
    (set) => ({
      users: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', roleId: 1, status: 'active' },
        { id: 2, name: 'Manager User', email: 'manager@example.com', roleId: 2, status: 'active' },
        { id: 3, name: 'Basic User', email: 'user@example.com', roleId: 3, status: 'active' }
      ],
      roles: initialRoles,
      permissions: [
        'view_dashboard',
        'manage_users',
        'manage_roles',
        'manage_permissions',
        'view_reports',
        'edit_settings'
      ],
      searchQuery: '',
      sortConfig: { key: null, direction: 'asc' },
      filters: {
        status: 'all',
        role: 'all'
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortConfig: (config) => set({ sortConfig: config }),
      setFilters: (filters) => set({ filters }),

      addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: Date.now() }]
      })),

      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),

      addRole: (role) => set((state) => ({
        roles: [...state.roles, { ...role, id: Date.now() }]
      })),

      updateRole: (id, updatedRole) => set((state) => ({
        roles: state.roles.map(role => 
          role.id === id ? { ...role, ...updatedRole } : role
        )
      })),

      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter(role => role.id !== id)
      })),

      hasPermission: (roleId, permission) => {
        const role = initialRoles.find(r => r.id === roleId)
        return role?.permissions.includes(permission) || false
      }
    }),
    {
      name: 'rbac-storage'
    }
  )
)

export default useRbacStore