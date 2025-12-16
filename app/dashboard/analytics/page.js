"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnalyticsCard from "../../components/AnalyticsCard";

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!Array.isArray(users)) users = [users];
    setAllUsers(users);
  }, []);

  if (!user) return null;

  
  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
  const totalManagers = allUsers.filter((u) => u.role === "manager").length;
  const totalEmployee = allUsers.filter((u) => u.role === "employee").length;

  
  const recentSignups = allUsers.slice(-5).length;

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-500">Analytics</h1>
      <p className="mb-6">Logged in as: {user.name} ({user.role})</p>

      <div className="flex justify-between gap-10">
        <AnalyticsCard title="Total Users" value={totalUsers} color="text-purple-400" />
        <AnalyticsCard title="Total Admins" value={totalAdmins} color="text-pink-400" />
        <AnalyticsCard title="Total Managers" value={totalManagers} color="text-green-400" />
        <AnalyticsCard title="Total Employee" value={totalEmployee} color="text-teal-400" />
        <AnalyticsCard title="Recent Signups" value={recentSignups} color="text-yellow-400" />
      </div>
    </div>
  );
}


