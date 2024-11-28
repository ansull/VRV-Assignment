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
import ConfirmDialog from './ConfirmDialog'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { roles } = useRbacStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
      permission: 'manage_users'
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutConfirm(false)
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
          onClick={handleLogoutClick}
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40 flex items-center px-4">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <h1 className="ml-4 text-xl font-semibold text-gray-800">
          {menuItems.find(item => item.path === window.location.pathname)?.name || 'Dashboard'}
        </h1>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-30 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4 pt-20">
          {sidebarContent}
        </div>
        <div
          className="bg-black bg-opacity-50 absolute inset-0 -z-10"
          onClick={toggleMobileMenu}
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed bg-gray-800 text-white w-64 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-8">RBAC Admin</h1>
        {sidebarContent}
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />
    </>
  )
}

export default Sidebar