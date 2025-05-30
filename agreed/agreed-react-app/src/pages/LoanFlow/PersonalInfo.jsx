'use client';

// Import hooks, context, and navigation tools
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';

// Page for entering the user's personal info (first name, last name, phone, address)
export default function PersonalInfo() {
  const { currentUser, newContractData, setNewContractData } = useContext(AppContext); // get user and contract state
  const navigate = useNavigate(); // used for page navigation

  // Initialize form fields with data from user (if available)
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

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
  }, [firstName, lastName, phone, address]);

  // Save user input to shared contract data and move to next step
  const handleContinue = () => {
    setNewContractData({
      ...newContractData,
      firstName,
      lastName,
      phone,
      address
    });

    navigate('/loan/amount'); // go to the loan amount page
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2 className="mb-4">Enter Your Information</h2>

      {/* Input form container with fixed width */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <input
          className="form-control mb-3"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          className="form-control mb-3"
          placeholder="Address"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <BackButton to="/loan/email" />
          <button className="btn-custom" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
