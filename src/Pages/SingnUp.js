import React, { useState } from 'react'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const backendUrl = "https://loan-managment-app.onrender.com";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
      .required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    phoneNumber: Yup.string()
      .matches(/^\+?\d{10,15}$/, 'Invalid phone number format')
      .required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/complete-profile');
      }
    } catch (err) {
      setError('Sign Up Failed. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Sign Up</Title>
        {error && <Error>{error}</Error>}
        <Formik
          initialValues={{ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <StyledField type="text" id="name" name="name" />
                <StyledErrorMessage name="name" component="div" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <StyledField type="email" id="email" name="email" />
                <StyledErrorMessage name="email" component="div" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <StyledField type="text" id="phone" name="phoneNumber" placeholder="+1234567890" />
                <StyledErrorMessage name="phoneNumber" component="div" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <StyledField type="password" id="password" name="password" />
                <StyledErrorMessage name="password" component="div" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <StyledField type="password" id="confirmPassword" name="confirmPassword" />
                <StyledErrorMessage name="confirmPassword" component="div" />
              </FormGroup>
              <SubmitButton type="submit" disabled={isSubmitting}>
                Sign Up
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>
        <FooterText>Already have an account? <a href="/">Login</a></FooterText>
      </FormContainer>
    </Container>
  );
};

// Styled components for styling the form
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: bold;
`;

const StyledForm = styled(Form)`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #666;
  font-size: 1rem;
`;

const StyledField = styled(Field)`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
  }
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
`;

const FooterText = styled.p`
  margin-top: 1.5rem;
  color: #666;
  text-align: center;
  font-size: 0.875rem;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default SignUpPage;
