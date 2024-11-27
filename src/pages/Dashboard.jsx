import React from 'react'
import useRbacStore from '../store/rbacStore'

const Dashboard = () => {
  const { users, roles } = useRbacStore()

  return (
    <div className="container mx-auto px-8 md:px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 md:mb-8 text-center lg:text-left">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl  font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600">{users.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-2">Total Roles</h2>
          <p className="text-4xl font-bold text-green-600">{roles.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-2">Active Users</h2>
          <p className="text-4xl font-bold text-purple-600">
            {users.filter(user => user.status === 'active').length}
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {users.slice(0, 3).map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Role Distribution</h2>
          <div className="space-y-4">
            {roles.map(role => {
              const userCount = users.filter(user => user.roleId === role.id).length
              return (
                <div key={role.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {userCount} users
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard