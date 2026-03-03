'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { ChevronLeft } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';

import Heading from '@/components/atoms/Typography/Heading';
import DateRange from '@/components/molecules/DateRange';
import numberFormat from '@/libs/utils/numberFormat';
import { getSidebarStatistics } from '@/services/kebun';
import {
  getBarChartBeratTimbangan,
  getBarChartTotalPenjualan,
  getDonutChartBeratTimbanganPabrik,
} from '@/services/penjualan';
import { setMapviewRightSidebarOpen } from '@/store/slices/app';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RightSidebar = ({
  dateRange = {
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  onDateRangeChange = () => {},
}) => {
  const dispatch = useDispatch();
  const { mapviewRightSidebarOpen } = useSelector((state) => state.app);

  // Chart data states
  const [totalPenjualanData, setTotalPenjualanData] = useState({
    labels: [],
    data: [],
  });
  const [beratTimbanganData, setBeratTimbanganData] = useState({
    labels: [],
    data: [],
  });
  const [beratTimbanganPabrikData, setBeratTimbanganPabrikData] = useState({
    labels: [],
    data: [],
  });
  const [sidebarStats, setSidebarStats] = useState({
    total_alert: 0,
    total_luas_deforestation: 0,
    total_petani: 0,
    total_kebun: 0,
  });
  const [loading, setLoading] = useState(false);

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    onDateRangeChange(newDateRange);
  };

  // Fetch chart data
  const fetchChartData = async () => {
    // Use current year as default date range if not provided
    const startDate =
      dateRange.startDate ||
      new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = dateRange.endDate || new Date().toISOString().split('T')[0];

    setLoading(true);
    try {
      const [
        totalPenjualanRes,
        beratTimbanganRes,
        beratTimbanganPabrikRes,
        sidebarStatsRes,
      ] = await Promise.all([
        getBarChartTotalPenjualan({
          start_date: startDate,
          end_date: endDate,
        }),
        getBarChartBeratTimbangan({
          start_date: startDate,
          end_date: endDate,
        }),
        getDonutChartBeratTimbanganPabrik({
          start_date: startDate,
          end_date: endDate,
        }),
        getSidebarStatistics(), // Fetch sidebar stats
      ]);

      if (totalPenjualanRes?.data?.data) {
        setTotalPenjualanData(totalPenjualanRes.data.data);
      }
      if (beratTimbanganRes?.data?.data) {
        setBeratTimbanganData(beratTimbanganRes.data.data);
      }
      if (beratTimbanganPabrikRes?.data?.data) {
        setBeratTimbanganPabrikData(beratTimbanganPabrikRes.data.data);
      }
      if (sidebarStatsRes?.data?.data) {
        setSidebarStats(sidebarStatsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching chart and statistics data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const statistics = useMemo(
    () => [
      {
        label: 'Total Alert',
        value: sidebarStats.total_alert || 0,
        color: 'text-red-600',
      },
      {
        label: 'Total Area Deforestasi',
        value: sidebarStats.total_luas_deforestation || 0,
        color: 'text-red-600',
      },
      {
        label: 'Total Petani',
        value: sidebarStats.total_petani || 0,
        color: 'text-blue-600',
      },
      {
        label: 'Total Kebun',
        value: sidebarStats.total_kebun || 0,
        color: 'text-blue-600',
      },
    ],
    [sidebarStats]
  );

  // Fetch chart data when component mounts
  useEffect(() => {
    fetchChartData();
  }, []);

  // Fetch chart data when date range changes
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchChartData();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  // Chart 1: Total Penjualan
  const totalPenjualanChartData = useMemo(
    () => ({
      labels: totalPenjualanData.labels || [],
      datasets: [
        {
          label: 'Total Penjualan',
          data: totalPenjualanData.data || [],
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 1,
        },
      ],
    }),
    [totalPenjualanData]
  );

  // Chart 2: Berat Timbangan
  const beratTimbanganChartData = useMemo(
    () => ({
      labels: beratTimbanganData.labels || [],
      datasets: [
        {
          label: 'Berat Timbangan',
          data: beratTimbanganData.data || [],
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 1,
        },
      ],
    }),
    [beratTimbanganData]
  );

  // Chart 3: Berat Timbangan per Pabrik (Donut)
  const beratTimbanganPabrikChartData = useMemo(() => {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#F97316',
    ];

    return {
      labels: beratTimbanganPabrikData.labels || [],
      datasets: [
        {
          label: 'Berat Timbangan',
          data: beratTimbanganPabrikData.data || [],
          backgroundColor: colors.slice(
            0,
            beratTimbanganPabrikData.labels?.length || 0
          ),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }, [beratTimbanganPabrikData]);

  const barChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          grid: { display: true },
          beginAtZero: true,
          ticks: {
            font: {
              size: 10,
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
            size: 10,
          },
          bodyFont: {
            size: 10,
          },
          callbacks: {
            label: function (context) {
              return numberFormat(context.parsed.y);
            },
          },
        },
      },
    }),
    []
  );

  const donutChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
          labels: {
            font: {
              size: 10,
            },
            padding: 10,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          titleFont: {
            size: 10,
          },
          bodyFont: {
            size: 10,
          },
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${numberFormat(value)}`;
            },
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
        className={`absolute transition-all duration-200 ease-in-out ${
          mapviewRightSidebarOpen ? 'right-[276px]' : 'right-[12px]'
        }  top-[16px] z-[500] h-[32px] w-[32px] cursor-pointer justify-end rounded-[4px] border border-gray-300 bg-white`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <ChevronLeft
            className={`${mapviewRightSidebarOpen ? 'rotate-180' : ''}`}
            size={18}
          />
        </div>
      </div>
      <div
        id="right-sidebar"
        className={`floating-scrollbar absolute right-4 top-4 z-[500] !h-[calc(100%-32px)] w-[250px] overflow-y-auto overflow-x-visible rounded-[4px] border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 ease-in-out ${
          mapviewRightSidebarOpen ? 'translate-x-0' : 'translate-x-[200%]'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* PERIODE Section */}
          <div className="flex flex-col gap-3">
            <Heading level={6} className="text-[14px] font-bold text-gray-800">
              PERIODE
            </Heading>
            <DateRange
              value={{
                startDate: dateRange.startDate || '',
                endDate: dateRange.endDate || '',
              }}
              onChange={handleDateRangeChange}
              placeholder="Pilih Periode"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Heading level={6} className="text-[14px] font-bold text-gray-800">
              STATISTIK
            </Heading>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-2">
              {statistics.map((stat, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="mt-1 text-xs font-bold leading-tight text-gray-600">
                    {stat.label}
                  </div>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {numberFormat(stat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 1: Total Penjualan */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Total Penjualan
            </Heading>
            <div className="h-[200px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                <Bar data={totalPenjualanChartData} options={barChartOptions} />
              )}
            </div>
          </div>

          {/* Chart 2: Berat Timbangan */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Berat Timbangan
            </Heading>
            <div className="h-[200px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                <Bar data={beratTimbanganChartData} options={barChartOptions} />
              )}
            </div>
          </div>

          {/* Chart 3: Berat Timbangan per Pabrik (Donut) */}
          <div className="flex flex-col gap-2">
            <Heading
              level={6}
              className="text-[12px] font-semibold text-gray-800"
            >
              Berat Timbangan per Pabrik
            </Heading>
            <div className="h-[250px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                <Doughnut
                  data={beratTimbanganPabrikChartData}
                  options={donutChartOptions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
