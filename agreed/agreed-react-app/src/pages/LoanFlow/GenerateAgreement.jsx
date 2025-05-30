'use client';

// Imports
import { jsPDF } from 'jspdf'; // For generating PDF documents
import { useContext, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext'; // Global state
import SignaturePad from 'react-signature-canvas'; // Signature input component
import { useNavigate } from 'react-router-dom'; // For page navigation

// Component that displays the final loan agreement with signature options and export
export default function GenerateAgreement() {
  const { currentUser, newContractData, setNewContractData, setUserContracts } = useContext(AppContext);
  const navigate = useNavigate();

  // Signature pad refs
  const lenderSigRef = useRef();
  const borrowerSigRef = useRef();

  // State to track if signatures have been saved
  const [lenderSaved, setLenderSaved] = useState(!!newContractData.lenderSignature);
  const [borrowerSaved, setBorrowerSaved] = useState(!!newContractData.borrowerSignature);

  // Timestamps for signatures
  const [lenderTimestamp, setLenderTimestamp] = useState(null);
  const [borrowerTimestamp, setBorrowerTimestamp] = useState(null);

  if (!newContractData) return <div>Loading...</div>; // Just in case the data isn't ready

  // Destructure all needed fields from the contract data
  const {
    firstName, lastName, email, phone, address, role,
    loanAmount, repaymentSchedule, paymentCount, startDate,
    interestRate, interestType, borrowerFirstName, borrowerLastName,
    borrowerEmail, borrowerPhone, borrowerAddress
  } = newContractData;

  // Determine who is the lender and who is the borrower
  const lender = role === 'Lender'
    ? { name: `${firstName} ${lastName}`, email, phone, address }
    : { name: `${borrowerFirstName} ${borrowerLastName}`, email: borrowerEmail, phone: borrowerPhone, address: borrowerAddress };

  const borrower = role === 'Borrower'
    ? { name: `${firstName} ${lastName}`, email, phone, address }
    : { name: `${borrowerFirstName} ${borrowerLastName}`, email: borrowerEmail, phone: borrowerPhone, address: borrowerAddress };

  // Calculate loan totals based on interest type
  const principal = parseFloat(loanAmount || 0);
  const totalPayments = parseInt(paymentCount || 1);
  const rate = parseFloat(interestRate || 0) / 100;

  let total = principal;
  let monthly = principal / totalPayments;

  if (interestType === 'Simple Interest') {
    total = principal + (principal * rate);
    monthly = total / totalPayments;
  } else if (interestType === 'Amortized Monthly Payments') {
    monthly = (principal * rate) / (1 - Math.pow(1 + rate, -totalPayments));
    total = monthly * totalPayments;
  }

  // Generate interest summary for contract
  const summary = interestType && interestType !== 'None'
    ? `- ${interestType} at ${interestRate}% | Total: $${total.toFixed(2)} over ${totalPayments} payments of $${monthly.toFixed(2)}`
    : `- No interest | Total: $${principal.toFixed(2)} | One payment of $${monthly.toFixed(2)}`;

  // Full contract text displayed and exported
  const contractText = `
This Loan Agreement ("Agreement") is made on ${new Date().toLocaleDateString()} between:

LENDER:
${lender.name}
Address: ${lender.address}
Email: ${lender.email}
Phone: ${lender.phone}

and

BORROWER:
${borrower.name}
Address: ${borrower.address}
Email: ${borrower.email}
Phone: ${borrower.phone}

LOAN TERMS:
- Principal Amount: $${principal.toFixed(2)}
- Repayment Schedule: ${repaymentSchedule}
- Start Date: ${startDate}
${summary}

DEFAULT:
If borrower fails to pay, lender may pursue legal recovery.

SIGNATURES:
`;

  // Generate array of payment objects based on schedule
  const generatePaymentSchedule = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const payments = [];
    const start = new Date(startDate);

    for (let i = 0; i < totalPayments; i++) {
      const date = new Date(start);
      if (repaymentSchedule === 'Weekly') {
        date.setDate(start.getDate() + i * 7);
      } else if (repaymentSchedule === 'Bi-Weekly') {
        date.setDate(start.getDate() + i * 14);
      } else if (repaymentSchedule === 'Monthly') {
        date.setMonth(start.getMonth() + i);
      }
      payments.push({
        date: date.toLocaleDateString(undefined, options),
        amount: parseFloat(monthly.toFixed(2)),
        paid: false,
      });
    }

    return payments;
  };

  // Save signature to context and update state
  const saveSignature = (role) => {
    const pad = role === 'lender' ? lenderSigRef.current : borrowerSigRef.current;
    if (!pad || pad.isEmpty()) return alert('Please sign before saving.');
    const image = pad.toDataURL('image/png');
    const timestamp = new Date().toLocaleString();
    setNewContractData(prev => ({ ...prev, [`${role}Signature`]: image }));
    role === 'lender' ? (setLenderSaved(true), setLenderTimestamp(timestamp)) : (setBorrowerSaved(true), setBorrowerTimestamp(timestamp));
  };

  // Clear signature from pad and context
  const clearSignature = (role) => {
    const pad = role === 'lender' ? lenderSigRef.current : borrowerSigRef.current;
    pad.clear();
    setNewContractData(prev => ({ ...prev, [`${role}Signature`]: null }));
    role === 'lender' ? (setLenderSaved(false), setLenderTimestamp(null)) : (setBorrowerSaved(false), setBorrowerTimestamp(null));
  };

  // Save full contract to backend and update frontend state
  const saveToAccount = () => {
    const contract = {
      content: contractText,
      date: new Date().toLocaleString(),
      displayName: `${borrower.name} ($${total.toFixed(2)})`,
      startDate,
      repaymentSchedule,
      paymentCount: totalPayments,
      loanAmount: principal,
      interestRate,
      interestType,
      payments: generatePaymentSchedule(),
      lenderSignature: newContractData.lenderSignature || null,
      borrowerSignature: newContractData.borrowerSignature || null
    };

    fetch(`http://localhost:3000/contracts/${currentUser.username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract)
    })
      .then(res => res.json())
      .then(() => fetch(`http://localhost:3000/contracts/${currentUser.username}`))
      .then(res => res.json())
      .then((contracts) => {
        setUserContracts(prev => ({
          ...prev,
          [currentUser.username]: contracts
        }));
        alert('Contract saved!');
        navigate('/account');
      })
      .catch((err) => {
        console.error("Save contract failed:", err.message);
        alert("Failed to save contract.");
      });
  };

  // Generate and download a PDF version of the contract
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('courier');
    doc.setFontSize(12);
    const marginLeft = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - 20;

    doc.text(contractText, marginLeft, 10, { maxWidth: pageWidth });

    if (newContractData.lenderSignature) {
      doc.addImage(newContractData.lenderSignature, 'PNG', 10, 170, 60, 20);
      doc.text(`Signed by: ${lender.name}`, 10, 195);
      doc.text(`Date: ${lenderTimestamp || new Date().toLocaleString()}`, 10, 202);
    }

    if (newContractData.borrowerSignature) {
      doc.addImage(newContractData.borrowerSignature, 'PNG', 110, 170, 60, 20);
      doc.text(`Signed by: ${borrower.name}`, 110, 195);
      doc.text(`Date: ${borrowerTimestamp || new Date().toLocaleString()}`, 110, 202);
    }

    doc.save('Loan_Agreement.pdf');
  };

  return (
    <div className="container">
      {/* Top right action buttons */}
      <div className="top-right-buttons">
        <button className="btn-custom" onClick={() => navigate('/account')}>Back to Account</button>
        <button className="btn-custom" onClick={downloadPDF}>Download PDF</button>
        <button className="btn-custom" onClick={() => window.print()}>Print</button>
        <button className="btn-custom" onClick={saveToAccount}>Save to Account</button>
      </div>

      <h2>Loan Agreement</h2>

      {/* Display the contract text */}
      <pre className="contract-text" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{contractText}</pre>

      {/* Signature sections */}
      <div className="signature-section">
        <div className="signature-box">
          <h4>Lender Signature</h4>
          <SignaturePad ref={lenderSigRef} canvasProps={{ className: 'signature-canvas' }} />
          {newContractData.lenderSignature && (
            <>
              <img src={newContractData.lenderSignature} className="signature-img" alt="Lender Signature" />
              <p className="signature-meta">
                Signed by: {lender.name}<br />
                Date: {lenderTimestamp || new Date().toLocaleString()}
              </p>
            </>
          )}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            {!lenderSaved && (
              <button className="signature-button" onClick={() => saveSignature('lender')}>Save</button>
            )}
            <button className="signature-button clear-btn" onClick={() => clearSignature('lender')}>Clear</button>
          </div>
        </div>

        <div className="signature-box">
          <h4>Borrower Signature</h4>
          <SignaturePad ref={borrowerSigRef} canvasProps={{ className: 'signature-canvas' }} />
          {newContractData.borrowerSignature && (
            <>
              <img src={newContractData.borrowerSignature} className="signature-img" alt="Borrower Signature" />
              <p className="signature-meta">
                Signed by: {borrower.name}<br />
                Date: {borrowerTimestamp || new Date().toLocaleString()}
              </p>
            </>
          )}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            {!borrowerSaved && (
              <button className="signature-button" onClick={() => saveSignature('borrower')}>Save</button>
            )}
            <button className="signature-button clear-btn" onClick={() => clearSignature('borrower')}>Clear</button>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn-custom" onClick={() => navigate('/loan/borrower')}>
          ← Back
        </button>
      </div>
    </div>
  );
}
