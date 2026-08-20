import { useEffect, useState } from "react";
import api from "../../services/api";

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
  Legend,
} from "recharts";

export default function PaymentCharts({ stats }) {
  const [revenueData, setRevenueData] = useState([]);

  // ==========================================
  // FETCH ADMIN MONTHLY REVENUE
  // ==========================================

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await api.get(
        "/admin/payments/stats/monthly-revenue"
      );

      setRevenueData(
        res.data.revenue || []
      );
    } catch (error) {
      console.error(
        "Admin monthly revenue error:",
        error
      );

      setRevenueData([]);
    }
  };

  // ==========================================
  // PAYMENT STATUS DATA
  // ==========================================

  const pieData = [
    {
      name: "Success",
      value: Number(
        stats?.successfulPayments || 0
      ),
    },
    {
      name: "Pending",
      value: Number(
        stats?.pendingPayments || 0
      ),
    },
    {
      name: "Failed",
      value: Number(
        stats?.failedPayments || 0
      ),
    },
  ];

  const COLORS = [
    "#D4AF37",
    "#F4C542",
    "#6B6B6B",
  ];

  return (
    <div className="row mt-4">

      {/* ==========================================
          PAYMENT STATUS CHART
      ========================================== */}

      <div className="col-lg-6 mb-4">

        <div className="payment-chart-card">

          <h4 className="chart-title">
            Payment Status
          </h4>

          {pieData.some(
            (item) => item.value > 0
          ) ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-5 text-muted">
              No payment status data available
            </div>
          )}

        </div>

      </div>

      {/* ==========================================
          MONTHLY REVENUE CHART
      ========================================== */}

      <div className="col-lg-6 mb-4">

        <div className="payment-chart-card">

          <h4 className="chart-title">
            Revenue
          </h4>

          {revenueData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={revenueData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#D4AF37"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-5 text-muted">
              No revenue data available
            </div>
          )}

        </div>

      </div>

    </div>
  );
}