import React from "react";
import { NavLink } from "react-router-dom";
import {
    UserGroupIcon,
    ShieldCheckIcon,
    KeyIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
    const menuItems = [
        { path: "/", name: "Dashboard", icon: ChartBarIcon },
        { path: "/users", name: "Users", icon: UserGroupIcon },
        { path: "/roles", name: "Roles", icon: ShieldCheckIcon },
        { path: "/permissions", name: "Permissions", icon: KeyIcon },
    ];

    return (
        <div className="bg-white text-gray-900 w-64 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">VRV Security</h1>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${
                                isActive
                                    ? "bg-gray-200 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
