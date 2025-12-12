export default function StatCard({ title, value, color }) {
  return (
    <div className="flex-1 min-w-[250px] bg-black p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}