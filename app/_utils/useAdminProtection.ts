"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "manager" | "employee";

interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export default function useAdminProtection() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);
}
