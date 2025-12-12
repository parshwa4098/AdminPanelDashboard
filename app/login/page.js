"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    let users = JSON.parse(localStorage.getItem("users"));

    
    if (!users) {
      setError("No users found, please sign up first.");
      return;
    }

  
    if (!Array.isArray(users)) {
      users = [users];
    }

  
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
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-black p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white">
          Login to Dashboard
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg bg-white text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-400 text-white p-3 rounded-lg hover:bg-pink-500"
        >
          Login
        </button>

        <p className="mt-4 text-center text-white">
          Don't have an account?
          <span
            className="text-pink-600 cursor-pointer"
            onClick={() => router.push("/Signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
