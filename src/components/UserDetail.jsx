import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Error fetching user:", err));
  }, [id]);

  if (!user) return <p className="p-8 text-gray-600">Loading...</p>;
  return (
    <div className="max-w-xl mx-auto p-6 bg-white mt-12 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Detail</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Firstname:</strong> {user.firstname || "-"}</p>
        <p><strong>Lastname:</strong> {user.lastname || "-"}</p>
      </div>
      <div className="mt-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm inline-block"
        >
          ⬅ Back to Users
        </Link>
      </div>
    </div>
  );
};

export default UserDetail;
