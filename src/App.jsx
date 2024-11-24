import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 px-8 py-6">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route
                                path="/"
                                element={<Dashboard />}
                            />
                            <Route
                                path="/users"
                                element={<Users />}
                            />
                            <Route
                                path="/roles"
                                element={<Roles />}
                            />
                            <Route
                                path="/permissions"
                                element={<Permissions />}
                            />
                        </Routes>
                    </div>
                </main>
                <ToastContainer
                    position="bottom-right"
                    theme="colored"
                    autoClose={3000}
                />
            </div>
        </Router>
    );
}

export default App;
