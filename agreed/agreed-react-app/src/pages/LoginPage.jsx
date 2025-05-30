// Import required hooks and context
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function LoginPage() {
  const { setCurrentUser } = useContext(AppContext); // Access function to set the logged-in user
  const [username, setUsername] = useState(""); // Track input for username
  const [password, setPassword] = useState(""); // Track input for password
  const navigate = useNavigate(); // Hook for navigation

  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault(); // Prevent page reload on form submit

    // Send login request to backend
    fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), // Send user credentials
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentUser(data.user); // Save user info in context
          navigate("/account"); // Redirect to account page after login
        } else {
          alert(data.message || "Login failed."); // Show error if login unsuccessful
        }
      })
      .catch((err) => {
        console.error("Login error:", err); // Log any unexpected errors
        alert("An error occurred during login.");
      });
  }

  return (
    <div className="container">
      <h2>Login</h2>

      {/* Login form */}
      <form onSubmit={handleLogin} style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Username input */}
        <input
          className="form-control"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={{ marginTop: "10px" }}
        />

        {/* Password input */}
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ marginTop: "10px" }}
        />

        {/* Submit button */}
        <button type="submit" className="btn btn-custom" style={{ marginTop: "20px" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
