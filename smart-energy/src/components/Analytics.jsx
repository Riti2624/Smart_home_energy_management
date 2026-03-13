import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Analytics() {
  const data = [
    { day: "Mon", usage: 3 },
    { day: "Tue", usage: 4 },
    { day: "Wed", usage: 2 },
    { day: "Thu", usage: 5 },
    { day: "Fri", usage: 6 },
    { day: "Sat", usage: 4 },
    { day: "Sun", usage: 3 }
  ];

  return (
    <div className="card">
      <h2>📊 Weekly Energy Usage</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="usage" stroke="#007bff" />
      </LineChart>
    </div>
  );
}