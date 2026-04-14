import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  inputDisabled: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "15px",
    border: "1px solid #eee",
    borderRadius: "10px",
    outline: "none",
    color: "#888",
    backgroundColor: "#f5f5f5",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "not-allowed",
  },
  fieldWrap: {
    marginBottom: "14px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f0f0f0",
    margin: "20px 0",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#aaa",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "14px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  strengthBar: {
    display: "flex",
    gap: "4px",
    marginTop: "6px",
  },
  strengthSegment: (filled, color) => ({
    flex: 1,
    height: "4px",
    borderRadius: "2px",
    backgroundColor: filled ? color : "#eee",
    transition: "background-color 0.2s",
  }),
  strengthLabel: (color) => ({
    fontSize: "11px",
    color: color,
    marginTop: "4px",
    fontWeight: "500",
  }),
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
    marginTop: "4px",
  }),
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
  skeletonField: {
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
    marginBottom: "14px",
    animation: "shimmer 1.4s ease-in-out infinite",
    backgroundImage: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "13px",
    color: "#888",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    backgroundColor: "#f8f8f8",
    borderRadius: "10px",
    border: "1px solid #eee",
  },
  infoRowLabel: {
    fontSize: "11px",
    color: "#999",
    fontWeight: "500",
    marginBottom: "2px",
  },
  infoRowValue: {
    fontSize: "14px",
    color: "#222",
    fontWeight: "500",
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

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const strengthConfig = [
  { label: "Weak", color: "#E53935" },
  { label: "Fair", color: "#FB8C00" },
  { label: "Good", color: "#FDD835" },
  { label: "Strong", color: "#43A047" },
  { label: "Very strong", color: "#1E88E5" },
];

function PasswordStrength({ strength }) {
  if (strength === 0) return null;
  const cfg = strengthConfig[strength - 1];
  return (
    <div>
      <div style={styles.strengthBar}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} style={styles.strengthSegment(s <= strength, cfg.color)} />
        ))}
      </div>
      <div style={styles.strengthLabel(cfg.color)}>{cfg.label}</div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <>
      <div style={{ ...styles.skeletonField, width: "60%", height: "18px", marginBottom: "20px" }} />
      <div style={styles.infoGrid}>
        <div style={styles.skeletonField} />
        <div style={styles.skeletonField} />
      </div>
      <div style={styles.skeletonField} />
      <div style={styles.skeletonField} />
    </>
  );
}

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
      navigate("/otpverify");
      return;
    }

    const encryptedUsername = localStorage.getItem("username");
    const secretKey = import.meta.env.VITE_CRYPTO_hello;
    const rollNumber = CryptoJS.AES.decrypt(encryptedUsername, secretKey).toString(CryptoJS.enc.Utf8);

    if (!rollNumber) {
      alert("Roll number missing in local storage.");
      navigate("/otpverify");
      return;
    }

    setFormData((prev) => ({ ...prev, rollNumber }));
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
        ...response.data,
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
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
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

  const isSubmitDisabled = !formData.password || !formData.confirmPassword || isLoading;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        input:focus { border-color: #185FA5 !important; background-color: #fff !important; box-shadow: 0 0 0 3px rgba(24,95,165,0.1) !important; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.card}>

          {/* Icon */}
          <div style={styles.iconWrap}>
            <KeyIcon />
          </div>

          <h1 style={styles.heading}>Set your password</h1>
          <p style={styles.subtext}>
            Your details have been pre-filled from the NIT KKR database. Just set a password to complete registration.
          </p>

          {error && (
            <div style={styles.errorBox}>
              <AlertIcon />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isLoading && !isStudentFound ? (
              <SkeletonLoader />
            ) : isStudentFound ? (
              <>
                {/* Student info — read-only display */}
                <div style={styles.sectionLabel}>Your details</div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Full name</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled
                      style={styles.inputDisabled}
                    />
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Semester</label>
                    <input
                      type="text"
                      name="sem"
                      value={formData.sem}
                      disabled
                      style={styles.inputDisabled}
                    />
                  </div>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      disabled
                      style={styles.inputDisabled}
                    />
                  </div>
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={styles.inputDisabled}
                  />
                </div>

                <div style={styles.divider} />

                {/* Password fields */}
                <div style={styles.sectionLabel}>Create password</div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>New password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <PasswordStrength strength={passwordStrength} />
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{
                      ...styles.input,
                      borderColor:
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? "#E53935"
                          : "#ddd",
                    }}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div style={{ fontSize: "12px", color: "#E53935", marginTop: "5px" }}>
                      Passwords do not match
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  style={styles.btnPrimary(isSubmitDisabled)}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span>Updating…</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </>
            ) : null}
          </form>

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
