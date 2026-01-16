"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { LiaUserEditSolid } from "react-icons/lia";
import { LuSave } from "react-icons/lu";
import { TbEyeCancel } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import Modal from "../../_components/Modal";
import useAdminProtection from "@/app/_utils/useAdminProtection";

type UserRole = "admin" | "manager" | "employee";

interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface NewUser {
  name: string;
  email: string;
  role: UserRole;
}

export default function UsersPage() {
  useAdminProtection();

  const router = useRouter();

  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return [];
    const usersData = localStorage.getItem("users");
    const parsed = usersData ? JSON.parse(usersData) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "employee",
  });

  if (!user) return null;

  const handleAddUser = (): void => {
    if (!newUser.name || !newUser.email) {
      toast.error("All fields are required!", { position: "top-center" });
      return;
    }

    const userToAdd: User = { ...newUser, password: "" };
    const updated = [...allUsers, userToAdd];
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User added!", { position: "top-center" });
    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "employee" });
  };

  const handleDelete = (index: number): void => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const updated = [...allUsers];
    updated.splice(index, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted!", { position: "top-center" });
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

  const handleStartEdit = (index: number): void => {
    setEditingIndex(index);
    setOriginalUser({ ...allUsers[index] });
  };

  const handleSaveEdit = (): void => {
    if (editingIndex === null) return;

    const current = allUsers[editingIndex];
    if (!originalUser) return;

    const isChanged =
      current.name !== originalUser.name ||
      current.email !== originalUser.email ||
      current.role !== originalUser.role;

    if (!isChanged) {
      toast.info("No changes to save", { position: "top-center" });
      setEditingIndex(null);
      setOriginalUser(null);
      return;
    }

    localStorage.setItem("users", JSON.stringify(allUsers));
    toast.success("User updated!", { position: "top-center" });
    setEditingIndex(null);
    setOriginalUser(null);
  };

  const handleCancelEdit = (): void => {
    if (editingIndex !== null && originalUser) {
      const updated = [...allUsers];
      updated[editingIndex] = originalUser;
      setAllUsers(updated);
    }
    setEditingIndex(null);
    setOriginalUser(null);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl sm:text-5xl text-gray-400" />
          <h1 className="text-lg sm:text-3xl font-semibold text-white">
            All Users
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 cursor-pointer bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all shrink-0"
        >
          <IoIosPersonAdd className="text-xl sm:text-2xl" />
          <span className="font-medium text-sm sm:text-base hidden sm:inline">
            Add New
          </span>
        </button>
      </div>

      <div className="w-full overflow-x-auto border border-gray-700 rounded-xl bg-gray-900/20 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allUsers.map((u, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-800 transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  {editingIndex === index ? (
                    <input
                      value={u.name}
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold truncate">{u.name}</h3>
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
                    <p className="text-sm text-gray-400 truncate mt-1">
                      {u.email}
                    </p>
                  )}
                </div>

                
                <div className="shrink-0">
                  {editingIndex === index ? (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "role",
                          e.target.value as UserRole
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize cursor-pointer border-2 outline-none
                        ${
                          u.role === "admin"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : u.role === "manager"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/40"
                        }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize inline-block
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
                  )}
                </div>
              </div>

              <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded w-fit">
                Active
              </div>

              {user.role === "admin" && (
                <div className="flex justify-end gap-3 mt-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-500 hover:text-green-400 cursor-pointer transition-colors"
                        title="Save changes"
                      >
                        <LuSave size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                        title="Cancel editing"
                      >
                        <TbEyeCancel size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(index)}
                        className="text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors"
                        title="Edit user"
                      >
                        <LiaUserEditSolid size={22} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete user"
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

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="w-[90vw] sm:w-[400px] bg-amber-50 p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold mb-5 text-black">Add New User</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Name</label>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-2.5 rounded border border-gray-300 text-black focus:border-purple-500 outline-none"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                value={newUser.email}
                type="email"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2.5 rounded border border-gray-300 text-black focus:border-purple-500 outline-none"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as UserRole })
                }
                className="w-full p-2.5 rounded border border-gray-500 text-black focus:border-purple-500 outline-none"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                title="Cancel"
              >
                <TbEyeCancel className="text-black text-3xl" />
              </button>
              <button
                onClick={handleAddUser}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                title="Save user"
              >
                <LuSave className="text-black text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
