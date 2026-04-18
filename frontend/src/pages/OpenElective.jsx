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
    const selectedElectives = options.map(
      (_, index) => selectedValues[`field${index}`]
    );

    if (selectedElectives.some((v) => !v)) {
      setError(`Please select all ${options.length} electives.`);
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
    <div className="min-h-screen bg-gray-50 font-sans">
{ (
  <div className="bg-yellow-400 text-yellow-900 text-xs font-semibold py-1.5 overflow-hidden">
    <style>{`
      @keyframes marqueeScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
    <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "marqueeScroll 20s linear infinite" }}>
      ⚠️&nbsp;&nbsp;IMPORTANT NOTICE FOR 7TH SEMESTER STUDENTS: Students who were already enrolled in&nbsp;
      <strong>Logistics &amp; Supply Chain Management</strong>&nbsp;or&nbsp;
      <strong>Industrial Engineering</strong>&nbsp;in 5th Sem should mark those subjects as&nbsp;
      <strong>LEAST PRIORITY</strong>&nbsp;in their elective choices.
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️&nbsp;&nbsp;
      IMPORTANT NOTICE FOR 7TH SEMESTER STUDENTS: Students who were already enrolled in&nbsp;
      <strong>Logistics &amp; Supply Chain Management</strong>&nbsp;or&nbsp;
      <strong>Industrial Engineering</strong>&nbsp;in 5th Sem should mark those subjects as&nbsp;
      <strong>LEAST PRIORITY</strong>&nbsp;in their elective choices.
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>
)}
      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate('/student/dashboard')}
        >
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
            <h1 className="text-lg font-bold leading-tight">Elective Selection Portal</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="text-xs font-medium bg-white/15 hover:bg-white/25 transition px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Deadline banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 7v5l3 3" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Submission window:</span>{' '}
            15 Apr 2026 – 27 Apr 2026 (till 5:00 PM). All selections must be submitted before the deadline.
          </p>
        </div>

        {/* Already chosen state */}
        {alreadyChosen ? (
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Elective Selection
              </p>
            </div>
            <div className="px-5 py-8 flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">Electives Already Submitted</p>
                <p className="text-sm text-gray-500 mt-1">
                  You have already submitted your elective choices. You can update them before the deadline.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => navigate('/Updateelective')}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm"
                >
                  Update Electives
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-all duration-150"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* ── Selection Form ── */
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
                      <option value="">— Select an option —</option>
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
                Submit Elective Choices
              </button>
            </form>
          </section>
        )}

        {/* Back link */}
        {!alreadyChosen && (
          <div className="text-center">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        )}
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







