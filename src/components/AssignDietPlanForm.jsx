import React, { useState } from "react";
import axios from "axios";

const AssignDietPlanForm = ({ userId, onSuccess }) => {
  const [name, setName] = useState("");
  const [meals, setMeals] = useState([
    {
      name: "",
      meal_items: [{ name: "", calories: "" }]
    }
  ]);

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
    const updated = meals.filter((_, i) => i !== index);
    setMeals(updated);
  };

  const addMealItem = (mealIndex) => {
    const updated = [...meals];
    updated[mealIndex].meal_items.push({ name: "", calories: "" });
    setMeals(updated);
  };

  const removeMealItem = (mealIndex, itemIndex) => {
    const updated = [...meals];
    updated[mealIndex].meal_items = updated[mealIndex].meal_items.filter((_, i) => i !== itemIndex);
    setMeals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/v1/diet_plans", {
        diet_plan: {
          user_id: userId,
          name,
          meals_attributes: meals.map((meal) => ({
            name: meal.name,
            meal_items_attributes: meal.meal_items
          }))
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to assign plan:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Diet Plan Name"
        className="w-full border px-4 py-2 rounded"
        required
      />
      {meals.map((meal, mealIndex) => (
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
          ))}

          <button type="button" onClick={() => addMealItem(mealIndex)} className="text-blue-600 text-sm">+ Add Item</button>
        </div>
      ))}

      <button type="button" onClick={addMeal} className="text-blue-600">+ Add Meal</button>
      <button type="submit" className="block w-full bg-green-600 text-white py-2 rounded mt-4">Assign Plan</button>
    </form>
  );
};

export default AssignDietPlanForm;