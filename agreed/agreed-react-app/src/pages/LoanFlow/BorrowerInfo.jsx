'use client';

// Import React hooks and app context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// Component to collect borrower details before generating the loan agreement
export default function BorrowerInfo() {
  const { newContractData, setNewContractData } = useContext(AppContext); // shared state for contract data
  const [borrower, setBorrower] = useState({
    email: newContractData.borrowerEmail || '',
    firstName: newContractData.borrowerFirstName || '',
    lastName: newContractData.borrowerLastName || '',
    phone: newContractData.borrowerPhone || '',
    address: newContractData.borrowerAddress || '',
  });

  const navigate = useNavigate(); // used to navigate between pages

  // Listen for Enter key to trigger "Continue"
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [borrower]);

  // Handle input field updates
  const handleChange = (field, value) => {
    setBorrower({ ...borrower, [field]: value });
  };

  // Validate input and move to next step
  const handleContinue = () => {
    if (!borrower.email || !borrower.firstName || !borrower.lastName || !borrower.phone || !borrower.address) {
      alert('Please fill in all fields.');
      return;
    }

    // Save borrower info to shared contract data
    setNewContractData({
      ...newContractData,
      borrowerEmail: borrower.email,
      borrowerFirstName: borrower.firstName,
      borrowerLastName: borrower.lastName,
      borrowerPhone: borrower.phone,
      borrowerAddress: borrower.address,
    });

    // Go to contract generation page
    navigate('/loan/generate');
  };

  // Go back to the previous step (start date page)
  const handleBack = () => {
    navigate('/loan/startdate');
  };

  return (
    <div className="container">
      <h2>Enter your Borrower's information:</h2>

      {/* Input fields for borrower details */}
      <input
        type="email"
        className="form-control"
        placeholder="Email"
        value={borrower.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        placeholder="First Name"
        value={borrower.firstName}
        onChange={(e) => handleChange('firstName', e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        placeholder="Last Name"
        value={borrower.lastName}
        onChange={(e) => handleChange('lastName', e.target.value)}
      />
      <input
        type="tel"
        className="form-control"
        placeholder="Phone"
        value={borrower.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        placeholder="Address"
        value={borrower.address}
        onChange={(e) => handleChange('address', e.target.value)}
      />

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button className="btn-custom" onClick={handleBack}>← Back</button>
        <button className="btn-custom" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
}
