import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const backendUrl = "https://loan-managment-app.onrender.com";

const AdminRepayments = () => {
  const [repayments, setRepayments] = useState([]); // repayments state to hold the data
  const [filteredRepayments, setFilteredRepayments] = useState([]); // Filtered data for pagination
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [loading, setLoading] = useState(true); // To show loading state

  const rowsPerPage = 5; // Number of rows to show per page

  // Fetch repayments from the server when the component mounts
  useEffect(() => {
    const fetchRepayments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/admin/repayments`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch loans");
        }
        const data = await response.json();
        setRepayments(Array.isArray(data) ? data : []); // Ensure repayments is always an array
      } catch (err) {
        console.error(err);
        setRepayments([]); // Set an empty array if error occurs
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchRepayments();
  }, []);

  // Apply filters when searchTerm, statusFilter, or repayments change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, repayments]);

  const applyFilters = () => {
    let filtered = repayments;

    if (searchTerm) {
      filtered = filtered.filter((repayment) => {
        const loanNumber = repayment.loanId?.loanNumber || ""; // Default to empty string if undefined
        const borrowerName = repayment.loanId?.borrower?.name || ""; // Default to empty string
        const paymentMethod = repayment.paymentMethod || ""; // Default to empty string

        return (
          loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((repayment) => repayment.status === statusFilter);
    }

    setFilteredRepayments(filtered); // Update filtered repayments
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRepayments = filteredRepayments.slice(startIndex, endIndex); // Paginate filtered data

    return currentRepayments.map((repayment, index) => (
      <tr key={index}>
        <td style={styles.td}>
          {repayment.loanId ? repayment.loanId._id : "Loan ID not available"}
        </td>
        <td style={styles.td}>
          {repayment.loanId && repayment.loanId.borrower
            ? repayment.loanId.borrower.name
            : "Borrower not available"}
        </td>
        <td style={styles.td}>GH₵{repayment.amountPaid}</td>
        <td style={styles.td}>
          {repayment.loanId ? repayment.loanId.balance : "Loan Balance not available"}
        </td>
        <td style={styles.td}>{repayment.paymentMethod}</td>
        <td style={styles.td}>{new Date(repayment.paymentDate).toDateString()}</td>
        <td style={styles.td}>
          {repayment.loanId && repayment.loanId.dueDate
            ? new Date(repayment.loanId.dueDate).toDateString()
            : "Loan Due Date not available"}
        </td>
        <td style={styles.td}>{repayment.loanId ? repayment.loanId.status: 'Status not available'}</td>
        <td style={styles.td}>
          <button style={styles.deleteBtn}>Approve</button>
        </td>
      </tr>
    ));
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage * rowsPerPage < filteredRepayments.length) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div style={styles.LoadingContainer}>
      <AiOutlineLoading3Quarters style={styles.spinner} />
      <p>Loading Repayments...</p>
      </div>
  );// Show loading message while fetching
  }

  if (repayments.length === 0) {
    return <p>No repayments found.</p>; // Handle no repayments case
  }

  return (
    <div style={styles.repaymentsContainer}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Repayment Dashboard</h1>
      </header>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by Loan ID, Borrower, or Payment Method"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          <option value="fully paid">Complete</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Loan ID</th>
              <th style={styles.th}>Borrower</th>
              <th style={styles.th}>Amount Paid (GH₵)</th>
              <th style={styles.th}>Balance</th>
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Loan Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button style={styles.paginationBtn} onClick={() => handlePageChange("prev")}>
          Previous
        </button>
        <span style={styles.pageIndicator}>
          Page {currentPage} of {Math.ceil(filteredRepayments.length / rowsPerPage)}
        </span>
        <button style={styles.paginationBtn} onClick={() => handlePageChange("next")}>
          Next
        </button>
      </div>
    </div>
  );
};


const styles = {
  repaymentsContainer: {
    width: '90%',
    margin: '30px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9', 
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#0A66C2',
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Makes inputs stack on smaller screens
  },
  input: {
    padding: '12px',
    width: '48%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    minWidth: '200px', // Minimum width for responsiveness
    marginBottom: '10px',
  },
  select: {
    padding: '12px',
    width: '48%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    minWidth: '200px', // Minimum width for responsiveness
    marginBottom: '10px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#0A66C2', 
    color: 'white',
  },
  th: {
    padding: '20px',
    textAlign: 'left',
    fontSize: '1rem',
  },
  td: {
    padding: '15px', 
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: '1px solid #ddd',
  },
  deleteBtn: {
    backgroundColor: 'light green',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationBtn: {
    padding: '10px 15px',
    margin: '0 5px',
    backgroundColor: '#0A66C2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pageIndicator: {
    margin: '0 10px',
  },
  LoadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
  spinner: {
    fontSize: '3rem',
    color: '#0A66C2',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  }
};

export default AdminRepayments;
