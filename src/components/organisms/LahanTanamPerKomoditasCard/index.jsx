/*************  ✨ Windsurf Command 🌟  *************/
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: theme.colors.primary,
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

/*******  8eb1008e-f76a-4fed-933d-893db1d4c4b2  *******/
