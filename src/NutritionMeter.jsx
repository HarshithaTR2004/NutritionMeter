import React, { useState, useEffect } from 'react';
import './NutritionMeter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const NutritionMeter = () => {
  const defaultItemsDisplayed = [];

  const [nutritionItems, setNutritionItems] = useState(defaultItemsDisplayed);
  const [newItem, setNewItem] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const [editItem, setEditItem] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [inputError, setInputError] = useState(false);

  const [userDetails, setUserDetails] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: 'sedentary',
  });
  const [recommendations, setRecommendations] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Calculate total calories whenever nutritionItems changes
    const calculateTotalCalories = nutritionItems.reduce(
      (total, item) => total + parseFloat(item.calories) * item.quantity,
      0
    );

    setTotalCalories(calculateTotalCalories);

    if (calculateTotalCalories > 1000) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [nutritionItems]);

  const addNutritionItem = () => {
    // Check for valid input values before adding the item
    if (
      newItem.name &&
      parseFloat(newItem.calories) >= 0 &&
      parseFloat(newItem.protein) >= 0 &&
      parseFloat(newItem.carbs) >= 0 &&
      parseFloat(newItem.fat) >= 0
    ) {
      setNutritionItems([
        ...nutritionItems,
        { ...newItem, id: Date.now(), quantity: 1 },
      ]);
      setNewItem({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      });
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const removeAllItems = () => {
    setNutritionItems([]);
  };

  const editItemFunction = (item) => {
    setEditItem(item.id);
    setNewItem({ ...item });
  };

  const updateItemFunction = () => {
    // Check for valid input values before updating the item
    if (
      newItem.name &&
      parseFloat(newItem.calories) >= 0 &&
      parseFloat(newItem.protein) >= 0 &&
      parseFloat(newItem.carbs) >= 0 &&
      parseFloat(newItem.fat) >= 0
    ) {
      const updatedItems = nutritionItems.map((item) =>
        item.id === newItem.id ? newItem : item
      );
      setNutritionItems(updatedItems);
      setNewItem({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      });
      setEditItem(null);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const deleteItemFunction = (id) => {
    const updatedItems = nutritionItems.filter((item) => item.id !== id);
    setNutritionItems(updatedItems);
  };

  const inputErrorStyle = {
    borderColor: 'red',
  };

  const updateItemQuantity = (id, change) => {
    const updatedItems = nutritionItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + change, 1) }
        : item
    );
    setNutritionItems(updatedItems);
  };

  const totalProtein = () =>
    nutritionItems.reduce(
      (total, item) => total + parseFloat(item.protein) * item.quantity,
      0
    );

  const totalCarbs = () =>
    nutritionItems.reduce(
      (total, item) => total + parseFloat(item.carbs) * item.quantity,
      0
    );

  const totalFat = () =>
    nutritionItems.reduce(
      (total, item) => total + parseFloat(item.fat) * item.quantity,
      0
    );

  const calculateRecommendations = () => {
    const { age, height, weight, gender, activityLevel } = userDetails;

    let bmr;

    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let activityFactor;

    switch (activityLevel) {
      case 'sedentary':
        activityFactor = 1.2;
        break;
      case 'lightly_active':
        activityFactor = 1.375;
        break;
      case 'moderately_active':
        activityFactor = 1.55;
        break;
      case 'very_active':
        activityFactor = 1.725;
        break;
      case 'extra_active':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const totalCalories = bmr * activityFactor;
    const protein = (totalCalories * 0.3) / 4;
    const carbs = (totalCalories * 0.5) / 4;
    const fat = (totalCalories * 0.2) / 9;

    setRecommendations({
      calories: totalCalories.toFixed(2),
      protein: protein.toFixed(2),
      carbs: carbs.toFixed(2),
      fat: fat.toFixed(2),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const chartData = [
    { name: 'Calories', value: totalCalories },
    { name: 'Protein', value: totalProtein() },
    { name: 'Carbs', value: totalCarbs() },
    { name: 'Fat', value: totalFat() },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container">
      <h1>Nutrition Meter</h1>

      <button className="openbtn" onClick={openDrawer}>
        ☰ Open User Details
      </button>

      <div className="main-content">
        <div className="text-center">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="input-field"
            style={inputError && !newItem.name ? inputErrorStyle : {}}
          />
          <input
            type="number"
            placeholder="Calories"
            value={newItem.calories}
            onChange={(e) =>
              setNewItem({ ...newItem, calories: e.target.value })
            }
            className="input-field"
            style={
              inputError && parseFloat(newItem.calories) < 0
                ? inputErrorStyle
                : {}
            }
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={newItem.protein}
            onChange={(e) =>
              setNewItem({ ...newItem, protein: e.target.value })
            }
            className="input-field"
            style={
              inputError && parseFloat(newItem.protein) < 0
                ? inputErrorStyle
                : {}
            }
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={newItem.carbs}
            onChange={(e) => setNewItem({ ...newItem, carbs: e.target.value })}
            className="input-field"
            style={
              inputError && parseFloat(newItem.carbs) < 0
                ? inputErrorStyle
                : {}
            }
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={newItem.fat}
            onChange={(e) => setNewItem({ ...newItem, fat: e.target.value })}
            className="input-field"
            style={
              inputError && parseFloat(newItem.fat) < 0
                ? inputErrorStyle
                : {}
            }
          />

          {editItem ? (
            <button onClick={updateItemFunction}>Update Item</button>
          ) : (
            <button onClick={addNutritionItem}>Add Item</button>
          )}

          {inputError && <p className="error-message">Invalid input values</p>}

          <ul className="item-list">
            {nutritionItems.map((item) => (
              <li key={item.id} className="item">
                <div>
                  <p>Name: {item.name}</p>
                  <p>Calories: {item.calories}</p>
                  <p>Protein: {item.protein}</p>
                  <p>Carbs: {item.carbs}</p>
                  <p>Fat: {item.fat}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div>
                  <button
                    className="icon-button"
                    onClick={() => updateItemQuantity(item.id, 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => updateItemQuantity(item.id, -1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => editItemFunction(item)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => deleteItemFunction(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {nutritionItems.length > 0 && (
            <button onClick={removeAllItems}>Remove All Items</button>
          )}
        </div>

        {showWarning && (
          <div className="warning-message">
            Total calories exceed 1000! Please be careful with your diet.
          </div>
        )}

        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="closebtn" onClick={closeDrawer}>
          &times;
        </button>
        <div className="drawer-content">
          <h2>User Details</h2>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={userDetails.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Height (cm):
            <input
              type="number"
              name="height"
              value={userDetails.height}
              onChange={handleChange}
            />
          </label>
          <label>
            Weight (kg):
            <input
              type="number"
              name="weight"
              value={userDetails.weight}
              onChange={handleChange}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={userDetails.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Activity Level:
            <select
              name="activityLevel"
              value={userDetails.activityLevel}
              onChange={handleChange}
            >
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
              <option value="extra_active">Extra Active</option>
            </select>
          </label>
          <button onClick={calculateRecommendations}>
            Calculate Recommendations
          </button>

          <h3>Recommendations</h3>
          <p>Calories: {recommendations.calories} kcal</p>
          <p>Protein: {recommendations.protein} g</p>
          <p>Carbs: {recommendations.carbs} g</p>
          <p>Fat: {recommendations.fat} g</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionMeter;
