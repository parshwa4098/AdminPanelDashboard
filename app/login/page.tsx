"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaChartLine, FaShieldAlt } from "react-icons/fa";

interface User {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      setError("No users found, please sign up first.");
      return;
    }

    let users: User[] = [];
    const parsedUsers = JSON.parse(storedUsers);
    users = Array.isArray(parsedUsers) ? parsedUsers : [parsedUsers];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
        
        <div className="flex-1 text-white space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4  ">
              User Management System
            </h1>
            <p className=" text-lg">
              A powerful platform to manage your team efficiently
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 ">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaUsers className="text-2xl text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">User Management</h3>
                <p className=" text-sm">
                  Add, edit, and manage users with different roles (Admin, Manager, Employee)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 ">
              <div className="bg-pink-500/20 p-3 rounded-lg">
                <FaShieldAlt className="text-2xl text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Role-Based Access</h3>
                <p className=" text-sm">
                  Secure authentication with role-based permissions and access control
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 ">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaChartLine className="text-2xl text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Analytics Dashboard</h3>
                <p className=" text-sm">
                  Track user statistics, pending approvals, and revenue metrics
                </p>
              </div>
            </div>
          </div>
        </div>

      
        <div className="lg:w-96 w-full">
          <div className="bg-black border border-gray-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
              Login to Dashboard
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-center text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm  mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-700 rounded-lg bg-black text-white"
                />
              </div>

              <div>
                <label className="text-sm  mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full p-3 border border-gray-700 rounded-lg bg-black text-white "
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-pink-600 text-white p-3 rounded-lg cursor-pointer font-medium shadow-lg"
              >
                Login
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className=" text-sm">
                Dont have an account?
                <span
                  className="text-pink-500 cursor-pointer"
                  onClick={() => router.push("/Signup")}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}