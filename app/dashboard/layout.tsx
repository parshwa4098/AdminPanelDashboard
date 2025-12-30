"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LuHousePlus } from "react-icons/lu";
import { TbBrandGoogleAnalytics, TbSettings } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { AiOutlineLogout, AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import SidebarItem from "../_components/SidebarItem";
import { IconType } from "react-icons";

type UserRole = "admin" | "manager" | "employee";

interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface MenuItem {
  text: string;
  icon: IconType;
  path?: string;
  action?: () => void;
  adminOnly?: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      
      requestAnimationFrame(() => {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      });
    } else {
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  if (loading || !user) return null; 

  const menuItems: MenuItem[] = [
    { text: "Overview", icon: LuHousePlus, path: "/dashboard" },
    { text: "Analytics", icon: TbBrandGoogleAnalytics, path: "/dashboard/analytics" },
    { text: "Users", icon: FaUsers, path: "/dashboard/user", adminOnly: true },
    { text: "Settings", icon: TbSettings, path: "/dashboard/settings", adminOnly: true },
    { text: "Logout", icon: AiOutlineLogout, action: logout },
    
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
  
      <div className="md:hidden fixed top-0 left-0 w-full bg-black border-b border-gray-800 z-20 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-500">Dashboard</h2>
        <button onClick={toggleSidebar} className="text-white p-1">
          <GiHamburgerMenu size={24} />
        </button>
      </div>

    
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-black border-r border-gray-800 p-6 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-purple-500">Dashboard</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            if (item.adminOnly && user.role !== "admin") return null;
            const isActive = pathname === item.path;
            return (
              <SidebarItem
                key={index}
                text={item.text}
                icon={item.icon}
                active={!!isActive}
                onClick={() =>
                  item.action ? item.action() : item.path && handleNavigation(item.path)
                }
              />
            );
          })}
        </nav>
      </aside>

  
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pt-20 md:pt-8 w-full">
        {children}
      </main>
    </div>
  );
}
