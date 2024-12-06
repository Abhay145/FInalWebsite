import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX library for exporting Excel
import '../App.css';
import Studenttable from './Studenttable';

function Subjecticon() {
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null); // Track the selected subject

  useEffect(() => {
    // Fetch subjects from the backend API
    axios
      .get('http://localhost:5000/api/subjects')
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      });
  }, []);

  const handleSubjectClick = (subject) => {
    setActiveSubject(subject); // Set the active subject
  };

  const handleBackClick = () => {
    setActiveSubject(null); // Clear the active subject to show the list again
  };
  const exportToExcel = (semesterSubjects) => {
    if (!semesterSubjects || semesterSubjects.length === 0) {
      console.error("No subjects available to export.");
      return;
    }
  
    // Prepare the data
    const exportData = semesterSubjects.flatMap((subject) => {
      if (!subject.students || subject.students.length === 0) {
        console.warn(`No students found for subject: ${subject.name}`);
        return [];
      }
  
      return subject.students.map((student) => ({
        'Subject Name': subject.name,
        'Subject Code': subject.code,
        'Student Name': student.name,
        'Roll Number': student.rollNumber,
        Choices: student.choices.map((choice) => choice.name).join(', '),
        Branch: student.dept,
        Allocated: subject.name,
        CG: student.CG, // Add CG if you want it in the Excel file
      }));
    });
  
    if (exportData.length === 0) {
      console.error("No data to export.");
      return;
    }
  
    // Sort the export data by CG in descending order
    exportData.sort((a, b) => b.CG - a.CG);
  
    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
    const filename = `electivesSem${semesterSubjects[0].sem}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };
  
  

  // Separate subjects by semester
  const semester6Subjects = subjects.filter((subject) => subject.sem === 6);
  const semester8Subjects = subjects.filter((subject) => subject.sem === 8);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-500 text-white py-4 shadow-md flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            className="h-12 w-12"
          />
          <h1 className="text-xl font-semibold"> Open Electives</h1>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {activeSubject ? (
          <div>
            <button
              onClick={handleBackClick}
              className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Back
            </button>
            <Studenttable subject={activeSubject} /> {/* Pass the active subject here */}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Electives by Semester</h1>

            {/* 6th Semester Section */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">6th Semester</h2>
              <button
                onClick={() => {
           
                  exportToExcel(semester6Subjects);
                }}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Export to Excel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {semester6Subjects.length > 0 ? (
                semester6Subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-red-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition overflow-hidden text-center"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <div className="font-semibold text-lg truncate">{subject.name} ({subject.code})</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No subjects for 6th semester.</div>
              )}
            </div>

            {/* 8th Semester Section */}
            <div className="mt-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">8th Semester</h2>
              <button
                onClick={() => exportToExcel(semester8Subjects)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Export to Excel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {semester8Subjects.length > 0 ? (
                semester8Subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-red-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition overflow-hidden text-center"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <div className="font-semibold text-lg truncate">{subject.name} ({subject.code})</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No subjects for 8th semester.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjecticon;
