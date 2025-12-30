"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import useAdminProtection from "@/app/_utils/useAdminProtection";

type UserRole = "admin" | "manager" | "employee";

interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export default function SettingsPage() {
  useAdminProtection();

  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return [];
    const usersData = localStorage.getItem("users");
    const parsed = usersData ? JSON.parse(usersData) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  if (!user) return null;

  const handleRoleChange = (index: number, newRole: UserRole) => {
    const updatedUsers = [...allUsers];
    updatedUsers[index].role = newRole;
    setAllUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (user.email === updatedUsers[index].email) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    toast.success("User role changed!", { position: "top-center" });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <FaUserCircle className="text-3xl sm:text-5xl text-gray-400" />
        <h1 className="text-xl sm:text-3xl font-bold text-white">
          Settings - Assign Roles
        </h1>
      </div>

      {allUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-xl mt-4 bg-gray-900/10">
          <p>No users found in the system.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allUsers.map((u, index) => (
          <div
            key={index}
            className="bg-gray-900/40 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaUserCircle className="text-4xl text-gray-500" />
              <div>
                <h2 className="text-lg font-semibold text-white">{u.name}</h2>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Role</span>
              <select
                value={u.role}
                onChange={(e) =>
                  handleRoleChange(index, e.target.value as UserRole)
                }
                className={`w-[130px] p-2 rounded border outline-none cursor-pointer transition-colors text-sm font-medium
                  ${
                    u.role === "admin"
                      ? "bg-red-500/10 border-red-500 text-red-400"
                      : u.role === "manager"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400"
                      : "bg-purple-500/10 border-purple-500 text-purple-400"
                  }`}
              >
                <option value="employee" className="bg-gray-900 text-gray-300">
                  Employee
                </option>
                <option value="manager" className="bg-gray-900 text-gray-300">
                  Manager
                </option>
                <option value="admin" className="bg-gray-900 text-gray-300">
                  Admin
                </option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Status</span>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
