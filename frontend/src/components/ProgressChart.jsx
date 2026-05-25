import { getDailyProgress } from "../utils/dailyProgress";

const ProgressChart = () => {
  const data = getDailyProgress();
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return { key, value: data[key] || 0 };
  });

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">📈 Last 7 Days</h3>
      <div className="flex gap-2 items-end h-24">
        {days.map((d) => (
          <div key={d.key} className="flex-1 text-center">
            <div
              className="bg-green-500 rounded"
              style={{ height: `${d.value * 20}px` }}
            />
            <p className="text-xs">{d.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
