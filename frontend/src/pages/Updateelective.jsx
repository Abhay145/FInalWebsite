// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UpdateElective = () => {
//   const [options, setOptions] = useState([]);
//   const [selectedValues, setSelectedValues] = useState({});
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const fetchElectives = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const electivesResponse = await axios.get('https://openelectivenitkkr.vercel.app/api/eligible-subjects', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const selectedResponse = await axios.get('https://openelectivenitkkr.vercel.app/api/student/selected-electives', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setOptions(electivesResponse.data.electives);
//         const initialValues = {};
//         selectedResponse.data.selectedElectives.forEach((elective, index) => {
//           initialValues[`field${index}`] = elective._id;
//         });
//         setSelectedValues(initialValues);
//       } catch (error) {
//         setError('Failed to load electives or selected choices');
//       }
//     };

//     fetchElectives();
//   }, []);

//   const handleSelectChange = (field, value) => {
//     setSelectedValues((prevValues) => ({
//       ...prevValues,
//       [field]: value,
//     }));
//   };

//   const getFilteredOptions = (field) => {
//     const selectedOptions = Object.values(selectedValues);
//     return options.map((option) => ({
//       ...option,
//       isSelected: selectedOptions.includes(option._id) && selectedValues[field] !== option._id,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const selectedElectives = Object.values(selectedValues).filter((value) => value !== null);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         'https://openelectivenitkkr.vercel.app/api/student/update-electives',
//         { selectedElectives },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setError('');
//       setSuccess('Electives updated successfully!');
//       setShowPopup(true);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error updating electives');
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-red-500 text-white py-4 shadow-md flex items-center justify-between px-4 md:px-6">
//         <div className="flex items-center space-x-4">
//           <a href="/student/dashboard">
//             <img
//               src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
//               alt="NIT Kurukshetra Logo"
//               className="h-12 w-12 cursor-pointer"
//             />
//           </a>
//           <h1 className="text-lg md:text-xl font-semibold">NIT Kurukshetra - Elective Update</h1>
//         </div>
//       </header>

//       <div className="container mx-auto py-8 px-4">
//         <div className="w-full max-w-2xl mx-auto px-2 md:px-0 space-y-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Select Your Electives</h2>
//             <form onSubmit={handleSubmit}>
//               {options.slice(0, options.length - 2).map((option, index) => (
//                 <div key={`field${index}`} className="form-group mb-4">
//                   <label htmlFor={`field${index}`} className="block font-medium text-gray-700">
//                     Elective {index + 1}:
//                   </label>
//                   <select
//                     id={`field${index}`}
//                     value={selectedValues[`field${index}`] || ''}
//                     onChange={(e) => handleSelectChange(`field${index}`, e.target.value)}
//                     className="select-dropdown mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   >
//                     <option value="">Clear</option>
//                     {getFilteredOptions(`field${index}`).map((filteredOption) => (
//                       <option
//                         key={filteredOption._id}
//                         value={filteredOption._id}
//                         style={{
//                           color: filteredOption.isSelected ? 'gray' : 'black',
//                           fontWeight: filteredOption.isSelected ? 'normal' : 'bold',
//                         }}
//                         disabled={filteredOption.isSelected}
//                       >
//                         {filteredOption.name} ({filteredOption.code}) - {filteredOption.branch}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ))}

//               {error && <p className="text-red-500 text-center text-sm">{error}</p>}
//               {success && <p className="text-green-500 text-center text-sm">{success}</p>}

//               <button
//                 type="submit"
//                 className="w-full py-3 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//               >
//                 Submit
//               </button>
//             </form>

//             <div className="text-center mt-6">
//               <a
//                 href="/student/dashboard"
//                 className="inline-block py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
//               >
//                 Back to Dashboard
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Center Modal Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white w-[90%] max-w-sm p-6 rounded-xl shadow-xl text-center relative animate-fadeIn">
//             <button
//               className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
//               onClick={() => setShowPopup(false)}
//             >
//               &times;
//             </button>
//             <h3 className="text-lg font-semibold text-green-600 mb-2">Electives Updated Successfully!</h3>
//             <p className="text-gray-700 text-sm">
//               Please verify from the Student Dashboard that your elective choices have been updated successfully. In rare cases, network issues may prevent updates from being saved.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateElective;
import React from 'react';

const UniqueDropdownForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-blue-100">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-300 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Elective Selection Portal</h1>
        <p className="text-xl text-gray-600 font-semibold">
          The form has been closed.
        </p>
      </div>
    </div>
  );
};

export default UniqueDropdownForm;

