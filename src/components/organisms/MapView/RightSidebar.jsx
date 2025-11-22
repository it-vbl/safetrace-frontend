'use client';

import { useEffect, useMemo } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { ChevronLeft } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';

import Heading from '@/components/atoms/Typography/Heading';
import numberFormat from '@/libs/utils/numberFormat';
import { setMapviewRightSidebarOpen } from '@/store/slices/app';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RightSidebar = () => {
  const dispatch = useDispatch();
  const { mapviewRightSidebarOpen } = useSelector((state) => state.app);

  useEffect(() => {
    const rightContainer = document.querySelector('.leaflet-right');
    if (rightContainer) {
      if (mapviewRightSidebarOpen) {
        rightContainer.classList.add('leaflet-right-custom');
      } else {
        rightContainer.classList.remove('leaflet-right-custom');
      }
    }
  }, [mapviewRightSidebarOpen]);

  // Statistics data
  const statistics = useMemo(
    () => [
      {
        label: 'Total Alert',
        value: 1789,
        color: 'text-red-600',
      },
      {
        label: 'Total Area Deforestasi',
        value: 1789,
        color: 'text-red-600',
      },
      {
        label: 'Total Petani',
        value: 3789,
        color: 'text-blue-600',
      },
      {
        label: 'Total Kebun',
        value: 4009,
        color: 'text-blue-600',
      },
    ],
    []
  );

  // Chart 1: Perubahan Area Deforestasi (Years)
  const deforestationAreaChartData = useMemo(
    () => ({
      labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Area Deforestasi',
          data: [1200000, 1700000, 1850000, 2100000, 1800000, 1300000, 500000],
          backgroundColor: '#8B4513',
          borderColor: '#8B4513',
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  // Chart 2: Perubahan Total Alert (Years)
  const totalAlertChartData = useMemo(
    () => ({
      labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Total Alert',
          data: [1200000, 1800000, 1900000, 2100000, 1800000, 1200000, 500000],
          backgroundColor: '#8B4513',
          borderColor: '#8B4513',
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  // Chart 3: Perubahan Area Deforestasi (Months by Year)
  const monthlyDeforestationChartData = useMemo(
    () => ({
      labels: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      datasets: [
        {
          label: '2019',
          data: [
            80000, 90000, 100000, 110000, 120000, 130000, 140000, 130000,
            120000, 110000, 100000, 90000,
          ],
          backgroundColor: '#8B4513',
          borderColor: '#8B4513',
          borderWidth: 1,
        },
        {
          label: '2020',
          data: [
            340000, 150000, 140000, 140000, 150000, 210000, 180000, 160000,
            180000, 160000, 130000, 150000,
          ],
          backgroundColor: '#2F4F4F',
          borderColor: '#2F4F4F',
          borderWidth: 1,
        },
        {
          label: '2021',
          data: [
            120000, 190000, 170000, 130000, 140000, 150000, 330000, 200000,
            150000, 120000, 110000, 100000,
          ],
          backgroundColor: '#20B2AA',
          borderColor: '#20B2AA',
          borderWidth: 1,
        },
        {
          label: '2022',
          data: [
            150000, 160000, 200000, 180000, 270000, 250000, 220000, 300000,
            240000, 130000, 120000, 130000,
          ],
          backgroundColor: '#FF8C00',
          borderColor: '#FF8C00',
          borderWidth: 1,
        },
        {
          label: '2023',
          data: [
            150000, 110000, 100000, 230000, 230000, 160000, 180000, 260000,
            200000, 140000, 120000, 110000,
          ],
          backgroundColor: '#32CD32',
          borderColor: '#32CD32',
          borderWidth: 1,
        },
        {
          label: '2024',
          data: [
            100000, 90000, 80000, 120000, 140000, 130000, 120000, 110000,
            100000, 90000, 80000, 70000,
          ],
          backgroundColor: '#556B2F',
          borderColor: '#556B2F',
          borderWidth: 1,
        },
        {
          label: '2025',
          data: [
            60000, 50000, 40000, 50000, 60000, 50000, 40000, 30000, 20000,
            10000, 5000, 0,
          ],
          backgroundColor: '#DAA520',
          borderColor: '#DAA520',
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { display: true },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
        },
        title: {
          display: false,
        },
      },
    }),
    []
  );

  const singleBarChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: {
              size: 8,
            },
          },
        },
        y: {
          grid: { display: true },
          beginAtZero: true,
          ticks: {
            font: {
              size: 8,
            },
            callback: function (value) {
              return numberFormat(value);
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          titleFont: {
            size: 8,
          },
          bodyFont: {
            size: 8,
          },
        },
      },
    }),
    []
  );

  const monthlyChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: {
              size: 8,
            },
          },
        },
        y: {
          grid: { display: true },
          beginAtZero: true,
          ticks: {
            font: {
              size: 8,
            },
            callback: function (value) {
              return numberFormat(value);
            },
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
          labels: {
            font: {
              size: 8,
            },
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          titleFont: {
            size: 8,
          },
          bodyFont: {
            size: 8,
          },
        },
      },
    }),
    []
  );

  return (
    <>
      <div
        onClick={() =>
          dispatch(setMapviewRightSidebarOpen(!mapviewRightSidebarOpen))
        }
        className={`absolute duration-200 ease-in-out transition-all ${
          mapviewRightSidebarOpen ? 'right-[276px]' : 'right-[12px]'
        }  top-[16px] z-[500] bg-white h-[32px] w-[32px] border border-gray-300 rounded-[4px] justify-end cursor-pointer`}
      >
        <div className="flex w-full h-full items-center justify-center">
          <ChevronLeft
            className={`${mapviewRightSidebarOpen ? 'rotate-180' : ''}`}
            size={18}
          />
        </div>
      </div>
      <div
        id="right-sidebar"
        className={`absolute overflow-x-visible !h-[calc(100%-32px)] right-4 top-4 z-[500] w-[250px] duration-300 ease-in-out transition-all border border-gray-200 bg-white rounded-[4px] p-3 shadow-lg overflow-y-auto floating-scrollbar ${
          mapviewRightSidebarOpen ? 'translate-x-0' : 'translate-x-[200%]'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* STATISTIK Section */}
          <div className="flex flex-col gap-3">
            <Heading level={6} className="text-[14px] font-bold text-gray-800">
              STATISTIK
            </Heading>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-2">
              {statistics.map((stat, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="text-xs font-bold text-gray-600 mt-1 leading-tight">
                    {stat.label}
                  </div>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {numberFormat(stat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 1: Perubahan Area Deforestasi (Years) */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Perubahan Area Deforestasi
            </Heading>
            <div className="h-[200px] w-full">
              <Bar
                data={deforestationAreaChartData}
                options={singleBarChartOptions}
              />
            </div>
          </div>

          {/* Chart 2: Perubahan Total Alert (Years) */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Perubahan Total Alert
            </Heading>
            <div className="h-[200px] w-full">
              <Bar data={totalAlertChartData} options={singleBarChartOptions} />
            </div>
          </div>

          {/* Chart 3: Perubahan Area Deforestasi (Months) */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Perubahan Area Deforestasi
            </Heading>
            <div className="h-[250px] w-full">
              <Bar
                data={monthlyDeforestationChartData}
                options={monthlyChartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
