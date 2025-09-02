import React, { useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ArcElement, Chart as ChartJS, Legend,Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import numberFormat from '@/libs/utils/numberFormat';
import { getJumlahStdbTerbitKomoditasPie } from '@/services/stdb';
import theme from '@/utils/tailwindTheme';

import Heading from '../atoms/Typography/Heading';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

ChartJS.register(ArcElement, Tooltip, Legend);

const palette = [
  theme?.colors?.primary || 'rgba(75, 192, 192, 0.6)',
  theme?.colors?.secondary || 'rgba(153, 102, 255, 0.6)',
  theme?.colors?.tertiary || 'rgba(255, 159, 64, 0.6)',
  theme?.colors?.quaternary || 'rgba(255, 99, 132, 0.6)',
  theme?.colors?.quinary || 'rgba(54, 162, 235, 0.6)',
];

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
};

const JumlahSTDBBerdasarkanKomoditasPieChart = ({
  komoditas,
  startDate,
  endDate,
}) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getJumlahStdbTerbitKomoditasPie({
          komoditas: komoditas || undefined,
          start_date: startDate,
          end_date: endDate,
        });
        if (res.status === 200) {
          const payload = res.data?.data ?? {};
          const labels = Array.isArray(payload?.chart_data?.labels)
            ? payload.chart_data.labels
            : [];
          const values = Array.isArray(payload?.chart_data?.datasets)
            ? payload.chart_data.datasets
            : [];
          const numbers = values.map((n) =>
            typeof n === 'number' ? n : Number(n) || 0
          );
          const colors = numbers.map((_, idx) => palette[idx % palette.length]);
          setChartData({
            labels,
            datasets: [
              {
                label: 'Jumlah STDB',
                data: numbers,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          });

          const tableArr = Array.isArray(payload?.table_data)
            ? payload.table_data
            : [];
          setTableData(tableArr);
        }
      } catch (err) {
        console.error('Failed to load pie chart data:', err);
      }
    };
    fetchData();
  }, [komoditas, startDate, endDate]);

  const columnDefs = useMemo(
    () => [
      { headerName: 'Komoditas', field: 'komoditas' },
      {
        headerName: 'Pekebun',
        field: 'pekebun',
        valueFormatter: (p) =>
          numberFormat(
            typeof p.value === 'number' ? p.value : Number(p.value) || 0
          ),
      },
      {
        headerName: 'Kebun',
        field: 'kebun',
        valueFormatter: (p) =>
          numberFormat(
            typeof p.value === 'number' ? p.value : Number(p.value) || 0
          ),
      },
      {
        headerName: 'Luas (ha)',
        field: 'luas',
        valueFormatter: (p) =>
          numberFormat(
            typeof p.value === 'number' ? p.value : Number(p.value) || 0,
            { maximumFractionDigits: 2 }
          ),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 120,
    }),
    []
  );

  const autoSizeStrategy = useMemo(() => {
    return { type: 'fitCellContents' };
  }, []);

  return (
    <div
      className={`flex flex-col gap-6 w-full h-full border border-gray-300 p-4`}
    >
      <Heading level={5}>Jumlah STDB Terbit Berdasarkan Komoditas</Heading>
      <div className="w-[50%] h-[50%] self-center">
        <Pie width={100} height={100} data={chartData} options={options} />
      </div>
      <div className=" relative mt-4 w-full h-full">
        <AgGridReact
          domLayout="autoHeight"
          rowData={tableData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoSizeStrategy={autoSizeStrategy}
        />
      </div>
    </div>
  );
};

export default JumlahSTDBBerdasarkanKomoditasPieChart;
