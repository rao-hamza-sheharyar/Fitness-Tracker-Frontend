import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Fitness Tracker</h2>
        {role === "admin" ? (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg shadow-md transition-transform hover:scale-105"
          >
            Show My Clients
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg shadow-md transition-transform hover:scale-105"
          >
            My Diet Plans
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
