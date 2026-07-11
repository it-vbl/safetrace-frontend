'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Calendar, DownloadCloudIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DatePicker from '@/components/molecules/DatePicker';
import SelectMultiple from '@/components/molecules/SelectMultiple';
import D3Sankey from '@/components/organisms/D3Sankey';
import {
  downloadSankeyData,
  getListPabrik,
  getSankeyData,
} from '@/services/penjualan';
import { getKelompokTani } from '@/services/referensi';

const SankeyPage = () => {
  const [startDate, setStartDate] = useState(
    moment().subtract(30, 'days').format('DD-MM-YYYY')
  );
  const [endDate, setEndDate] = useState(moment().format('DD-MM-YYYY'));
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const dateDropdownRef = useRef(null);
  const chartRef = useRef(null);

  const [kelompokOptions, setKelompokOptions] = useState([]);
  const [pabrikOptions, setPabrikOptions] = useState([]);
  const [selectedKelompok, setSelectedKelompok] = useState([]);
  const [selectedPabrik, setSelectedPabrik] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [kelompokRes, pabrikRes] = await Promise.all([
          getKelompokTani(),
          getListPabrik(),
        ]);

        if (kelompokRes?.data?.data) {
          const kelompokData =
            kelompokRes.data.data.results || kelompokRes.data.data || [];
          setKelompokOptions(
            kelompokData.map((item) => ({
              label: item.label,
              value: item.value,
            }))
          );
        }

        if (pabrikRes?.data?.data) {
          const pabrikData =
            pabrikRes.data.data.results || pabrikRes.data.data || [];

          const uniquePabrikData = Array.from(
            new Map(
              pabrikData.map((item) => {
                const name = item.nama_pabrik || item.nama;
                return [name, { label: name, value: name }];
              })
            ).values()
          );

          setPabrikOptions(uniquePabrikData);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setIsDateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const params = {
          start_date: startDate,
          end_date: endDate,
          ...(selectedPabrik.length > 0 && {
            pabrik: selectedPabrik,
          }),
          ...(selectedKelompok.length > 0 && {
            kelompok_tani: selectedKelompok,
          }),
        };

        const response = await getSankeyData(params);

        if (response?.data?.data) {
          const { nodes, links } = response.data.data;
          setData({ nodes: nodes || [], links: links || [] });
        } else {
          setData({ nodes: [], links: [] });
        }
      } catch (error) {
        console.error('Failed to fetch sankey data:', error);
        toast.error('Gagal memuat data diagram');
        setIsError(true);
        setData({ nodes: [], links: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    fetchData();
  }, [startDate, endDate, selectedKelompok, selectedPabrik]);

  const handleChangeStartDate = (e) => {
    const newStart = moment(e.target.value);
    const today = moment();
    
    const startToSet = newStart.isAfter(today) ? today : newStart;
    setStartDate(startToSet.format('DD-MM-YYYY'));

    const currentEnd = moment(endDate, 'DD-MM-YYYY');
    if (currentEnd.isBefore(startToSet) || currentEnd.diff(startToSet, 'days') > 31) {
      let newEnd = moment(startToSet).add(30, 'days');
      if (newEnd.isAfter(today)) {
        newEnd = today;
      }
      if (newEnd.isBefore(startToSet)) {
        newEnd = startToSet;
      }
      setEndDate(newEnd.format('DD-MM-YYYY'));
    }
  };

  const handleChangeEndDate = (e) => {
    const newEnd = moment(e.target.value);
    const today = moment();

    const endToSet = newEnd.isAfter(today) ? today : newEnd;
    setEndDate(endToSet.format('DD-MM-YYYY'));

    const currentStart = moment(startDate, 'DD-MM-YYYY');
    if (currentStart.isAfter(endToSet) || endToSet.diff(currentStart, 'days') > 31) {
      const newStart = moment(endToSet).subtract(30, 'days');
      setStartDate(newStart.format('DD-MM-YYYY'));
    }
  };

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    try {
      setIsExporting(true);

      // Temporarily store original styles that might affect capturing
      const originalScrollLeft = chartRef.current.scrollLeft;
      const originalScrollTop = chartRef.current.scrollTop;

      // Capture the canvas using html2canvas
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Handle cross-origin images if any
      });

      // Restore scroll positions if any
      chartRef.current.scrollLeft = originalScrollLeft;
      chartRef.current.scrollTop = originalScrollTop;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Sankey_Diagram_${startDate}_${endDate}.pdf`);
      toast.success('Berhasil mengekspor PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Gagal mengekspor PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      const params = {
        start_date: moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        end_date: moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        ...(selectedPabrik.length > 0 && {
          pabrik: selectedPabrik,
        }),
        ...(selectedKelompok.length > 0 && {
          kelompok_tani: selectedKelompok,
        }),
      };

      const response = await downloadSankeyData(params);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `sankey-diagram-${moment().format('YYYY-MM-DD-HH-mm')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Gagal mengunduh data');
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 sm:gap-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Heading
          level={3}
          className="text-base uppercase tracking-[2px] sm:text-lg"
        >
          SANKEY DIAGRAM
        </Heading>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <SelectMultiple
              placeholder="Pilih Kelompok Tani"
              options={kelompokOptions}
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              selectClassName="!h-[40px] bg-white"
              selectAll="Pilih Semua"
              withCheckbox
            />
          </div>
          <div className="w-48">
            <SelectMultiple
              placeholder="Pilih Pabrik"
              options={pabrikOptions}
              value={selectedPabrik}
              onChange={(e) => setSelectedPabrik(e.target.value)}
              selectClassName="!h-[40px] bg-white"
              selectAll="Pilih Semua"
              withCheckbox
            />
          </div>
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none"
            >
              <Calendar size={18} />
              <span>
                {startDate} - {endDate}
              </span>
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 flex w-72 flex-col gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-lg">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-600">
                    Tanggal Mulai
                  </label>
                  <DatePicker
                    placeholder="Tanggal Mulai"
                    name="start_date"
                    value={startDate}
                    onChange={handleChangeStartDate}
                    inputContainerClassName="!h-[40px]"
                    maxDate={moment().format('YYYY-MM-DD')}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-600">
                    Tanggal Selesai
                  </label>
                  <DatePicker
                    placeholder="Tanggal Selesai"
                    name="end_date"
                    value={endDate}
                    onChange={handleChangeEndDate}
                    inputContainerClassName="!h-[40px]"
                    maxDate={moment().format('YYYY-MM-DD')}
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            className="!px-2 sm:!px-3"
            icon={<DownloadCloudIcon size={18} />}
            title="Export Excel"
            onClick={handleExportExcel}
            isLoading={isExportingExcel}
            disabled={
              isExportingExcel ||
              isExporting ||
              isLoading ||
              isError ||
              data.nodes.length === 0
            }
          />
          <Button
            variant="primary"
            size="medium"
            className="!px-2 text-xs sm:!px-4 sm:text-sm"
            onClick={handleExportPDF}
            isLoading={isExporting}
            disabled={
              isExporting || isLoading || isError || data.nodes.length === 0
            }
          >
            Export Pdf
          </Button>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div
        ref={chartRef}
        className="rounded-[8px] border border-neutral-200 bg-white p-3 shadow-sm sm:p-6"
      >
        {isError ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded bg-neutral-50 text-center sm:h-[400px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error1 text-tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="max-w-[300px]">
              <h3 className="text-sm font-semibold text-neutral-900">
                Gagal Memuat Data
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Terjadi kesalahan saat mengambil data diagram. Silakan coba
                sabarata lagi beberapa saat lagi.
              </p>
            </div>
          </div>
        ) : !isLoading && data.nodes.length === 0 ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded bg-neutral-50 text-center sm:h-[400px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="2" y1="20" x2="22" y2="20" />
                <line x1="6" y1="16" x2="6" y2="10" />
                <line x1="10" y1="16" x2="10" y2="4" />
                <line x1="14" y1="16" x2="14" y2="12" />
                <line x1="18" y1="16" x2="18" y2="8" />
              </svg>
            </div>
            <div className="max-w-[300px]">
              <h3 className="text-sm font-semibold text-neutral-900">
                Data Tidak Tersedia
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Tidak ada data aliran yang ditemukan untuk periode atau filter
                yang dipilih.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Sankey Diagram Container - Responsive with horizontal scroll on mobile */}
            <div
              className={`w-full overflow-x-auto ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              <div className="min-w-[600px] sm:min-w-0">
                <D3Sankey data={data} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SankeyPage;
