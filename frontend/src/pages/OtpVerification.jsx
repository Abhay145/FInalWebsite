import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
export default function OtpVerification() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
const [isDisabled, setIsDisabled] = useState(false);
  const sendOTP = async () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    // Frontend domain validation
    if (!email.endsWith("@nitkkr.ac.in")) {
      setError("Please use your NIT KKR email address (e.g., example@nitkkr.ac.in).");
      return;
    }

    try {
      setError("");
      const response = await fetch("https://openelectivenitkkr.vercel.app/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.status === 429) {
      // Rate limit hit
      setError(result.message || "You have exceeded the OTP request limit. Please try again after one minute");
      return;
    }
      if (result.success) {
        alert(`OTP sent to ${email}`);
        setIsOtpSent(true);
      } else {
        setError(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
        setError("Please enter the OTP.");
        return;
    }

    try {
        setError(""); // Clear any previous errors
        const response = await fetch("https://openelectivenitkkr.vercel.app/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const result = await response.json();

        if (result.success) {
            alert("Email verified successfully!");
            const username = email.split("@")[0]; // Extract username from email
            const secretKey =  import.meta.env.VITE_CRYPTO_hello;


            const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();
            localStorage.setItem("username", encryptedUsername);
            

            // Save verification status and username in localStorage
            localStorage.setItem("isVerified", "true");

            // Navigate to the registration page with the email as state
            navigate("/Register", { state: { email } });
        } else {
            setError(result.message || "Failed to verify OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        setError("An error occurred. Please try again.");
    }
};

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Verify Your Email
      </h1>
      <input
        type="email"
        placeholder="Enter Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {!isOtpSent && (
        <button
        onClick={() => {
          sendOTP();
          setIsDisabled(true); // Disable the button
        }}
        disabled={isDisabled}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Send OTP
        </button>
      )}

      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={verifyOTP}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Verify OTP
          </button>
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
        >
          {error}
        </div>
      )}
    </div>
  );
}
