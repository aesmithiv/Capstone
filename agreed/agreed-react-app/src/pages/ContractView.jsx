'use client';

// Import hooks and context
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';

// Component to display a single saved contract
export default function ContractView() {
  // Pull user and contract data from context
  const { currentUser, userContracts } = useContext(AppContext);
  const { id } = useParams(); // Get contract ID from URL
  const navigate = useNavigate();

  // Get contracts for current user
  const contracts = userContracts[currentUser?.username] || [];

  // Find the contract that matches the ID in the URL
  const contract = contracts.find((c) => c.id === id);

  // If the contract doesn't exist, show an error and a back button
  if (!contract) {
    return (
      <div className="container">
        <h2>Contract not found</h2>
        <button className="btn-custom" onClick={() => navigate('/account')}>
          Back to Account
        </button>
      </div>
    );
  }

  // Function to download the contract as a PDF using jsPDF
  const downloadPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get contract content to include in PDF
    const text = contract.content;

    // Set font and layout
    doc.setFont("courier");
    doc.setFontSize(12);
    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - 20;

    // Add contract content as text
    doc.text(text, marginLeft, marginTop, { maxWidth: pageWidth });

    // Set positions for images (signatures + QR codes)
    const sigXLeft = marginLeft;
    const sigXRight = marginLeft + 100;
    const sigY = marginTop + 180;

    // Add lender signature and QR
    if (contract.lenderSignature?.startsWith("data:image")) {
      doc.addImage(contract.lenderSignature, 'PNG', sigXLeft, sigY, 50, 25);
      doc.text("Lender Signature", sigXLeft + 10, sigY + 30);
    }
    if (contract.lenderQR?.startsWith("data:image")) {
      doc.addImage(contract.lenderQR, 'PNG', sigXLeft, sigY + 40, 50, 50);
    }

    // Add borrower signature and QR
    if (contract.borrowerSignature?.startsWith("data:image")) {
      doc.addImage(contract.borrowerSignature, 'PNG', sigXRight, sigY, 50, 25);
      doc.text("Borrower Signature", sigXRight + 10, sigY + 30);
    }
    if (contract.borrowerQR?.startsWith("data:image")) {
      doc.addImage(contract.borrowerQR, 'PNG', sigXRight, sigY + 40, 50, 50);
    }

    // Save the PDF file
    doc.save("Saved_Contract_With_Signatures.pdf");
  };

  // Render the full contract view
  return (
    <div className="container">
      {/* Print and Download buttons */}
      <div className="top-right-buttons">
        <button className="btn-custom print-button" onClick={() => window.print()}>
          Print
        </button>
        <button className="btn-custom pdf-button" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      {/* Display contract title and date */}
      <h2>{contract.displayName || 'Contract'} - {contract.date}</h2>

      {/* Display contract content */}
      <pre
        id="savedContractText"
        style={{
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          background: '#f1f1f1',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        {contract.content}
      </pre>

      {/* Show both signatures and QR codes if available */}
      <div className="signature-section">
        <div className="signature-box">
          {contract.lenderSignature && (
            <img src={contract.lenderSignature} alt="Lender Signature" style={{ maxWidth: '100%' }} />
          )}
          {contract.lenderQR && (
            <img src={contract.lenderQR} alt="Lender QR" style={{ maxWidth: '100px', marginTop: '10px' }} />
          )}
        </div>
        <div className="signature-box">
          {contract.borrowerSignature && (
            <img src={contract.borrowerSignature} alt="Borrower Signature" style={{ maxWidth: '100%' }} />
          )}
          {contract.borrowerQR && (
            <img src={contract.borrowerQR} alt="Borrower QR" style={{ maxWidth: '100px', marginTop: '10px' }} />
          )}
        </div>
      </div>

      {/* Back button to return to account page */}
      <div className="bottom-nav">
        <button className="btn-custom" onClick={() => navigate('/account')}>
          Back to Account
        </button>
      </div>
    </div>
  );
}
