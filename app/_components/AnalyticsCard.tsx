interface AnalyticsProps{
  title:string;
  value:number;
  color:string
}
export default function AnalyticsCard({ title, value, color }:AnalyticsProps) {
  return (
    <div className="h-full w-full bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg hover:border-gray-500 transition-colors flex flex-col justify-between">
      <h3 className="text-sm sm:text-base font-medium text-gray-300 mb-2">
        {title}
      </h3>
      <p className={`text-2xl sm:text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}