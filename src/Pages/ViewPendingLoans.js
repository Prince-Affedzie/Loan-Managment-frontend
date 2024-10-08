import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com";

const ViewPendingLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPendingLoans = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/loan//borrower/pendingLoans`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error fetching pending loans');
        }

        const loansData = await response.json();
        setLoans(Array.isArray(loansData) ? loansData : []);
      } catch (error) {
        console.error('Failed to fetch loans:', error);
      } finally {
        setLoading(false);
      }
    };

    getPendingLoans();
  }, []);

  return (
    <PageWrapper>
    <Header>
      <Title>Pending Loans</Title>
    </Header>
    <ContentSection>
      {loading ? (
        <LoadingMessage>Loading loan information...</LoadingMessage>
      ) : loans.length > 0 ? (
        <ResponsiveTableContainer>
          <LoanList loans={loans} />
        </ResponsiveTableContainer>
      ) : (
        <NoLoansMessage>No loan information available.</NoLoansMessage>
      )}
    </ContentSection>
  </PageWrapper>
  );
};

// Separate LoanList component for handling loan rendering
const LoanList = ({ loans }) => (
  <Table>
    <thead>
      <tr>
        <TableHeader>ID</TableHeader>
        <TableHeader>Amount</TableHeader>
        <TableHeader>Interest Rate</TableHeader>
        <TableHeader>Duration (Months)</TableHeader>
        <TableHeader>Start Payment Date</TableHeader>
        <TableHeader>Due Date</TableHeader>
      </tr>
    </thead>
    <tbody>
      {loans.map((loan, index) => (
        <TableRow key={loan._id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell> GH₵ {loan.loanAmount}</TableCell>
          <TableCell>{loan.interestRate}%</TableCell>
          <TableCell>{loan.durationMonths} Months</TableCell>
          <TableCell>{new Date(loan.startPaymentDate).toDateString()}</TableCell>
          <TableCell>{new Date(loan.dueDate).toDateString()}</TableCell>
        </TableRow>
      ))}
    </tbody>
  </Table>
);

// Styled components
const PageWrapper = styled.div`
  background-color: #f0f8ff;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto; // Enable horizontal scrolling if needed
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const ContentSection = styled.section`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; // Hide overflow
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;

const NoLoansMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #777;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 1rem;
  background-color: #f1f1f1;
  font-size: 1rem;
  border-bottom: 2px solid #ccc;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  color: #333;
  overflow: hidden; // Prevent overflow in cells
  text-overflow: ellipsis; // Add ellipsis for overflow text
  white-space: nowrap; // Prevent text wrapping
`;

const ResponsiveTableContainer = styled.div`
  overflow-x: auto; // Allow horizontal scrolling
  max-width: 100%; // Prevent overflow from the page
`;

export default ViewPendingLoansPage;
