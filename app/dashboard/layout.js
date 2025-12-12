"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LuHousePlus } from "react-icons/lu";
import { TbBrandGoogleAnalytics, TbSettings } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import SidebarItem from "../components/SidebarItem";
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");  
    setUser(JSON.parse(storedUser)); //Redirects to login if no user exists
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login"); //logout functionality
  };

  if (!user) return null;

  const menuItems = [
    { text: "Overview", icon: <LuHousePlus size={22} />, path: "/dashboard" },
    {
      text: "Analytics",
      icon: <TbBrandGoogleAnalytics size={22} />,
      path: "/dashboard/analytics",
    },
    {
      text: "Users",                                 //sidebar overview 
      icon: <FaUsers size={22} />,
      path: "/dashboard/user",
      adminOnly: true,
    },
    {
      text: "Settings",
      icon: <TbSettings size={22} />,
      path: "/dashboard/settings",
      adminOnly: true,
    },
    { text: "Logout", icon: <AiOutlineLogout size={22} />, action: logout },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-black p-6 border-r border-gray-700">
        <h2 className="text-3xl font-bold text-purple-500 mb-8">Dashboard</h2>
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            if (item.adminOnly && user.role !== "admin") return null;
            const isActive = pathname === item.path;
            return (
              <SidebarItem
                key={index}
                text={item.text}
                icon={item.icon}
                active={isActive}
                onClick={() =>
                  item.action ? item.action() : router.push(item.path)
                }
              />
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

