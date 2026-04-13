import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateElective = () => {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const token = localStorage.getItem('token');
        const electivesResponse = await axios.get(
          'https://openelectivenitkkr.vercel.app/api/eligible-subjects',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const selectedResponse = await axios.get(
          'https://openelectivenitkkr.vercel.app/api/student/selected-electives',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOptions(electivesResponse.data.electives);
        const initialValues = {};
        selectedResponse.data.selectedElectives.forEach((elective, index) => {
          initialValues[`field${index}`] = elective._id;
        });
        setSelectedValues(initialValues);
      } catch (error) {
        setError('Failed to load electives or selected choices');
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
      isSelected:
        selectedOptions.includes(option._id) && selectedValues[field] !== option._id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedElectives = Object.values(selectedValues).filter((value) => value !== null && value !== '');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://openelectivenitkkr.vercel.app/api/student/update-electives',
        { selectedElectives },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setError('');
      setSuccess('Electives updated successfully!');
      setShowPopup(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating electives');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <a href="/student/dashboard" className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
              alt="NIT Kurukshetra Logo"
              className="h-8 w-8 object-contain"
            />
          </a>
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-200 uppercase">
              NIT Kurukshetra
            </p>
            <h1 className="text-lg font-bold leading-tight">Update Electives</h1>
          </div>
        </div>
        <a
          href="/student/dashboard"
          className="text-xs font-medium bg-white/15 hover:bg-white/25 transition px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </a>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 7v5l3 3" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Submission window:</span>{' '}
            15 Apr 2026 – 26 Apr 2026 (till 5:00 PM). Changes can be made anytime before the deadline.
          </p>
        </div>

        {/* Form card */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Select Your Electives
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Rank your preferences in order of priority</p>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
            {options.map((option, index) => (
              <div key={`field${index}`}>
                <label
                  htmlFor={`field${index}`}
                  className="block text-xs font-semibold text-gray-500 mb-1.5"
                >
                  Priority {index + 1}
                </label>
                <div className="relative">
                  <select
                    id={`field${index}`}
                    value={selectedValues[`field${index}`] || ''}
                    onChange={(e) => handleSelectChange(`field${index}`, e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm font-medium px-4 py-2.5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                  >
                    <option value="">— Clear selection —</option>
                    {getFilteredOptions(`field${index}`).map((filteredOption) => (
                      <option
                        key={filteredOption._id}
                        value={filteredOption._id}
                        disabled={filteredOption.isSelected}
                        style={{ color: filteredOption.isSelected ? '#9ca3af' : '#111827' }}
                      >
                        {filteredOption.name} ({filteredOption.code}) — {filteredOption.branch}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            {/* Messages */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 shadow-sm mt-2"
            >
              Save Elective Choices
            </button>
          </form>
        </section>

        {/* Back link */}
        <div className="text-center">
          <a
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </main>

      {/* ── Success Modal ── */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Updated Successfully</h3>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-lg font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Your elective choices have been saved. Please verify from the{' '}
                <span className="font-semibold text-gray-800">Student Dashboard</span> that your
                choices are reflected correctly. In rare cases, network issues may prevent updates
                from being saved.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-5 pb-5 flex gap-3">
              <a
                href="/student/dashboard"
                className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all text-center"
              >
                Go to Dashboard
              </a>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Stay here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateElective;
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





