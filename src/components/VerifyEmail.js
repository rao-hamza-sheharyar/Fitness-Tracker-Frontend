import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`http://localhost:3000/api/v1/verify_email?token=${token}`)
        .then((res) => {
          setMessage(res.data.message);
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch((err) => {
          setError(err.response?.data?.error || "Verification failed.");
        });
    } else {
      setError("Invalid or missing token.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify Email</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        {message && (
          <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
