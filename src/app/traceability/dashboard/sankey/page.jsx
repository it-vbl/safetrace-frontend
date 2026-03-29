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
    setStartDate(moment(e.target.value).format('DD-MM-YYYY'));
  };

  const handleChangeEndDate = (e) => {
    setEndDate(moment(e.target.value).format('DD-MM-YYYY'));
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
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <Calendar size={18} />
              <span>
                {startDate} - {endDate}
              </span>
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 flex w-72 flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Tanggal Mulai
                  </label>
                  <DatePicker
                    placeholder="Tanggal Mulai"
                    name="start_date"
                    value={startDate}
                    onChange={handleChangeStartDate}
                    inputContainerClassName="!h-[40px]"
                    maxDate={moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                    minDate={moment(endDate, 'DD-MM-YYYY')
                      .subtract(31, 'days')
                      .format('YYYY-MM-DD')}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Tanggal Selesai
                  </label>
                  <DatePicker
                    placeholder="Tanggal Selesai"
                    name="end_date"
                    value={endDate}
                    onChange={handleChangeEndDate}
                    inputContainerClassName="!h-[40px]"
                    minDate={moment(startDate, 'DD-MM-YYYY').format(
                      'YYYY-MM-DD'
                    )}
                    maxDate={moment(startDate, 'DD-MM-YYYY')
                      .add(31, 'days')
                      .format('YYYY-MM-DD')}
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
        className="rounded-[8px] border border-gray-200 bg-white p-3 shadow-sm sm:p-6"
      >
        {isError ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded bg-gray-50 text-center sm:h-[400px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
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
              <h3 className="text-sm font-semibold text-gray-900">
                Gagal Memuat Data
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Terjadi kesalahan saat mengambil data diagram. Silakan coba
                sabarata lagi beberapa saat lagi.
              </p>
            </div>
          </div>
        ) : !isLoading && data.nodes.length === 0 ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded bg-gray-50 text-center sm:h-[400px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
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
              <h3 className="text-sm font-semibold text-gray-900">
                Data Tidak Tersedia
              </h3>
              <p className="mt-1 text-xs text-gray-500">
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

const D3Sankey = ({ data }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });
  const [sankeyGraph, setSankeyGraph] = useState({ nodes: [], links: [] });
  const totalValueRef = useRef(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        const isMobile = width < 640;
        const minHeight = isMobile ? 500 : 650;
        const heightRatio = isMobile ? 0.8 : 0.55;
        setDimensions({
          width: Math.max(width, 320),
          height: Math.max(minHeight, width * heightRatio),
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Close dropdown when clicking outside

  const getConnectedNodes = useCallback((nodeId, links) => {
    const connected = new Set([nodeId]);

    const findUpstream = (id) => {
      links.forEach((link) => {
        const targetId =
          typeof link.target === 'object' ? link.target.id : link.target;
        const sourceId =
          typeof link.source === 'object' ? link.source.id : link.source;
        if (targetId === id && !connected.has(sourceId)) {
          connected.add(sourceId);
          findUpstream(sourceId);
        }
      });
    };

    const findDownstream = (id) => {
      links.forEach((link) => {
        const targetId =
          typeof link.target === 'object' ? link.target.id : link.target;
        const sourceId =
          typeof link.source === 'object' ? link.source.id : link.source;
        if (sourceId === id && !connected.has(targetId)) {
          connected.add(targetId);
          findDownstream(targetId);
        }
      });
    };

    findUpstream(nodeId);
    findDownstream(nodeId);
    return connected;
  }, []);

  useEffect(() => {
    if (
      !dimensions.width ||
      !dimensions.height ||
      !data ||
      data.nodes.length === 0
    )
      return;

    const { width, height } = dimensions;

    const sankeyData = {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    };

    const isMobile = width < 640;
    const nodeWidth = isMobile ? 90 : 140;
    const nodePadding = isMobile ? 4 : 8;

    const sankeyGenerator = d3Sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [0, 0],
        [width, height - 10],
      ])
      .nodeId((d) => d.id);

    const graph = sankeyGenerator(sankeyData);
    totalValueRef.current = graph.links.reduce((sum, l) => sum + l.value, 0);
    setSankeyGraph(graph);
  }, [data, dimensions]);

  useEffect(() => {
    if (sankeyGraph.nodes.length === 0) return;

    const { nodes, links } = sankeyGraph;
    const totalValue = totalValueRef.current;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const linkGroup = svg.append('g').attr('fill', 'none');

    linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'sankey-link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', (d) => Math.max(2, d.width))
      .attr('stroke-opacity', 0.5)
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        setHoveredLink({
          source: { id: d.source.id },
          target: { id: d.target.id },
          value: d.value,
        });
        const percentage = ((d.value / totalValue) * 100).toFixed(1);
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: {
            type: 'link',
            source: d.source.id,
            target: d.target.id,
            value: d.value,
            percentage,
          },
        });
      })
      .on('mousemove', function (event) {
        setTooltip((prev) => ({ ...prev, x: event.pageX, y: event.pageY }));
      })
      .on('mouseleave', function () {
        setHoveredLink(null);
        setTooltip({ visible: false, x: 0, y: 0, content: null });
      });

    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node
      .append('rect')
      .attr('class', 'sankey-node')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => Math.max(1, d.y1 - d.y0))
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#D1D5DB')
      .attr('stroke-width', 1)
      .attr('opacity', 1)
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        setHoveredNode(d.id);
        const nodeValue = d.value || 0;
        const percentage = ((nodeValue / totalValue) * 100).toFixed(1);
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: {
            type: 'node',
            name: d.id,
            category: d.category,
            value: nodeValue,
            percentage,
            sourceLinks: d.sourceLinks?.length || 0,
            targetLinks: d.targetLinks?.length || 0,
          },
        });
      })
      .on('mousemove', function (event) {
        setTooltip((prev) => ({ ...prev, x: event.pageX, y: event.pageY }));
      })
      .on('mouseleave', function () {
        setHoveredNode(null);
        setTooltip({ visible: false, x: 0, y: 0, content: null });
      });

    const isMobile = dimensions.width < 640;
    const fontSize = isMobile ? '8px' : '11px';
    const maxChars = isMobile ? 10 : 18;

    node
      .append('text')
      .attr('class', 'sankey-node-text')
      .attr('x', (d) => (d.x0 + d.x1) / 2)
      .attr('y', (d) => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) =>
        d.id.length > maxChars ? d.id.substring(0, maxChars - 2) + '...' : d.id
      )
      .style('font-size', fontSize)
      .style('font-weight', '400')
      .style('fill', '#1F2937')
      .style('pointer-events', 'none')
      .style('transition', 'opacity 0.3s ease')
      .style('opacity', 1);
  }, [sankeyGraph, dimensions]);

  // Handle hover visual updates (without remounting elements)
  useEffect(() => {
    if (!svgRef.current || sankeyGraph.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { links } = sankeyGraph;

    const connectedNodes = hoveredNode
      ? getConnectedNodes(hoveredNode, links)
      : null;

    svg
      .selectAll('.sankey-link')
      .attr('stroke', (d) => {
        if (hoveredNode) {
          if (d.source.id === hoveredNode || d.target.id === hoveredNode) {
            return '#FFA49E';
          }
        }
        if (
          hoveredLink &&
          d.source.id === hoveredLink.source.id &&
          d.target.id === hoveredLink.target.id
        ) {
          return '#FFA49E';
        }
        return '#E5E7EB';
      })
      .attr('stroke-opacity', (d) => {
        if (hoveredNode) {
          return d.source.id === hoveredNode || d.target.id === hoveredNode
            ? 0.9
            : 0.1;
        }
        if (
          hoveredLink &&
          d.source.id === hoveredLink.source.id &&
          d.target.id === hoveredLink.target.id
        ) {
          return 0.9;
        }
        if (hoveredLink) return 0.1;
        return 0.5;
      });

    svg
      .selectAll('.sankey-node')
      .attr('fill', (d) => (hoveredNode === d.id ? '#FF6B5F' : '#FFFFFF'))
      .attr('stroke-width', (d) => (hoveredNode === d.id ? 2 : 1))
      .attr('opacity', (d) => {
        if (hoveredNode) {
          return connectedNodes?.has(d.id) ? 1 : 0.2;
        }
        if (hoveredLink) {
          return d.id === hoveredLink.source.id ||
            d.id === hoveredLink.target.id
            ? 1
            : 0.2;
        }
        return 1;
      });

    svg.selectAll('.sankey-node-text').style('opacity', (d) => {
      if (hoveredNode) return connectedNodes?.has(d.id) ? 1 : 0.2;
      if (hoveredLink) {
        return d.id === hoveredLink.source.id || d.id === hoveredLink.target.id
          ? 1
          : 0.2;
      }
      return 1;
    });
  }, [hoveredNode, hoveredLink, sankeyGraph, getConnectedNodes]);

  const handleContainerMouseLeave = useCallback(() => {
    setHoveredNode(null);
    setHoveredLink(null);
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onMouseLeave={handleContainerMouseLeave}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseLeave={handleContainerMouseLeave}
      />

      {/* Tooltip */}
      {tooltip.visible && tooltip.content && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          content={tooltip.content}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

const Tooltip = ({ x, y, content, containerRef }) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let left = x - rect.left + 15;
    let top = y - rect.top - 10;

    if (left + 200 > rect.width) left = x - rect.left - 210;
    if (top < 0) top = 10;

    setPosition({ left, top });
  }, [x, y, containerRef]);

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg"
      style={{
        left: position.left,
        top: position.top,
        minWidth: '160px',
      }}
    >
      {content.type === 'node' ? (
        <>
          <p className="text-sm font-semibold text-gray-900">{content.name}</p>
          <p className="mt-1 text-xs capitalize text-gray-500">
            {content.category}
          </p>
          <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-600">
            <p>
              Volume: <span className="font-medium">{content.value}</span>
            </p>
            <p>
              % Total:{' '}
              <span className="font-medium">{content.percentage}%</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-gray-900">
            {content.source} → {content.target}
          </p>
          <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-600">
            <p>
              Volume: <span className="font-medium">{content.value}</span>
            </p>
            <p>
              % Total:{' '}
              <span className="font-medium">{content.percentage}%</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SankeyPage;
