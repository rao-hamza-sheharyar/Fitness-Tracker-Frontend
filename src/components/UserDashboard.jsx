import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";

const UserDashboard = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const targetUserId = paramUserId;
  const isAdminViewing = role === "admin" && paramUserId;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const url = `http://localhost:3000/api/v1/users/${targetUserId}/diet_plans`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();
  }, [targetUserId]);

  const handleAddPlan = () => {
    navigate(`/admin/users/${targetUserId}/diet_plans/new`);
  };

  const handleEdit = (planId) => {
    navigate(`/admin/users/${targetUserId}/diet_plans/${planId}/edit`);
  };

  const confirmDelete = (planId) => {
    setSelectedPlanId(planId);
    setShowModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!selectedPlanId) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/diet_plans/${selectedPlanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(plans.filter(plan => plan.id !== selectedPlanId));
    } catch (err) {
      console.error("Failed to delete plan:", err);
    } finally {
      setShowModal(false);
      setSelectedPlanId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdminViewing ? `User #${targetUserId}'s Diet Plans` : "My Diet Plans"}
        </h1>

        {isAdminViewing && (
          <button
            onClick={handleAddPlan}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Diet Plan
          </button>
        )}
      </div>

      {plans.length === 0 ? (
        <p className="text-gray-500">No diet plans found.</p>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {isAdminViewing && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(plan.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm transition duration-150"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(plan.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition duration-150"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
              {plan.meals?.map((meal, index) => (
                <div key={index} className="ml-4 mb-2">
                  <p className="font-medium text-gray-700">🍽 {meal.name}</p>
                  <ul className="ml-6 list-disc text-gray-600 text-sm">
                    {meal.meal_items?.map((item, i) => (
                      <li key={i}>{item.name} — {item.calories} cal</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ConfirmModal
          title="Delete Diet Plan"
          message="Are you sure you want to delete this diet plan? This action cannot be undone."
          onConfirm={handleConfirmedDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
