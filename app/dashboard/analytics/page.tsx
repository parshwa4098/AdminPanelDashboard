"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnalyticsCard from "../../_components/AnalyticsCard";
type Userrole='admin'|'manager'|'employee';
interface User {
  name: string;
  email: string;
  password: string;
  role: Userrole;
}
export default function AnalyticsPage() {
  const router = useRouter();
 const [user] = useState<User | null>(() => {
   const storedUser = localStorage.getItem("user");
   return storedUser ? JSON.parse(storedUser) : null;
 });
   const [allUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return [];
  
    const usersData = localStorage.getItem("users");
    const parsed = usersData ? JSON.parse(usersData) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  
 
 useEffect(() => {
  if (!user) {
    router.push("/login");
  }
}, [user, router]);

  if (!user) return null;

  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
  const totalManagers = allUsers.filter((u) => u.role === "manager").length;
  const totalEmployee = allUsers.filter((u) => u.role === "employee").length;
  const recentSignups = allUsers.slice(-5).length;

  return (
    <div className="bg-black text-white min-h-screen p-3 sm:p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto w-full">
    
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-500 mb-2">
            Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Logged in as: <span className="font-semibold text-white">{user.name}</span>{" "}
            <span className="text-gray-500">({user.role})</span>
          </p>
        </div>

        
        <div className="flex flex-wrap -m-2">
          
        
          <div className="w-1/2 md:w-1/3 lg:w-1/5 p-2">
            <AnalyticsCard
              title="Total Users"
              value={totalUsers}
              color="text-purple-400"
            />
          </div>

          
          <div className="w-1/2 md:w-1/3 lg:w-1/5 p-2">
            <AnalyticsCard
              title="Total Admins"
              value={totalAdmins}
              color="text-pink-400"
            />
          </div>

          
          <div className="w-1/2 md:w-1/3 lg:w-1/5 p-2">
            <AnalyticsCard
              title="Total Managers"
              value={totalManagers}
              color="text-green-400"
            />
          </div>

      
          <div className="w-1/2 md:w-1/3 lg:w-1/5 p-2">
            <AnalyticsCard
              title="Total Employee"
              value={totalEmployee}
              color="text-teal-400"
            />
          </div>

          
          <div className="w-1/2 md:w-1/3 lg:w-1/5 p-2">
            <AnalyticsCard
              title="Recent Signups"
              value={recentSignups}
              color="text-yellow-400"
            />
          </div>

        </div>
      </div>
    </div>
  );
}