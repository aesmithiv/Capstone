import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Component for editing the user's profile information
const EditProfilePage = () => {
  // Get the current user and updateUser function from context
  const { currentUser, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Set up local state to hold the form data, pre-filled with current user info
  const [formData, setFormData] = useState({
    email: currentUser.email || '',
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    phone: currentUser.phone || '',
    address: currentUser.address || ''
  });

  // Update form data when input values change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form and call updateUser to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    await updateUser(formData); // Call context function to update the user
    navigate('/account'); // Go back to the account page after saving
  };

  // Field labels for form inputs
  const fieldLabels = {
    email: "Email",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    address: "Address"
  };

  // Render the edit profile form
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2 className="mb-4">Edit Your Info</h2>

      {/* Form to edit profile fields */}
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
        {/* Loop through each field and render an input */}
        {Object.keys(fieldLabels).map((field) => (
          <div key={field} className="form-group mb-3">
            <label htmlFor={field} className="form-label">
              {fieldLabels[field]}
            </label>
            <input
              type="text"
              name={field}
              id={field}
              className="form-control"
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Submit button */}
        <div className="text-center">
          <button type="submit" className="btn-custom">
            Save and Return
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
