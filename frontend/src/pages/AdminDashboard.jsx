import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAssignBasedOnChoices = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/admin/chosen-electives",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred while assigning electives based on choices.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignFallbackElectives = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/admin/nonchosen-electives",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred while assigning fallback electives.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllSubjects = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(
        "http://localhost:5000/api/admin/electives"
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred while clearing subjects.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSubjectIcon = () => {
    navigate("/subjecticon");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-blue-600 py-6 shadow-lg">
        <h1 className="text-4xl font-bold text-white text-center">
          Admin Dashboard
        </h1>
      </header>

      {/* Dashboard Card */}
      <div className="w-full max-w-lg mt-12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Manage Electives
        </h2>

        {/* Buttons Section */}
        <div className="flex flex-col gap-4">
          {/* Assign Based on Choices */}
          <button
            onClick={handleAssignBasedOnChoices}
            disabled={loading}
            className={`w-full px-6 py-3 text-lg rounded-lg font-semibold shadow-md transition-all ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Assigning Based on Choices..." : "Assign 6th Semester Electives"}
          </button>

          {/* Assign Fallback Electives */}
         <button
            onClick={handleAssignFallbackElectives}
            disabled={loading}
            className={`w-full px-6 py-3 text-lg rounded-lg font-semibold shadow-md transition-all ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Assigning Fallback Electives..." : "Assign 8th Semester Electives"}
          </button>    

          {/* Clear All Subjects
          { <button
            onClick={handleClearAllSubjects}
            disabled={loading}
            className={`w-full px-6 py-3 text-lg rounded-lg font-semibold shadow-md transition-all ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? "Clearing Subjects..." : "Clear All Subjects"}
          </button> } */}

          {/* Navigation Button */}
          <button
            onClick={handleNavigateToSubjectIcon}
            className="w-full px-6 py-3 text-lg bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-green-700 transition"
          >
            View Subject-wise Students
          </button>
        </div>

        {/* Message Section */}
        {message && (
          <div
            className={`mt-8 text-center text-lg px-4 py-3 rounded-lg shadow-md transition-all ${
              message.includes("error")
                ? "bg-red-100 text-red-600 border border-red-400"
                : "bg-green-100 text-green-600 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} NIT Kurukshetra | All Rights Reserved
      </footer>
    </div>
  );
}

export default AdminDashboard;
