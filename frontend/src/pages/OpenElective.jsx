import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UniqueDropdownForm = () => {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Fetch eligible electives from the backend
  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://openelectivenitkkr.vercel.app/api/eligible-subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set eligible electives
        setOptions(response.data.electives);
      } catch (error) {
        setError('Failed to load electives');
      }
    };

    fetchElectives();
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

    // Extract selected electives
    const selectedElectives = Object.values(selectedValues).filter((value) => value !== null);

    // Validate that all electives are selected
 if (selectedElectives.length !== options.length - 2) {
  setError(`Please select ${options.length - 2} electives.`);
  setSuccess('');
  return;
}


    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://openelectivenitkkr.vercel.app/api/student/OpenElective',
        { selectedElectives },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setError('');
      setSuccess('Electives chosen successfully!');
      setSelectedValues({});
      console.log(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error choosing electives');
      setSuccess('');
      console.error('Error choosing electives:', error);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-200">
    {/* Header */}
    <header className="bg-red-600 text-white py-4 shadow-lg flex items-center justify-between px-8">
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => navigate('/student/dashboard')}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
          alt="NIT Kurukshetra Logo"
          className="h-12 w-12 rounded-full"
        />
        <h1 className="text-2xl font-bold tracking-wide">
          Elective Selection Portal
        </h1>
      </div>
    </header>

    <main className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-2xl backdrop-blur-md bg-white/60 p-8 rounded-2xl shadow-xl border border-red-200">
        <h2 className="text-2xl font-semibold text-red-700 mb-6 text-center border-b pb-2">
          Choose Your Electives
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {options.slice(0, options.length - 2).map((option, index) => (
            <div key={`field${index}`}>
              <label
                htmlFor={`field${index}`}
                className="block text-gray-800 font-medium mb-1"
              >
                Elective {index + 1}
              </label>
              <select
                id={`field${index}`}
                value={selectedValues[`field${index}`] || ''}
                onChange={(e) => handleSelectChange(`field${index}`, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              >
                <option value="">-- Select an option --</option>
                {getFilteredOptions(`field${index}`).map((filteredOption) => (
                  <option
                    key={filteredOption._id}
                    value={filteredOption._id}
                    disabled={filteredOption.isSelected}
                    className="text-gray-700"
                  >
                    {filteredOption.name} ({filteredOption.code}) - {filteredOption.branch}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {error && <p className="text-red-600 text-center font-medium">{error}</p>}
          {success && <p className="text-green-600 text-center font-medium">{success}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Submit
          </button>
          <button
            type="button"
            className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            onClick={() => navigate('/student/dashboard')}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </main>
  </div>
);

};

export default UniqueDropdownForm;
