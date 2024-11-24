import React, { useState } from "react";
import useRbacStore from "../store/rbacStore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ConfirmDialog from "./ConfirmDialog";

const UserList = () => {
    const {
        users,
        roles,
        deleteUser,
        updateUser,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
    } = useRbacStore();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (!userToDelete) return;

        const adminUsers = users.filter(
            (u) => roles.find((r) => r.id === u.roleId)?.name === "Admin"
        );

        if (
            roles.find((r) => r.id === userToDelete.roleId)?.name === "Admin" &&
            adminUsers.length === 1
        ) {
            toast.error("Cannot delete the last admin user");
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            return;
        }

        deleteUser(userToDelete.id);
        toast.success("User deleted successfully");
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const newRole = roles.find((r) => r.id === Number(selectedUser.roleId));
        const currentRole = roles.find(
            (r) => r.id === Number(selectedUser.roleId)
        );

        if (currentRole?.name === "Admin") {
            const adminUsers = users.filter(
                (u) => roles.find((r) => r.id === u.roleId)?.name === "Admin"
            );
            if (adminUsers.length === 1 && newRole?.name !== "Admin") {
                toast.error("Cannot remove the last admin user");
                return;
            }
        }

        updateUser(selectedUser.id, selectedUser);
        setShowEditModal(false);
        toast.success("User updated successfully");
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filters.status === "all" || user.status === filters.status;
        const matchesRole =
            filters.role === "all" ||
            roles.find((r) => r.id === user.roleId)?.name.toLowerCase() ===
                filters.role;

        return matchesSearch && matchesStatus && matchesRole;
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search users..."
                />
                <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {
                                            roles.find(
                                                (r) => r.id === user.roleId
                                            )?.name
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(user)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser.name}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    value={selectedUser.roleId}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            roleId: Number(e.target.value),
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    {roles.map((role) => (
                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={selectedUser.status}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            status: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
};

export default UserList;
