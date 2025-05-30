'use client';

// Import hooks and context
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// Page to display archived (fully paid) contracts
export default function ArchivedContracts() {
  const { currentUser } = useContext(AppContext); // get current user from context
  const [contracts, setContracts] = useState([]); // state for archived contracts
  const navigate = useNavigate(); // navigation hook

  // Fetch archived contracts from backend when page loads
  useEffect(() => {
    fetch(`http://localhost:3000/archived/${currentUser.username}`)
      .then((res) => res.json())
      .then(setContracts);
  }, [currentUser.username]);

  // Delete an archived contract
  const handleDelete = async (index) => {
    const res = await fetch(`http://localhost:3000/archived/${currentUser.username}/${index}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      // Remove deleted contract from state
      setContracts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>Archived Contracts</h2>

      {/* Show message if there are no archived contracts */}
      {contracts.length === 0 ? (
        <p>No archived contracts.</p>
      ) : (
        // Display each archived contract
        contracts.map((c, i) => (
          <div
            key={i}
            style={{
              border: '1px solid black',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h5>
              {c.displayName || `Contract ${i + 1}`} — {c.date}
            </h5>

            {/* View and Delete buttons for each contract */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '15px' }}>
              <button
                className="btn btn-custom"
                onClick={() => navigate('/archived/view', { state: { contract: c } })}
              >
                View
              </button>

              <button className="btn btn-custom" onClick={() => handleDelete(i)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Navigation back to account page */}
      <div className="text-center mt-4">
        <button className="btn btn-custom" onClick={() => navigate('/account')}>
          Back to Account
        </button>
      </div>
    </div>
  );
}
