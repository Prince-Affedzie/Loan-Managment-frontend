import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';

const backendUrl = "http://localhost:3000";

const RepayLoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amountPaid, setRepaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/loan/borrower/approvedLoans`, {
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

  const handleLoanSelection = (e) => {
    const loanId = e.target.value;
    const loan = loans.find((loan) => loan._id === loanId);
    setSelectedLoan(loan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan || !amountPaid || !paymentMethod || !paymentDate) {
      alert('Please fill in all fields.');
      return;
    }

    const repaymentData = {
      loanId: selectedLoan._id,
      amountPaid, // Ensure it's a number
      paymentDate,
      paymentMethod,
    };

    try {
      const response = await fetch(`${backendUrl}/api/loan/repay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repaymentData),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Repayment successful!');
        setSelectedLoan(null); // Reset after successful submission
        setRepaymentAmount('');
        setPaymentDate('');
        setPaymentMethod('');
      } else {
        alert('Repayment failed.');
      }
    } catch (err) {
      console.error('Error submitting repayment:', err);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading  Info...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Repay a Loan</h1>
      </Header>
      <MainContent>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Select Loan:</label>
            <LoanSelect onChange={handleLoanSelection}>
              <option value="">-- Select a loan --</option>
              {loans.map((loan) => (
                <option key={loan._id} value={loan._id}>
                  Loan #{loan._id} - Balance: GH$ {loan.loanAmount}
                </option>
              ))}
            </LoanSelect>
          </FormGroup>

          {selectedLoan && (
            <LoanSummary>
              <h3>Loan Summary:</h3>
              <p><strong>Amount:</strong> GH$ {selectedLoan.loanAmount}</p>
              <p><strong>Balance:</strong> GH$ {selectedLoan.balance}</p>
              <p><strong>Due Date:</strong> {selectedLoan.dueDate}</p>
            </LoanSummary>
          )}

          <FormGroup>
            <label>Repayment Amount:</label>
            <Input 
              type="number" 
              value={amountPaid} 
              onChange={(e) => setRepaymentAmount(e.target.value)} 
              placeholder="Enter amount" 
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>Payment Date:</label>
            <Input 
              type="date" 
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>Payment Method:</label>
            <Select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              required
            >
              <option value="">-- Select payment method --</option>
              <option value="cash">Cash</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="mobile-money">Mobile Money</option>
            </Select>
          </FormGroup>

          <SubmitButton type="submit">Submit Repayment</SubmitButton>
        </Form>
      </MainContent>
    </Container>
  );
};

// Styled components for the Repay Loan page
const Container = styled.div`
  padding: 2rem;
  background-color: #e6f7ff; /* Match Dashboard's background color */
  max-width: 800px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
`;

const LoanSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const LoanSummary = styled.div`
  background-color: #f1f3f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    margin-top: 0;
    font-size: 1.2rem;
    color: #007bff;
  }

  p {
    margin: 0.5rem 0;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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


export default RepayLoanPage;
