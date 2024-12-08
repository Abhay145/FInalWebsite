import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex flex-col items-center justify-center text-white">
      {/* Logo */}
      <img
        src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
        alt="NIT Kurukshetra Logo"
        className="h-32 w-32 mb-6 shadow-lg"
      />

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">
        NIT Kurukshetra 
      </h1>
      <p className="text-lg text-center max-w-lg mb-6">
    
      </p>

      {/* Register Button */}
      <button
        onClick={() => navigate("/register")}
        className="px-6 py-3 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
      >
        Register Now
      </button>
      <br/>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
      >
        Login
      </button>

      {/* Footer */}
      <footer className="mt-10 text-sm text-center text-white/70">
        &copy; {new Date().getFullYear()} NIT Kurukshetra. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
