import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

// Функция для получения последних 7 дней
const getLast7Days = (): string[] => {
  const days: string[] = [];
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', options));
  }

  return days;
};

// Фиктивные данные
const generateSampleStats = () => {
  const days = getLast7Days();

  return days.map((day) => ({
    day,
    wins: Math.floor(Math.random() * 5),
    losses: Math.floor(Math.random() * 5),
  }));
};

const WinLossChart: React.FC = () => {
  const data = generateSampleStats();

  return (
    <div
      className="
        w-full
        h-[min(360px,40vw)]
        bg-gray-800
        bg-opacity-50
        rounded-2xl
        p-4
        shadow-lg
      "
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="day"
            stroke="#ccc"
            tick={{ fill: '#ccc', fontSize: 14 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#ccc"
            tick={{ fill: '#ccc', fontSize: 14 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#222',
              borderColor: '#00ffcc',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          <Legend />
          <Bar dataKey="wins" fill="#10b981" name="Wins" />
          <Bar dataKey="losses" fill="#ef4444" name="Losses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinLossChart;
