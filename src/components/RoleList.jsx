import React, { useState } from "react";
import useRbacStore from "../store/rbacStore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";

const RoleList = () => {
    const { roles, deleteRole, users, updateRole } = useRbacStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleDeleteClick = (role) => {
        if (role.name === "Admin") {
            toast.error("Cannot delete the Admin role");
            return;
        }

        const usersWithRole = users.filter((user) => user.roleId === role.id);
        if (usersWithRole.length > 0) {
            toast.error(
                `Cannot delete role: ${usersWithRole.length} users are assigned to this role`
            );
            return;
        }

        setRoleToDelete(role);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (!roleToDelete) return;
        deleteRole(roleToDelete.id);
        toast.success("Role deleted successfully");
        setShowDeleteConfirm(false);
        setRoleToDelete(null);
    };

    const handleEdit = (role) => {
        if (role.name === "Admin") {
            toast.error("Cannot modify the Admin role");
            return;
        }
        setSelectedRole({ ...role });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (selectedRole.name === "Admin") {
            toast.error("Cannot modify the Admin role");
            return;
        }
        updateRole(selectedRole.id, selectedRole);
        setShowEditModal(false);
        toast.success("Role updated successfully");
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Permissions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {role.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {role.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {role.permissions.join(", ")}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleEdit(role)}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(role)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                            disabled={role.name === "Admin"}
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
                        <h2 className="text-xl font-bold mb-4">Edit Role</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedRole.name}
                                    onChange={(e) =>
                                        setSelectedRole({
                                            ...selectedRole,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={selectedRole.description}
                                    onChange={(e) =>
                                        setSelectedRole({
                                            ...selectedRole,
                                            description: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                    rows="3"
                                    required
                                />
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
                message="Are you sure you want to delete this role? This action cannot be undone."
            />
        </div>
    );
};

export default RoleList;
