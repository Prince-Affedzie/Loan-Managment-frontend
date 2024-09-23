import React, { useState } from 'react';
import styled from 'styled-components';

const backendUrl = "https://loan-managment-app.onrender.com"; // Change this to your backend URL

const AdminAddUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(null); // For displaying success/error messages
  const [error, setError] = useState(false); // Flag to track if the message is an error

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/addUser`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phoneNumber, role }),
      });

      // Parse the response body
      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        throw new Error(data.message || 'Failed to add user');
      }

      // Display success message
      setMessage(`User ${name} has been added successfully.`);
      setError(false);

      // Clear form fields after success
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setRole('user');

    } catch (err) {
      console.error(err);
      // Display error message
      setMessage(err.message);
      setError(true);
    }

    // Clear the message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <Container>
      <Header>
        <h1>Add New User</h1>
      </Header>
      <Form onSubmit={handleAddUser}>
        <FormField>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </FormField>
        <FormField>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </FormField>
        <FormField>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input 
            type="text" 
            id="phoneNumber" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required
          />
        </FormField>
        <FormField>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </FormField>
        <FormField>
          <label htmlFor="role">Role:</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </FormField>
        <Button type="submit">Add User</Button>
      </Form>

      {message && (
        <Message error={error}>{message}</Message>
      )}
    </Container>
  );
};

// Styled components for the Admin Add User page
const Container = styled.div`
  padding: 2rem;
  background-color: #e6f7ff;
  max-width: 600px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
  }

  input, select {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
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

const Message = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: ${(props) => (props.error ? 'red' : 'green')};
`;

export default AdminAddUserPage;
