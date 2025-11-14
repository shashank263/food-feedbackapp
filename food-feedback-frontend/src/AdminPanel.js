import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css"; // (optional if you’re styling)

function AdminPanel() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState("");
  const [duration, setDuration] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // ✅ to show wrong password message

  useEffect(() => {
    if (loggedIn) loadFoods();
  }, [loggedIn]);

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", { password });
      if (res.data.success) {
        setLoggedIn(true);
        setErrorMsg(""); // ✅ clear previous error
      } else {
        setErrorMsg("❌ Wrong password! Try again."); // ✅ show message
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("❌ Server error. Please try again later.");
    }
  };

  const loadFoods = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/foods");
    setFoods(res.data);
  };

  const addFood = async () => {
    await axios.post("http://localhost:5000/api/foods", {
      name: newFood,
      duration: Number(duration),
    });
    setNewFood("");
    setDuration("");
    loadFoods();
  };

  const closeFood = async (id) => {
    await axios.patch(`http://localhost:5000/api/foods/${id}/close`);
    loadFoods();
  };

  const deleteFood = async (id) => {
    await axios.delete(`http://localhost:5000/api/foods/${id}`);
    loadFoods();
  };

  const viewResults = async (id) => {
    const res = await axios.get(`http://localhost:5000/feedback/${id}`);
    const feedbacks = res.data;
    if (!feedbacks.length) return alert("No feedback yet!");
    const avg = (
      feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length
    ).toFixed(1);
    alert(`Average Rating: ${avg}⭐ (${feedbacks.length} votes)`);
  };

  // ✅ If not logged in
  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>🔒 Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        {errorMsg && <p className="error">{errorMsg}</p>} {/* ✅ show error */}
      </div>
    );
  }

  // ✅ If logged in
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <input
        value={newFood}
        onChange={(e) => setNewFood(e.target.value)}
        placeholder="Food Name"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (min)"
      />
      <button onClick={addFood}>Add</button>

      <h3>Active Foods</h3>
      <ul>
        {foods
          .filter((f) => f.feedbackOpen)
          .map((f) => (
            <li key={f._id}>
              {f.name}{" "}
              <button onClick={() => closeFood(f._id)}>Close</button>
              <button onClick={() => deleteFood(f._id)}>Delete</button>
            </li>
          ))}
      </ul>

      <h3>Completed Foods</h3>
      <ul>
        {foods
          .filter((f) => !f.feedbackOpen)
          .map((f) => (
            <li key={f._id}>
              {f.name}{" "}
              <button onClick={() => viewResults(f._id)}>View Results</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
