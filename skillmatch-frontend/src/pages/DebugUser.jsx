import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugUser = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>

          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg mb-2">Full User Object:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">User Role:</h2>
              <p className="text-xl font-mono bg-yellow-100 p-2 rounded">
                {user?.role || "NO ROLE FOUND"}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Is Admin?</h2>
              <p className="text-xl font-mono bg-blue-100 p-2 rounded">
                {user?.role === "admin" ? "✅ YES" : "❌ NO"}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">
                Token from localStorage:
              </h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {localStorage.getItem("token")?.substring(0, 100)}...
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugUser;
