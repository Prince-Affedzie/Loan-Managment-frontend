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
     {/* <MobileHeader>
        <HamburgerMenu onClick={toggleSidebar}>
          <FiMenu />
        </HamburgerMenu>
        <h1>Loan Management</h1>
      </MobileHeader>*/}

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
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

// Mobile-first Header
const MobileHeader = styled.div`
  display: none;
  width: 100%;
  padding: 1rem;
  background-color: #1e1e2d;
  color: white;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    display: flex;
  }
`;

const HamburgerMenu = styled.div`
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
`;

// Sidebar
const Sidebar = styled.aside`
  width: 150px;
  background-color: #1e1e2d;
  color: white;
  padding: 2rem;
  
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  transition: all 0.3s ease;
  z-index: 10;

  @media (max-width: 1000px) {
    left: ${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '-250px')};
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f0f2f5;
  border-radius: 50%;
`;

const LogoText = styled.h1`
  font-size: 1.6rem;
  color: white;
  font-family: 'Poppins', sans-serif;
`;

const Menu = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0;
`;

const SidebarItem = styled.li`
  margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    color: #00aaff;
  }

  .icon {
    margin-right: 0.75rem;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background: none;
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  .icon {
    margin-right: 0.75rem;
  }
`;

// Main Content
const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 100px;
  padding: 2rem;

  @media (max-width: 1000px) {
    margin-left: 0;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Poppins', sans-serif;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  h3 {
    font-size: 1.2rem;
    color: #444;
  }

  p {
    font-size: 1.8rem;
    color: #00aaff;
  }
`;

// Activity List
const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  font-family: 'Poppins', sans-serif;
`;

const ActivityItem = styled.li`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

// Loading
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;

  .spinner {
    font-size: 3rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #00aaff;
`;


export default DashboardPage;