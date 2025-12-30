"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";
import { TbEyeCancel } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Modal from "../_components/Modal";
import StatCard from "../_components/StatCard";

type Userrole = "admin" | "manager" | "employee";
interface User {
  name: string;
  email: string;
  password: string;
  role: Userrole;
}

interface NewUser {
  name: string;
  email: string;
  role: Userrole;
  password: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return [];

    const usersData = localStorage.getItem("users");
    const parsed = usersData ? JSON.parse(usersData) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "employee",
    password: "password",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [user] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleAddUser = (): void => {
  const updated = [...allUsers, newUser];

  setAllUsers(updated);
  localStorage.setItem("users", JSON.stringify(updated));

  setNewUser({
    name: "",
    email: "",
    role: "employee",
    password: "",
  });

  setShowAddModal(false);
  toast.success("User added successfully!", { position: "top-center" });
};


  const handleDelete = (index: number) => {
    if (user.role !== "admin")
      return toast.error("Only admin can delete users!", {
        position: "top-center",
      });

    const updated = [...allUsers];
    updated.splice(index, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted successfully!", { position: "top-center" });
  };

  const handleFieldChange = (
    index: number,
    field: keyof User,
    value: string
  ): void => {
    const updated = [...allUsers];
    updated[index] = { ...updated[index], [field]: value };
    setAllUsers(updated);
  };

  const handleSaveEdit = () => {
    localStorage.setItem("users", JSON.stringify(allUsers));
    setEditingIndex(null);
    toast.success("User updated successfully!", { position: "top-center" });
  };

  return (
    <div className="bg-black text-white min-h-screen p-3 sm:p-6 md:p-8">
      <main className="max-w-[1600px] mx-auto w-full flex flex-col">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaUserCircle className="text-3xl sm:text-5xl text-gray-400" />
            <h1 className="text-lg sm:text-3xl font-semibold leading-tight">
              Welcome, <br className="sm:hidden" />
              <span className="text-purple-400">{user.name}</span>
            </h1>
          </div>

          {user.role === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 sm:gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all shrink-0"
            >
              <IoIosPersonAdd className="text-xl sm:text-2xl" />
            </button>
          )}
        </div>
          
        <div className="flex flex-wrap -m-2 mb-8">
          <div className="w-1/2 lg:w-1/4 p-2">
            <StatCard
              title="Total Users"
              value={allUsers.length}
              color="text-purple-500"
            />
          </div>
          <div className="w-1/2 lg:w-1/4 p-2">
            <StatCard
              title="Active Managers"
              value={allUsers.filter((u) => u.role === "manager").length}
              color="text-green-500"
            />
          </div>
          <div className="w-1/2 lg:w-1/4 p-2">
            <StatCard
              title="Pending Approvals"
              value={35}
              color="text-yellow-500"
            />
          </div>
          <div className="w-1/2 lg:w-1/4 p-2">
            <StatCard title="Revenue" value={"$34k"} color="text-teal-500" />
          </div>
        </div>

        <div className="bg-black border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold">Users</h3>
          </div>

          <div className="overflow-x-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUsers.map((u, index) => (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-800 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {editingIndex === index ? (
                        <input
                          value={u.name}
                          onChange={(e) =>
                            handleFieldChange(index, "name", e.target.value)
                          }
                          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold">{u.name}</h3>
                      )}

                      {editingIndex === index ? (
                        <input
                          value={u.email}
                          onChange={(e) =>
                            handleFieldChange(index, "email", e.target.value)
                          }
                          className="mt-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                        />
                      ) : (
                        <p className="text-sm text-gray-400">{u.email}</p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize
            ${
              u.role === "admin"
                ? "bg-red-500/20 text-red-400"
                : u.role === "manager"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-purple-500/20 text-purple-400"
            }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  {editingIndex === index && (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleFieldChange(index, "role", e.target.value)
                      }
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  )}

                  <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded w-fit">
                    Active
                  </div>

                  {user.role === "admin" && (
                    <div className="flex justify-end gap-3 mt-2">
                      {editingIndex === index ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-500 hover:text-green-400"
                          >
                            <LuSave size={20} />
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <TbEyeCancel size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="text-yellow-500 hover:text-yellow-400"
                          >
                            <LiaUserEditSolid size={22} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <MdDelete size={22} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
          
          </div>
        </div>
      </main>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add New User
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Name</label>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-black"
                placeholder="Enter Your Name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-black"
                placeholder="Enter Your Email"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={newUser.password || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-black"
                placeholder="Enter Your Password"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as Userrole })
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-black bg-white"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <TbEyeCancel
                onClick={() => setShowAddModal(false)}
                className="text-black text-3xl"
              />

              <LuSave
                onClick={handleAddUser}
                className=" text-black text-3xl"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
