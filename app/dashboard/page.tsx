"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";
import { TbEyeCancel } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
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
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return [];

    const usersData = localStorage.getItem("users");
    const parsed = usersData ? JSON.parse(usersData) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

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

  
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (): void => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Please fill all fields!", { position: "top-center" });
      return;
    }

    const updated = [...allUsers, newUser];

    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    setNewUser({
      name: "",
      email: "",
      role: "employee",
      password: "password",
    });

    setShowAddModal(false);
    toast.success("User added successfully!", { position: "top-center" });
  };

  const handleDeleteClick = (index: number) => {
    if (user.role !== "admin") {
      toast.error("Only admin can delete users!", { position: "top-center" });
      return;
    }
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex === null) return;

    const updated = [...allUsers];
    updated.splice(deleteIndex, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted successfully!", { position: "top-center" });
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
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

  const handleStartEdit = (index: number): void => {
    setEditingIndex(index);
    setOriginalUser({ ...allUsers[index] });
  };

  const clearSearch = () => {
    setSearchQuery("");
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
              className="flex cursor-pointer items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all shrink-0"
            >
              <IoIosPersonAdd className="text-xl sm:text-2xl" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">
                Add New
              </span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg sm:text-xl font-semibold">Users</h3>

              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              
                <div className="relative flex-1 sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-black border border-gray-600 rounded-lg text-sm text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      <IoClose size={18} />
                    </button>
                  )}
                </div>

              
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-black border border-gray-600 rounded-lg text-sm text-white  cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            {filteredUsers.length === 0 ? (
          
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-800/50 rounded-full p-6 mb-4">
                  <FaUserCircle className="text-6xl " />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchQuery || roleFilter !== "all"
                    ? "No users found"
                    : "No users yet"}
                </h3>
                <p className="text-white text-center mb-6 max-w-md">
                  {searchQuery || roleFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first user to the system"}
                </p>
                {user.role === "admin" &&
                  !searchQuery &&
                  roleFilter === "all" && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-all font-medium"
                    >
                      <IoIosPersonAdd className="text-xl" />
                      Add First User
                    </button>
                  )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                {filteredUsers.map((u, index) => {
              
                  const actualIndex = allUsers.findIndex(
                    (user) => user.email === u.email
                  );

                  return (
                    <div
                      key={actualIndex}
                      className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-800 transition"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          {editingIndex === actualIndex ? (
                            <input
                              value={u.name}
                              onChange={(e) =>
                                handleFieldChange(
                                  actualIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                            />
                          ) : (
                            <h3 className="text-lg font-semibold truncate">
                              {u.name}
                            </h3>
                          )}

                          {editingIndex === actualIndex ? (
                            <input
                              value={u.email}
                              onChange={(e) =>
                                handleFieldChange(
                                  actualIndex,
                                  "email",
                                  e.target.value
                                )
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
                          {editingIndex === actualIndex ? (
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleFieldChange(
                                  actualIndex,
                                  "role",
                                  e.target.value as Userrole
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
                          {editingIndex === actualIndex ? (
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
                                onClick={() => handleStartEdit(actualIndex)}
                                className="text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors"
                                title="Edit user"
                              >
                                <LiaUserEditSolid size={22} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(actualIndex)}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      
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
                  setNewUser({ ...newUser, role: e.target.value as Userrole })
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
                <LuSave className="text-black text-3xl cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <div className="w-[90vw] sm:w-[400px] bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500/20 p-4 rounded-full">
              <MdDelete className="text-4xl text-red-500" />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3 text-center text-white">
            Delete User?
          </h2>

          <p className="text-gray-400 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">
              {deleteIndex !== null ? allUsers[deleteIndex]?.name : ""}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleDeleteCancel}
              className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}