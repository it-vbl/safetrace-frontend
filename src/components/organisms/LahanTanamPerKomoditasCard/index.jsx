import React, { useEffect, useState } from 'react';
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
import { getLuasKebunKomoditasChartBar } from '@/services/stdb';
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

export default function App({ komoditas, startDate, endDate }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (komoditas) params.komoditas = komoditas;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const res = await getLuasKebunKomoditasChartBar(params);
        if (res.status === 200) {
          const arr = Array.isArray(res.data?.data) ? res.data.data : [];
          const labels = arr.map((item) => item?.komoditas_nama ?? '-');
          const data = arr.map((item) =>
            typeof item?.luas_lahan === 'number'
              ? item.luas_lahan
              : Number(item?.luas_lahan) || 0
          );
          setChartData({
            labels,
            datasets: [
              {
                label: 'Luas Lahan (Hektar)',
                data,
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    fetchData();
  }, [komoditas, startDate, endDate]);

  return (
    <div className="flex flex-col items-start border border-neutral-300 p-8">
      <Heading>Jumlah Lahan Tanam Per Komoditas</Heading>
      <Bar options={options} data={chartData} />
    </div>
  );
}
