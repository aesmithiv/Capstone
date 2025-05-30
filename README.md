Agreed. – Person-to-Person Loan Agreement App

Agreed. is a full-stack web application that enables individuals to create, sign, manage, and track person-to-person loan agreements. Whether you're lending money to a friend, family member, or someone in your community, Agreed. provides a transparent, secure, and accountable way to formalize the loan process.

Project Purpose & Stakeholders

Problem: Informal loans often result in confusion, forgotten repayment terms, and strained relationships.  
Solution: Agreed. provides a simple platform to generate legally-sound loan agreements, track repayment schedules, and archive completed contracts.  
Stakeholders: Borrowers and lenders looking for a digital, trustworthy solution to manage private loans.

Features

-Secure user registration and login
-Multi-step loan agreement form (role, amount, interest, repayment)
-Digital signature capture for borrower and lender
-QR code upload for payment tracking
-Repayment tracking with checkboxes and progress bar
-Archive completed contracts
-Downloadable/printable PDF of the final agreement
-Data saved per user using JSON files (mock database)

Tech Stack

Frontend:
-React (Vite)
-Bootstrap
-React Router DOM

Backend:
-Node.js
-Express
-REST API with MVC structure
-JSON file-based data storage

Tools & Libraries:
-jsPDF for PDF export
-Signature Pad for digital signatures
-date-fns for date formatting
-Postman for API testing
-Git and GitHub for version control
-VS Code for development

Project Planning & Effort

-Designed app structure in advance (pages, context, routes, JSON storage)
-Built backend first to handle user and contract routes with mock data
-Iteratively added frontend loan flow (multi-step forms, signatures, interest logic)
-Added payment tracking and contract archiving features
-Testing implemented last to ensure code coverage
-Would migrate to a real database like MongoDB or PostgreSQL in future versions

File Structure Summary

agreed/
├── agreed-react-app/       # React frontend app
│   ├── src/
│   │   ├── pages/          # Page components (Login, ContractView, etc.)
│   │   ├── components/     # Reusable UI components (Navbar, BackButton)
│   │   ├── context/        # Global app context
├── routes/                 # Express route files (users, contracts, archived)
├── data/                   # JSON mock databases
├── tests/                  # Jest + Supertest API tests
├── server.js               # Express server entry point
```

Testing Summary

Unit tests were implemented using **Jest** and **Supertest** to validate core backend functionality:

User API Tests**
- Signup and login with correct/incorrect credentials

Contract API Tests**
- Create and retrieve contracts per user

All tests pass:
- Test Suites: 2 passed
- Tests: 4 passed

Run with:

npm install
npm test


How to Run the App

1. Clone the repository
2. Navigate to the project directory
3. Run the backend server:
   
   node server.js

4. Run the frontend:
   
   cd agreed-react-app
   npm install
   npm run dev
   

Next Steps

- Integrate a real database (MongoDB or PostgreSQL)
- Add email notifications for due payments
- Implement admin dashboard for managing user accounts
