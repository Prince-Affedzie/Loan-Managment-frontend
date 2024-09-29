import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdOutlineError } from 'react-icons/md'; // Modern icon for no loans
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon
import { FiSearch } from 'react-icons/fi'; // Search icon for search bar
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const backendUrl = "https://loan-managment-app.onrender.com";

const AdminRejectedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/rejectedLoans`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch rejected loans');
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

    fetchLoans();
  }, []);

  const handleReapproveLoan = async (loanId, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/approveLoan`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId, status }),
      });
      if (!response.ok) {
        throw new Error('Failed to reapprove loan');
      }

      // Update the loan list by removing the reapproved loan
      setLoans(loans.filter((loan) => loan._id !== loanId));
      setMessage(`Loan #${loanId} has been reapproved.`);
      setMessageType('success');

      // Hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to reapprove loan #${loanId}.`);
      setMessageType('error');

      // Hide error message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/deleteLoan`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete loan');
      }

      // Update the loan list by removing the deleted loan
      setLoans(loans.filter((loan) => loan._id !== loanId));
      setMessage(`Loan #${loanId} has been deleted.`);

      // Hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to delete loan #${loanId}.`);

      // Hide error message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filter loans based on search query (name or email)
  const filteredLoans = loans.filter((loan) =>
    loan.borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.borrower.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading rejected loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Rejected Loans</h1>
        {message && (
          <FloatingMessage type={messageType}>
            {messageType === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{message}</span>
          </FloatingMessage>
        )}
      </Header>
      
      <SearchBarContainer>
        <FiSearch size={24} />
        <SearchInput
          type="text"
          placeholder="Search by borrower's name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBarContainer>

      <MainContent>
        {filteredLoans.length === 0 ? (
          <NoLoansContainer>
            <MdOutlineError size={50} />
            <p>No rejected loans match your search.</p>
          </NoLoansContainer>
        ) : (
          <LoanList>
            {filteredLoans.map((loan) => (
              <LoanItem key={loan._id}>
                <LoanDetails>
                  <h3>Loan #{loan._id}</h3>
                  <p><strong>Borrower:</strong> {loan.borrower.name} ({loan.borrower.email})</p>
                  <p><strong>Amount:</strong> GH$ {loan.loanAmount}</p>
                  <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                  <p><strong>Payment Starts on :</strong> {new Date(loan.startPaymentDate).toDateString()}</p>
                  <p><strong>Payment Due on :</strong> {new Date(loan.dueDate).toDateString()}</p>
                  <p><strong>Purpose:</strong> {loan.purpose}</p>
                  <p><strong>Duration:</strong> {loan.durationMonths} months</p>
                  <p><strong>Status:</strong> {loan.status}</p>
                  <p><strong>Rejected By:</strong> {loan.approvedBy}</p>
                  <p><strong>Approved Date:</strong> {new Date(loan.approvedDate).toDateString()}</p>
                </LoanDetails>
                <ActionButtons>
                  <button onClick={() => handleReapproveLoan(loan._id,'approved')}>Reapprove</button>
                  <button onClick={() => handleDeleteLoan(loan._id)}>Delete</button>
                </ActionButtons>
              </LoanItem>
            ))}
          </LoanList>
        )}
      </MainContent>
    </Container>
  );
};

// Styled components for the Admin Rejected Loans Page
const Container = styled.div`
  padding: 2rem;
  background-color: #f4f6f8;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #1565c0;
    margin: 0;
    font-weight: bold;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
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
  border-radius: 12px;
  padding: 2rem;
  width:97%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const LoanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoanItem = styled.div`
  background-color: #e3f2fd;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LoanDetails = styled.div`
  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #1565c0;
  }

  p {
    margin: 0.5rem 0;
    color: #333;
    line-height: 1.6;
  }
`;

const NoLoansContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #1565c0;

  svg {
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
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
    color: #1e88e5;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.25rem;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    color: #fff;
    background-color: #1565c0;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0d47a1;
    }

    &:nth-child(2) {
      background-color: #e53935;

      &:hover {
        background-color: #c62828;
      }
    }
  }
`;
const FloatingMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => (props.type === 'success' ? '#28a745' : '#dc3545')};
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInOut 3s ease-in-out;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  span {
    font-size: 1.2rem;
  }
`;


export default AdminRejectedLoansPage;
