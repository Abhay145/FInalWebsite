import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff", // ✅ WHITE BACKGROUND
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* subtle light blobs */}
      <div style={{
        position: "absolute", top: "-120px", left: "-120px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(24,95,165,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-120px", right: "-120px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,57,195,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* card */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "24px",
        padding: "48px 40px 40px",
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)", // ✅ soft shadow
        position: "relative",
        zIndex: 1,
      }}>

        {/* logo */}
        <div style={{
          width: "84px", height: "84px", borderRadius: "50%",
          padding: "3px",
          background: "linear-gradient(135deg, #185FA5, #6339c3)",
          marginBottom: "24px",
        }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            style={{
              width: "100%", height: "100%", borderRadius: "50%",
              objectFit: "cover", backgroundColor: "#fff",
            }}
          />
        </div>

        {/* badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          backgroundColor: "#e6f0ff",
          border: "1px solid #c7dbff",
          borderRadius: "999px", padding: "4px 12px", marginBottom: "16px",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: "#1a74c4",
            animation: "blink 2s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: "12px",
            color: "#1a74c4",
            fontWeight: "500",
          }}>
            Enrollment Open
          </span>
        </div>

        {/* heading */}
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#111827", // dark text
          margin: "0 0 8px",
        }}>
          NIT Kurukshetra
        </h1>

        {/* subtitle */}
        <p style={{
          fontSize: "15px",
          color: "#6b7280",
          margin: "0 0 32px",
          maxWidth: "300px",
        }}>
          Open Elective portal for 5th and 7th Semester students
        </p>

        {/* divider */}
        <div style={{
          width: "100%", height: "1px",
          backgroundColor: "#e5e7eb",
          marginBottom: "28px",
        }} />

        {/* buttons */}
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #185FA5, #1a74c4)",
              color: "#fff",
            }}
          >
            Register Now
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#f9fafb",
              color: "#111827",
            }}
          >
            Login
          </button>
        </div>

        {/* semester section */}
        <div style={{
          display: "flex",
          width: "100%",
          marginTop: "28px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}>
          {[
            { value: "5th", label: "Semester" },
            { value: "·", label: "and" },
            { value: "7th", label: "Semester" },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1,
              padding: "12px 8px",
              backgroundColor: "#fafafa",
              borderRight: i < 2 ? "1px solid #e5e7eb" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <span style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1a74c4"
              }}>
                {item.value}
              </span>
              <span style={{
                fontSize: "11px",
                color: "#6b7280"
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* footer */}
      <footer style={{
        marginTop: "24px",
        fontSize: "12px",
        color: "#9ca3af",
      }}>
        &copy; {new Date().getFullYear()} NIT Kurukshetra. All rights reserved.
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
