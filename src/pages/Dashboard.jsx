import React from "react";
import useRbacStore from "../store/rbacStore";

const Dashboard = () => {
    const { users, roles } = useRbacStore();

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-600 mb-2">
                        Total Users
                    </h2>
                    <p className="text-3xl font-semibold text-gray-800">
                        {users.length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-600 mb-2">
                        Total Roles
                    </h2>
                    <p className="text-3xl font-semibold text-gray-800">
                        {roles.length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-600 mb-2">
                        Active Users
                    </h2>
                    <p className="text-3xl font-semibold text-gray-800">
                        {
                            users.filter((user) => user.status === "active")
                                .length
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
