import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com";

const UserViewLoansPage = () => {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/loan/user/all-loans`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setLoans(data);
          setFilteredLoans(data);
        } else {
          setLoans([]);
          setFilteredLoans([]);
        }
      } catch (err) {
        setLoans([]);
        setFilteredLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleStatusFilter(selectedStatus);
  }, [loans, selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredLoans(loans);
    } else {
      setFilteredLoans(loans.filter(loan => loan.status === status));
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading All Loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Your Loans</Title>
        <StatusFilter>
          <FilterButton active={selectedStatus === 'All'} onClick={() => handleStatusFilter('All')}>All</FilterButton>
          <FilterButton active={selectedStatus === 'approved'} onClick={() => handleStatusFilter('approved')}>Approved</FilterButton>
          <FilterButton active={selectedStatus === 'pending'} onClick={() => handleStatusFilter('pending')}>Pending</FilterButton>
          <FilterButton active={selectedStatus === 'rejected'} onClick={() => handleStatusFilter('rejected')}>Rejected</FilterButton>
        </StatusFilter>
      </Header>
      <MainContent>
        {filteredLoans.length > 0 ? (
          <LoansTable>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Start Payment Date</TableHeader>
                <TableHeader>Duration Months</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{loan._id}</TableCell>
                  <TableCell>{loan.loanAmount}</TableCell>
                  <TableCell status={loan.status}>{loan.status}</TableCell>
                  <TableCell>{new Date(loan.startPaymentDate).toDateString() || 'N/A'}</TableCell>
                  <TableCell>{loan.durationMonths} Months</TableCell>
                 
                </TableRow>
              ))}
            </tbody>
          </LoansTable>
        ) : (
          <NoDataMessage>No loan information available.</NoDataMessage>
        )}
      </MainContent>
    </Container>
  );
};

// Styled components for styling the View Loans page

const Container = styled.div`
  padding: 3rem;
  background-color: #f4f7fb;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;
const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StatusFilter = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? '#007bff' : '#f1f1f1')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #007bff;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;


const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto; /* Ensures that horizontal overflow is handled */
  width: 100%; /* Prevent the content from overflowing */

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const LoansTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  overflow-x: auto; /* Prevent the table from overlapping */
  white-space: nowrap; /* Prevents cell content from wrapping */

  th, td {
    padding: 1.25rem;
    border-bottom: 1px solid #ddd;
  }

  th {
    background: #f8f9fa;
    font-size: 1.1rem;
    font-weight: 600;
    color: #555;
  }

  tr:hover {
    background: #f0f8ff;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    th, td {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    th {
      font-size: 0.85rem;
    }
  }
`;

const TableHeader = styled.th`
  font-size: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TableCell = styled.td`
  font-size: 1rem;
  color: ${(props) => (props.status === 'approved' ? '#28a745' : 
                      props.status === 'pending' ? '#ffc107' : 
                      '#dc3545')};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

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

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;


const NoDataMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin: 2rem 0;
`;

export default UserViewLoansPage;
