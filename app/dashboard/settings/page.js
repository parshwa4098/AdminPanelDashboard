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

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser?.email === updatedUsers[index].email) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...loggedUser, role: newRole })
      );
    }

    toast.success("User role changed!", {
      position: "top-center",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-8">
    
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-500">
        Settings - Assign Roles
      </h1>

      
      <div className="overflow-x-auto border border-gray-700 rounded-xl">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="py-3 px-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((u, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3 px-3">{u.name}</td>
                <td className="py-3 px-3">{u.email}</td>

                <td className="py-3 px-3">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(index, e.target.value)
                    }
                    className="w-full sm:w-auto bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="py-3 px-3">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-600/20 text-green-500">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
