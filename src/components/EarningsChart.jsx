import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const EarningsChart = ({ earningsHistory }) => {
  // Format data safely
  const chartData =
    earningsHistory && earningsHistory.length > 0
      ? earningsHistory.map((e) => ({
          month: e.month || "N/A",
           amount: parseFloat(e.amount) || 0,
        }))
      : [];

  if (chartData.length === 0) {
    return (
      <p className="dark:text-gray-300 text-center py-10">
        No earnings data available.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        {/* Gradient for line fill */}
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
        <XAxis dataKey="month" stroke="#e5e7eb" tick={{ fill: "#e5e7eb" }} />
        <YAxis stroke="#e5e7eb" tick={{ fill: "#e5e7eb" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            border: "none",
            color: "#fff",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2563eb"
          strokeWidth={3}
          fill="url(#colorAmount)"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
