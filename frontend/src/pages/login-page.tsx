// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/auth";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleAuth = async () => {
    if (!form.email || !form.password) {
      setError("Both email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup(form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate("/");
    } catch (error: any) {
      console.error("Authentication failed:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-neutral-950 p-20 border-r border-neutral-800">
        <img
          src="/images/sadaora-text.png"
          alt="Sadaora Text Logo"
          className="h-18 mb-4 invert opacity-90"
        />
        <h1 className="text-3xl font-semibold tracking-tight text-center mb-6 mx-10">
          Your Data. Our Knowledge. Your Power.
        </h1>
        <p className="text-lg text-gray-400 max-w-md text-center leading-relaxed">
          Sadaora is an intelligent platform that turns your data into answers.
          We combine your personal, professional, and external information to
          deliver smart, personalized insights.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center px-6 md:px-12">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-center mb-8 text-white">
            {isSignup ? "Create your account" : "Sign in to continue"}
          </h2>

          <div className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm font-medium"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm font-medium"
            />

            {error && (
              <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loading
                ? isSignup
                  ? "Creating..."
                  : "Signing in..."
                : isSignup
                ? "Sign Up"
                : "Login"}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-neutral-500 font-light">
            {isSignup
              ? "Already have an account?"
              : "Don’t have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-white hover:underline font-medium"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
