import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';
const backendUrl = "https://loan-managment-app.onrender.com";
// Mock data for demonstration
// const approvedLoansData = [
 // { id: 1, amount: '$5000', date: '2024-09-10', term: '12 months' },
 // { id: 2, amount: '$3000', date: '2024-09-12', term: '6 months' },
 // { id: 3, amount: '$7000', date: '2024-09-15', term: '24 months' },
 
//];

const UserRejectedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/loan//borrower/rejectedLoans`, {
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
        <LoadingText>Loading Rejected loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Rejected Loans</h1>
      </Header>
      <MainContent>
      {loans.length > 0 ? (
        <LoansTable>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Interest</TableHeader>
              <TableHeader>Term</TableHeader>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{loan.loanAmount}</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>{loan.durationMonths} Months</TableCell>
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
  background-color: #e6f7ff;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 100vh; /* Ensures the container fills the viewport height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1; /* Allow the main content to grow and fill available space */

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto; /* Enable horizontal scrolling on mobile devices */
`;

const LoansTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid #ddd;

    @media (max-width: 768px) {
      padding: 0.5rem;
    }
  }

  th {
    background: #f8f9fa;
  }

  tr:hover {
    background: #f1f1f1;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const TableHeader = styled.th`
  font-size: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const TableCell = styled.td`
  font-size: 1.4rem;
  color: #333;
  word-break: break-word; /* Break long text in cells */

  @media (max-width: 768px) {
    font-size: 0.8rem;
    white-space: nowrap; /* Prevent cell content from wrapping */
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  height: 100vh; /* Full viewport height */

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .spinner {
    font-size: 3rem;
    color: #1a73e8;
    animation: spin 1s linear infinite;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
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

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default UserRejectedLoansPage;
