import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon
import { FiSearch } from 'react-icons/fi';

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminFullyPaidPage = () => {
  const [loans, setLoans] = useState([]); // Archived loans
  const [unarchivedLoans, setUnarchivedLoans] = useState([]); // Unarchived loans
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // To display success/error messages
  const [searchTerm, setSearchTerm] = useState(''); // State to track search input
  const [currentPage, setCurrentPage] = useState(1);
  const [loansPerPage] = useState(5);
  const [viewMode, setViewMode] = useState('archived'); // 'archived' or 'unarchived'

  // Fetch archived loans
  useEffect(() => {
    if (viewMode === 'archived') {
      fetchLoans();
    }
  }, [viewMode]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/getUnArchiveLoans`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      const data = await response.json();
      setLoans(data);
    } catch (err) {
      console.error(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unarchived loans
  const fetcharchivedLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/getArchiveLoans`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch unarchived loans');
      }
      const data = await response.json();
      setUnarchivedLoans(data);
    } catch (err) {
      console.error(err);
      setUnarchivedLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (loanId, action) => {
    const endpoint = action === 'archive' ? 'archiveloan' : 'unarchiveloan';
    try {
      const response = await fetch(`${backendUrl}/api/admin/${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} loan`);
      }

      if (action === 'archive') {
        setLoans(loans.filter((loan) => loan._id !== loanId));
      } else {
        setUnarchivedLoans(unarchivedLoans.filter((loan) => loan._id !== loanId));
      }

      setMessage(`Loan #${loanId} has been ${action}d successfully.`);
      setTimeout(() => setMessage(null), 3000);

    } catch (err) {
      console.error(err);
      setMessage(`Failed to ${action} loan #${loanId}.`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filter the loans based on search
  const filteredLoans = (viewMode === 'archived' ? loans : unarchivedLoans).filter((loan) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      loan.borrower.name.toLowerCase().includes(lowerSearchTerm) ||
      loan.borrower.email.toLowerCase().includes(lowerSearchTerm) ||
      loan.borrower.phoneNumber.includes(lowerSearchTerm) ||
      loan.loanAmount.toString().includes(lowerSearchTerm)
    );
  });

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>{viewMode === 'archived' ? 'Fully Paid Loans (Archived)' : 'Unarchived Loans'}</h1>
        {message && <Message>{message}</Message>} {/* Display message */}
        <SearchBarContainer>
          <FiSearch size={24} />
          <SearchInput
            type="text"
            placeholder="Search by borrower's name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBarContainer>
        {/* Button to switch between archived and unarchived loans */}
        <ButtonContainer>
          <button onClick={() => setViewMode('archived')}>View UnArchived Loans</button>
          <button onClick={() => {
            setViewMode('unarchived');
            fetcharchivedLoans();
          }}>
            View Archived Loans
          </button>
        </ButtonContainer>
      </Header>
      <MainContent>
        <LoanList>
          {currentLoans.length === 0 ? (
            <p>No {viewMode === 'archived' ? 'Fully Paid' : 'Unarchived'} loans available.</p>
          ) : (
            currentLoans.map((loan) => (
              <LoanItem key={loan._id}>
                <LoanDetails>
                  <h5>Loan #{loan._id}</h5>
                  <p><strong>Borrower:</strong> {loan.borrower.name} ({loan.borrower.email})</p>
                  <p><strong>Phone Number:</strong> {loan.borrower.phoneNumber}</p>
                  <p><strong>Amount:</strong> GH$ {loan.loanAmount}</p>
                  <p><strong>Balance:</strong> GH$ {loan.balance}</p>
                  <p><strong>Interest:</strong> {loan.interestRate}%</p>
                  <p><strong>Payment Starts on:</strong> {new Date(loan.startPaymentDate).toDateString()}</p>
                  <p><strong>Payment Ends on:</strong> {new Date(loan.dueDate).toDateString()}</p>
                  <p><strong>Purpose:</strong> {loan.purpose}</p>
                  <p><strong>Duration:</strong> {loan.durationMonths} months</p>
                </LoanDetails>
                <ActionButtons>
                  <button onClick={() => handleStatusChange(loan._id, viewMode === 'archived' ? 'unarchive' : 'archive')}>
                    {viewMode === 'archived' ? 'Unarchive' : 'Archive'}
                  </button>
                </ActionButtons>
              </LoanItem>
            ))
          )}
        </LoanList>
        {/* Pagination Controls */}
        <Pagination>
          <PaginationButton onClick={prevPage} disabled={currentPage === 1}>Previous</PaginationButton>
          <PaginationButton
            onClick={nextPage}
            disabled={indexOfLastLoan >= filteredLoans.length}
          >
            Next
          </PaginationButton>
        </Pagination>
      </MainContent>
    </Container>
  );
};

// Styled components for the Admin Loan page
const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(to right, #e0f7fa, #80deea); /* Gradient background */
  max-width: 1000px;
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

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
  margin-top:1.5rem;
  width:100%;
  background-color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 1.1rem;
  margin-left: 0.75rem;
  flex-grow: 1;
  padding: 0.5rem;
`;

const Message = styled.p`
  color: green;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const LoanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoanItem = styled.div`
  background-color: #f1f3f5;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoanDetails = styled.div`
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #007bff;
  }

  p {
    margin: 0.5rem 0;
  }
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &:first-child {
      background-color: #28a745;
      color: #fff;

      &:hover {
        background-color: #218838;
      }
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  border: none;
  background-color: ${({ disabled }) => (disabled ? '#cccccc' : '#1565c0')};
  color: #ffffff;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#cccccc' : '#0d47a1')};
  }
`;

export default AdminFullyPaidPage;
