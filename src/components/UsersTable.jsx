import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (role === "admin") {
      axios.get("http://localhost:3000/api/v1/users")
        .then((res) => setUsers(res.data.users));
    } else {
      axios.get(`http://localhost:3000/api/v1/users/${userId}`)
        .then((res) => setUsers([res.data.user]));
    }
  }, []);






  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {role === "admin" ? "All Users" : "My Profile"}
        </h1>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b">ID</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Firstname</th>
              <th className="px-6 py-3 border-b">Lastname</th>
              {role === "admin" && <><th className="px-6 py-3 border-b">Action</th><th className="px-6 py-3 border-b">Assign Diet Plan</th></>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 border-b">{user.id}</td>
                <td className="px-6 py-3 border-b">{user.email}</td>
                <td className="px-6 py-3 border-b">{user.firstname || "-"}</td>
                <td className="px-6 py-3 border-b">{user.lastname || "-"}</td>
                {role === "admin" && (
                  <><td className="px-6 py-3 border-b">
                    <Link to={`/users/${user.id}`}>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        Show
                      </button>
                    </Link>
                  </td><td className="p-2 border text-center">
                   <Link to={`/dashboard/${user.id}`}>
                      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                        Assign Diet Plan
                      </button>
                    </Link>
                  </td></>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default UsersTable;
