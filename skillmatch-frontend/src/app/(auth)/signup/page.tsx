"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";

interface SignupState {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  skillsRaw: string;
}

const SignupPage = () => {
  const router = useRouter();
  const [state, setState] = useState<SignupState>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    skillsRaw: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (state.password !== state.passwordConfirm) {
      setError(
        "Passwords do not match. Please confirm your password correctly."
      );
      setLoading(false);
      return;
    }

    const skillsArray = state.skillsRaw
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    if (skillsArray.length === 0) {
      setError("Please enter at least one skill.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        username: state.username,
        email: state.email,
        password: state.password,
        passwordConfirm: state.passwordConfirm,
        skills: skillsArray,
      });

      const message = response.data.message;
      setSuccessMessage(
        message || "Registration successful! Proceeding to account activation."
      );

      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(state.email)}`);
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          "Registration failed. Check your data and ensure fields meet validation rules.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred.");
      }
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
            Create an account
          </h1>
          <p className="text-gray-500 mb-8">
            Join us to match your skills with great opportunities.
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputBox
              id="username"
              name="username"
              label="Full Name"
              type="text"
              value={state.username}
              onChange={handleChange}
              required={true}
            />
            <InputBox
              id="email"
              name="email"
              label="Email"
              type="email"
              value={state.email}
              onChange={handleChange}
              required={true}
            />
            <InputBox
              id="skillsRaw"
              name="skillsRaw"
              label="Skills (e.g., React, Node.js, MongoDB)"
              type="text"
              value={state.skillsRaw}
              onChange={handleChange}
              required={true}
            />

            <InputBox
              id="password"
              name="password"
              label="Password (Strong requirements)"
              type="password"
              value={state.password}
              onChange={handleChange}
              required={true}
            />
            <InputBox
              id="passwordConfirm"
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              value={state.passwordConfirm}
              onChange={handleChange}
              required={true}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

interface InputBoxProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}

const InputBox = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  required,
}: InputBoxProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);
