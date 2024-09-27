import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon
import { FiSearch } from 'react-icons/fi'

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminApprovedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
                  <p><strong>Approved Date:</strong> {loan.approvedDate}</p>
                </LoanDetails>
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
  padding: 2rem;
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

export default AdminApprovedLoansPage;
