import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if(response.ok){
        navigate('/dashboard');
      } else {
        alert('Invalid Credentials');
      }
    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <Wrapper>
      <Header>
        Loan Management System
      </Header>
      <LoginContainer>
        <Title>Welcome Back!</Title>
        <Subtitle>Please login to your account</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </Form>
        <FooterText>Don't have an account? <a href="/sign-up">Sign up</a></FooterText>
      </LoginContainer>

      {/* Powered by Pros Technologies */}
      <Footer>
        Powered by <span>Pros Technologies</span>
      </Footer>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e90ff, #6a82fb);
  position: relative;
  padding: 1rem; /* Added padding for mobile responsiveness */
`;

const Header = styled.header`
  width: 100%;
  text-align: center;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem; 
  position: absolute;
  top: 2rem; 
  left: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem; /* Reduced font size for mobile */
    top: 1rem;
  }
`;

const LoginContainer = styled.div`
  background-color: #fff;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem; /* Reduced padding on mobile */
    max-width: 90%; /* Allows container to take more width on mobile */
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for mobile */
  }
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem; /* Adjust subtitle size on mobile */
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: 768px) {
    gap: 1rem; /* Reduced gap between form elements on mobile */
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media (max-width: 768px) {
    padding: 0.7rem; /* Reduced padding for mobile */
    font-size: 0.9rem; /* Adjust input font size */
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    padding: 0.8rem; /* Reduced padding on mobile */
    font-size: 1rem; /* Adjust button font size */
  }
`;

const FooterText = styled.p`
  margin-top: 1.5rem;
  color: #666;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Adjust footer text size on mobile */
  }
`;

const Footer = styled.footer`
  margin-top: 1.0rem;
  color: #fff;
  font-size: 1.2rem;
  position: absolute;
  bottom: 1rem;
  text-align: center;
  
  span {
    font-weight: bold;
    color: #f1c40f;
  }

  @media (max-width: 768px) {
    font-size: 1.0rem; /* Adjust footer size on mobile */
    bottom: 0.5rem;
  }
`;

export default LoginPage;
