import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoterView from "./VoterView";
import AdminPanel from "./AdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoterView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;

