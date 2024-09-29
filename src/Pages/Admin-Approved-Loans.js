import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon
import { FiSearch } from 'react-icons/fi'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const backendUrl = "https://loan-managment-app.onrender.com";

const AdminApprovedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/getApprovedLoans`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        setLoans(data);
        setFilteredLoans(data); // Initialize filtered loans with the full loan list
      } catch (err) {
        console.error(err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Filter loans based on search term
  useEffect(() => {
    const results = loans.filter(loan => 
      loan.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrower.phoneNumber.includes(searchTerm) ||
      loan.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLoans(results);
  }, [searchTerm, loans]);

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/approveLoan`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update loan status');
      }

      // Remove the loan from the list after approval/rejection
      setLoans(loans.filter(loan => loan._id !== loanId));

      // Set success message
      setMessage(`Loan #${loanId} has been ${newStatus} successfully.`);
      setMessageType('success');

      // Hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (err) {
      console.error(err);
      setMessage(`Failed to ${newStatus} loan #${loanId}.`);
      setMessageType('error');

      // Hide error message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Approved loans...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Approved Loans</h1>
        {message && (
          <FloatingMessage type={messageType}>
            {messageType === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{message}</span>
          </FloatingMessage>
        )}
        <SearchBarContainer>
        <FiSearch size={24} />
        <SearchInput
          type="text"
          placeholder="Search by borrower's name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBarContainer>

      </Header>
      <MainContent>
        <LoanList>
          {filteredLoans.length === 0 ? (
            <p>No approved loans available.</p>
          ) : (
            filteredLoans.map((loan) => (
              <LoanItem key={loan._id}>
                <LoanDetails>
                  <h3>Loan #{loan._id}</h3>
                  <p><strong>Borrower:</strong> {loan.borrower.name} ({loan.borrower.email})</p>
                  <p><strong>Phone Number:</strong> {loan.borrower.phoneNumber}</p>
                  <p><strong>Amount:</strong> GH$ {loan.loanAmount}</p>
                  <p><strong>Balance:</strong> {loan.balance} </p>
                  <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                  <p><strong>Purpose:</strong> {loan.purpose}</p>
                  <p><strong>Duration:</strong> ({loan.durationMonths}) months</p>
                  <p><strong>Start Payment Date :</strong> {new Date(loan.startPaymentDate).toDateString()} </p>
                  <p><strong>Due Date:</strong> {new Date(loan.dueDate).toDateString()}</p>
                  <p><strong>Status:</strong> {loan.status}</p>
                  <p><strong>Approved By:</strong> {loan.approvedBy}</p>
                  <p><strong>Approved Date:</strong> {new Date(loan.approvedDate).toDateString()}</p>
                </LoanDetails>
                <ActionButtons>
                  <button onClick={() => handleStatusChange(loan._id, 'rejected')}>Cancel Approval</button>
                </ActionButtons>
              </LoanItem>
            ))
          )}
        </LoanList>
      </MainContent>
    </Container>
  );
};

// Styled components for the Admin Loan page
const Container = styled.div`
  padding: 2rem;
  background-color: #e6f7ff;
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
  width:100%;
  margin-bottom: 1.0rem;
  margin-top:1.5rem;
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

const MainContent = styled.main`
  background: #fff;
  border-radius: 8px;
  padding: 2.0rem;
  margin-right: 5rem;
  width:100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
const Message = styled.p`
  color: green;
  font-size: 1.2rem;
  margin-top: 1rem;
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


export default AdminApprovedLoansPage;
