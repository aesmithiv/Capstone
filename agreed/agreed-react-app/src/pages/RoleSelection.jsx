'use client';

// Import hooks and context
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';

export default function RoleSelection() {
  // Access function to update new contract data from context
  const { setNewContractData } = useContext(AppContext);
  const navigate = useNavigate(); // Used to programmatically navigate to other pages

  // When user selects a role, update contract data and move to email page
  const handleRoleSelect = (role) => {
    setNewContractData(prev => ({ ...prev, role })); // Store selected role (Lender/Borrower)
    navigate('/loan/email'); // Navigate to next step in loan creation
  };

  // Go back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Are you the:</h2>

      {/* Role selection buttons */}
      <button className="btn btn-custom" onClick={() => handleRoleSelect('Lender')}>Lender</button>
      <button className="btn btn-custom" onClick={() => handleRoleSelect('Borrower')}>Borrower</button>

      {/* Back button at bottom of page */}
      <button className="back-button-bottom" onClick={handleBack}>Back</button>
    </div>
  );
}
