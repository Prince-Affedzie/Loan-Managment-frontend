import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com"; // Replace with actual backend URL

const AdminUserDetailsPage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState({});
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user, loans, and repayment data on component load
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          const userResponse = await fetch(`${backendUrl}/api/admin/userDetails/${userId}`, {
            method: 'GET',
            credentials: 'include',
          })
          
          const userData = await userResponse.json();
           
          
          console.log( userData)
          setUser(userData);
          console.log(userData.loan)
          setLoans(userData.loan);
          console.log(loans) // Set loans
      
          // Combine all repayments from each loan
          //const allRepayments = userData.loan.reduce((acc, loan) => {
            //return acc.concat(loan.repaymentSchedule || []);
         // }, []);
         // setRepayments(allRepayments); // Set repayments
        } catch (err) {
          console.error('Failed to fetch data:', err);
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  return (
    <Container>
      <h1>User Details</h1>

      {/* Section 1: All Information About the User */}
      <Section>
        <h2>All Information About the User</h2>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
        <p><strong>Country:</strong> {user.country || 'N/A'}</p>
        <p><strong>Employement Status:</strong> {user.employmentStatus || 'N/A'}</p>
        <p><strong>Monthly Income:</strong> {user.MonthlyIncome || 'N/A'}</p>
        <p><strong>Identification Type:</strong> {user.IdentificationType || 'N/A'}</p>
        <p><strong>ID Number:</strong> {user.IDNumber || 'N/A'}</p>
        <p><strong>Residential Address:</strong> {user.ResidentialAddress || 'N/A'}</p>
        <p><strong>Date Of Birth:</strong> {user.DateOfBirth || 'N/A'}</p>
        <p><strong>Next Of Kin:</strong> {user.nextOfKin || 'N/A'}</p>
        <p><strong>Phone Number(Next of Kin):</strong> {user.nextOfKinPhoneNumber || 'N/A'}</p>
        <p><strong>Relationship(Next of Kin):</strong> {user.relationWithNextOfKin || 'N/A'}</p>
        <p><strong>Role:</strong> {user.role === 'admin' ? 'Admin' : 'User'}</p>
        <p><strong>Registered On:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
      </Section>

      {/* Section 2: All Loans Collected by the User */}
      <Section>
        <h2>All Loans and Associated Information</h2>
        {loans.length > 0 ? (
          loans.map((loan) => (
            <LoanItem key={loan._id}>
              <p><strong>Loan ID:</strong> {loan._id}</p>
              <p><strong>Amount:</strong> {loan.loanAmount}</p>
              <p><strong>Status:</strong> {loan.balance}</p>
              <p><strong>Status:</strong> {loan.status}</p>
              <p><strong>Start Payment Date:</strong> {new Date(loan.startPaymentDate).toLocaleDateString()}</p>
              <p><strong> Payment Ends on:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
            </LoanItem>
          ))
        ) : (
          <p>No loans found for this user.</p>
        )}
      </Section>

      {/* Section 3: Repayments Info */}
      <Section>
        <h2>Repayments Info</h2>
        {repayments.length > 0 ? (
          repayments.map((repayment) => (
            <RepaymentItem key={repayment._id}>
              <p><strong>Repayment ID:</strong> {repayment._id}</p>
              <p><strong>Amount Repaid:</strong> {repayment.amount}</p>
              <p><strong>Date:</strong> {new Date(repayment.date).toLocaleDateString()}</p>
            </RepaymentItem>
          ))
        ) : (
          <p>No repayments found for this user.</p>
        )}
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafc;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const LoanItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const RepaymentItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
  color: #007bff;
`;

export default AdminUserDetailsPage;
