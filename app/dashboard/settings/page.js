"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== "admin") {
      alert("Access denied: Admins only");
      return router.push("/dashboard");
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!Array.isArray(users)) users = [users];
    setAllUsers(users);
  }, []);

  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...allUsers];
    updatedUsers[index].role = newRole;
    setAllUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

     toast.success("User Role Changed!", {
        className: "bg-green-500 text-white font-semibold rounded-lg",
        position: "top-center",
      });
  };

  if (!user) return null;

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-500">Settings - Assign Roles</h1>

      <table className="w-full text-left border border-gray-700 rounded-xl">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-3 px-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((u, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-3 px-2">{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="bg-black text-white border border-gray-600 rounded-lg px-2 py-1"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
