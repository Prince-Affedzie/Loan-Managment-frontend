import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';
const backendUrl = "http://localhost:3000";
// Mock data for demonstration
// const approvedLoansData = [
 // { id: 1, amount: '$5000', date: '2024-09-10', term: '12 months' },
 // { id: 2, amount: '$3000', date: '2024-09-12', term: '6 months' },
 // { id: 3, amount: '$7000', date: '2024-09-15', term: '24 months' },
 
//];

const UserApprovedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/loan//borrower/approvedLoans`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging output

        if (Array.isArray(data)) {
          setLoans(data);
           // Set initial filtered loans
        } else {
          console.error('Data is not an array:', data);
          setLoans([]);
          
        }
      } catch (err) {
        console.error(err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Approved Loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Approved Loans</h1>
      </Header>
      <MainContent>
      {loans.length > 0 ? (
        <LoansTable>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Balance</TableHeader>
              <TableHeader>Interest Rate</TableHeader>
              <TableHeader>Term</TableHeader>
              <TableHeader>Start Payment Date</TableHeader>
              <TableHeader>Due Date</TableHeader>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{loan.loanAmount}</TableCell>
                <TableCell>{loan.balance}</TableCell>
                <TableCell>{loan.interestRate} %</TableCell>
                <TableCell>{loan.durationMonths} Months</TableCell>
                <TableCell>{new Date(loan.startPaymentDate).toDateString()} </TableCell>
                <TableCell>{new Date(loan.dueDate).toDateString()} </TableCell>

              </tr>
            ))}
          </tbody>
        </LoansTable>
      ): (
        <p>No loan information available.</p>
      )}
      </MainContent>
    </Container>
  );
};

// Styled components for styling the Approved Loans page
const Container = styled.div`
  padding: 2rem;
  background-color: #e6f7ff; /* Match Dashboard's background color */
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;

const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LoansTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }

  th {
    background: #f8f9fa;
  }

  tr:hover {
    background: #f1f1f1;
  }
`;

const TableHeader = styled.th`
  font-size: 1rem;
  color: #333;
`;

const TableCell = styled.td`
  font-size: 1rem;
  color: #333;
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .spinner {
    font-size: 3rem;
    color: #1a73e8;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #1a73e8;
`;

export default UserApprovedLoansPage;
