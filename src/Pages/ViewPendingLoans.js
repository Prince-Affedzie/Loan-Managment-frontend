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
          <LoanList loans={loans} />
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
      </tr>
    </thead>
    <tbody>
      {loans.map((loan, index) => (
        <TableRow key={loan._id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{loan.loanAmount}</TableCell>
          <TableCell>{loan.interestRate}%</TableCell>
          <TableCell>{loan.durationMonths} Months</TableCell>
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
`;

export default ViewPendingLoansPage;
