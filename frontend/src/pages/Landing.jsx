import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Blurred Gradient Circles for Aesthetic */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-blue-300 opacity-30 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] bg-red-400 opacity-30 rounded-full filter blur-3xl animate-pulse" />

      {/* Logo Card */}
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center transition duration-300 hover:scale-105">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
          alt="NIT Kurukshetra Logo"
          className="h-28 w-28 mb-6 rounded-full border-4 border-white shadow-md"
        />
        <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-xl">
          NIT Kurukshetra
        </h1>
        <p className="mt-4 text-white/90 text-lg max-w-md leading-relaxed">
        Open Elective for 5th and 7th Semester
        </p>

        {/* Buttons */}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-lg rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 transition-transform duration-300 transform hover:scale-105"
          >
            Register Now
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-emerald-600 transition-transform duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-white/60">
        &copy; {new Date().getFullYear()} NIT Kurukshetra. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
