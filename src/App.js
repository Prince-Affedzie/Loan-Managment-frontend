import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';
import ApplyLoan from './Pages/ApplyLoan';
import SignUpPage  from './Pages/SingnUp';
import ViewLoansPage from './Pages/ViewLoans';
import AdminDashboardPage from './Pages/AdminDashboard';
import UserViewLoansPage from './Pages/userViewLons';
import UserApprovedLoansPage from './Pages/User-Approved-Loans';
import RepayLoanPage from './Pages/Repay-loan';
import RepaymentsMadePage from './Pages/User-Repayments';
import UserRejectedLoansPage from './Pages/User-Rejected-Loans'
import ViewPendingLoansPage from './Pages/ViewPendingLoans';
import AdminLoanPage from './Pages/Admin-Pending-Loans';
import AdminApprovedLoansPage from './Pages/Admin-Approved-Loans'
import AdminRejectedLoansPage from './Pages/Admin-Rejected-Loans'
import  AdminViewUsersPage from './Pages/Admin-View-Users'
import UserProfilePage from './Pages/CompleteProfile'
import UserProfile from './Pages/UserProfile'
import AdminLoginPage from './Pages/AdminLogin'
import AdminRepayments from './Pages/Admin-View-Repayments'
import AdminAddUserPage from './Pages/Admin-Add-User'
import AdminUpdateUser from './Pages/Admin-Update-user'
import UserFullyPaidLoansPage from './Pages/User-View-FullyPaid'
import  AdminUserDetailsPage from './Pages/Admin-View-UserDetails'
import AdminFullyPaidPage from './Pages/Admin-View-fullyPaid-Loan'
//import LoanDetails from './pages/LoanDetails';
//import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complete-profile" element={<UserProfilePage />} />
        <Route path="/user-profile" element={<UserProfile />} />
        
        

        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin-add-user" element={<AdminAddUserPage />} />
        <Route path="/admin-pending-loans" element={<AdminLoanPage />} />
        <Route path="/admin-approved-loans" element={<AdminApprovedLoansPage />} />
        <Route path="/admin-rejected-loans" element={<AdminRejectedLoansPage />} />
        <Route path="/admin-view-users" element={< AdminViewUsersPage />} />
        <Route path="/admin-view-userDetails/:userId" element={<  AdminUserDetailsPage />} />
        <Route path="/admin-update-user/:userId" element={< AdminUpdateUser  />} />
        <Route path="/admin-view-repayments" element={< AdminRepayments />} />
        <Route path="/admin-view-fullypaid" element={<AdminFullyPaidPage />} />
        <Route path="/view-pending" element={<ViewPendingLoansPage />} />

        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/view-loans" element={<UserViewLoansPage />} />
        <Route path="/approved-loans" element={<UserApprovedLoansPage />} />
       
        <Route path="/rejected-loans" element={< UserRejectedLoansPage />} />
        <Route path="/repay-loans" element={<RepayLoanPage />} />
        <Route path="/user-repayments" element={<RepaymentsMadePage />} />
        <Route path="/user-fullyPaid" element={<UserFullyPaidLoansPage />} />

       
       
      </Routes>
    </Router>
  );
}

export default App;
