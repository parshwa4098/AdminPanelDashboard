"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";


export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const router=useRouter();

  return (
    
    

      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl"
        >
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <p>{user.name}</p>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 w-56">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm capitalize">Role: {user.role}</p>

            <AiOutlineLogout
              className="mt-4  bg-white text-4xl text-black p-2 "
              onClick={() =>router.push('/login')}
            >
        
            </AiOutlineLogout>
          </div>
        )}
      </div>
  );
}
