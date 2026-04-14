import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CryptoJS from "crypto-js";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#EBF3FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  stepIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  stepDot: (state) => ({
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "600",
    flexShrink: 0,
    ...(state === "active" && { backgroundColor: "#185FA5", color: "#fff" }),
    ...(state === "done" && { backgroundColor: "#E6F4EA", color: "#2E7D32" }),
    ...(state === "inactive" && {
      backgroundColor: "#f0f0f0",
      color: "#aaa",
      border: "1px solid #e0e0e0",
    }),
  }),
  stepLabel: (active) => ({
    fontSize: "12px",
    color: active ? "#111" : "#999",
    fontWeight: active ? "500" : "400",
  }),
  stepLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e0e0e0",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "6px",
  },
  subtext: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
    display: "block",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    outline: "none",
    color: "#111",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  },
  fieldWrap: {
    marginBottom: "16px",
  },
  btnPrimary: (disabled) => ({
    width: "100%",
    padding: "11px",
    fontSize: "15px",
    fontWeight: "500",
    border: "none",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "#7aaee0" : "#185FA5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "opacity 0.15s",
    fontFamily: "inherit",
  }),
  btnSecondary: {
    width: "100%",
    padding: "10px",
    fontSize: "13px",
    fontWeight: "400",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#666",
    marginTop: "8px",
    fontFamily: "inherit",
  },
  errorBox: {
    backgroundColor: "#FFF0F0",
    color: "#C62828",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    lineHeight: "1.5",
  },
  successBox: {
    backgroundColor: "#E6F4EA",
    color: "#2E7D32",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "13px",
    color: "#888",
  },
};

function Spinner() {
  return (
    <span
      style={{
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function SendingDots() {
  return (
    <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.7)",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

export default function OtpVerification() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!email.endsWith("@nitkkr.ac.in")) {
      setError("Please use your NIT KKR email address (e.g., example@nitkkr.ac.in).");
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const response = await fetch("https://openelectivenitkkr.vercel.app/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.status === 429) {
        setError(result.message || "Too many requests. Please wait a minute before trying again.");
        return;
      }
      if (result.success) {
        setIsOtpSent(true);
        setOtpSentSuccess(true);
      } else {
        setError(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      const response = await fetch("https://openelectivenitkkr.vercel.app/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (result.success) {
        const username = email.split("@")[0];
        const secretKey = import.meta.env.VITE_CRYPTO_hello;
        const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();
        localStorage.setItem("username", encryptedUsername);
        localStorage.setItem("isVerified", "true");
        navigate("/Register", { state: { email } });
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
        input:focus { border-color: #185FA5 !important; background-color: #fff !important; box-shadow: 0 0 0 3px rgba(24,95,165,0.1) !important; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.card}>

          {/* Icon */}
          <div style={styles.iconWrap}>
            <MailIcon />
          </div>

          {/* Step indicator */}
          <div style={styles.stepIndicator}>
            <div style={styles.stepItem}>
              <div style={styles.stepDot(isOtpSent ? "done" : "active")}>
                {isOtpSent ? <CheckIcon /> : "1"}
              </div>
              <span style={styles.stepLabel(!isOtpSent)}>Enter email</span>
            </div>
            <div style={styles.stepLine} />
            <div style={styles.stepItem}>
              <div style={styles.stepDot(isOtpSent ? "active" : "inactive")}>2</div>
              <span style={styles.stepLabel(isOtpSent)}>Verify OTP</span>
            </div>
          </div>

          {!isOtpSent ? (
            <>
              <h1 style={styles.heading}>Verify your email</h1>
              <p style={styles.subtext}>
                Enter your NIT KKR email address and we'll send you a one-time password.
              </p>

              {error && (
                <div style={styles.errorBox}>
                  <AlertIcon />
                  {error}
                </div>
              )}

              <div style={styles.fieldWrap}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  placeholder="yourname@nitkkr.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isSending && sendOTP()}
                  style={styles.input}
                  disabled={isSending}
                />
              </div>

              <button
                onClick={sendOTP}
                disabled={isSending}
                style={styles.btnPrimary(isSending)}
              >
                {isSending ? (
                  <>
                    <SendingDots />
                    <span>Sending OTP…</span>
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            <>
              <h1 style={styles.heading}>Check your inbox</h1>
              <p style={styles.subtext}>
                We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
              </p>

              {otpSentSuccess && !error && (
                <div style={styles.successBox}>
                  <CheckIcon />
                  OTP sent successfully
                </div>
              )}

              {error && (
                <div style={styles.errorBox}>
                  <AlertIcon />
                  {error}
                </div>
              )}

              <div style={styles.fieldWrap}>
                <label style={styles.label}>One-time password</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && !isVerifying && verifyOTP()}
                  style={{ ...styles.input, letterSpacing: "0.15em", fontSize: "18px" }}
                  maxLength={6}
                  autoFocus
                />
              </div>

              <button
                onClick={verifyOTP}
                disabled={isVerifying}
                style={styles.btnPrimary(isVerifying)}
              >
                {isVerifying ? (
                  <>
                    <Spinner />
                    <span>Verifying…</span>
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <button
                style={styles.btnSecondary}
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                  setError("");
                  setOtpSentSuccess(false);
                }}
              >
                Use a different email
              </button>
            </>
          )}

          <div style={styles.footer}>
            Already registered?{" "}
            <Link to="/login" style={{ color: "#185FA5", textDecoration: "none", fontWeight: "500" }}>
              Login
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
