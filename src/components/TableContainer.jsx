import React from 'react'

const TableContainer = ({ children }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {children}
        </div>
      </div>
    </div>
  )
}

export default TableContainer