import React, { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiList, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiTrendingUp, FiLogOut, FiBriefcase, FiMenu } from 'react-icons/fi'; // Added new icons
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';

// Mock data for demonstration (You may want to replace this with actual API data)
const recentActivities = [
  { id: 1, text: 'Loan application approved for $5000' },
  { id: 2, text: 'New loan application received' },
  { id: 3, text: 'Loan repayment completed for $1500' },
];

const backendUrl = "https://loan-managment-app.onrender.com";

const DashboardPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUserData] = useState();
  const [loans, setLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for toggling sidebar

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
        navigate("/"); // Redirect to homepage on successful logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
        setLoans(data);
        setApprovedLoans(data.filter((loan) => loan.status === 'approved'));
        setPendingLoans(data.filter((loan) => loan.status === 'pending'));
        setRejectedLoans(data.filter((loan) => loan.status === 'rejected'));
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Your Dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <MobileHeader>
        <HamburgerMenu onClick={toggleSidebar}>
          <FiMenu />
        </HamburgerMenu>
        <h1>Loan Management</h1>
      </MobileHeader>
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <SidebarTop>
          <LogoIcon />
          <LogoText>Loan Management</LogoText>
        </SidebarTop>
        <Menu>
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
            <LogoutButton onClick={handleLogout}>
              <FiLogOut className="icon" /> Logout
            </LogoutButton>
          </SidebarItem>
        </Menu>
      </Sidebar>

      <MainContent>
        <Header>
          <h1>Welcome, {user?.name || 'Guest'}</h1>
          <ProfileInfo>
            <p>Email: {user?.email || 'N/A'}</p>
            <p>Phone: {user?.phoneNumber || 'N/A'}</p>
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
                <ActivityItem key={payment.id}>
                  Repayment of ${payment.balance} due on{' '}
                  {new Date(payment.dueDate).toDateString()}
                </ActivityItem>
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
  background-color: #f5f7fa; /* Light background */
`;

const MobileHeader = styled.div`
  display: none;
  width: 100%;
  padding: 1rem;
  background-color: #004080;
  color: white;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamburgerMenu = styled.div`
  font-size: 2rem;
  cursor: pointer;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #004080; /* Deep blue */
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #ccc;

  @media (max-width: 1000px) {
    position: absolute;
    width: 100%;
    height: 100%;
    left: ${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '-100%')};
    transition: all 0.3s ease;
    z-index: 10;
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  color: white;
`;

const Menu = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0;
`;

const SidebarItem = styled.li`
  width: 100%;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;

  .icon {
    margin-right: 0.5rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;

  .icon {
    margin-right: 0.5rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.div`
  background-color: #004080;
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProfileInfo = styled.div`
  font-size: 1rem;
`;

const Content = styled.div``;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem;
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
`;

export default DashboardPage;
