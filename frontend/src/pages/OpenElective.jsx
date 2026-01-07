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

        const electivesRes = await axios.get(
          'https://openelectivenitkkr.vercel.app/api/eligible-subjects',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOptions(electivesRes.data.electives);

        const selectedRes = await axios.get(
          'https://openelectivenitkkr.vercel.app/api/student/selected-electives',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (selectedRes.data.selectedElectives?.length > 0) {
          setAlreadyChosen(true);
        }
      } catch (err) {
        setError('Failed to load electives');
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (field, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ FIXED
  const getFilteredOptions = (field) => {
    const selectedOptions = options.map(
      (_, index) => selectedValues[`field${index}`]
    );

    return options.map((option) => ({
      ...option,
      isSelected:
        selectedOptions.includes(option._id) &&
        selectedValues[field] !== option._id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIXED ORDER (NOT TIME-BASED)
    const selectedElectives = options.map(
      (_, index) => selectedValues[`field${index}`]
    );

    if (selectedElectives.some((v) => !v)) {
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
      <header className="bg-white shadow-md p-4 border-b border-gray-200">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate('/student/dashboard')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            className="h-12 w-12"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Elective Selection Portal
          </h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 border-b pb-4">
            Select Your Electives
          </h2>

          {alreadyChosen ? (
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">
                You have already submitted your electives.
              </p>
              <button
                onClick={() => navigate('/Updateelective')}
                className="w-full py-3 bg-blue-500 text-white rounded-xl"
              >
                Update Electives
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {options.map((_, index) => (
                <div key={`field${index}`}>
                  <label className="block font-medium mb-1">
                    Elective {index + 1}
                  </label>
                  <select
                    value={selectedValues[`field${index}`] || ''}
                    onChange={(e) =>
                      handleSelectChange(`field${index}`, e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-xl"
                  >
                    <option value="">Select an option</option>
                    {getFilteredOptions(`field${index}`).map((opt) => (
                      <option
                        key={opt._id}
                        value={opt._id}
                        disabled={opt.isSelected}
                      >
                        {opt.name} ({opt.code}) - {opt.branch}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {error && <p className="text-red-600 text-center">{error}</p>}
              {success && <p className="text-green-600 text-center">{success}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white rounded-xl"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default UniqueDropdownForm;

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







