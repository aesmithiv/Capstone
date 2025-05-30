'use client';

// Import necessary hooks and context
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '@/context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Navbar component that shows user info and navigation options
export default function Navbar() {
  const { currentUser, setCurrentUser } = useContext(AppContext); // get current user from context
  const navigate = useNavigate(); // hook to programmatically navigate
  const location = useLocation(); // hook to access current route
  const dropdownRef = useRef(); // ref for detecting outside clicks
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // toggle dropdown state

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  // Don’t show navbar on landing page or if user is not logged in
  if (!currentUser || location.pathname === '/') return null;

  // Log the user out and go to homepage
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Navigate to edit profile page
  const handleEditInfo = () => {
    navigate('/edit-profile');
    setIsDropdownOpen(false);
  };

  // Navigate to archived contracts page
  const handleArchived = () => {
    navigate('/archived');
    setIsDropdownOpen(false);
  };

  // Navigate to account page
  const handleAccount = () => {
    navigate('/account');
    setIsDropdownOpen(false);
  };

  const isAccountPage = location.pathname === '/account';

  return (
    <nav className="navbar">
      {/* App title, only clickable if user is not logged in */}
      <div
        className="nav-title"
        onClick={() => {
          if (!currentUser) {
            navigate('/');
          }
        }}
        style={{ cursor: currentUser ? 'default' : 'pointer' }}
      >
        Agreed.
      </div>

      {/* User dropdown menu */}
      <div className="nav-links" ref={dropdownRef}>
        <button className="nav-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {currentUser.username} ▼
        </button>

        {/* Dropdown content */}
        {isDropdownOpen && (
          <div
            className="dropdown-menu absolute-dropdown"
            style={{
              minWidth: '240px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}
          >
            {/* Show full user info if already on account page */}
            {isAccountPage ? (
              <div
                style={{
                  marginBottom: '16px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>Name</div>
                <div>{currentUser.firstName} {currentUser.lastName}</div>

                <div style={{ fontWeight: 'bold', marginTop: '12px' }}>Email</div>
                <div>{currentUser.email}</div>

                <div style={{ fontWeight: 'bold', marginTop: '12px' }}>Phone</div>
                <div>{currentUser.phone}</div>

                <div style={{ fontWeight: 'bold', marginTop: '12px' }}>Address</div>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {currentUser.address?.split(',')[0]}
                  <br />
                  {currentUser.address?.split(',').slice(1).join(',').trim()}
                </div>
              </div>
            ) : null}

            {/* Dropdown action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!isAccountPage && (
                <button className="btn-custom" style={{ width: '100%' }} onClick={handleAccount}>
                  My Account
                </button>
              )}
              {isAccountPage && (
                <button className="btn-custom" style={{ width: '100%' }} onClick={handleEditInfo}>
                  Edit Info
                </button>
              )}
              {isAccountPage && (
                <button className="btn-custom" style={{ width: '100%' }} onClick={handleArchived}>
                  Archived Contracts
                </button>
              )}
              <button className="btn-custom" style={{ width: '100%' }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
