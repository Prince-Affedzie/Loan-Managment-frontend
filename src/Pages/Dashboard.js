import React, { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiList, FiCheckCircle, FiXCircle, FiClock, 
  FiCreditCard, FiTrendingUp, FiLogOut, FiBriefcase, } from 'react-icons/fi'; // Added new icons
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';

// Mock data for demonstration (You may want to replace this with actual API data)
const recentActivities = [
  { id: 1, text: 'Loan application approved for $5000' },
  { id: 2, text: 'New loan application received' },
  { id: 3, text: 'Loan repayment completed for $1500' },
];

const backendUrl = "http://localhost:3000";

const DashboardPage = ({ refreshTrigger }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [user, setUserData] = useState();
  const [loans, setLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);

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
        navigate("/"); // Or you can use window.location.href = '/login';
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/loan/user/all-loans`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging output

        if (Array.isArray(data)) {
          setLoans(data);
          setApprovedLoans(data.filter((loan) => loan.status === 'approved'));
          setPendingLoans(data.filter((loan) => loan.status === 'pending'));
          setRejectedLoans(data.filter((loan) => loan.status === 'rejected'));
        }
      } catch (err) {
        console.error(err);
        setLoans([]);
        setApprovedLoans([]);
        setPendingLoans([]);
        setRejectedLoans([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/loan/user/dashboard`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Your Dashbaord...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Sidebar>
      <SidebarTop>
            <LogoIcon />
           <LogoText>Loan Management</LogoText>
        </SidebarTop>

        <SidebarItem>
          <StyledLink to="/apply-loan">
            <FiDollarSign className="icon" /> Apply for Loan
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/view-loans">
            <FiList className="icon" /> View All Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/approved-loans">
            <FiCheckCircle className="icon" /> Approved Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/rejected-loans">
            <FiXCircle className="icon" /> Rejected Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/view-pending">
            <FiClock className="icon" /> Pending Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/repay-loans">
            <FiCreditCard className="icon" /> Settle a Loan
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/user-repayments">
            <FiTrendingUp className="icon" /> Repayments Made
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/user-fullyPaid">
            <FiCheckCircle className="icon" /> Fully Paid Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/user-profile">
            <FiUser className="icon" /> View Profile
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <button onClick={handleLogout}>
            <FiLogOut className="icon" /> Logout
          </button>
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <Header>
          <h1>Welcome, {user.name || 'Guest'}</h1>
          <ProfileInfo>
            <p>Email: {user.email || 'N/A'}</p>
            <p>Phone: {user.phoneNumber || 'N/A'}</p>
          </ProfileInfo>
        </Header>

        <Content>
          <Section>
            <h2>Loan Statistics</h2>
            <StatsGrid>
              <StatCard>
                <h3>Total Loans</h3>
                <p>{loans.length}</p>
              </StatCard>
              <StatCard>
                <h3>Approved Loans</h3>
                <p>{approvedLoans.length}</p>
              </StatCard>
              <StatCard>
                <h3>Pending Loans</h3>
                <p>{pendingLoans.length}</p>
              </StatCard>
              <StatCard>
                <h3>Rejected Loans</h3>
                <p>{rejectedLoans.length}</p>
              </StatCard>
            </StatsGrid>
          </Section>
          <Section>
          <h2>Upcoming Payments</h2>
          <ActivityList>
        {approvedLoans.map((payment) => (
          <ActivityItem key={payment.id}>Repayment of ${payment.balance} due on {new Date(payment.dueDate).toDateString()}</ActivityItem>
          ))}
  </ActivityList>
</Section>
        </Content>
      </MainContent>
    </Container>
  );
};

// Styled components for styling the dashboard
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #e6f7ff; /* Soft Blue */
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #003366; /* Dark Blue */
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;
const LogoIcon = styled(FiBriefcase)`
  font-size: 6rem; /* Adjust this value to increase/decrease the size */
  margin-bottom: 1rem; /* Space between the icon and text */
`;

const LogoText = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const SidebarItem = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  &:hover {
    background: #00509e; /* Light Blue */
  }
  .icon {
    margin-right: 1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  h1 {
    margin: 0;
    font-size: 2rem;
    color: #333;
  }
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
  p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #555;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }
  p {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
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

export default DashboardPage;
