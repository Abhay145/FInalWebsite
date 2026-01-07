 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UniqueDropdownForm = () => {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alreadyChosen, setAlreadyChosen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const electivesRes = await axios.get('https://openelectivenitkkr.vercel.app/api/eligible-subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOptions(electivesRes.data.electives);

        const selectedRes = await axios.get('https://openelectivenitkkr.vercel.app/api/student/selected-electives', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (selectedRes.data.selectedElectives?.length > 0) {
          setAlreadyChosen(true);
        }
      } catch (error) {
        setError('Failed to load electives or check existing selection');
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (field, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const getFilteredOptions = (field) => {
    const selectedOptions = Object.values(selectedValues);
    return options.map((option) => ({
      ...option,
      isSelected: selectedOptions.includes(option._id) && selectedValues[field] !== option._id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedElectives = Object.values(selectedValues).filter((value) => value !== null);
    if (selectedElectives.length !== options.length) {
      setError(`Please select ${options.length} electives.`);
      setSuccess('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://openelectivenitkkr.vercel.app/api/student/OpenElective',
        { selectedElectives },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      setSuccess('Electives chosen successfully!');
      setSelectedValues({});
    } catch (error) {
      setError(error.response?.data?.message || 'Error choosing electives');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate('/student/dashboard')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            className="h-12 w-12"
          />
          <h1 className="text-2xl font-bold text-gray-800">Elective Selection Portal</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-300 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 border-b pb-4">
            Select Your Electives
          </h2>

          {alreadyChosen ? (
            <div className="text-center space-y-6">
              <p className="text-lg text-gray-700 font-semibold">
                You have already submitted your electives.
              </p>
              <button
                onClick={() => navigate('/Updateelective')}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                Update Electives
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="w-full py-3 bg-gray-400 hover:bg-gray-500 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {options.map((option, index) => (
                <div key={`field${index}`} className="space-y-2">
                  <label
                    htmlFor={`field${index}`}
                    className="block text-lg font-medium text-gray-600"
                  >
                    Elective {index + 1}
                  </label>
                  <select
                    id={`field${index}`}
                    value={selectedValues[`field${index}`] || ''}
                    onChange={(e) => handleSelectChange(`field${index}`, e.target.value)}
                    className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                  >
                    <option value="">Select an option</option>
                    {getFilteredOptions(`field${index}`).map((filteredOption) => (
                      <option
                        key={filteredOption._id}
                        value={filteredOption._id}
                        disabled={filteredOption.isSelected}
                        style={{
                          color: filteredOption.isSelected ? 'gray' : 'black',
                          fontWeight: filteredOption.isSelected ? 'normal' : 'bold',
                        }}
                      >
                        {filteredOption.name} ({filteredOption.code}) - {filteredOption.branch}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
              {success && <p className="text-green-600 font-semibold text-center">{success}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                Submit
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="w-full py-3 mt-3 bg-gray-400 hover:bg-gray-500 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                Back to Dashboard
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

// // export default UniqueDropdownForm; 
// import React from 'react';

// const UniqueDropdownForm = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-blue-100">
//       <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-300 max-w-xl text-center">
//         <h1 className="text-3xl font-bold text-gray-700 mb-4">Elective Selection Portal</h1>
//         <p className="text-xl text-gray-600 font-semibold">
//           The form has been closed.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UniqueDropdownForm;




