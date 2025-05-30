// Importing React Router tools for routing
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importing shared components
import Navbar from './components/Navbar';

// Importing general pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import ContractView from './pages/ContractView';
import EditProfilePage from './pages/EditProfilePage';

// Archived contracts pages
import ArchivedContracts from './pages/ArchivedContracts';
import ArchivedContractView from './pages/ArchivedContractView';

// Importing loan creation flow pages
import RoleSelection from './pages/LoanFlow/RoleSelection';
import EmailPage from './pages/LoanFlow/EmailPage';
import PersonalInfo from './pages/LoanFlow/PersonalInfo';
import LoanAmountPage from './pages/LoanFlow/LoanAmountPage';
import RepaymentSchedulePage from './pages/LoanFlow/RepaymentSchedulePage';
import InterestPage from './pages/LoanFlow/InterestPage';
import StartDatePage from './pages/LoanFlow/StartDatePage';
import BorrowerInfo from './pages/LoanFlow/BorrowerInfo';
import GenerateAgreement from './pages/LoanFlow/GenerateAgreement';
import SignaturePage from './pages/LoanFlow/SignaturePage';

// Importing global styles
import './App.css';

/*
  Layout component wraps all routes and conditionally renders the Navbar.
  Navbar is hidden on the landing page and agreement generation page.
*/
function Layout() {
  const location = useLocation();

  // Hide navbar on specific routes
  const hideNavbar = location.pathname === '/' || location.pathname === '/loan/generate';

  return (
    <>
      {/* Only show navbar if not on landing or generate page */}
      {!hideNavbar && <Navbar />}

      {/* Page content container */}
      <div className="page-content">
        <Routes>
          {/* General Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/contract/:id" element={<ContractView />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />

          {/* Archived Contract Pages */}
          <Route path="/archived" element={<ArchivedContracts />} />
          <Route path="/archived/view" element={<ArchivedContractView />} />

          {/* Loan Flow Pages */}
          <Route path="/loan/role" element={<RoleSelection />} />
          <Route path="/loan/email" element={<EmailPage />} />
          <Route path="/loan/info" element={<PersonalInfo />} />
          <Route path="/loan/amount" element={<LoanAmountPage />} />
          <Route path="/loan/repayment" element={<RepaymentSchedulePage />} />
          <Route path="/loan/interest" element={<InterestPage />} />
          <Route path="/loan/startdate" element={<StartDatePage />} />
          <Route path="/loan/borrower" element={<BorrowerInfo />} />
          <Route path="/loan/generate" element={<GenerateAgreement />} />
          <Route path="/loan/signature" element={<SignaturePage />} />
        </Routes>
      </div>
    </>
  );
}

/*
  App component wraps everything in a Router.
  This allows the whole app to use React Router for navigation.
*/
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
