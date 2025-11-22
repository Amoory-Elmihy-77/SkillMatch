"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";

const VerifyPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post("/auth/verify", {
        email: email,
        code: code,
      });

      const token = response.data.token;
      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", token);
        }
        setSuccessMessage(
          "Account successfully verified! Redirecting to home..."
        );

        setTimeout(() => {
          router.push("/home");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          "Verification failed. Invalid code or email.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred during verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email to resend the code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.post("/auth/resendCode", { email });
      setSuccessMessage("New verification code has been sent to your email.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to resend code.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-indigo-600">SkillMatch</span>
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">
            Activate Your Account
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            A verification code was sent to your email. Enter the code to
            activate your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code (6 digits)
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.substring(0, 6))} // 🔑 تحديد 6 أرقام
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-center tracking-widest text-lg font-bold text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            disabled={loading || !email}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Resend Verification Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
