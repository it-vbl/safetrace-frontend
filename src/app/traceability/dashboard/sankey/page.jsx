'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { ChevronRight, DownloadCloudIcon } from 'lucide-react';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Select from '@/components/molecules/Select';

const SankeyPage = () => {
  // Filter states
  const [selectedYear, setSelectedYear] = useState('2022');
  const [selectedColumn, setSelectedColumn] = useState('kolom1');

  // Options
  const yearOptions = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];

  const columnOptions = [
    { value: 'kolom1', label: 'Isi Kolom' },
    { value: 'kolom2', label: 'Kolom 2' },
  ];

  const data = useMemo(
    () => ({
      nodes: [
        // Petani (Level 0)
        { id: 'Agung Nugraha', category: 'petani' },
        { id: 'Fajar Willy', category: 'petani' },
        { id: 'Toto Sutejo', category: 'petani' },
        { id: 'Ryan Desril', category: 'petani' },
        { id: 'Filbert Kusuma', category: 'petani' },
        { id: 'Willy Ahn', category: 'petani' },
        { id: 'Suparto W', category: 'petani' },
        { id: 'Ridwan Harahap', category: 'petani' },
        { id: 'Gusti Wulandari', category: 'petani' },
        { id: 'Rendi Anugrah', category: 'petani' },
        { id: 'Siti Sulastri', category: 'petani' },
        { id: 'Reni Wulandari', category: 'petani' },
        { id: 'Rosida Sukno', category: 'petani' },
        { id: 'Agatha Jung', category: 'petani' },
        { id: 'Hana Halda', category: 'petani' },
        { id: 'Supri Supro', category: 'petani' },

        // Agen (Level 1)
        { id: 'Agen Sawit', category: 'agen' },
        { id: 'Agen Biru Bersamo', category: 'agen' },
        { id: 'Tara Rusly', category: 'agen' },
        { id: 'Agen Sawit Merdeka', category: 'agen' },
        { id: 'Rully Sutisna', category: 'agen' },

        // Koperasi (Level 2)
        { id: 'Koperasi Merah', category: 'koperasi' },
        { id: 'Koperasi Kumpul Jaya', category: 'koperasi' },
        { id: 'Koperasi Sawit Muda', category: 'koperasi' },

        // Pabrik (Level 3)
        { id: 'Andes Agro Indonesia', category: 'pabrik' },
        { id: 'Tebo Plasma Bersama', category: 'pabrik' },
        { id: 'Tasik Raja Jaya', category: 'pabrik' },
        { id: 'Perkebunan Nusantara', category: 'pabrik' },
        { id: 'Mitrasari Prima', category: 'pabrik' },
        { id: 'Bumi Mekar Sari', category: 'pabrik' },
        { id: 'Bina Sawit Bahagia', category: 'pabrik' },
      ],
      links: [
        // Petani to Agen
        { source: 'Agung Nugraha', target: 'Agen Sawit', value: 10 },
        { source: 'Fajar Willy', target: 'Agen Sawit', value: 10 },
        { source: 'Toto Sutejo', target: 'Agen Sawit', value: 10 },
        { source: 'Ryan Desril', target: 'Agen Biru Bersamo', value: 10 },
        { source: 'Filbert Kusuma', target: 'Agen Biru Bersamo', value: 10 },
        { source: 'Willy Ahn', target: 'Agen Biru Bersamo', value: 10 },
        { source: 'Suparto W', target: 'Tara Rusly', value: 10 },
        { source: 'Ridwan Harahap', target: 'Tara Rusly', value: 10 },
        { source: 'Gusti Wulandari', target: 'Tara Rusly', value: 10 },
        { source: 'Rendi Anugrah', target: 'Agen Sawit Merdeka', value: 10 },
        { source: 'Siti Sulastri', target: 'Agen Sawit Merdeka', value: 10 },
        { source: 'Reni Wulandari', target: 'Agen Sawit Merdeka', value: 10 },
        { source: 'Rosida Sukno', target: 'Rully Sutisna', value: 10 },
        { source: 'Agatha Jung', target: 'Rully Sutisna', value: 10 },
        { source: 'Hana Halda', target: 'Rully Sutisna', value: 10 },
        { source: 'Supri Supro', target: 'Rully Sutisna', value: 10 },

        // Agen to Koperasi
        { source: 'Agen Sawit', target: 'Koperasi Merah', value: 15 },
        { source: 'Agen Sawit', target: 'Koperasi Kumpul Jaya', value: 15 },
        { source: 'Agen Biru Bersamo', target: 'Koperasi Merah', value: 30 },
        { source: 'Tara Rusly', target: 'Koperasi Kumpul Jaya', value: 30 },
        {
          source: 'Agen Sawit Merdeka',
          target: 'Koperasi Kumpul Jaya',
          value: 15,
        },
        {
          source: 'Agen Sawit Merdeka',
          target: 'Koperasi Sawit Muda',
          value: 15,
        },
        { source: 'Rully Sutisna', target: 'Koperasi Sawit Muda', value: 40 },

        // Koperasi to Pabrik
        { source: 'Koperasi Merah', target: 'Andes Agro Indonesia', value: 15 },
        { source: 'Koperasi Merah', target: 'Tebo Plasma Bersama', value: 15 },
        { source: 'Koperasi Merah', target: 'Tasik Raja Jaya', value: 15 },
        {
          source: 'Koperasi Kumpul Jaya',
          target: 'Tasik Raja Jaya',
          value: 15,
        },
        {
          source: 'Koperasi Kumpul Jaya',
          target: 'Perkebunan Nusantara',
          value: 15,
        },
        {
          source: 'Koperasi Kumpul Jaya',
          target: 'Mitrasari Prima',
          value: 15,
        },
        {
          source: 'Koperasi Kumpul Jaya',
          target: 'Bumi Mekar Sari',
          value: 15,
        },
        { source: 'Koperasi Sawit Muda', target: 'Bumi Mekar Sari', value: 25 },
        {
          source: 'Koperasi Sawit Muda',
          target: 'Bina Sawit Bahagia',
          value: 30,
        },
      ],
    }),
    []
  );

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading level={3} className="uppercase tracking-[2px]">
          SANKEY DIAGRAM
        </Heading>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <Select
              placeholder="Isi Kolom"
              options={columnOptions}
              value={selectedColumn}
              onChange={(val) => setSelectedColumn(val)}
              containerClassName="!mb-0"
            />
          </div>
          <div className="w-36">
            <Select
              placeholder="Periode"
              options={yearOptions}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              containerClassName="!mb-0"
            />
          </div>
          <Button
            className="!px-2 sm:!px-3"
            icon={<DownloadCloudIcon size={18} />}
            title="Export Excel"
          />
          <Button variant="primary" size="medium">
            Export Pdf
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-[8px] border border-gray-200 bg-white p-6 shadow-sm">
        {/* Stage Headers */}
        <div className="mb-6 flex items-center justify-between">
          <StageHeader label="Petani" />
          <ArrowSpacer />
          <StageHeader label="Agen" />
          <ArrowSpacer />
          <StageHeader label="Koperasi" />
          <ArrowSpacer />
          <StageHeader label="Pabrik" />
        </div>

        {/* Sankey Diagram Container */}
        <div className="w-full overflow-x-auto">
          <D3Sankey data={data} />
        </div>
      </div>
    </div>
  );
};

// D3 Sankey Diagram Component - Clean minimal style matching reference image
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

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: Math.max(650, width * 0.55) });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Find all connected nodes for a given node
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
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Deep clone data
    const sankeyData = {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    };

    const sankeyGenerator = d3Sankey()
      .nodeWidth(140)
      .nodePadding(12)
      .extent([
        [0, 0],
        [width, height - 10],
      ])
      .nodeId((d) => d.id);

    const { nodes, links } = sankeyGenerator(sankeyData);
    const totalValue = links.reduce((sum, l) => sum + l.value, 0);

    // Calculate connected nodes for hover state
    const connectedNodes = hoveredNode
      ? getConnectedNodes(hoveredNode, links)
      : null;

    // --- Draw Links (light gray curves like reference) ---
    const linkGroup = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round');

    linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#E5E7EB') // Light gray like reference
      .attr('stroke-width', (d) => Math.max(2, d.width))
      .attr('stroke-opacity', (d) => {
        if (hoveredNode) {
          return d.source.id === hoveredNode || d.target.id === hoveredNode
            ? 0.9
            : 0.15;
        }
        if (hoveredLink === d) return 1;
        return 0.7;
      })
      .style('cursor', 'pointer')
      .style('transition', 'stroke-opacity 0.2s ease, stroke 0.2s ease')
      .on('mouseenter', function (event, d) {
        setHoveredLink(d);
        d3.select(this).attr('stroke', '#94A3B8');
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
        d3.select(this).attr('stroke', '#E5E7EB');
        setTooltip({ visible: false, x: 0, y: 0, content: null });
      });

    // --- Draw Nodes (white cards with border like reference) ---
    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    // Node Box - White with light gray border
    node
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', '#FFFFFF')
      .attr('stroke', (d) => {
        if (hoveredNode === d.id) return '#3B82F6';
        return '#E5E7EB';
      })
      .attr('stroke-width', (d) => (hoveredNode === d.id ? 2 : 1))
      .attr('rx', 4)
      .attr('opacity', (d) => {
        if (hoveredNode) {
          return connectedNodes?.has(d.id) ? 1 : 0.4;
        }
        if (hoveredLink) {
          return d.id === hoveredLink.source.id ||
            d.id === hoveredLink.target.id
            ? 1
            : 0.4;
        }
        return 1;
      })
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
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

    // --- Text Labels (centered, dark text) ---
    node
      .append('text')
      .attr('x', (d) => (d.x0 + d.x1) / 2)
      .attr('y', (d) => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) => (d.id.length > 18 ? d.id.substring(0, 16) + '...' : d.id))
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#374151')
      .style('pointer-events', 'none')
      .style('opacity', (d) => {
        if (hoveredNode) return connectedNodes?.has(d.id) ? 1 : 0.4;
        if (hoveredLink) {
          return d.id === hoveredLink.source.id ||
            d.id === hoveredLink.target.id
            ? 1
            : 0.4;
        }
        return 1;
      });
  }, [data, dimensions, hoveredNode, hoveredLink, getConnectedNodes]);

  return (
    <div ref={containerRef} className="relative h-full min-h-[650px] w-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />

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

// Tooltip Component
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

// Stage Header Component - Blue background like reference image
const StageHeader = ({ label }) => (
  <div className="flex min-w-[120px] items-center justify-center rounded-[4px] bg-[#D5E2F6] px-6 py-2.5">
    <span className="text-[13px] font-semibold text-black">{label}</span>
  </div>
);

// Arrow Spacer - Clean arrow line like reference
const ArrowSpacer = () => (
  <div className="flex flex-1 items-center justify-center px-3">
    <div className="h-[1px] flex-1 bg-gray-300"></div>
    <ChevronRight size={16} className="text-gray-400" />
  </div>
);

export default SankeyPage;
