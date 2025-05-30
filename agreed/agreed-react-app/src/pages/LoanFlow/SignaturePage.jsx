'use client';

// Import hooks and libraries
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';
import SignaturePad from 'signature_pad';

// Page where both parties can draw their signatures using plain canvas and signature_pad
export default function SignaturePage() {
  const { newContractData } = useContext(AppContext); // access contract data
  const navigate = useNavigate(); // used for page navigation

  // References to the canvas elements
  const lenderCanvasRef = useRef(null);
  const borrowerCanvasRef = useRef(null);

  // State to hold signature images
  const [lenderSigData, setLenderSigData] = useState('');
  const [borrowerSigData, setBorrowerSigData] = useState('');

  // State to hold SignaturePad instances
  const [lenderSigPad, setLenderSigPad] = useState(null);
  const [borrowerSigPad, setBorrowerSigPad] = useState(null);

  // Initialize SignaturePad objects when component loads
  const initPads = () => {
    if (lenderCanvasRef.current && !lenderSigPad) {
      setLenderSigPad(new SignaturePad(lenderCanvasRef.current));
    }
    if (borrowerCanvasRef.current && !borrowerSigPad) {
      setBorrowerSigPad(new SignaturePad(borrowerCanvasRef.current));
    }
  };

  // Save the current signature as image data
  const saveSignature = (role) => {
    const canvas = role === 'lender' ? lenderCanvasRef.current : borrowerCanvasRef.current;
    const dataUrl = canvas.toDataURL();
    if (role === 'lender') {
      setLenderSigData(dataUrl);
    } else {
      setBorrowerSigData(dataUrl);
    }
  };

  // Clear the drawn signature from the canvas
  const clearSignature = (role) => {
    const sigPad = role === 'lender' ? lenderSigPad : borrowerSigPad;
    sigPad?.clear();
  };

  // Continue only if both signatures are saved
  const handleContinue = () => {
    if (!lenderSigData || !borrowerSigData) {
      alert('Both signatures are required');
      return;
    }

    // Could add signature data to context here if needed
    navigate('/loan/qrupload');
  };

  return (
    <div className="container" onLoad={initPads}>
      <h2>Signatures</h2>

      {/* Signature pads for lender and borrower */}
      <div className="signature-section">
        <div className="signature-box">
          <canvas ref={lenderCanvasRef} className="signature-canvas" width={300} height={150}></canvas>
          <button className="btn-custom" onClick={() => saveSignature('lender')}>Save Lender Signature</button>
          <button className="btn-custom" onClick={() => clearSignature('lender')}>Clear</button>
        </div>

        <div className="signature-box">
          <canvas ref={borrowerCanvasRef} className="signature-canvas" width={300} height={150}></canvas>
          <button className="btn-custom" onClick={() => saveSignature('borrower')}>Save Borrower Signature</button>
          <button className="btn-custom" onClick={() => clearSignature('borrower')}>Clear</button>
        </div>
      </div>

      {/* Continue to next step */}
      <button className="btn-custom" onClick={handleContinue}>Continue</button>
    </div>
  );
}
