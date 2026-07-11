import React, { useEffect, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { getJumlahStdbChartBar } from '@/services/stdb';
import theme from '@/utils/tailwindTheme';

import Heading from '../atoms/Typography/Heading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      grid: { display: false },
    },
  },
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
};

const STDBProcessStepChart = ({ komoditas, startDate, endDate }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getJumlahStdbChartBar({
          komoditas: komoditas || undefined,
          start_date: startDate,
          end_date: endDate,
        });
        if (res.status === 200) {
          const payload = res.data?.data ?? {};
          const labels = Array.isArray(payload.labels) ? payload.labels : [];
          const datasetsArr = Array.isArray(payload.datasets)
            ? payload.datasets
            : [];
          const palette = [
            theme?.colors?.primary || 'rgba(75, 192, 192, 0.6)',
            theme?.colors?.secondary || 'rgba(153, 102, 255, 0.6)',
            theme?.colors?.tertiary || 'rgba(255, 159, 64, 0.6)',
          ];
          const datasets = datasetsArr.map((ds, idx) => ({
            label: ds?.label ?? `Dataset ${idx + 1}`,
            data: Array.isArray(ds?.data)
              ? ds.data.map((n) => (typeof n === 'number' ? n : Number(n) || 0))
              : [],
            backgroundColor: palette[idx % palette.length],
            borderColor: palette[idx % palette.length],
            borderWidth: 1,
          }));
          setChartData({ labels, datasets });
        }
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    fetchData();
  }, [komoditas, startDate, endDate]);

  return (
    <div className="flex flex-col gap-6 w-full h-full border border-neutral-300 p-4">
      <Heading level={5}>
        Jumlah STDB berdasarkan tahapan proses penerbitan
      </Heading>
      <div className="w-full h-full ">
        <Bar height={300} options={options} data={chartData} />
      </div>
    </div>
  );
};

export default STDBProcessStepChart;
