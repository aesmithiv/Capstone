'use client';

// Import required hooks and context creator
import { createContext, useState } from 'react';

// Create a new context to share app state
export const AppContext = createContext();

// AppProvider wraps the entire app and shares state and functions
export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // holds logged-in user data
  const [newContractData, setNewContractData] = useState({}); // temporary data for building a contract
  const [userContracts, setUserContracts] = useState({}); // all contracts grouped by user
  const [archivedContracts, setArchivedContracts] = useState([]); // contracts that have been archived

  const API_URL = 'http://localhost:3000'; // backend base URL

  // Login function
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // Validate JSON response
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response from login: ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user); // save user to context

        // fetch user's saved contracts
        const contractRes = await fetch(`${API_URL}/contracts/${data.user.username}`);
        const contracts = await contractRes.json();

        setUserContracts((prev) => ({
          ...prev,
          [data.user.username]: contracts,
        }));

        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      return { success: false, message: 'Login error' };
    }
  };

  // Signup function
  const signup = async (user) => {
    try {
      const res = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response from signup: ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user); // save user to context

        // fetch user's saved contracts
        const contractRes = await fetch(`${API_URL}/contracts/${data.user.username}`);
        const contracts = await contractRes.json();

        setUserContracts((prev) => ({
          ...prev,
          [data.user.username]: contracts,
        }));

        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Signup failed:', err.message);
      return { success: false, message: 'Signup error' };
    }
  };

  // Login as a guest (no backend request)
  const loginAsGuest = () => {
    const guestUser = {
      username: 'Guest',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    };
    setCurrentUser(guestUser);
  };

  // Update user info
  const updateUser = async (updatedData) => {
    if (!currentUser?.username) return;

    try {
      const res = await fetch(`${API_URL}/user/${currentUser.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response from update: ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user); // update local user state
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Update failed:', err.message);
      return { success: false, message: 'Update error' };
    }
  };

  // Save a new contract
  const saveContract = async (contractData) => {
    const newId = Date.now().toString(); // simple unique ID
    const user = currentUser?.username || 'Guest';

    const newContract = {
      ...contractData,
      id: newId,
      date: new Date().toLocaleDateString(),
    };

    // Add contract to local state
    setUserContracts((prev) => ({
      ...prev,
      [user]: [...(prev[user] || []), newContract],
    }));

    // Also save it to the backend
    try {
      await fetch(`${API_URL}/contracts/${user}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContract),
      });
    } catch (err) {
      console.error("Error saving contract to backend:", err.message);
    }

    return newId; // return the contract ID
  };

  // Provide state and functions to the rest of the app
  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        newContractData,
        setNewContractData,
        userContracts,
        setUserContracts,
        archivedContracts,
        setArchivedContracts,
        login,
        signup,
        loginAsGuest,
        saveContract,
        updateUser, // included for user info updates
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
