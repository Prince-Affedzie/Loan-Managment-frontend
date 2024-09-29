import React, { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiList, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiTrendingUp, FiLogOut, FiMenu } from 'react-icons/fi';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const backendUrl = "https://loan-managment-app.onrender.com";

const DashboardPage = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUserData] = useState();
  const [loans, setLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
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

         {/* Hamburger Menu - Only Visible on Mobile */}
      <HamburgerMenu onClick={toggleSidebar}>
        <FiMenu style={{ color: '#f9a825' }} />
      </HamburgerMenu>

      <Sidebar isSidebarOpen={isSidebarOpen}>
        <SidebarTop>
          <LogoText>Loan Management System</LogoText>
        </SidebarTop>
        <Menu>
          <SidebarItem>
            <StyledLink to="/apply-loan"><FiDollarSign className="icon" /> Apply for Loan</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/view-loans"><FiList className="icon" /> View Loans</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/approved-loans"><FiCheckCircle className="icon" /> Approved Loans</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/rejected-loans"><FiXCircle className="icon" /> Rejected Loans</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/view-pending"><FiClock className="icon" /> Pending Loans</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/repay-loans"><FiCreditCard className="icon" /> Settle a Loan</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <StyledLink to="/user-profile"><FiUser className="icon" /> View Profile</StyledLink>
          </SidebarItem>
          <SidebarItem>
            <LogoutButton onClick={handleLogout}><FiLogOut className="icon" /> Logout</LogoutButton>
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
              {approvedLoans.map(payment => (
                <ActivityItem key={payment.id}>
                  Repayment of ${payment.balance} due on {new Date(payment.dueDate).toDateString()}
                </ActivityItem>
              ))}
            </ActivityList>
          </Section>
        </Content>
      </MainContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

// Sidebar
const Sidebar = styled.aside`
  width: 150px;
  background-color: #002147;
  color: white;
  padding: 2rem;
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '-100%')}); /* Initially hidden on mobile */
  z-index: 1000;

  @media (min-width: 1000px) {
    transform: none; /* Keep sidebar visible on larger screens */
    width: 250px;
  }
`;
const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.0rem;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  color: #f9a825;
  text-align: center;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarItem = styled.li`
  margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  &:hover {
    color: #f9a825;
  }

  .icon {
    margin-right: 0.75rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  color: #ffffff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;

  .icon {
    margin-right: 0.75rem;
  }
`;

// Main Content
const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 300px;
  padding: 2rem;

  @media (max-width: 1000px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background-color: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    color: #002147;
    font-size: 1.8rem;
  }
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
  color: #666;
`;

// Stats Section
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    font-size: 1.5rem;
    color: #002147;
  }

  p {
    font-size: 2rem;
    color: #f9a825;
  }
`;

// Activity Section
const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ActivityItem = styled.li`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  color: #002147;
`;

// Loading
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .spinner {
    font-size: 3rem;
    color: #f9a825;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #002147;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Space between sections */
`;

const Section = styled.section`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.8rem;
    color: #002147;
    margin-bottom: 1.5rem; /* Space between heading and content */
  }
`;
const HamburgerMenu = styled.div`
  position: absolute;
  top: 0.9rem;
  left: 0rem;
  font-size: 2rem;
  color: #ffffff;
  cursor: pointer;
  z-index: 1100;

  @media (min-width: 1000px) {
    display: none; /* Hide hamburger menu on larger screens */
  }
`;


export default DashboardPage;