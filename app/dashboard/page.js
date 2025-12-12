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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "employee" });
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
    const updated = [...allUsers, newUser]; //unpack users and a new user
    setAllUsers(updated); //sets the updated in all users state
    localStorage.setItem("users", JSON.stringify(updated)); //storing updated in loclastorage
    setNewUser({ name: "", email: "", role: "employee" }); //Resets the newUser state to its initial values. Clears the input fields in the form after successfully adding the user.
    setShowAddModal(false); //closes the modal
    toast.success("User added successfully!",{   
      position:'top-center'
    });
  };

  const handleDelete = (index) => {
    if (user.role !== "admin") return toast.error("Only admin can delete users!",{
      position:'top-center'
    }); 

    const updated = [...allUsers]; //unpack users from allusers state 
    updated.splice(index, 1); //it ensures that only 1 elemnt is removed
    setAllUsers(updated); //set the updated state to all users
    localStorage.setItem("users", JSON.stringify(updated));  //stores updated data
    toast.success("User deleted successfully!",{
      position:'top-center'
    });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...allUsers]; //unpack users from all users state
    updated[index][field] = value; //update user field by accessing its index
    setAllUsers(updated); //set the updated state
  };

  const handleSaveEdit = (index) => {
    localStorage.setItem("users", JSON.stringify(allUsers)); //saves the updated field in localstoraage 
    setEditingIndex(null);  //it sets the editing index to null
    toast.success("User updated successfully!",{ 
      position:'top-center'
    });
  };

  return (
    <div className="flex bg-black text-white min-h-screen p-8">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome, <span className="text-purple-400">{user.name}</span>
          </h1>
          {user.role === "admin" && (
            <button
              className="bg-yellow-500 px-4 py-2 rounded-lg text-black hover:bg-yellow-600"
              onClick={() => setShowAddModal(true)}
            >
              + Add User
            </button> //here when button is clicked modal form would be open for adding a user only for admin
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <StatCard title="Total Users" value={allUsers.length} color="text-purple-500" />
          <StatCard
            title="Active Managers"
            value={allUsers.filter((u) => u.role === "manager").length} //it shows the no. of managers active 
            color="text-green-500"
          />
          <StatCard title="Pending Approvals" value={35} color="text-yellow-500" />
          <StatCard title="Revenue Overview" value="$34,000" color="text-teal-500" />
        </div>

        <div className="bg-black p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Users</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-3 px-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {user.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {allUsers.map((u, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td>
                    {editingIndex === index ? ( //if editing row index matches the row index then show input field
                      <input
                        value={u.name}
                        onChange={(e) => handleFieldChange(index, "name", e.target.value)} 
                        className="p-1 rounded bg-gray-800 border border-gray-600"
                      />
                    ) : (        
                      u.name
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        value={u.email}
                        onChange={(e) => handleFieldChange(index, "email", e.target.value)}
                        className="p-1 rounded bg-gray-800 border border-gray-600"
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleFieldChange(index, "role", e.target.value)}
                        className="p-1 rounded bg-gray-800 border border-gray-600"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                  <td>
                    <span className="bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold px-3 py-1">
                      Active
                    </span>
                  </td>
                  {user.role === "admin" && (
                    <td className="flex gap-2">
                      {editingIndex === index ? ( //if editing index and row idex matches then it show save and cancel options
                        <>
                          <LuSave
                            size={22}
                            onClick={() => handleSaveEdit(index)}
                            className="text-green-500 text-xl"
                          />
                          <TbEyeCancel
                            size={22}
                            onClick={() => setEditingIndex(null)}
                            className="text-red-500 "
                          />
                        </>
                      ) : (
                        <> 
                          <LiaUserEditSolid //otherwise if no editing is happening then delte and edit options
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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

  
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
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

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
