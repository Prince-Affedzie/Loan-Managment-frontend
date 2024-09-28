import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
const backendUrl = "https://loan-managment-app.onrender.com";

const AdminUpdateUser = () => {
  const { userId } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber:"",
    ResidentialAddress: "",
    role: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/updateUser/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();

        setUserData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber:data.phoneNumber|| "",
          ResidentialAddress: data.ResidentialAddress || "",
          role: data.role || "",
          status: data.status || "",
        }); // Populate the form with fetched data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);
    try {
      const response = await fetch(`${backendUrl}/api/admin/updateUser/${userId}`, {
        method: "PuT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Update failed");
      navigate("/admin-view-users"); // Redirect after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div style={styles.LoadingContainer}>
        <AiOutlineLoading3Quarters style={styles.spinner} />
        <p>Loading User Information...</p>
        </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Update User</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            style={styles.input}
          
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            style={styles.input}
           
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            style={styles.input}
           
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
            style={styles.input}
           
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Role</label>
          <input
            type="text"
            name="role"
            value={userData.role}
            onChange={handleChange}
            style={styles.input}
           
          />
        </div>
       
        <button type="submit" style={styles.submitButton}>Update User</button>
      </form>
      <button
        style={styles.cancelButton}
        onClick={() => navigate("/admin-view-users")}
      >
        Cancel
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: "90%",
    maxWidth: "600px",
    margin: "30px auto",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#0A66C2",
    fontWeight: "600",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#0A66C2",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "10px",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "10px",
    marginLeft: "10px",
  },
  spinner: {
    fontSize: '3rem',
    color: '#1a73e8',
    animation: 'spin 1s linear infinite'
  },
  LoadingContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'}
};

export default AdminUpdateUser;
