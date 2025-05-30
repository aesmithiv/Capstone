'use client'; // Enables client-side rendering for this component

import { useNavigate } from 'react-router-dom'; // Import navigation hook from React Router

// LandingPage is the first screen users see when visiting the app
export default function LandingPage() {
  const navigate = useNavigate(); // Hook used to programmatically navigate to other routes

  return (
    <div className="container">
      {/* Main title of the app */}
      <h1>Agreed.</h1>

      {/* Tagline or brief description */}
      <p>Person to person loans made simple</p>

      {/* Button that takes the user to the auth page (login/signup) */}
      <button className="btn btn-custom" onClick={() => navigate('/auth')}>
        Continue
      </button>
    </div>
  );
}
