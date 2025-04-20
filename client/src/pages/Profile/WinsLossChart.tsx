
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type MatchResult = {
  match: number;
  result: 'win' | 'loss';
};

const sampleData: MatchResult[] = [
  { match: 1, result: 'loss' },
  { match: 2, result: 'win' },
  { match: 3, result: 'loss' },
  { match: 4, result: 'win' },
  { match: 5, result: 'win' },
  { match: 6, result: 'loss' },
  { match: 7, result: 'win' },
];

const parsedData = sampleData.map((entry) => ({
  ...entry,
  value: entry.result === 'win' ? 1 : 0,
}));

const WinLossChart = () => {
  return (
    <div className="w-full
					h-[min(360px,40vw)] 
					bg-gray-800
					bg-opacity-70
					rounded-2xl 
					p-4 
					shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={parsedData}>
          <XAxis
            dataKey="match"
            stroke="#ccc"
            tick={{ fill: '#ccc', fontSize: 14 }}
          />
          <YAxis
            dataKey="value"
            stroke="#ccc"
            domain={[0, 1]}
            tick={{ fill: '#ccc', fontSize: 14 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#222',
              borderColor: '#00ffcc',
              color: '#fff',
              fontSize: '14px'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00e0ff"
            strokeWidth={3}
            dot={{ r: 6, fill: '#00e0ff' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinLossChart;
