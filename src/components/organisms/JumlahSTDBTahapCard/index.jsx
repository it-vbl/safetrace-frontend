import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
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

const labels = ['Pendataan', 'Pemetaan', 'Tidak Diterbitkan', 'Rekomendasi', 'Terbit', 'Berakhir'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Pekebun',
      data: labels.map(() => faker.number.int({ min: 0, max: 5000 })),
      backgroundColor: theme.colors.primary,
    },
    {
      label: 'Kebun',
      data: labels.map(() => faker.number.int({ min: 0, max: 5000 })),
      backgroundColor: `${theme.colors.primary}80`,
    },
  ],
};

export default function App() {
  return (
    <div className='flex flex-col items-start border border-gray-300 p-8'>
      <Heading>Jumlah Lahan Tanam Per Komoditas</Heading>
      <Bar options={options} data={data} />
    </div>
  );
}
