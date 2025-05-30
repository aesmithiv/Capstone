import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function SignupPage() {
  // Access user context and navigation
  const { setCurrentUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Form state to store user input
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  // Update form data when inputs change
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Handle form submission for signup
  function handleSignup(e) {
    e.preventDefault();

    try {
      // Simple client-side validation to prevent invalid characters
      Object.values(formData).forEach(val => {
        if (typeof val === 'string' && val.includes('"')) {
          alert('Please remove any quotation marks from input fields.');
          throw new Error('Invalid character in input');
        }
      });

      // Send signup request to backend
      fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          // Handle unexpected responses
          if (!res.ok || !contentType?.includes("application/json")) {
            const text = await res.text();
            throw new Error(`Unexpected response: ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          // If signup is successful, save user and go to account page
          if (data.success) {
            setCurrentUser(data.user);
            navigate("/account");
          } else {
            alert(data.message || "Signup failed.");
          }
        })
        .catch((err) => {
          console.error("Signup error:", err.message);
          alert("An error occurred during signup.");
        });
    } catch (err) {
      console.error("Client validation error:", err.message);
    }
  }

  return (
    <div className="container">
      <h2>Create an Account</h2>

      {/* Signup form */}
      <form onSubmit={handleSignup} style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Username input */}
        <input
          className="form-control"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ marginTop: "10px" }}
        />

        {/* Password input */}
        <input
          className="form-control"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginTop: "10px" }}
        />

        {/* Other optional fields */}
        <input
          className="form-control"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />
        <input
          className="form-control"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />
        <input
          className="form-control"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />
        <input
          className="form-control"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />
        <input
          className="form-control"
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />

        {/* Submit button */}
        <button type="submit" className="btn btn-custom" style={{ marginTop: "20px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
