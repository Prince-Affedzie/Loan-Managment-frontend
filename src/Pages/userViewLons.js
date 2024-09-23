import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';

const backendUrl = "http://localhost:3000";

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
                <TableHeader>Date</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{loan._id}</TableCell>
                  <TableCell>{loan.loanAmount}</TableCell>
                  <TableCell status={loan.status}>{loan.status}</TableCell>
                  <TableCell>{new Date(loan.startPaymentDate).toDateString() || 'N/A'}</TableCell>
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
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const StatusFilter = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
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
`;

const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const LoansTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

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
`;

const TableHeader = styled.th`
  font-size: 1rem;
  color: #333;
`;

const TableCell = styled.td`
  font-size: 1rem;
  color: ${(props) => (props.status === 'approved' ? '#28a745' : 
                      props.status === 'pending' ? '#ffc107' : 
                      '#dc3545')};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.5rem;
  color: #007bff;
  text-align: center;
  margin: 2rem 0;
`;

const NoDataMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin: 2rem 0;
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

export default UserViewLoansPage;
