import React from "react";
import useRbacStore from "../store/rbacStore";
import { toast } from "react-toastify";

const Permissions = () => {
    const { roles, permissions, updateRole } = useRbacStore();

    const handlePermissionToggle = (roleId, permission) => {
        const role = roles.find((r) => r.id === roleId);
        if (!role) return;

        // Prevent removing critical permissions from admin
        if (role.name === "Admin" && permission === "manage_roles") {
            toast.error("Cannot remove critical permissions from Admin role");
            return;
        }

        const updatedPermissions = role.permissions.includes(permission)
            ? role.permissions.filter((p) => p !== permission)
            : [...role.permissions, permission];

        updateRole(roleId, { ...role, permissions: updatedPermissions });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Permissions Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Permission
                            </th>
                            {roles.map((role) => (
                                <th
                                    key={role.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {role.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {permissions.map((permission) => (
                            <tr key={permission}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {permission}
                                    </div>
                                </td>
                                {roles.map((role) => (
                                    <td
                                        key={`${role.id}-${permission}`}
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={role.permissions.includes(
                                                permission
                                            )}
                                            onChange={() =>
                                                handlePermissionToggle(
                                                    role.id,
                                                    permission
                                                )
                                            }
                                            className="rounded border-gray-300 text-gray-800 focus:border-gray-500 focus:ring-gray-500"
                                            disabled={
                                                role.name === "Admin" &&
                                                permission === "manage_roles"
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
    );
};

export default Permissions;
