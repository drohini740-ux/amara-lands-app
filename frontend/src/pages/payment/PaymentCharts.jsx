import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function PaymentCharts({ stats }) {
  const pieData = [
    {
      name: "Success",
      value: stats.successfulPayments,
    },
    {
      name: "Pending",
      value: stats.pendingPayments,
    },
    {
      name: "Failed",
      value: stats.failedPayments,
    },
  ];

  const revenueData = [
    {
      name: "Revenue",
      amount: stats.totalRevenue,
    },
  ];

  const COLORS = [
    "#D4AF37",
    "#F4C542",
    "#6B6B6B",
  ];

  return (
    <div className="row mt-4">
      {/* Pie Chart */}

      <div className="col-lg-6 mb-4">
        <div className="payment-chart-card">

          <h4 className="chart-title">
            Payment Status
          </h4>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* Revenue Chart */}

      <div className="col-lg-6 mb-4">
        <div className="payment-chart-card">

          <h4 className="chart-title">
            Revenue
          </h4>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#D4AF37"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}