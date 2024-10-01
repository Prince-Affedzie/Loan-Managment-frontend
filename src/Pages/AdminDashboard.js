import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiFileText, FiLogOut, FiBriefcase, FiMenu } from 'react-icons/fi';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Bar chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedloans, setApprovedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        navigate("/admin/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Fetch repayments
  useEffect(() => {
    const fetchRepayments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/repayments`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        setRepayments(data);
      } catch (err) {
        console.error(err);
        setRepayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepayments();
  }, []);

  // Fetch users
  useEffect(() => {
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
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch approved loans
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/getApprovedLoans`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        setApprovedLoans(data);
      } catch (err) {
        console.error(err);
        setApprovedLoans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Fetch pending loans
  useEffect(() => {
    const fetchPendingLoans = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/pendingLoans`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        setPendingLoans(data);
      } catch (err) {
        console.error(err);
        setPendingLoans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingLoans();
  }, []);

  // Fetch rejected loans
  useEffect(() => {
    const fetchRejectedLoans = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/rejectedLoans`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch rejected loans');
        }
        const data = await response.json();
        setRejectedLoans(data);
      } catch (err) {
        console.error(err);
        setRejectedLoans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRejectedLoans();
  }, []);

  const TotalLoans = approvedloans.length + pendingLoans.length + rejectedLoans.length;
  const TotalAmountOnLoan = approvedloans.reduce((total, loan) => total + (loan.loanAmount || 0), 0);
  const TotalAmountRepaid = repayments.reduce((total, repayment) => total + (repayment.amountPaid || 0), 0);
  const PendingAmount = TotalAmountOnLoan - TotalAmountRepaid;

  // Prepare data for the bar chart
  const chartData = {
    labels: ['Total Amount On Loan', 'Total Amount Repaid', 'Pending Amount'],
    datasets: [
      {
        label: 'Loan Statistics',
        data: [
          TotalAmountOnLoan,
          TotalAmountRepaid,
          PendingAmount,
        ],
        backgroundColor: 'rgba(0, 123, 255, 0.5)', // Adjusted for Bar chart
        borderColor: '#007bff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Loan Management Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <AiOutlineLoading3Quarters className="spinner" />
        <LoadingText>Loading Admin Dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <HamburgerMenu onClick={toggleSidebar}>
        <FiMenu style={{ color: 'black' }} />
      </HamburgerMenu>
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <SidebarTop>
          <LogoIcon />
          <LogoText>Loan Management</LogoText>
        </SidebarTop>

        <SidebarItem>
          <StyledLink to="/admin-approved-loans">
            <FiCheckCircle className="icon" /> Approved Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-pending-loans">
            <FiClock className="icon" /> Pending Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-rejected-loans">
            <FiXCircle className="icon" /> Rejected Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-fullypaid">
            <FiClock className="icon" /> Fully Paid Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-repayments">
            <FiFileText className="icon" /> Repayments
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-users">
            <FiUsers className="icon" /> View Users
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <LogoutButton onClick={handleLogout}>
            <FiLogOut className="icon" /> Logout
          </LogoutButton>
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <Header>
          <h1>Admin Dashboard</h1>
        </Header>
        <Content>
          <Section>
            <h2>Loan Overview</h2>
            <Bar data={chartData} options={chartOptions} /> {/* Render Bar chart */}
          </Section>
          <Section>
            <h2>Dashboard Statistics</h2>
            <StatsGrid>
              <StatCard>
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </StatCard>
              <StatCard>
                <h3>Total Loans</h3>
                <p>{TotalLoans}</p>
              </StatCard>
              <StatCard>
                <h3>Total Amount On Loan</h3>
                <p>{TotalAmountOnLoan}</p>
              </StatCard>
              <StatCard>
                <h3>Total Repayments Amount</h3>
                <p>{TotalAmountRepaid}</p>
              </StatCard>
              <StatCard>
                <h3>Pending Loan Amount</h3>
                <p>{PendingAmount}</p>
              </StatCard>
              <StatCard>
                <h3>Approved Loans</h3>
                <p>{approvedloans.length}</p>
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
        </Content>
      </MainContent>
    </Container>
  );
};

// Styled components (remains unchanged from your current code)

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8; /* Light Gray */
`;

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
  margin-bottom: 2rem;
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.0rem;
  display: block;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background: #004a99; /* Medium Blue */
  }
  .icon {
    margin-right: 0.3rem;
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 300px;
  padding: 2rem;

  @media (max-width: 1000px) {
    margin-left: 0;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.4rem;
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

const HamburgerMenu = styled.div`
  position: absolute;
  top: 2rem;
  left: 0.5rem;
  font-size: 2rem;
  background-color: #001f3f;
  color: #ffffff;
  cursor: pointer;
  z-index: 1100;

  @media (min-width: 1000px) {
    display: none; /* Hide hamburger menu on larger screens */
  }
`;

export default AdminDashboardPage;
