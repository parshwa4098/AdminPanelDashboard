

export default function SidebarItem({ text, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-purple-600/20 text-purple-400 border border-purple-500" : "hover:bg-gray-800"
      }`}
    >
      {icon}
      <span className="text-lg">{text}</span>

    </div>
  );
}