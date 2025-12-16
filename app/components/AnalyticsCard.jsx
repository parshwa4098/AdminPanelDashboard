export default function AnalyticsCard({ title, value, color }) {
  return (
    <div className="bg-black border border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
