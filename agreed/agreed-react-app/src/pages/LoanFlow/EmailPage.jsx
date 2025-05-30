'use client';

// Import hooks and context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';

// Component to collect or confirm the user's email before continuing the loan process
export default function EmailPage() {
  const { currentUser, newContractData, setNewContractData } = useContext(AppContext); // get shared state
  const [email, setEmail] = useState(currentUser?.email || ''); // set initial email from user context if available
  const navigate = useNavigate(); // hook for navigation

  // Allow pressing "Enter" to trigger continue
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };
    document.addEventListener('keydown', handleEnter);
    return () => document.removeEventListener('keydown', handleEnter);
  }, [email]);

  // Save email to context and move to the next step
  const handleContinue = () => {
    setNewContractData({ ...newContractData, email });

    // If a user is logged in, update the email there too
    if (currentUser) {
      currentUser.email = email;
    }

    navigate('/loan/info'); // go to next page in loan flow
  };

  return (
    <div className="container">
      <h2>Enter your email:</h2>

      {/* Email input field */}
      <input
        type="email"
        className="form-control"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <BackButton to="/loan/role" />
        <button className="btn-custom" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
