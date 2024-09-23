import React, { useState,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components';
const backendUrl =  "http://localhost:3000";

const ApplyLoanPage = () => {
 
 
const navigate = useNavigate()

  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate:'',
    purpose: '',
    durationMonths: '',
    startPaymentDate:'',
    dueDate:'',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate a delay (for demonstration purposes)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Replace this URL and data with the appropriate backend URL and request body
      const response = await fetch(`${backendUrl}/api/loan/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          formData
        ),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Loan application submitted successfully!');
        navigate('/dashboard')
      } else {
        setSuccess(`Failed to submit loan application. ${result.message || 'Please try again.'}`);
      }
    } catch (error) {
      setSuccess('Failed to submit loan application. Please try again.');
      console.error('Loan submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <h1>Apply for Your Loan Today</h1>
          <p>Get the financial support you need with our quick and easy loan application process.</p>
        </HeroContent>
      </HeroSection>
      <MainContent>
        <BenefitsSection>
          <h2>Why Apply for a Loan?</h2>
          <BenefitsGrid>
            <BenefitCard>
              <Icon>💰</Icon>
              <h3>Fast Processing</h3>
              <p>Receive your funds quickly with our streamlined application process.</p>
            </BenefitCard>
            <BenefitCard>
              <Icon>🔒</Icon>
              <h3>Secure Transactions</h3>
              <p>Your information is protected with our secure system.</p>
            </BenefitCard>
            <BenefitCard>
              <Icon>✅</Icon>
              <h3>Easy Approval</h3>
              <p>We offer flexible criteria to make the approval process easier.</p>
            </BenefitCard>
          </BenefitsGrid>
        </BenefitsSection>
        <FormSection>
          <h2>Apply Now</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                type="number"
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="Enter the amount you want to borrow"
                required
              />
              <FormGroup>
              <Label htmlFor="interestRate">Interest Rate</Label>
              <Input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                placeholder="Enter the interest rate"
                required
              />
            </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <Input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="What will the loan be used for?"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="durationMonths">Repayment Period (in months)</Label>
              <Input
                type="number"
                id="durationMonths"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleChange}
                placeholder="Enter the repayment period"
                required
              />

           <FormGroup>
              <Label htmlFor="startPaymentDate">Start Payment Date</Label>
              <Input
                id="startPaymentDate"
                type="date"
                name="startPaymentDate"
                value={formData.startPaymentDate}
                onChange={handleChange}
                placeholder="When to start making payment"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="dueDate">Loan Payment Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                placeholder="Loan Payment Due Date"
              />
            </FormGroup>
              
            </FormGroup>
            <FormGroup>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Provide any additional information that might help us process your application"
              />
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </SubmitButton>
            {success && <FeedbackMessage success={success.includes('success')}>{success}</FeedbackMessage>}
          </Form>
        </FormSection>
        <TestimonialsSection>
          <h2>What Our Customers Say</h2>
          <TestimonialsGrid>
            <TestimonialCard>
              <p>"The loan process was smooth and easy. I got the funds I needed quickly!"</p>
              <span>- Sarah J.</span>
            </TestimonialCard>
            <TestimonialCard>
              <p>"Excellent customer service and a hassle-free application process."</p>
              <span>- Mark L.</span>
            </TestimonialCard>
          </TestimonialsGrid>
        </TestimonialsSection>
      </MainContent>
    </Container>
  );
};

// Styled components for styling the Apply for Loan page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #e6f7ff; /* Match Dashboard's background color */
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HeroSection = styled.section`
  background: linear-gradient(to right, #007bff, #00bcd4);
  color: #fff;
  padding: 3rem 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
`;

const HeroContent = styled.div`
  h1 {
    font-size: 2.5rem;
    margin: 0;
  }
  p {
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BenefitsSection = styled.section`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const BenefitCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0.5rem 0;
    font-size: 1.25rem;
  }
  p {
    font-size: 1rem;
    color: #555;
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FormSection = styled.section`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff; /* Match Dashboard's primary color */
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Match Dashboard's primary color hover */
  }

  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
`;

const FeedbackMessage = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: ${props => props.success ? '#28a745' : '#dc3545'};
`;

const TestimonialsSection = styled.section`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const TestimonialCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  p {
    font-size: 1rem;
    color: #333;
  }
  span {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #555;
  }
`;

export default ApplyLoanPage;
