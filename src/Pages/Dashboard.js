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

const backendUrl = "https://loan-managment-app.onrender.com";

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
  background-color: #f5f7fa; /* Light background */
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #004080;
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #ccc;

  @media (max-width: 768px) { /* For devices less than or equal to 768px width */
    width: 100%;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    border: none;
    box-shadow: 0px -3px 10px rgba(0,0,0,0.1);
  }
`;


const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled(FiBriefcase)`
  font-size: 4rem;
  color: #fff;
  margin-bottom: 1rem;
`;

const LogoText = styled.h2`
  color: #fff;
  font-size: 1.5rem;
`;

const Menu = styled.div`
  width: 100%;
`;

const SidebarItem = styled.div`
  margin-bottom: 1.2rem;
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background: #00509e;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: #006bb3;
  }

  .icon {
    margin-right: 1rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #006bb3;
    border-radius: 4px;
  }

  .icon {
    margin-right: 1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto; /* Allows scrolling within the main content */
  
  @media (max-width: 768px) {
    padding: 1rem; /* Adjusts padding for smaller screens */
    margin-top: 5rem; /* Ensures content is not hidden by fixed sidebar */
  }
`;
;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem; /* Reduced margin for mobile view */

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    align-items: center;
    text-align: center;
  }
`;

const ProfileInfo = styled.div`
  font-size: 1rem;
  color: #333;
  margin-top: 1rem;

  p {
    margin: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;


const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;


const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack the stats on smaller screens */
    gap: 1rem;
  }
`;


const StatCard = styled.div`
  background: #004080;
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #004080;
  margin-top: 1rem;
`;



export default DashboardPage;