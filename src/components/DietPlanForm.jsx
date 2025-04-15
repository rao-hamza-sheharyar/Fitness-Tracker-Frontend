import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DietPlanForm = ({ isEdit = false }) => {
  const { userId, planId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [meals, setMeals] = useState([{ name: "", meal_items: [{ name: "", calories: "" }] }]);

  useEffect(() => {
    if (isEdit && planId) {
      axios
        .get(`http://localhost:3000/api/v1/diet_plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const plan = res.data;
          setName(plan.name);
          setMeals(plan.meals || []);
        })
        .catch((err) => console.error("Failed to load plan:", err));
    }
  }, [isEdit, planId]);

  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleMealItemChange = (mealIndex, itemIndex, field, value) => {
    const updated = [...meals];
    updated[mealIndex].meal_items[itemIndex][field] = value;
    setMeals(updated);
  };

  const addMeal = () => {
    setMeals([...meals, { name: "", meal_items: [{ name: "", calories: "" }] }]);
  };

  const removeMeal = (index) => {
    const updated = [...meals];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    setMeals(updated);
  };

  const addMealItem = (mealIndex) => {
    const updated = [...meals];
    updated[mealIndex].meal_items.push({ name: "", calories: "" });
    setMeals(updated);
  };

  const removeMealItem = (mealIndex, itemIndex) => {
    const updated = [...meals];
    const item = updated[mealIndex].meal_items[itemIndex];
    if (item.id) {
      item._destroy = true;
    } else {
      updated[mealIndex].meal_items.splice(itemIndex, 1);
    }
    setMeals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      diet_plan: {
        user_id: userId,
        name,
        meals_attributes: meals.map((meal) => ({
          id: meal.id,
          name: meal.name,
          _destroy: meal._destroy,
          meal_items_attributes: meal.meal_items.map((item) => ({
            id: item.id,
            name: item.name,
            calories: item.calories,
            _destroy: item._destroy,
          }))
        }))
      }
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/v1/diet_plans/${planId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:3000/api/v1/diet_plans", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error("Failed to submit plan:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit" : "Assign New"} Diet Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Diet Plan Name"
          className="w-full px-4 py-2 border rounded"
          required
        />

        {meals.map((meal, mealIndex) => (
          meal._destroy ? null : (
            <div key={mealIndex} className="border p-4 rounded space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meal.name}
                  onChange={(e) => handleMealChange(mealIndex, "name", e.target.value)}
                  placeholder={`Meal ${mealIndex + 1} Name`}
                  className="flex-1 border px-3 py-1 rounded"
                  required
                />
                <button type="button" onClick={() => removeMeal(mealIndex)} className="text-red-600 text-sm">Remove Meal</button>
              </div>

              {meal.meal_items.map((item, itemIndex) => (
                item._destroy ? null : (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleMealItemChange(mealIndex, itemIndex, "name", e.target.value)}
                      placeholder="Item name"
                      className="flex-1 border px-3 py-1 rounded"
                      required
                    />
                    <input
                      type="number"
                      value={item.calories}
                      onChange={(e) => handleMealItemChange(mealIndex, itemIndex, "calories", e.target.value)}
                      placeholder="Calories"
                      className="w-24 border px-3 py-1 rounded"
                      required
                    />
                    <button type="button" onClick={() => removeMealItem(mealIndex, itemIndex)} className="text-red-500">✖</button>
                  </div>
                )
              ))}

              <button type="button" onClick={() => addMealItem(mealIndex)} className="text-blue-600 text-sm">+ Add Item</button>
            </div>
          )
        ))}

        <button type="button" onClick={addMeal} className="text-blue-600">+ Add Meal</button>

        <button type="submit" className="block w-full bg-green-600 text-white py-2 rounded mt-4">
          {isEdit ? "Update" : "Assign"} Plan
        </button>
      </form>
    </div>
  );
};

export default DietPlanForm;
