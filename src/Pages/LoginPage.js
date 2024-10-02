import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const backendUrl =  "https://loan-managment-app.onrender.com";

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
`;

const LoginContainer = styled.div`
  background-color: #fff;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
`;

const Footer = styled.footer`
  margin-top: 2rem;
  color: #fff;
  font-size: 2rem;
  position: absolute;
  bottom: 1rem;
  text-align: center;
  
  span {
    font-weight: bold;
    color: #f1c40f;
  }
`;

const Header = styled.header`
  margin-top: 2rem;
  color: #fff;
  font-size: 2rem;
  position: absolute;
  text-align: center;
  
  span {
    font-weight: bold;
    color: #f1c40f;
  }
`;


export default LoginPage;
