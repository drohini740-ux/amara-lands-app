import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#d4af37",
  "#000000",
  "#8c7853",
  "#6b7280",
  "#f59e0b",
];

export default function PaymentMethodChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/payments/stats/methods");
      setData(res.data.methods);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="payment-table-card mt-5">
      <h4 className="mb-4">Payment Methods</h4>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="payment_method"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}