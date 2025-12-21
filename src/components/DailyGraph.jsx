import { getDailyProgress } from "../utils/dailyProgress";

const DailyGraph = () => {
  const daily = getDailyProgress();

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    return { day: key.slice(5), value: daily[key] || 0 };
  }).reverse();

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">📈 Last 7 Days Progress</h2>
      <div className="flex gap-2 items-end h-24">
        {days.map((d) => (
          <div key={d.day} className="flex flex-col items-center">
            <div
              className="w-6 bg-blue-500 rounded"
              style={{ height: `${d.value * 10}px` }}
            />
            <span className="text-xs">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyGraph;
