import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if(response.ok){
        navigate('/admin-dashboard');
      } else {
        alert('Unauthorized Access');
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
        <Title>Admin Portal</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </Form>
      </LoginContainer>
      <Footer>
        Powered by <span>Pros Technologies</span>
      </Footer>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #2c3e50;
`;

const Header = styled.header`
  width: 100%;
  text-align: center;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem; /* Adjust the margin to control spacing */
  position: absolute;
  top: 2.5rem; /* Fixes the header at the top */
  left: 0;
`;

const LoginContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3rem 4rem;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #34495e;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 0.9rem 1.2rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;
const Footer = styled.footer`
  margin-top: 2rem;
  color: #fff;
  font-size: 1.4rem;
  position: absolute;
  bottom: 1rem;
  text-align: center;
  
  span {
    font-weight: bold;
    color: #f1c40f;
  }
`;

export default AdminLoginPage;
