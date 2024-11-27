import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  KeyIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'
import useRbacStore from '../store/rbacStore'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { roles } = useRbacStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userRole = roles.find(role => role.id === user?.roleId)

  const menuItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: ChartBarIcon,
      permission: 'view_dashboard'
    },
    { 
      path: '/users', 
      name: 'Users', 
      icon: UserGroupIcon,
      permission: 'view_dashboard' // Changed to allow users to view
    },
    { 
      path: '/roles', 
      name: 'Roles', 
      icon: ShieldCheckIcon,
      permission: 'manage_roles'
    },
    { 
      path: '/permissions', 
      name: 'Permissions', 
      icon: KeyIcon,
      permission: 'manage_permissions'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const sidebarContent = (
    <>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Logged in as:</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm text-gray-400">{userRole?.name}</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          userRole?.permissions.includes(item.permission) && (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </NavLink>
          )
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 w-full"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span>Logout</span>
        </button>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-8 mt-16">RBAC Admin</h1>
          {sidebarContent}
        </div>
        <div
          className="bg-black bg-opacity-50 absolute inset-0 -z-10"
          onClick={toggleMobileMenu}
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-gray-800 text-white w-64 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-8">RBAC Admin</h1>
        {sidebarContent}
      </div>
    </>
  )
}

export default Sidebar