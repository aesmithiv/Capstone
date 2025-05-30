'use client';

// Import hooks and context
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Page where users can view and manage their saved contracts
export default function AccountPage() {
  const { currentUser, userContracts, setUserContracts } = useContext(AppContext);
  const contracts = userContracts[currentUser?.username] || []; // get contracts for the logged-in user
  const [activeIndex, setActiveIndex] = useState(0); // track which contract is being shown
  const [viewingContract, setViewingContract] = useState(false); // toggle full contract view
  const navigate = useNavigate();

  // Toggle payment status for a specific payment checkbox
  const togglePayment = (contractIndex, paymentIndex) => {
    const updatedContracts = [...contracts];
    const payment = updatedContracts[contractIndex].payments[paymentIndex];
    payment.paid = !payment.paid;

    // Save updated state locally
    setUserContracts(prev => ({
      ...prev,
      [currentUser.username]: updatedContracts,
    }));

    // Update payment status in the backend
    fetch(`http://localhost:3000/contracts/${currentUser.username}/${contractIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContracts[contractIndex]),
    });
  };

  // Delete a contract after confirmation
  const deleteContract = (index) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;

    fetch(`http://localhost:3000/contracts/${currentUser.username}/${index}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        const updated = [...contracts];
        updated.splice(index, 1); // remove the contract from the list
        setUserContracts(prev => ({
          ...prev,
          [currentUser.username]: updated,
        }));

        // Adjust active index if needed
        if (activeIndex >= updated.length) {
          setActiveIndex(Math.max(0, updated.length - 1));
        }
      });
  };

  // Archive a contract after marking it as fully paid
  const archiveContract = async (index) => {
    const confirmed = window.confirm("Mark contract as Paid in Full and archive?");
    if (!confirmed) return;

    const contract = contracts[index];

    // Save to archived contracts
    await fetch(`http://localhost:3000/archived/${currentUser.username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract),
    });

    deleteContract(index); // remove from active list
  };

  // Navigate to the previous contract in the list
  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  // Navigate to the next contract in the list
  const goNext = () => {
    if (activeIndex < contracts.length - 1) setActiveIndex(activeIndex + 1);
  };

  // If there are no contracts, show message and button to create one
  if (!contracts.length) {
    return (
      <div className="container">
        <h2>No contracts saved yet.</h2>
        <button className="btn-custom mt-4" onClick={() => navigate('/loan/role')}>
          Create New Contract
        </button>
      </div>
    );
  }

  const current = contracts[activeIndex];
  const paidCount = current.payments.filter(p => p.paid).length;
  const progressPercent = current.payments.length
    ? Math.round((paidCount / current.payments.length) * 100)
    : 0;

  return (
    <div className="container accounts-page">
      <h2>Hello, {currentUser?.firstName || currentUser?.username}</h2>
      <h2>Your Contracts</h2>

      {!viewingContract ? (
        <>
          {/* Summary card for the current contract */}
          <div className="contract-cards">
            <div className="contract-card">
              <div className="card-header">
                <strong>{current.displayName}</strong>
              </div>
              <div className="card-body">
                <p><strong>Start Date:</strong> {new Date(current.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Repayment:</strong> {current.repaymentSchedule} – {current.paymentCount} payments</p>
                <p><strong>Interest:</strong> {current.interestType || 'None'} at {current.interestRate || 0}%</p>

                {/* Progress bar */}
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progressPercent}%` }}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progressPercent}%
                  </div>
                </div>

                {/* List of scheduled payments with checkboxes */}
                <ul className="list-group">
                  {current.payments.map((payment, i) => (
                    <li key={i} className="list-group-item d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={payment.paid}
                        onChange={() => togglePayment(activeIndex, i)}
                        className="form-check-input me-2"
                      />
                      <span style={{ flex: 1, textAlign: 'center' }}>
                        {new Date(payment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} — ${payment.amount?.toFixed(2) || 'N/A'}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Action buttons */}
                <div className="btn-group mt-4" style={{ justifyContent: 'center', display: 'flex', gap: '10px' }}>
                  <button className="btn-custom" onClick={() => setViewingContract(true)}>
                    View Contract
                  </button>
                  <button className="btn-custom" onClick={() => deleteContract(activeIndex)}>
                    Delete Contract
                  </button>
                </div>

                <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-custom" onClick={() => archiveContract(activeIndex)}>
                    Mark Paid in Full
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation between contracts */}
          <div className="account-buttons">
            <button className="btn-custom" onClick={goPrev} disabled={activeIndex === 0}>
              Previous
            </button>
            <button className="btn-custom" onClick={goNext} disabled={activeIndex === contracts.length - 1}>
              Next
            </button>
          </div>
        </>
      ) : (
        // View full contract content
        <div className="contract-page">
          <h3>Contract Agreement</h3>
          <pre className="contract-text">{current.content}</pre>
          <button className="btn-custom" onClick={() => setViewingContract(false)}>Back</button>
        </div>
      )}

      {/* Create new contract button */}
      <div className="mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn-custom" onClick={() => navigate('/loan/role')}>
          Create New Contract
        </button>
      </div>
    </div>
  );
}
