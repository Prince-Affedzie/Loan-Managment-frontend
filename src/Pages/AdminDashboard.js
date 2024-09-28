import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiFileText, FiLogOut, FiBriefcase } from 'react-icons/fi';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const backendUrl = "https://loan-managment-app.onrender.com";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [approvedloans, setApprovedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);

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

  useEffect(() => {
    const fetchRepayments = async () => {
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
      }
    };
    fetchRepayments();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
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
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLoans = async () => {
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
      }
    };
    fetchLoans();
  }, []);

  useEffect(() => {
    const fetchPendingLoans = async () => {
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
      }
    };
    fetchPendingLoans();
  }, []);

  useEffect(() => {
    const fetchRejectedLoans = async () => {
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
      }
    };
    fetchRejectedLoans();
  }, []);

  const TotalLoans = approvedloans.length + pendingLoans.length + rejectedLoans.length;
  const TotalAmountOnLoan = approvedloans.reduce((total, loan) => total + (loan.loanAmount || 0), 0);
  const TotalAmountRepaid = repayments.reduce((total, repayment) => total + (repayment.amountPaid || 0), 0);
  const PendingAmount = TotalAmountOnLoan- TotalAmountRepaid;

  // Prepare data for the chart
  
    // Sample data for the chart (you can replace this with actual loan data)
    const chartData = {
      labels: [ 'Total Amount On Loan', 'Total Amount Repaid', 'Pending Amount'],
      datasets: [
        {
          label: 'Loan Statistics',
          data: [
            TotalAmountOnLoan,
            TotalAmountRepaid,
            PendingAmount,
          ],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          fill: true,
          tension: 0.3,
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
    };

  return (
    <Container>
      <Sidebar>
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
            <FiClock className="icon" />Pending Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-rejected-loans">
            <FiXCircle className="icon" />Rejected Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-fullypaid">
            <FiClock className="icon" />Fully Paid Loans
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-repayments">
            <FiFileText className="icon" />Repayments
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink to="/admin-view-users">
            <FiUsers className="icon" />View Users
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <button onClick={handleLogout}>
            <FiLogOut className="icon" />Logout
          </button>
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <Header>
          <h1>Admin Dashboard</h1>
        </Header>
        <Content>
        <Section>
            <h2>Loan Overview</h2>
            <Line data={chartData} options={ chartOptions }  />
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




// Styled components for styling the admin dashboard
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8; /* Light Gray */
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #002d72; /* Dark Blue */
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
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
const LogoIcon = FiBriefcase  `
  font-size: 6rem; /* Adjust this value to increase/decrease the size */
  margin-bottom: 1rem; /* Space between the icon and text */
`;

const LogoText = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;
const SidebarItem = styled.div`
  margin-bottom: 3rem;
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
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default AdminDashboardPage;
