"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";
import Modal from "../../components/Modal";

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

    if (parsedUser.role !== "admin") router.push("/dashboard");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!Array.isArray(users)) users = [users];
    setAllUsers(users);
  }, []);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email)
      return toast.error("All fields are required!", {
        position: "top-center",
      });

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    toast.success("User added!", {
      position: "top-center",
    });
    setShowAddModal(false);

    setNewUser({ name: "", email: "", role: "employee" });
  };

  const handleDelete = (index) => {
    const updated = [...allUsers];
    updated.splice(index, 1);
    setAllUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted!", {
      position: "top-center",
    });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...allUsers];
    updated[index][field] = value;
    setAllUsers(updated);
  };

  const handleSaveEdit = () => {
    localStorage.setItem("users", JSON.stringify(allUsers));
    setEditingIndex(null);
    toast.success("User updated!", {
      position: "top-center",
    });
  };

  if (!user) return null;

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mt-5">All Users</h1>

        <button
          className="bg-yellow-500 px-4 py-2 rounded-lg text-black hover:bg-yellow-600 mt-3"
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>

      <table className="w-full text-left border border-gray-700 rounded-xl mt-4">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-3 px-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {allUsers.map((u, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-3 px-2">
                {editingIndex === index ? (
                  <input
                    value={u.name}
                    onChange={(e) =>
                      handleFieldChange(index, "name", e.target.value)
                    }
                    className="p-1 rounded bg-gray-800 border text-white border-gray-600"
                  />
                ) : (
                  u.name
                )}
              </td>

              <td>
                {editingIndex === index ? (
                  <input
                    value={u.email}
                    onChange={(e) =>
                      handleFieldChange(index, "email", e.target.value)
                    }
                    className="p-1 rounded bg-gray-800 border text-white border-gray-600"
                  />
                ) : (
                  u.email
                )}
              </td>

              <td>
                {editingIndex === index ? (
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleFieldChange(index, "role", e.target.value)
                    }
                    className="p-1 rounded bg-gray-800 border text-white border-gray-600"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>

              <td>Active</td>

              <td className="flex gap-3 items-center">
                {editingIndex === index ? (
                  <LuSave
                    className="cursor-pointer text-green-500 mt-3"
                    size={22}
                    onClick={handleSaveEdit}
                  />
                ) : (
                  <LiaUserEditSolid
                    className="cursor-pointer text-yellow-500 mt-3"
                    size={22}
                    onClick={() => setEditingIndex(index)}
                  />
                )}

                <MdDelete
                  onClick={() => handleDelete(index)}
                  className="cursor-pointer text-red-500 mt-3"
                  size={22}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
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
          className="w-full p-2 mb-3 border rounded text-black"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-red-500 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-600 rounded text-white"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
