'use client';

// Import hooks and libraries
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

// Page to view a specific archived contract with options to print or download as PDF
export default function ArchivedContractView() {
  const location = useLocation();
  const navigate = useNavigate();
  const contract = location.state?.contract; // Get contract data passed through navigation

  const printRef = useRef(); // Ref for the contract display container

  // Redirect back if no contract was passed
  useEffect(() => {
    if (!contract) {
      navigate('/archived');
    }
  }, [contract, navigate]);

  // Generate a PDF file from the contract content
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const scale = pageWidth / printRef.current.scrollWidth;

    doc.html(printRef.current, {
      callback: () => doc.save(`${contract.displayName || 'contract'}.pdf`),
      html2canvas: {
        scale,
        useCORS: true,
      },
      x: 20,
      y: 20,
      width: pageWidth - 40,
      windowWidth: printRef.current.scrollWidth,
    });
  };

  // Trigger browser print dialog
  const handlePrint = () => {
    window.print();
  };

  // Don't render anything if contract isn't available
  if (!contract) return null;

  return (
    <div className="container mt-4">
      {/* Contract display container */}
      <div
        ref={printRef}
        id="print-area"
        style={{
          maxWidth: '595px',
          margin: '0 auto',
          fontSize: '12pt',
          padding: '20px',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {contract.displayName || 'Archived Contract'}
        </h2>

        <h4 style={{ marginTop: '0' }}>Agreement Terms:</h4>
        <p style={{ whiteSpace: 'pre-line', marginBottom: '30px' }}>{contract.content}</p>

        {/* Signatures and optional QR codes */}
        <div
          className="row"
          style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}
        >
          {/* Lender Section */}
          <div className="col text-center">
            <p>
              <strong>Lender Signature:</strong>
            </p>
            {contract.lenderSignature ? (
              <img
                src={contract.lenderSignature}
                alt="Lender Signature"
                style={{ maxWidth: '200px', width: '100%' }}
              />
            ) : (
              <p>No signature available.</p>
            )}
            {contract.lenderQR && (
              <div className="mt-2">
                <img
                  src={contract.lenderQR}
                  alt="Lender QR Code"
                  style={{ maxWidth: '100px', width: '100%' }}
                />
              </div>
            )}
          </div>

          {/* Borrower Section */}
          <div className="col text-center">
            <p>
              <strong>Borrower Signature:</strong>
            </p>
            {contract.borrowerSignature ? (
              <img
                src={contract.borrowerSignature}
                alt="Borrower Signature"
                style={{ maxWidth: '200px', width: '100%' }}
              />
            ) : (
              <p>No signature available.</p>
            )}
            {contract.borrowerQR && (
              <div className="mt-2">
                <img
                  src={contract.borrowerQR}
                  alt="Borrower QR Code"
                  style={{ maxWidth: '100px', width: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="text-center mt-4 no-print">
        <button className="btn-custom me-2" onClick={handleDownloadPDF}>
          Download PDF
        </button>
        <button className="btn-custom me-2" onClick={handlePrint}>
          Print
        </button>
        <button className="btn-custom" onClick={() => navigate('/archived')}>
          Back
        </button>
      </div>
    </div>
  );
}
