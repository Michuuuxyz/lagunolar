"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ActivityData {
  date: string;
  messages: number;
  joins: number;
  warns: number;
  commands: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-lg p-4 border border-gray-700 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 text-sm">
                  {entry.name}:
                </span>
                <span className="text-white font-medium text-sm">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorJoins" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorWarns" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCommands" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />

        <XAxis
          dataKey="date"
          stroke="#9CA3AF"
          style={{ fontSize: "12px" }}
          tickLine={false}
        />

        <YAxis
          stroke="#9CA3AF"
          style={{ fontSize: "12px" }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{
            paddingTop: "20px",
          }}
          iconType="circle"
          formatter={(value) => (
            <span className="text-gray-300 text-sm">{value}</span>
          )}
        />

        <Line
          type="monotone"
          dataKey="messages"
          stroke="#D4AF37"
          strokeWidth={3}
          dot={{ fill: "#D4AF37", r: 4 }}
          activeDot={{ r: 6, fill: "#D4AF37" }}
          name="Mensagens"
        />

        <Line
          type="monotone"
          dataKey="joins"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: "#10B981", r: 4 }}
          activeDot={{ r: 6, fill: "#10B981" }}
          name="Entradas"
        />

        <Line
          type="monotone"
          dataKey="warns"
          stroke="#F59E0B"
          strokeWidth={3}
          dot={{ fill: "#F59E0B", r: 4 }}
          activeDot={{ r: 6, fill: "#F59E0B" }}
          name="Warns"
        />

        <Line
          type="monotone"
          dataKey="commands"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: "#3B82F6", r: 4 }}
          activeDot={{ r: 6, fill: "#3B82F6" }}
          name="Comandos"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
