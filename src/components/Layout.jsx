import React from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          FitnessTracker
        </h1>
        {token && (
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
