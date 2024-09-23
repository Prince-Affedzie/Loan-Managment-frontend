import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Mock data for demonstration
const loanData = [
  { id: 1, borrower: 'John Doe', amount: '$5000', status: 'Approved', date: '2024-09-10' },
  { id: 2, borrower: 'Jane Smith', amount: '$3000', status: 'Pending', date: '2024-09-12' },
  { id: 3, borrower: 'Emily Johnson', amount: '$7000', status: 'Rejected', date: '2024-09-15' },
  // Add more mock data as needed
];

const ViewLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLoans, setFilteredLoans] = useState([]);
  
  useEffect(() => {
    // Simulate fetching data
    setLoans(loanData);
    setFilteredLoans(loanData);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = loans.filter(loan => 
      loan.borrower.toLowerCase().includes(e.target.value.toLowerCase()) ||
      loan.amount.includes(e.target.value) ||
      loan.status.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLoans(filtered);
  };

  return (
    <Container>
      <Header>
        <h1>View Loans</h1>
        <SearchInput
          type="text"
          placeholder="Search by borrower, amount, or status..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Header>
      <MainContent>
        <LoansTable>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Borrower</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map(loan => (
              <tr key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell status={loan.status}>{loan.status}</TableCell>
                <TableCell>{loan.date}</TableCell>
              </tr>
            ))}
          </tbody>
        </LoansTable>
      </MainContent>
    </Container>
  );
};

// Styled components for styling the View Loans page
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 300px;
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
  color: ${props => (props.status === 'Approved' ? '#28a745' : 
                      props.status === 'Pending' ? '#ffc107' : 
                      '#dc3545')};
`;

export default ViewLoansPage;
