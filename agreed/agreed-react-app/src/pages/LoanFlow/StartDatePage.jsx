'use client';

// Import React hooks and app context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// Page for selecting the loan's start date
export default function StartDatePage() {
  const { newContractData, setNewContractData } = useContext(AppContext); // access shared contract state
  const [startDate, setStartDate] = useState(newContractData.startDate || ''); // set default value if available
  const navigate = useNavigate(); // for navigation between pages

  // Allow pressing Enter to continue
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [startDate]);

  // Save the start date and move to the next step
  const handleContinue = () => {
    if (!startDate) return alert('Please select a start date.');

    setNewContractData({
      ...newContractData,
      startDate,
    });

    navigate('/loan/borrower');
  };

  // Go back to the previous step
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Enter Start Date:</h2>

      {/* Date picker input */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="form-control"
      />

      {/* Navigation buttons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button className="btn-custom" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn-custom" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
