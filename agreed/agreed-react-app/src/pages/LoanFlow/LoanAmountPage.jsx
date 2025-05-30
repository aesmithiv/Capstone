'use client';

// Import hooks and shared context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';

// Page to enter the loan amount
export default function LoanAmountPage() {
  const { newContractData, setNewContractData } = useContext(AppContext); // access contract state
  const [loanAmount, setLoanAmount] = useState(newContractData.loanAmount || ''); // controlled input field
  const navigate = useNavigate(); // used for navigation

  // Allow user to press Enter to continue
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [loanAmount]);

  // Remove any non-numeric characters except one decimal
  const formatAmount = (value) => {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  };

  // Handle changes in the input field
  const handleChange = (e) => {
    setLoanAmount(formatAmount(e.target.value));
  };

  // Save loan amount and continue to next step
  const handleContinue = () => {
    if (!loanAmount || isNaN(parseFloat(loanAmount))) {
      alert('Please enter a valid loan amount.');
      return;
    }
    setNewContractData({ ...newContractData, loanAmount });
    navigate('/loan/repayment');
  };

  return (
    <div className="container">
      <h2>Enter Loan Amount:</h2>

      {/* Input field for loan amount */}
      <div className="input-group">
        <span>$</span>
        <input
          type="text"
          className="form-control"
          placeholder="0.00"
          value={loanAmount}
          onChange={handleChange}
        />
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <BackButton to="/loan/info" />
        <button className="btn-custom" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
