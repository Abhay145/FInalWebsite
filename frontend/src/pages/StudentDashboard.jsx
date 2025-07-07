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

            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Electives Allotted</h2>
              {subjects.length > 0 ? (
                <ul className="space-y-3">
                  {subjects.map((subj, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
                      <span className="font-medium text-gray-800">{subj.name}</span>
                      <span className="text-sm text-gray-500">(Code: {subj.code})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No subjects allotted.</p>
              )}
            </section>

            <div className="flex flex-wrap gap-4 justify-center">
              {student.subjects == null && student.choices?.length === 0 && (
                <button
                  onClick={() => navigate("/openelective")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                  Select Open Electives
                </button>
              )}

              {student.subjects == null && chosenElectives.length > 0 && (
                <>
                  <button
                    onClick={() => navigate("/Updateelective")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition"
                  >
                    Update Chosen Electives
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                  >
                    View Chosen Electives
                  </button>
                </>
              )}
               <a
  href="/sem6-syllabus.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
               <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition">
    Check Syllabus
  </button>
</a>
                Check Syllabus
              </button>
            </div>
          </div>
        )}
      </main>

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
              <ul className="space-y-3">
                {chosenElectives.map((choice, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-md border"
                  >
                    <span className="font-medium text-gray-700">{choice.name}</span>
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
