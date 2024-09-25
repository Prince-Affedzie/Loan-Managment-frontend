import React, { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiList, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiTrendingUp, FiLogOut, FiMenu,FiX  } from 'react-icons/fi';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Sidebar toggle state

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <HamburgerMenu onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </HamburgerMenu>
        <h1>Loan Management</h1>
      </MobileHeader>
      <MobileMenu isOpen={isMenuOpen} onClick={toggleMenu}>
        <MenuItems onClick={(e) => e.stopPropagation()}>
          <MenuItem>
            <StyledLink to="/apply-loan" onClick={toggleMenu}>
              <FiDollarSign className="icon" /> Apply for Loan
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/view-loans" onClick={toggleMenu}>
              <FiList className="icon" /> View All Loans
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/approved-loans" onClick={toggleMenu}>
              <FiCheckCircle className="icon" /> Approved Loans
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/rejected-loans" onClick={toggleMenu}>
              <FiXCircle className="icon" /> Rejected Loans
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/view-pending" onClick={toggleMenu}>
              <FiClock className="icon" /> Pending Loans
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/repay-loans" onClick={toggleMenu}>
              <FiCreditCard className="icon" /> Settle a Loan
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/user-repayments" onClick={toggleMenu}>
              <FiTrendingUp className="icon" /> Repayments Made
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/user-fullyPaid" onClick={toggleMenu}>
              <FiCheckCircle className="icon" /> Fully Paid Loans
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/user-profile" onClick={toggleMenu}>
              <FiUser className="icon" /> View Profile
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <LogoutButton onClick={handleLogout}>
              <FiLogOut className="icon" /> Logout
            </LogoutButton>
          </MenuItem>
        </MenuItems>
      </MobileMenu>
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
  background-color: #f5f7fa;
`;

const MobileHeader = styled.div`
  display: none;
  width: 100%;
  padding: 1rem;
  background-color: #004080;
  color: white;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    display: flex;
  }
`;

const HamburgerMenu = styled.div`
  cursor: pointer;
  padding: 1rem;
  color: white;
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;

  @media (max-width: 1000px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  }
`;

const MenuItems = styled.ul`
  list-style: none;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
`;

const MenuItem = styled.li`
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.2rem;
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
  font-size: 1.2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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