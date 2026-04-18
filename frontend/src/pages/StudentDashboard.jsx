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

        const studentRes = await axios.get(
          "https://openelectivenitkkr.vercel.app/api/student/details",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudent(studentRes.data.student);
        setSubjects(studentRes.data.student.subjects || []);

        const selectedResponse = await axios.get(
          "https://openelectivenitkkr.vercel.app/api/student/selected-electives",
          { headers: { Authorization: `Bearer ${token}` } }
        );

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
    <div className="min-h-screen bg-gray-50 font-sans">
{student?.sem === 7 && (
  <div className="bg-yellow-400 text-yellow-900 text-xs font-semibold py-1.5 overflow-hidden">
    <marquee behavior="scroll" direction="left" scrollamount="10">
      ⚠️&nbsp;&nbsp;IMPORTANT NOTICE FOR 7TH SEMESTER STUDENTS: Students who were already enrolled in&nbsp;
      <strong>Logistics &amp; Supply Chain Management</strong>&nbsp;or&nbsp;
      <strong>Industrial Engineering</strong>&nbsp;in 5th Sem should mark those subjects as&nbsp;
      <strong>LEAST PRIORITY</strong>&nbsp;in their elective choices.
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️&nbsp;&nbsp;
      IMPORTANT NOTICE FOR 7TH SEMESTER STUDENTS: Students who were already enrolled in&nbsp;
      <strong>Logistics &amp; Supply Chain Management</strong>&nbsp;or&nbsp;
      <strong>Industrial Engineering</strong>&nbsp;in 5th Sem should mark those subjects as&nbsp;
      <strong>LEAST PRIORITY</strong>&nbsp;in their elective choices.
    </marquee>
  </div>
)}

      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
              alt="NIT Kurukshetra Logo"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-200 uppercase">
              NIT Kurukshetra
            </p>
            <h1 className="text-lg font-bold leading-tight">Student Dashboard</h1>
          </div>
        </div>
        <span className="text-xs font-medium bg-white/15 px-3 py-1 rounded-full border border-white/20">
          Session 2025–26
        </span>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 mt-3 text-sm">Loading student details…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium text-center">
            {error}
          </div>
        ) : (
          <>
            {/* ── Student Info ── */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Student Information
                </p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                {[
                  ["Roll Number", student.rollNumber],
                  ["Name", student.name],
                  ["Email", student.email],
                  ["Branch", student.branch],
                ].map(([label, value]) => (
                  <div key={label} className="px-5 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Actions ── */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Actions
              </p>

              <div className="flex flex-wrap gap-3">
                {student.subjects == null && student.choices?.length === 0 && (
                  <button
                    onClick={() => navigate("/openelective")}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
                  >
                    Select Open Electives
                  </button>
                )}

                {student.subjects == null && chosenElectives.length > 0 && (
                  <>
                    <button
                      onClick={() => navigate("/Updateelective")}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
                    >
                      Update Electives
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 transition-all duration-150"
                    >
                      View Chosen Electives
                    </button>
                  </>
                )}

                <a
                  href={
                    student.sem === 5
                      ? "/OE Syllabus of 5th Semester for AY 2026-27.docx"
                      : "/OE Syllabus of 7th Semester for AY 2026-27.docx"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
                >
                  Check Syllabus
                </a>
              </div>

              {/* Deadline notice */}
              <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg
                  className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 7v5l3 3" />
                </svg>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-semibold">Submission window:</span>{" "}
                  15 Apr 2026 – 27 Apr 2026 (till 5:00 PM). No changes accepted after deadline.
                </p>
              </div>
            </section>

            {/* ── Guidelines ── */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Allocation Guidelines
              </p>

              {/* Sub-section */}
              {[
                {
                  title: "Subject Choice Submission",
                  items: [
                    "Submit choices priority-wise from the electives list before the deadline.",
                    "Detailed syllabus for each elective is available on the portal.",
                  ],
                },
                {
                  title: "Eligibility Criteria",
                  items: [
                    "5th Semester (incl. re-appears): Average SGPA from 1st to 3rd semesters.",
                    "7th Semester Regular: Based on 5th semester CGPA.",
                    "7th Semester with Re-appear: Average SGPA from 1st to 5th semesters.",
                    "Merit policy: CGPA students are given priority over average SGPA candidates.",
                  ],
                },
                {
                  title: "Instructions",
                  items: [
                    "Choices may be edited at any time before the deadline.",
                    "No submissions or changes accepted after the deadline.",
                    "Once a subject is allocated, no changes will be permitted.",
                    "Please verify your Open Elective choices after submission by checking them on the Home Page.",
                  ],
                },
              ].map((section, si) => (
                <div key={si} className={si !== 0 ? "mt-5" : ""}>
                  <p className="text-xs font-semibold text-gray-500 mb-2">{section.title}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">Your Chosen Electives</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-lg font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {chosenElectives.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                  {chosenElectives.map((choice, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-gray-800">
                        {index + 1}. {choice.name}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-3">
                        {choice.code}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">No electives selected yet.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
