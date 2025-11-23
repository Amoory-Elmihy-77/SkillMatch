"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post("/auth/forgotPassword", { email });

      setSuccessMessage(
        response.data.message ||
          "Password reset code sent! Please check your email and proceed to reset page."
      );

      setTimeout(() => {
        router.push(`/reset?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to process request. Please check the email address.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-indigo-600">SkillMatch</span>
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">
            Forgot Password?
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email address to receive the password reset code.
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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? "Sending Request..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/reset"
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Already have a code? Reset Password
          </a>
        </div>
        <div className="mt-2 text-center">
          <a
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
