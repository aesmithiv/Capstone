'use client';

// Import hooks and context
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Page for selecting and calculating interest options for the loan
export default function InterestPage() {
  const { newContractData, setNewContractData } = useContext(AppContext); // access shared contract state
  const navigate = useNavigate(); // used for page navigation

  // State for selected interest type and rate
  const [selectedType, setSelectedType] = useState(null);
  const [rate, setRate] = useState('');
  const [estimate, setEstimate] = useState(''); // used to show estimated payment

  // Recalculate estimated payment when type or rate changes
  useEffect(() => {
    if (selectedType && rate) {
      const principal = parseFloat(newContractData.loanAmount || 0);
      const payments = parseInt(newContractData.paymentCount || 1);
      const rateDecimal = parseFloat(rate) / 100;

      let monthlyPayment = 0;

      if (selectedType === 'Simple Interest') {
        const totalInterest = principal * rateDecimal;
        monthlyPayment = (principal + totalInterest) / payments;
      } else if (selectedType === 'Amortized Monthly Payments') {
        const monthlyRate = rateDecimal / 12;
        monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));
      }

      // Display the estimated payment summary
      setEstimate(`Estimated Payment: $${monthlyPayment.toFixed(2)} x ${payments}`);
    } else {
      setEstimate('');
    }
  }, [selectedType, rate, newContractData]);

  // Save interest details and continue to next step
  const handleContinue = () => {
    setNewContractData(prev => ({
      ...prev,
      interestType: selectedType,
      interestRate: rate
    }));
    navigate('/loan/startdate');
  };

  // Skip selecting interest
  const skipInterest = () => {
    setNewContractData(prev => ({
      ...prev,
      interestType: 'None',
      interestRate: null
    }));
    navigate('/loan/startdate');
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Interest Options</h2>
      <p>Would you like to include interest?</p>

      {/* Interest type selection */}
      <div className="btn-group">
        <button
          className={`btn btn-custom ${selectedType === 'Simple Interest' ? 'selected' : ''}`}
          onClick={() => setSelectedType('Simple Interest')}
        >
          Simple Interest
        </button>
        {newContractData.repaymentSchedule === 'Monthly' && (
          <button
            className={`btn btn-custom ${selectedType === 'Amortized Monthly Payments' ? 'selected' : ''}`}
            onClick={() => setSelectedType('Amortized Monthly Payments')}
          >
            Amortized Monthly Payments
          </button>
        )}
      </div>

      {/* Show rate options if a type is selected */}
      {selectedType && (
        <div style={{ marginTop: '20px' }}>
          <label>Interest Rate (%):</label>
          <select
            className="form-control"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={{ marginTop: '10px' }}
          >
            <option value="">Select</option>
            <option value="2">2%</option>
            <option value="5">5%</option>
            <option value="8">8%</option>
            <option value="10">10%</option>
            <option value="12">12%</option>
            <option value="15">15%</option>
          </select>
        </div>
      )}

      {/* Show estimate if applicable */}
      {estimate && (
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{estimate}</p>
      )}

      {/* Navigation buttons */}
      <div className="btn-group" style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button className="btn btn-custom" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn btn-custom" onClick={skipInterest}>
          Skip
        </button>
        {selectedType && rate && (
          <button className="btn btn-custom" onClick={handleContinue}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
