import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUserPlus, FiEdit, FiTrash, FiSearch, FiEye } from 'react-icons/fi'; // Add FiEye for view icon

const backendUrl = "https://loan-managment-app.onrender.com"; // Replace with actual backend URL

const AdminViewUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/getUsers`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    navigate('/admin-add-user');
  };

  const handleUpdateUser = (userId) => {
    navigate(`/admin-update-user/${userId}`);
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        const response = await fetch(`${backendUrl}/api/admin/removeUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
          credentials: 'include',
        });

        const result = await response.json();
        if (response.ok) {
          alert('User removed successfully!');
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
          setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } else {
          alert(`Failed to remove user: ${result.message || 'Please try again.'}`);
        }
      } catch (error) {
        alert('Failed to remove user. Please try again.');
      }
    }
  };

  const handleViewUserDetails = (userId) => {
    navigate(`/admin-view-userDetails/${userId}`);
  };

  if (loading) {
    return <LoadingSpinner>Loading users...</LoadingSpinner>;
  }

  return (
    <Container>
      <Header>
        <h1>Users</h1>
        <AddUserButton onClick={handleAddUser}>
          <FiUserPlus /> Add New User
        </AddUserButton>
      </Header>

      <SearchBarContainer>
        <FiSearch />
        <SearchInput
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchBarContainer>

      <MainContent>
        <UserList>
          {filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <UserItem key={user._id}>
                <UserDetails>
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber}</p>
                  <p><strong>Location:</strong> {user.location}</p>
                </UserDetails>
                <ActionButtons>
                  <ViewButton onClick={() => handleViewUserDetails(user._id)}>
                    <FiEye /> View
                  </ViewButton>
                  <UpdateButton onClick={() => handleUpdateUser(user._id)}>
                    <FiEdit /> Update
                  </UpdateButton>
                  <RemoveButton onClick={() => handleRemoveUser(user._id)}>
                    <FiTrash /> Remove
                  </RemoveButton>
                </ActionButtons>
              </UserItem>
            ))
          )}
        </UserList>
      </MainContent>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafc;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AddUserButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-left: 0.5rem;
`;

const MainContent = styled.main`
  background: #fff;
  padding: 5rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserItem = styled.div`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 2rem;
  width :100%
  display: flex;
  justify-content: space-between;
  flex-direction: column; /* Stack details and buttons vertically */
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column; /* Maintain column layout for mobile */
  }
`;

const UserDetails = styled.div`
  h3 {
    margin: 0;
  }
  p {
    margin: 0.5rem 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%; // Ensure the container takes full width

     button {
      width: 100%;
      padding: 8px 10px; /* Smaller padding for mobile */
      font-size: 14px;   /* Reduced font size for mobile */
    }
  }
`;

const ViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: padding: 8px 12px;;
  border-radius: 8px;
  cursor: pointer;
  
   @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
  }

`;

const UpdateButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: padding: 8px 12px;;
  border-radius: 8px;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
  }

`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding:padding: 8px 12px;;
  border-radius: 8px;
  cursor: pointer;
   @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
  }

`;

const LoadingSpinner = styled.div`
  text-align: center;
`;

export default AdminViewUsersPage;
