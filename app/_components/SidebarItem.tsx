"use client";

import { IconType } from "react-icons";

interface SidebarItemProps {
  text: string;
  icon: IconType;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({ text, icon: Icon, active, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        active
          ? "bg-purple-600/20 text-purple-400 border border-purple-500"
          : "hover:bg-gray-800 text-gray-300 hover:text-white"
      }`}
    >
      <div className="text-xl">
        <Icon />
      </div>
      <span className="text-base font-medium">{text}</span>
    </div>
  );
}
