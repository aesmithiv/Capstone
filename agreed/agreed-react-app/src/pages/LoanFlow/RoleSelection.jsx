'use client';

// Import required hooks and context
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

// Page where the user chooses their role in the loan agreement
export default function RoleSelection() {
  const { setNewContractData } = useContext(AppContext); // get function to update contract data
  const navigate = useNavigate(); // used for navigating to next page

  // Save selected role and move to email input page
  const handleRoleSelect = (role) => {
    setNewContractData(prev => ({ ...prev, role }));
    navigate('/loan/email');
  };

  // Go back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container" style={{ justifyContent: 'center' }}>
      <h2>Are you the:</h2>

      {/* Buttons to select a role */}
      <div className="btn-group" style={{ justifyContent: 'center' }}>
        <button className="btn-custom" onClick={() => handleRoleSelect('Lender')}>
          Lender
        </button>
        <button className="btn-custom" onClick={() => handleRoleSelect('Borrower')}>
          Borrower
        </button>
      </div>

      {/* Back button */}
      <button className="btn-custom" style={{ marginTop: '30px' }} onClick={handleBack}>
        ← Back
      </button>
    </div>
  );
}
