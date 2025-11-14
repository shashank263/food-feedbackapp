import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

// color helper
const getColor = (rating) => {
  if (rating === 5) return "#4CAF50";
  if (rating === 4) return "#8BC34A";
  if (rating === 3) return "#FFC107";
  if (rating === 2) return "#FF9800";
  return "#F44336";
};

function VoterView() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const navigate = useNavigate(); // ✅ navigation hook

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/foods")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

  const loadFeedbacks = async (foodId) => {
    const res = await axios.get(`http://localhost:5000/feedback/${foodId}`);
    setFeedbacks(res.data);
  };

  const submitFeedback = async () => {
    if (!selectedFood) return alert("Select a food first!");
    await axios.post(`http://localhost:5000/feedback/${selectedFood._id}`, {
      rating: Number(rating),
      comment,
    });
    setComment("");
    setRating(5);
    loadFeedbacks(selectedFood._id);
  };

  const getFeedbackStats = () => {
    const total = feedbacks.length;
    if (total === 0) return {};
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => stats[f.rating]++);
    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] = ((stats[i] / total) * 100).toFixed(1);
    }
    return percentages;
  };

  const percentages = getFeedbackStats();

  return (
    <div className="container">
      <div className="header">
        <h1>🍽 Food Feedback</h1>
        {/* ✅ Admin Button */}
        <button className="admin-btn" onClick={() => navigate("/admin")}>
          Admin Panel
        </button>
      </div>

      <div className="food-list">
        {foods.map((food) => (
          <button
            key={food._id}
            className={`food-button ${
              selectedFood?._id === food._id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedFood(food);
              loadFeedbacks(food._id);
            }}
          >
            {food.name}
          </button>
        ))}
      </div>

      {selectedFood && (
        <div className="feedback-section">
          <h2>Rate: {selectedFood.name}</h2>
          <label>Rating (1–5): </label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <label>Comment:</label>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback"
          />
          <button onClick={submitFeedback}>Submit</button>

          <h3>Feedbacks</h3>
          {feedbacks.map((f) => (
            <p key={f._id}>
              {f.rating}⭐ - {f.comment}
            </p>
          ))}

          <h3>Rating Breakdown</h3>
          {Object.keys(percentages).map((star) => (
            <div key={star} className="rating-bar">
              {star}⭐
              <div
                className="bar-fill"
                style={{
                  width: `${percentages[star]}%`,
                  backgroundColor: getColor(Number(star)),
                }}
              />
              {percentages[star]}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VoterView;
