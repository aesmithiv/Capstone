'use client';

// Import necessary hooks and context
import { useState, useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// AuthPage handles both login and signup functionality
export default function AuthPage() {
  // Pull login, signup, and user setter from context
  const { login, signup, setCurrentUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Boolean to toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  // Form data state to hold input values
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  // Update form data when input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for login/signup
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    let res;
    if (isLogin) {
      // Call login function with just username and password
      res = await login(formData.username, formData.password);
    } else {
      // Call signup function with full form data
      res = await signup(formData);
    }

    // If successful, navigate to account page
    if (res.success) {
      navigate('/account');
    } else {
      // Show error message
      alert(res.message || 'Authentication failed');
    }
  };

  // Guest mode: create a temporary user and skip login
  const continueAsGuest = () => {
    setCurrentUser({
      username: 'Guest',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    });
    navigate('/loan/role');
  };

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      {/* Auth form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="form-control"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className="form-control"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Extra fields shown only during signup */}
        {!isLogin && (
          <>
            <input
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Buttons for submit and toggle */}
        <div className="auth-buttons">
          <button type="submit" className="btn-custom">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="btn-custom"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>
      </form>

      {/* Guest login option */}
      <hr style={{ width: '60%', margin: '20px auto' }} />
      <p>Continue without an account:</p>
      <button className="btn-custom" onClick={continueAsGuest}>
        Continue as Guest
      </button>
    </div>
  );
}
