import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import Heading from '@/components/atoms/Typography/Heading';
import theme from '@/utils/tailwindTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    title: {
      display: true,
    },
  },
};

const komoditasLabels = ['Sawit', 'Kakao', 'Kopi', 'Lada', 'Karet', 'Lainnya'];

// Realistic plantation area data in hectares for each komoditas
const komoditasData = [12500, 8500, 4200, 1800, 3200, 1500];

export const data = {
  labels: komoditasLabels,
  datasets: [
    {
      label: 'Luas Lahan (Hektar)',
      data: komoditasData,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
  ],
};

export default function App() {
  return (
    <div className="flex flex-col items-start border border-gray-300 p-8">
      <Heading>Jumlah Lahan Tanam Per Komoditas</Heading>
      <Bar options={options} data={data} />
    </div>
  );
}
