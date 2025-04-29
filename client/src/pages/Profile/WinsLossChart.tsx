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
import { MatchResult } from './types/UserInfo';

interface WinLossChartProps {
  history?: MatchResult[];
}

// las 7 days
const getLast7DaysWithWeekday = () => {
  const days: { date: string; weekday: string }[] = [];
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      weekday: d.toLocaleDateString('en-US', options),
    });
  }

  return days;
};

const transformHistoryToChartData = (history: MatchResult[] = []) => {
  const last7Days = getLast7DaysWithWeekday();

  return last7Days.map(({ date, weekday }) => {
    const matchesForDay = history.filter((m) => m.date === date);
    const wins = matchesForDay.filter((m) => m.result === 'win').length;
    const losses = matchesForDay.filter((m) => m.result === 'loss').length;

    return {
      day: weekday,
      wins,
      losses,
    };
  });
};

const WinLossChart: React.FC<WinLossChartProps> = ({ history = [] }) => {
  const data = transformHistoryToChartData(history);

  return (
    <div className="w-full
					h-[min(360px,40vw)]
					bg-gray-800
					bg-opacity-50
					rounded-2xl
					p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#ccc" tick={{ fill: '#ccc', fontSize: 14 }} />
          <YAxis allowDecimals={false} stroke="#ccc" tick={{ fill: '#ccc', fontSize: 14 }} />
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
