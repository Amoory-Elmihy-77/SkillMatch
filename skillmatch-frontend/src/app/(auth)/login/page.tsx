"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";

interface LoginState {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // Login function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        email: state.email,
        password: state.password,
      });

      const token = response.data.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("jwt", token);
      }

      router.push("/home");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Check your network.";
      setError(errorMessage);
      console.error("Login Error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="w-1/2 hidden lg:flex items-center justify-center p-12 bg-gradient-to-tr from-indigo-600 to-purple-500">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Discover Opportunities</h2>
            <p className="text-lg">
              Connecting creative professionals with freelance jobs, courses,
              and tools to elevate their careers.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-12">
          <div className="flex justify-center mb-6">
            <span className="text-3xl font-bold text-indigo-600">
              SkillMatch
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Login to your account
          </h1>
          <p className="text-gray-500 mb-8">
            Welcome back! Please enter your details.
          </p>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={state.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={state.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <a
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
