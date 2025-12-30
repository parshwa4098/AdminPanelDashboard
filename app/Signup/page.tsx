"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "manager" | "employee";

interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleSignup = () => {
    setError("");
    
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long and contain letters and numbers"
      );
      return;
    }

    const stored = localStorage.getItem("users");
    let existingUsers: User[] = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(existingUsers)) existingUsers = [existingUsers];

    if (existingUsers.some((user) => user.email === email)) {
      setError("Email is already registered");
      return;
    }

    const newUser: User = { name, email, password, role };
    existingUsers.push(newUser);

    localStorage.setItem("users", JSON.stringify(existingUsers));
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-black p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center text-white">
          Create an Account
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-pink-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-white">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
