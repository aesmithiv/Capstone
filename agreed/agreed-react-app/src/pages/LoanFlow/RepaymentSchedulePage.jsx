'use client';

// Import hooks, context, and navigation tools
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';

// Page where the user selects repayment frequency and number of payments
export default function RepaymentSchedulePage() {
  const { newContractData, setNewContractData } = useContext(AppContext); // access shared contract data
  const navigate = useNavigate(); // for routing to next page

  // State for selected schedule type and payment count
  const [schedule, setSchedule] = useState(newContractData.repaymentSchedule || '');
  const [paymentCount, setPaymentCount] = useState(newContractData.paymentCount || '');
  const [estimateText, setEstimateText] = useState(''); // display estimated payment amount

  // Handle schedule selection change
  const handleScheduleChange = (e) => {
    const selected = e.target.value;
    setSchedule(selected);
    setPaymentCount('');
    setEstimateText('');
  };

  // Handle payment count selection change
  const handlePaymentCountChange = (e) => {
    setPaymentCount(e.target.value);
  };

  // Save selected values to contract data and go to the next step
  const handleContinue = () => {
    setNewContractData(prev => ({
      ...prev,
      repaymentSchedule: schedule,
      paymentCount: schedule === 'One-Time' ? 1 : parseInt(paymentCount),
    }));

    // Skip interest step if it's one-time; otherwise go to interest page
    navigate(schedule === 'One-Time' ? '/loan/startdate' : '/loan/interest');
  };

  // Only show payment count dropdown if schedule is not one-time
  const showPaymentCount = schedule && schedule !== 'One-Time';

  // Estimate the payment amount based on selected inputs
  useEffect(() => {
    if (!newContractData.loanAmount || !paymentCount) return;

    const principal = parseFloat(newContractData.loanAmount || 0);
    const rate = parseFloat(newContractData.interestRate || 0);
    const count = parseInt(paymentCount);
    let estimated = principal / count;

    if (newContractData.interestType === 'Simple Interest') {
      const interestTotal = principal * (rate / 100);
      estimated = (principal + interestTotal) / count;
    } else if (newContractData.interestType === 'Amortized Monthly Payments') {
      const monthlyRate = rate / 100 / 12;
      estimated = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -count));
    }

    // Set the estimated payment display text
    if (!isNaN(estimated)) {
      setEstimateText(`Estimated Payment: $${estimated.toFixed(2)} x ${count}`);
    }
  }, [paymentCount, newContractData]);

  return (
    <div className="container text-center">
      <h2 className="text-2xl font-bold mb-4">Select Repayment Schedule</h2>

      {/* Repayment schedule dropdown */}
      <select
        className="form-control mb-4"
        value={schedule}
        onChange={handleScheduleChange}
      >
        <option value="">-- Select --</option>
        <option value="One-Time">One-Time</option>
        <option value="Weekly">Weekly</option>
        <option value="Bi-Weekly">Bi-Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>

      {/* Payment count dropdown if applicable */}
      {showPaymentCount && (
        <>
          <label htmlFor="paymentCount">Number of Payments</label>
          <select
            id="paymentCount"
            className="form-control mb-4"
            value={paymentCount}
            onChange={handlePaymentCountChange}
          >
            <option value="">-- Select --</option>
            {[...Array(24)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </>
      )}

      {/* Display estimated payment text */}
      {estimateText && (
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>{estimateText}</p>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <BackButton to="/loan/amount" />
        <button
          className="btn-custom"
          disabled={!schedule || (showPaymentCount && !paymentCount)}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
