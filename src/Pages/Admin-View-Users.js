import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiUserPlus, FiEdit, FiTrash, FiSearch, FiEye } from 'react-icons/fi';

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminViewUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // You can change this number to show more or fewer users per page

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
    setCurrentPage(1); // Reset to first page when searching
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Users Information...</LoadingText>
      </LoadingContainer>
    );
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
          {currentUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            currentUsers.map((user) => (
              <UserItem key={user._id}>
                <UserDetails>
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber}</p>
                  <p><strong>Country:</strong> {user.country}</p>
                  <p><strong>Residential Address:</strong> {user.ResidentialAddress}</p>
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

        {/* Pagination Controls */}
        <PaginationControls>
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </PaginationControls>
      </MainContent>
    </Container>
  );
};

// Styled components (Add styles for pagination controls)
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

  @media (max-width: 768px) {
    max-width: 100%; 
    padding: 1rem; 
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserItem = styled.div`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column; 
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column; 
  }
`;

const UserDetails = styled.div`
  h3 {
    margin: 0;
    word-wrap: break-word; 
    max-width: 100%; 
  }
  p {
    margin: 0.5rem 0;
    word-wrap: break-word; 
    max-width: 100%; 
  }
  
  @media (max-width: 768px) {
    word-wrap: break-word;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ViewButton = styled.button`
  background-color: #2196f3;
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const UpdateButton = styled.button`
  background-color: #ffc107;
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  
  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;

  .spinner {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    margin-bottom: 1rem;
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
  font-size: 1.5rem;
  color: #555;
`;

export default AdminViewUsersPage;
