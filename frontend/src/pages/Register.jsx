import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    sem: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });
  const [isStudentFound, setIsStudentFound] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);



  useEffect(() => {


    const isVerified = localStorage.getItem("isVerified");
    if (isVerified !== "true") {
      // alert("Access denied! Complete email verification first.");
      navigate("/otpverify");
      return;
    }

    const encryptedUsername = localStorage.getItem("username");

    const secretKey =  import.meta.env.VITE_CRYPTO_hello;


    const rollNumber = CryptoJS.AES.decrypt(encryptedUsername, secretKey).toString(CryptoJS.enc.Utf8);

    if (!rollNumber) {
      alert("Roll number missing in local storage.");
      navigate("/otpverify");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      rollNumber,
    }));

    // Automatically fetch student details
    fetchStudentDetails(rollNumber);
  }, [navigate]);

  const fetchStudentDetails = async (rollNumber) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://openelectivenitkkr.vercel.app/api/student/register",
        { rollNumber }
      );
      setFormData((prev) => ({
        ...prev,
        ...response.data, // Pre-fill details
        password: "",
        confirmPassword: "",
      }));
      setIsStudentFound(true);
    } catch {
      setError("Student not found. Please contact admin.");
      setIsStudentFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      setPasswordStrength(calculateStrength(e.target.value));
    }
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length > 8) strength += 1; // Length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1; // Special chars
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("https://openelectivenitkkr.vercel.app/api/student/register", {
        rollNumber: formData.rollNumber,
        password: formData.password,
      });
      alert("Password updated successfully!");
      navigate("/login");
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Update Password
      </h1>

      <form onSubmit={handleSubmit}>
        {isStudentFound && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              disabled
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              name="sem"
              placeholder="Semester"
              value={formData.sem}
              disabled
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              disabled
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              disabled
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {isStudentFound && (
          <button
            type="submit"
            disabled={!formData.password || !formData.confirmPassword || isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        )}
      </form>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ fontSize: "14px" }}>
          Already registered?{" "}
          <Link to="/login" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
