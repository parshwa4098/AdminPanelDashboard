"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";
import { TbEyeCancel } from "react-icons/tb";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { IoIosPersonAdd } from "react-icons/io";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "employee",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); //get the logged in user
    if (!storedUser) return router.push("/login"); //if no user exists then redirect to login

    const parsedUser = JSON.parse(storedUser); //convert data to object
    setUser(parsedUser); //store object in state

    let users = JSON.parse(localStorage.getItem("users")) || []; //load all users
    if (!Array.isArray(users)) users = [users]; //ensures that data should be in array form
    setAllUsers(users);
  }, []);

  if (!user) return null;

  const handleAddUser = () => {
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    setNewUser({ name: "", email: "", role: "employee" });
    setShowAddModal(false);
    toast.success("User added successfully!", { position: "top-center" });
  };

  const handleDelete = (index) => {
    if (user.role !== "admin")
      return toast.error("Only admin can delete users!", { position: "top-center" });

    const updated = [...allUsers];
    updated.splice(index, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted successfully!", { position: "top-center" });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...allUsers];
    updated[index][field] = value;
    setAllUsers(updated);
  };

  const handleSaveEdit = (index) => {
    localStorage.setItem("users", JSON.stringify(allUsers));
    setEditingIndex(null);
    toast.success("User updated successfully!", { position: "top-center" });
  };

  return (
    <div className="flex flex-col md:flex-row bg-black text-white min-h-screen px-4 py-6 md:px-8 md:py-8 gap-6">
      <main className="flex-1">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome, <span className="text-purple-400">{user.name}</span>
          </h1>
          {user.role === "admin" && (
            <IoIosPersonAdd
              className="text-4xl sm:text-5xl text-yellow-500 hover:text-yellow-600 cursor-pointer ml-6"
              onClick={() => setShowAddModal(true)}
            />
          )}
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total Users" value={allUsers.length} color="text-purple-500" />
          <StatCard
            title="Active Managers"
            value={allUsers.filter((u) => u.role === "manager").length}
            color="text-green-500"
          />
          <StatCard title="Pending Approvals" value={35} color="text-yellow-500" />
          <StatCard title="Revenue Overview" value="$34,000" color="text-teal-500" />
        </div>

        
        <div className="bg-black p-4 sm:p-6 rounded-2xl border border-gray-700 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Users</h3>
          <table className="w-full min-w-[700px] text-left border border-gray-700 rounded-xl mt-4 table-fixed">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-3">Name</th>
                <th>Email</th>
                <th className="md:pl-6">Role</th>
                <th>Status</th>
                {user.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2 sm:p-4">
                    {editingIndex === index ? (
                      <input
                        value={u.name}
                        onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                        className="w-full px-2 h-9 rounded bg-gray-800 border border-gray-600 text-sm"
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="p-2 sm:p-4">
                    {editingIndex === index ? (
                      <input
                        value={u.email}
                        onChange={(e) => handleFieldChange(index, "email", e.target.value)}
                        className="w-full h-9 rounded bg-gray-800 border border-gray-600 text-sm"
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="p-2 sm:p-4">
                    {editingIndex === index ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleFieldChange(index, "role", e.target.value)}
                        className="w-full h-9 rounded bg-gray-800 border border-gray-600 text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block text-center px-3 py-1 rounded-full text-sm font-semibold ${
                          u.role === "admin"
                            ? "bg-pink-600/20 text-pink-500"
                            : u.role === "manager"
                            ? "bg-green-600/20 text-green-500"
                            : "bg-purple-600/20 text-purple-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-2 sm:p-4">
                    <span className="bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold px-3 py-1">
                      Active
                    </span>
                  </td>
                  {user.role === "admin" && (
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-3">
                        {editingIndex === index ? (
                          <>
                            <LuSave
                              size={22}
                              onClick={() => handleSaveEdit(index)}
                              className="text-green-500 cursor-pointer"
                            />
                            <TbEyeCancel
                              size={22}
                              onClick={() => setEditingIndex(null)}
                              className="text-red-500 cursor-pointer"
                            />
                          </>
                        ) : (
                          <>
                            <LiaUserEditSolid
                              onClick={() => setEditingIndex(index)}
                              className="cursor-pointer text-yellow-500"
                              size={22}
                            />
                            <MdDelete
                              onClick={() => handleDelete(index)}
                              className="cursor-pointer text-red-500"
                              size={22}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

    
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="w-[90%] sm:w-[400px] max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-black">Add User</h2>
          <div className="flex flex-col gap-3">
            <input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="p-2 rounded border border-gray-600"
              placeholder="Name"
            />
            <input
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 rounded border border-gray-600"
              placeholder="Email"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="p-2 rounded border border-gray-600"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <TbEyeCancel
                onClick={() => setShowAddModal(false)}
                className="text-red-500 text-3xl cursor-pointer"
              />
              <LuSave
                onClick={handleAddUser}
                className="text-3xl text-green-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
