"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LiaUserEditSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";
import Modal from "../../components/Modal";
import { TbEyeCancel } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "employee",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== "admin") {
      alert("Access denied: Admins only");
      return router.push("/dashboard");
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!Array.isArray(users)) users = [users];
    setAllUsers(users);
  }, []);

  if (!user) return null;

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email)
      return toast.error("All fields are required!", { position: "top-center" });

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    toast.success("User added!", { position: "top-center" });
    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "employee" });
  };

  const handleDelete = (index) => {
    const updated = [...allUsers];
    updated.splice(index, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted!", { position: "top-center" });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...allUsers];
    updated[index][field] = value;
    setAllUsers(updated);
  };

  const handleSaveEdit = () => {
    localStorage.setItem("users", JSON.stringify(allUsers));
    setEditingIndex(null);
    toast.success("User updated!", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-8">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">All Users</h1>

        <IoIosPersonAdd
          className="text-4xl sm:text-5xl text-yellow-500 hover:text-yellow-600 cursor-pointer"
          onClick={() => setShowAddModal(true)}
        />
      </div>

      
      <div className="overflow-x-auto border border-gray-700 rounded-xl">
        <table className="w-full min-w-[750px] text-left table-fixed">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="py-3 px-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((u, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-3">
                  {editingIndex === index ? (
                    <input
                      value={u.name}
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      className="w-full h-9 px-2 rounded bg-gray-800 border border-gray-600 text-sm"
                    />
                  ) : (
                    u.name
                  )}
                </td>

                <td className="p-3">
                  {editingIndex === index ? (
                    <input
                      value={u.email}
                      onChange={(e) =>
                        handleFieldChange(index, "email", e.target.value)
                      }
                      className="w-full h-9 px-2 rounded bg-gray-800 border border-gray-600 text-sm"
                    />
                  ) : (
                    u.email
                  )}
                </td>

                <td className="p-3">
                  {editingIndex === index ? (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleFieldChange(index, "role", e.target.value)
                      }
                      className="w-full h-9 px-2 rounded bg-gray-800 border border-gray-600 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-600/20 text-purple-400">
                      {u.role}
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-600/20 text-green-500">
                    Active
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {editingIndex === index ? (
                      <>
                        <LuSave
                          className="cursor-pointer text-green-500"
                          size={22}
                          onClick={handleSaveEdit}
                        />
                        <TbEyeCancel
                          size={22}
                          onClick={() => setEditingIndex(null)}
                          className="cursor-pointer text-red-500"
                        />
                      </>
                    ) : (
                      <>
                        <LiaUserEditSolid
                          className="cursor-pointer text-yellow-500"
                          size={22}
                          onClick={() => setEditingIndex(index)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="w-[90%] sm:w-[400px] bg-white p-6 rounded-xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">Add User</h2>

          <input
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full p-2 mb-3 border rounded text-black"
            placeholder="Name"
          />

          <input
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-2 mb-3 border rounded text-black"
            placeholder="Email"
          />

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 mb-4 border rounded text-black"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <div className="flex justify-end gap-3">
            <TbEyeCancel
              onClick={() => setShowAddModal(false)}
              className="text-3xl text-red-500 cursor-pointer"
            />
            <LuSave
              onClick={handleAddUser}
              className="text-3xl text-green-500 cursor-pointer"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
