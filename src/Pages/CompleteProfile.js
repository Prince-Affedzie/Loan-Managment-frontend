import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #6dd5ed, #2193b0); /* Example gradient */
    font-family: Arial, sans-serif;
    color: #333;
  }
`;

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    employmentStatus: '',
    income: '',
    idType: '',
    idNumber: '',
    address: '',
    dob: '',
    nextOfKin:'',
    relationWithNextOfKin:'',
    nextOfKinPhoneNumber:''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Profile information submitted successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to submit profile information.');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ProgressContainer>
          <ProgressText>You're almost there! Complete your profile to get a loan.</ProgressText>
          <ProgressBar>
            <ProgressFill style={{ width: '70%' }} /> {/* Adjust width as needed */}
          </ProgressBar>
        </ProgressContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Complete Your Profile</h1>
          <FormGroup>
            <label>Full Name:</label>
            <Input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Country:</label>
            <Input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Employment Status:</label>
            <Select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} required>
              <option value="">-- Select Employment Status --</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <label>Monthly Income (GH₵):</label>
            <Input type="number" name="income" value={formData.income} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Identification Type:</label>
            <Select name="idType" value={formData.idType} onChange={handleInputChange} required>
              <option value="">-- Select ID Type --</option>
              <option value="national-id">Ghana Card</option>
              <option value="passport">Passport</option>
              <option value="driver-license">Driver's License</option>
              <option value="voter-id">Voter's ID</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <label>ID Number:</label>
            <Input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Residential Address:</label>
            <Input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Date of Birth:</label>
            <Input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Next Of Kin:</label>
            <Input type="text" name="nextOfKin" value={formData.nextOfKin} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
  <label>Relationship with Next Of Kin:</label>
  <Select
    name="relationWithNextOfKin"
    value={formData.relationWithNextOfKin}
    onChange={handleInputChange}
    required
  >
    <option value="">-- Select Relationship --</option>
    <option value="parent">Parent</option>
    <option value="sibling">Sibling</option>
    <option value="spouse">Spouse</option>
    <option value="child">Child</option>
    <option value="relative">Relative</option>
    <option value="friend">Friend</option>
    <option value="guardian">Guardian</option>
  </Select>
</FormGroup>

          <FormGroup>
            <label>Phone Number(Next of Kin):</label>
            <Input type="dtext" name="nextOfKinPhoneNumber" value={formData.nextOfKinPhoneNumber} onChange={handleInputChange} required />
          </FormGroup>
          <SubmitButton type="submit">Submit Profile</SubmitButton>
        </Form>
      </Container>
    </>
  );
};

// Styled components for form
const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9); /* Add slight transparency for contrast */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px); /* Optional: add a blur effect */
`;

const ProgressContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProgressText = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  background: #ddd;
  border-radius: 5px;
  height: 20px;
  width: 100%;
`;

const ProgressFill = styled.div`
  background: #3498db;
  height: 100%;
  border-radius: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default UserProfilePage;
