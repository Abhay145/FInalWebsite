import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      <div style={{
        position: "absolute", top: "-120px", left: "-120px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(24,95,165,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-120px", right: "-120px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,57,195,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "24px",
        padding: "48px 40px 40px",
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
      }}>

        <div style={{
          width: "84px", height: "84px", borderRadius: "50%",
          padding: "3px",
          background: "linear-gradient(135deg, #185FA5, #6339c3)",
          marginBottom: "24px", flexShrink: 0,
        }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
            alt="NIT Kurukshetra Logo"
            style={{
              width: "100%", height: "100%", borderRadius: "50%",
              objectFit: "cover", display: "block", backgroundColor: "#fff",
            }}
          />
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          backgroundColor: "rgba(24,95,165,0.18)",
          border: "1px solid rgba(24,95,165,0.35)",
          borderRadius: "999px", padding: "4px 12px", marginBottom: "16px",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: "#4fa3f7", flexShrink: 0,
            animation: "blink 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "12px", color: "#7ec8f7", fontWeight: "500", letterSpacing: "0.02em" }}>
            Enrollment Open
          </span>
        </div>

        <h1 style={{
          fontSize: "28px", fontWeight: "700", color: "#f0f6ff",
          margin: "0 0 8px", lineHeight: "1.25", letterSpacing: "-0.02em",
        }}>
          NIT Kurukshetra
        </h1>

        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.5)",
          margin: "0 0 32px", lineHeight: "1.6", maxWidth: "300px",
        }}>
          Open Elective portal for 5th and 7th Semester students
        </p>

        <div style={{
          width: "100%", height: "1px",
          backgroundColor: "rgba(255,255,255,0.07)", marginBottom: "28px",
        }} />

        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={() => navigate("/register")}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            style={{
              flex: 1, padding: "12px", fontSize: "14px", fontWeight: "600",
              border: "none", borderRadius: "12px", cursor: "pointer",
              background: "linear-gradient(135deg, #185FA5, #1a74c4)",
              color: "#fff", letterSpacing: "0.01em",
              transition: "opacity 0.15s", fontFamily: "inherit",
            }}
          >
            Register Now
          </button>

          <button
            onClick={() => navigate("/login")}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.11)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"}
            style={{
              flex: 1, padding: "12px", fontSize: "14px", fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px",
              cursor: "pointer", backgroundColor: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em",
              transition: "background-color 0.15s", fontFamily: "inherit",
            }}
          >
            Login
          </button>
        </div>

        <div style={{
          display: "flex", width: "100%", marginTop: "28px",
          borderRadius: "12px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[
            { value: "5th", label: "Semester" },
            { value: "·", label: "and" },
            { value: "7th", label: "Semester" },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1, padding: "12px 8px",
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#7ec8f7" }}>
                {item.value}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.03em" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      <footer style={{
        marginTop: "24px", fontSize: "12px",
        color: "rgba(255,255,255,0.25)", zIndex: 1,
      }}>
        &copy; {new Date().getFullYear()} NIT Kurukshetra. All rights reserved.
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
