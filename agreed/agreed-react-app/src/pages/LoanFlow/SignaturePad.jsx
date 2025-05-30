'use client';

// Import hooks and context
import { useRef, useContext } from 'react';
import { AppContext } from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';

// Page where both lender and borrower provide digital signatures
export default function SignaturePage() {
  const { newContractData, setNewContractData } = useContext(AppContext); // access shared contract state
  const navigate = useNavigate(); // used to move to the next page

  // References to the signature pads
  const lenderSigRef = useRef(null);
  const borrowerSigRef = useRef(null);

  // Clear lender's signature from the canvas
  const clearLenderSignature = () => {
    lenderSigRef.current.clear();
  };

  // Clear borrower's signature from the canvas
  const clearBorrowerSignature = () => {
    borrowerSigRef.current.clear();
  };

  // Save signatures to shared state and move to QR upload page
  const handleSaveSignatures = () => {
    const lenderSignature = lenderSigRef.current.isEmpty()
      ? null
      : lenderSigRef.current.getTrimmedCanvas().toDataURL('image/png');

    const borrowerSignature = borrowerSigRef.current.isEmpty()
      ? null
      : borrowerSigRef.current.getTrimmedCanvas().toDataURL('image/png');

    // Check that both signatures are provided
    if (!lenderSignature || !borrowerSignature) {
      alert('Both signatures are required.');
      return;
    }

    // Save both signatures to the contract data
    setNewContractData((prev) => ({
      ...prev,
      lenderSignature,
      borrowerSignature,
    }));

    // Navigate to QR code upload step
    navigate('/loan/qrupload');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-8">Sign the Agreement</h1>

      {/* Lender signature input */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Lender Signature</h2>
        <SignaturePad
          ref={lenderSigRef}
          canvasProps={{ className: 'border border-gray-400 rounded w-80 h-48' }}
        />
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={clearLenderSignature}
        >
          Clear Lender Signature
        </button>
      </div>

      {/* Borrower signature input */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Borrower Signature</h2>
        <SignaturePad
          ref={borrowerSigRef}
          canvasProps={{ className: 'border border-gray-400 rounded w-80 h-48' }}
        />
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={clearBorrowerSignature}
        >
          Clear Borrower Signature
        </button>
      </div>

      {/* Button to save and continue */}
      <button
        className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        onClick={handleSaveSignatures}
      >
        Save Signatures & Continue
      </button>
    </div>
  );
}
