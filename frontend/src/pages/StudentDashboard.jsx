import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chosenElectives, setChosenElectives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const studentRes = await axios.get("https://openelectivenitkkr.vercel.app/api/student/details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(studentRes.data.student);
        setSubjects(studentRes.data.student.subjects || []);

        const selectedResponse = await axios.get("https://openelectivenitkkr.vercel.app/api/student/selected-electives", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChosenElectives(selectedResponse.data.selectedElectives || []);
      } catch (err) {
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 font-sans">
      <header className="bg-gradient-to-r from-red-500 to-red-700 text-white py-6 shadow-lg flex items-center justify-between px-8">
        <div className="flex items-center space-x-5">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            className="h-14 w-14 drop-shadow-md"
          />
          <h1 className="text-2xl font-bold tracking-wide">NIT Kurukshetra - Student Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto py-10 px-6">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-3">Loading student details...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center text-lg font-medium">{error}</p>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Student Information</h2>
              <ul className="grid grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                <li><span className="font-semibold">Roll Number:</span> {student.rollNumber}</li>
                <li><span className="font-semibold">Name:</span> {student.name}</li>
                <li><span className="font-semibold">Email:</span> {student.email}</li>
                <li><span className="font-semibold">Branch:</span> {student.branch}</li>
              </ul>
            </section>

            {/* Actions Section */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {student.subjects == null && student.choices?.length === 0 && (
                  <button
                    onClick={() => navigate("/openelective")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-xl shadow-sm transition transform hover:scale-105"
                  >
                    Select Open Electives
                  </button>
                )}

                {student.subjects == null && chosenElectives.length > 0 && (
                  <>
                    <button
                      onClick={() => navigate("/Updateelective")}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-xl shadow-sm transition transform hover:scale-105"
                    >
                      Update Chosen Electives
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2 rounded-xl shadow-sm transition transform hover:scale-105"
                    >
                      View Chosen Electives
                    </button>
                  </>
                )}

                <a
                  href={
                    student.sem === 5
                      ? "/5th Sem Open Electives.pdf"
                      : "/7th Sem Open Electives .pdf"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2 rounded-xl shadow-sm transition transform hover:scale-105"
                >
                  Check Syllabus
                </a>
              </div>
            </section>

            {/* Guidelines & Eligibility */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
    Guidelines for Open Elective Allocation
  </h2>

  <ul className="text-sm text-gray-600 list-disc pl-6 space-y-2">
    <li>
      <strong>Subject Choice Submission:</strong>
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li>
          Each student must submit their open elective choices priority-wise
          from the available list before the deadline.
        </li>
        <li>
          A detailed syllabus for each elective subject is available on the
          website for reference.
        </li>
      </ul>
    </li>

    <li>
      <strong>Eligibility Criteria for Allocation:</strong>
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li>
          <strong>6th Semester Students (including re-appears):</strong>
          Allocation will be based on 4th semester CGPA or the average SGPA
          from 1st to 4th semesters (if CGPA is not available).
        </li>
        <li>
          <strong>8th Semester Students (including re-appears):</strong>
          Allocation will be based on 6th semester CGPA or the average SGPA
          from 1st to 6th semesters (if CGPA is not available).
        </li>
        <li>
          <strong>Merit-Based Allocation Policy:</strong>
          Final allocation will be strictly merit-based. Students evaluated
          using CGPA will be given priority over those considered on average
          SGPA due to re-appear.
        </li>
      </ul>
    </li>

    <li>
      <strong>Instructions:</strong>
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li>
          Students may edit their submitted choices any number of times
          before the deadline.
        </li>
        <li>
          <strong>Open Elective Choice Submission Window:</strong> 27th
          December 2025 to 31st December 2025 (till 5:00 PM). No submissions
          will be accepted after the deadline.
        </li>
        <li>
          Once a subject is allocated, no changes will be permitted.
        </li>
      </ul>
    </li>
  </ul>
</section>

          </div>
        )}
      </main>

      {/* Scrollable Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-lg p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Your Chosen Electives</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            {chosenElectives.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto pr-1 space-y-3">
                {chosenElectives.map((choice, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-md border"
                  >
                    <span className="font-medium text-gray-700">{index + 1}.{choice.name}</span>
                    <span className="text-sm text-gray-500">(Code: {choice.code})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No electives selected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;

