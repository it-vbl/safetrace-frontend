'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { ChevronRight, DownloadCloudIcon } from 'lucide-react';
import { Check } from 'lucide-react';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Select from '@/components/molecules/Select';

import { getSankeyData } from '@/services/penjualan';
import { toast } from 'react-toastify';
import useYearOptions from '@/hooks/useYearOptions';
import { ALL_COLUMN_VALUES, COLUMN_OPTIONS } from '@/constants/columns';

const SankeyPage = () => {
  const yearOptions = useYearOptions();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedColumns, setSelectedColumns] = useState([
    ...ALL_COLUMN_VALUES,
  ]);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({ nodes: [], links: [] });
  const columnDropdownRef = useRef(null);

  const isAllSelected = selectedColumns.length === ALL_COLUMN_VALUES.length;

  const handleColumnToggle = (value) => {
    if (value === 'all') {
      if (isAllSelected) {
        setSelectedColumns([]);
      } else {
        setSelectedColumns([...ALL_COLUMN_VALUES]);
      }
    } else {
      if (selectedColumns.includes(value)) {
        setSelectedColumns(selectedColumns.filter((col) => col !== value));
      } else {
        setSelectedColumns([...selectedColumns, value]);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setIsColumnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const params = {
          year: selectedYear,
          columns: selectedColumns,
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
  }, [selectedYear, selectedColumns]);

  const getFilterLabel = () => {
    if (isAllSelected) return 'Semua';
    if (selectedColumns.length === 0) return 'Pilih Filter';
    if (selectedColumns.length === 1) {
      return (
        COLUMN_OPTIONS.find((opt) => opt.value === selectedColumns[0])?.label ||
        ''
      );
    }
    return `${selectedColumns.length} dipilih`;
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
          <div className="relative w-28 sm:w-36" ref={columnDropdownRef}>
            <div
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="flex min-h-[40px] w-full cursor-pointer items-center justify-between rounded-[6px] border border-neutral5 bg-white px-3 py-2 text-[14px] hover:border-blue6"
            >
              <span
                className={
                  selectedColumns.length === 0 ? 'text-neutral6' : 'text-black'
                }
              >
                {getFilterLabel()}
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isColumnDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isColumnDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-[6px] border bg-white p-2 shadow-lg">
                {/* Semua Option */}
                <div
                  onClick={() => handleColumnToggle('all')}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] hover:bg-gray-100 ${
                    isAllSelected ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isAllSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isAllSelected && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <span>Semua</span>
                </div>
                <div className="my-1 border-t border-gray-100" />
                {/* Individual Options */}
                {COLUMN_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleColumnToggle(option.value)}
                    className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] hover:bg-gray-100 ${
                      selectedColumns.includes(option.value)
                        ? 'bg-blue-50 text-blue-600'
                        : ''
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        selectedColumns.includes(option.value)
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedColumns.includes(option.value) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-24 sm:w-36">
            <Select
              placeholder="Periode"
              options={yearOptions}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              containerClassName="!mb-0"
            />
          </div>
          <Button
            className="!px-2 sm:!px-3"
            icon={<DownloadCloudIcon size={18} />}
            title="Export Excel"
          />
          <Button
            variant="primary"
            size="medium"
            className="!px-2 text-xs sm:!px-4 sm:text-sm"
          >
            Export Pdf
          </Button>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="rounded-[8px] border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
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
            {/* Stage Headers - Vertical on mobile, horizontal on desktop */}
            <div className="hidden sm:mb-6 sm:flex sm:items-center sm:justify-between">
              {ALL_COLUMN_VALUES.map((col, index) => {
                const isVisible =
                  isAllSelected || selectedColumns.includes(col);
                const label =
                  COLUMN_OPTIONS.find((opt) => opt.value === col)?.label || col;
                const isLast = index === ALL_COLUMN_VALUES.length - 1;
                const nextColVisible =
                  !isLast &&
                  (isAllSelected ||
                    selectedColumns.includes(ALL_COLUMN_VALUES[index + 1]));

                if (!isVisible) return null;

                return (
                  <React.Fragment key={col}>
                    <StageHeader label={label} />
                    {!isLast && nextColVisible && <ArrowSpacer />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile: Vertical stage headers */}
            <div className="mb-3 flex flex-col gap-1 sm:hidden">
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap items-center gap-1 text-[10px] text-gray-500">
                  <span className="font-semibold text-gray-700">Alur:</span>
                  {ALL_COLUMN_VALUES.map((col, index) => {
                    const isVisible =
                      isAllSelected || selectedColumns.includes(col);
                    const label =
                      COLUMN_OPTIONS.find((opt) => opt.value === col)?.label ||
                      col;

                    let hasNextVisible = false;
                    for (let i = index + 1; i < ALL_COLUMN_VALUES.length; i++) {
                      if (
                        isAllSelected ||
                        selectedColumns.includes(ALL_COLUMN_VALUES[i])
                      ) {
                        hasNextVisible = true;
                        break;
                      }
                    }

                    if (!isVisible) return null;

                    return (
                      <React.Fragment key={col}>
                        <StageHeaderMobile label={label} />
                        {hasNextVisible && <span>→</span>}
                      </React.Fragment>
                    );
                  })}
                  {selectedColumns.length === 0 && (
                    <span className="italic text-gray-400">
                      Pilih filter untuk melihat alur
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[9px] italic text-gray-400">
                Geser ke kanan untuk melihat selengkapnya
              </p>
            </div>

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

    const connectedNodes = hoveredNode
      ? getConnectedNodes(hoveredNode, links)
      : null;
    const linkGroup = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round');

    linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
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
      .attr('stroke-width', (d) => Math.max(2, d.width))
      .attr('stroke-opacity', (d) => {
        if (hoveredNode) {
          return d.source.id === hoveredNode || d.target.id === hoveredNode
            ? 0.9
            : 0.2;
        }
        if (
          hoveredLink &&
          d.source.id === hoveredLink.source.id &&
          d.target.id === hoveredLink.target.id
        ) {
          return 1;
        }
        return 0.6;
      })
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
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', (d) => {
        if (hoveredNode === d.id) return '#FF6B5F';
        return '#FFFFFF';
      })
      .attr('stroke', '#D1D5DB')
      .attr('stroke-width', (d) => (hoveredNode === d.id ? 2 : 1))
      .attr('rx', 2)
      .attr('opacity', (d) => {
        if (hoveredNode) {
          return connectedNodes?.has(d.id) ? 1 : 0.35;
        }
        if (hoveredLink) {
          return d.id === hoveredLink.source.id ||
            d.id === hoveredLink.target.id
            ? 1
            : 0.35;
        }
        return 1;
      })
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
      .style('opacity', (d) => {
        if (hoveredNode) return connectedNodes?.has(d.id) ? 1 : 0.35;
        if (hoveredLink) {
          return d.id === hoveredLink.source.id ||
            d.id === hoveredLink.target.id
            ? 1
            : 0.35;
        }
        return 1;
      });
  }, [sankeyGraph, dimensions, hoveredNode, hoveredLink, getConnectedNodes]);

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

const StageHeader = ({ label }) => (
  <div className="flex min-w-[60px] items-center justify-center rounded-[4px] bg-[#D5E2F6] px-2 py-1.5 sm:min-w-[120px] sm:px-6 sm:py-2.5">
    <span className="text-[10px] font-semibold text-black sm:text-[13px]">
      {label}
    </span>
  </div>
);

const ArrowSpacer = () => (
  <div className="flex flex-1 items-center justify-center px-1 sm:px-3">
    <div className="h-[1px] flex-1 bg-gray-300"></div>
    <ChevronRight size={12} className="text-gray-400 sm:hidden" />
    <ChevronRight size={16} className="hidden text-gray-400 sm:block" />
  </div>
);

const StageHeaderMobile = ({ label }) => (
  <span className="rounded bg-[#D5E2F6] px-1.5 py-0.5 text-[9px] font-semibold text-gray-700">
    {label}
  </span>
);

export default SankeyPage;
