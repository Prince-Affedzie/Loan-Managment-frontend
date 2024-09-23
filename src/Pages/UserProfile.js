import React, {useEffect,useState} from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Modern loading icon

import styled from 'styled-components';
import { FiEdit, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const backendUrl = "https://loan-managment-app.onrender.com";
const UserProfile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // To include cookies if necessary
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Logout was successful, redirect to login or homepage
        navigate("/login"); // Or you can use window.location.href = '/login';
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/auth/user-profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging output
        setUser(data)
        
      } catch (err) {
        console.error(err);
        setUser();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading User Details...</LoadingText>
      </LoadingContainer>
    );
  }


  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileImage src="https://via.placeholder.com/150" alt="Profile Picture" />
          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </ProfileHeader>
        <ProfileDetails>
          <DetailRow>
            <DetailLabel>Phone:</DetailLabel>
            <DetailValue>{user.phoneNumber}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Location:</DetailLabel>
            <DetailValue>{user.ResidentialAddress}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Employment Status:</DetailLabel>
            <DetailValue>{user.employmentStatus}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Income:</DetailLabel>
            <DetailValue>{user.MonthlyIncome}</DetailValue>
          </DetailRow>
        </ProfileDetails>
        <ProfileActions>
          <ActionButton>
            <FiEdit className="icon" /> Edit Profile
          </ActionButton>
          <LogoutButton onClick={handleLogout}>
            <FiLogOut className="icon" /> Logout
          </LogoutButton>
        </ProfileActions>
      </ProfileCard>
    </ProfileContainer>
  );
};

// Styled components for the profile page
const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  padding: 20px;
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
`;

const ProfileDetails = styled.div`
  margin-bottom: 2rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const DetailLabel = styled.div`
  font-weight: bold;
  color: #34495e;
`;

const DetailValue = styled.div`
  color: #7f8c8d;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-grow: 1;

  .icon {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: #2980b9;
  }
`;

const LogoutButton = styled(ActionButton)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
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



export default UserProfile;
