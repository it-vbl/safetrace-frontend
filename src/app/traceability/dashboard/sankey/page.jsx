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
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedColumn, setSelectedColumn] = useState('all');

  const yearOptions = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];

  const columnOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'petani', label: 'Petani' },
    { value: 'agen', label: 'Agen' },
    { value: 'koperasi', label: 'Koperasi' },
    { value: 'pabrik', label: 'Pabrik' },
  ];

  const baseNodes = [
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
    { id: 'Bambang Sutrisno', category: 'petani' },
    { id: 'Eko Prasetyo', category: 'petani' },
    { id: 'Dewi Lestari', category: 'petani' },
    { id: 'Ahmad Fauzi', category: 'petani' },
    { id: 'Sri Wahyuni', category: 'petani' },
    { id: 'Joko Widodo', category: 'petani' },
    { id: 'Ratna Sari', category: 'petani' },
    { id: 'Budi Santoso', category: 'petani' },
    { id: 'Agen Sawit', category: 'agen' },
    { id: 'Agen Biru Bersamo', category: 'agen' },
    { id: 'Tara Rusly', category: 'agen' },
    { id: 'Agen Sawit Merdeka', category: 'agen' },
    { id: 'Rully Sutisna', category: 'agen' },
    { id: 'Agen Makmur Jaya', category: 'agen' },
    { id: 'Agen Sejahtera', category: 'agen' },
    { id: 'Agen Subur Mandiri', category: 'agen' },
    { id: 'Koperasi Merah', category: 'koperasi' },
    { id: 'Koperasi Kumpul Jaya', category: 'koperasi' },
    { id: 'Koperasi Sawit Muda', category: 'koperasi' },
    { id: 'Koperasi Hijau Lestari', category: 'koperasi' },
    { id: 'Koperasi Tani Makmur', category: 'koperasi' },
    { id: 'Koperasi Bersatu', category: 'koperasi' },
    { id: 'Andes Agro Indonesia', category: 'pabrik' },
    { id: 'Tebo Plasma Bersama', category: 'pabrik' },
    { id: 'Tasik Raja Jaya', category: 'pabrik' },
    { id: 'Perkebunan Nusantara', category: 'pabrik' },
    { id: 'Mitrasari Prima', category: 'pabrik' },
    { id: 'Bumi Mekar Sari', category: 'pabrik' },
    { id: 'Bina Sawit Bahagia', category: 'pabrik' },
    { id: 'Sawit Mas Sejahtera', category: 'pabrik' },
    { id: 'Agro Lestari Mandiri', category: 'pabrik' },
    { id: 'Palm Oil Industries', category: 'pabrik' },
  ];

  const baseLinks = [
    { source: 'Agung Nugraha', target: 'Agen Sawit', value: 12 },
    { source: 'Agung Nugraha', target: 'Agen Makmur Jaya', value: 8 },
    { source: 'Fajar Willy', target: 'Agen Sawit', value: 15 },
    { source: 'Toto Sutejo', target: 'Agen Sawit', value: 10 },
    { source: 'Toto Sutejo', target: 'Agen Biru Bersamo', value: 5 },
    { source: 'Ryan Desril', target: 'Agen Biru Bersamo', value: 12 },
    { source: 'Filbert Kusuma', target: 'Agen Biru Bersamo', value: 10 },
    { source: 'Filbert Kusuma', target: 'Agen Sejahtera', value: 8 },
    { source: 'Willy Ahn', target: 'Agen Biru Bersamo', value: 10 },
    { source: 'Suparto W', target: 'Tara Rusly', value: 12 },
    { source: 'Suparto W', target: 'Agen Subur Mandiri', value: 6 },
    { source: 'Ridwan Harahap', target: 'Tara Rusly', value: 14 },
    { source: 'Gusti Wulandari', target: 'Tara Rusly', value: 10 },
    { source: 'Rendi Anugrah', target: 'Agen Sawit Merdeka', value: 12 },
    { source: 'Rendi Anugrah', target: 'Agen Makmur Jaya', value: 6 },
    { source: 'Siti Sulastri', target: 'Agen Sawit Merdeka', value: 10 },
    { source: 'Reni Wulandari', target: 'Agen Sawit Merdeka', value: 10 },
    { source: 'Rosida Sukno', target: 'Rully Sutisna', value: 12 },
    { source: 'Agatha Jung', target: 'Rully Sutisna', value: 10 },
    { source: 'Agatha Jung', target: 'Agen Sejahtera', value: 5 },
    { source: 'Hana Halda', target: 'Rully Sutisna', value: 10 },
    { source: 'Supri Supro', target: 'Rully Sutisna', value: 12 },
    { source: 'Bambang Sutrisno', target: 'Agen Makmur Jaya', value: 18 },
    { source: 'Eko Prasetyo', target: 'Agen Makmur Jaya', value: 14 },
    { source: 'Eko Prasetyo', target: 'Agen Sejahtera', value: 6 },
    { source: 'Dewi Lestari', target: 'Agen Sejahtera', value: 16 },
    { source: 'Ahmad Fauzi', target: 'Agen Sejahtera', value: 12 },
    { source: 'Sri Wahyuni', target: 'Agen Subur Mandiri', value: 18 },
    { source: 'Joko Widodo', target: 'Agen Subur Mandiri', value: 20 },
    { source: 'Ratna Sari', target: 'Agen Subur Mandiri', value: 14 },
    { source: 'Budi Santoso', target: 'Agen Subur Mandiri', value: 12 },
    { source: 'Budi Santoso', target: 'Rully Sutisna', value: 8 },
    { source: 'Agen Sawit', target: 'Koperasi Merah', value: 20 },
    { source: 'Agen Sawit', target: 'Koperasi Kumpul Jaya', value: 15 },
    { source: 'Agen Sawit', target: 'Koperasi Hijau Lestari', value: 7 },
    { source: 'Agen Biru Bersamo', target: 'Koperasi Merah', value: 25 },
    { source: 'Agen Biru Bersamo', target: 'Koperasi Bersatu', value: 12 },
    { source: 'Tara Rusly', target: 'Koperasi Kumpul Jaya', value: 20 },
    { source: 'Tara Rusly', target: 'Koperasi Tani Makmur', value: 16 },
    { source: 'Agen Sawit Merdeka', target: 'Koperasi Kumpul Jaya', value: 15 },
    { source: 'Agen Sawit Merdeka', target: 'Koperasi Sawit Muda', value: 17 },
    { source: 'Rully Sutisna', target: 'Koperasi Sawit Muda', value: 30 },
    { source: 'Rully Sutisna', target: 'Koperasi Tani Makmur', value: 22 },
    { source: 'Agen Makmur Jaya', target: 'Koperasi Hijau Lestari', value: 28 },
    { source: 'Agen Makmur Jaya', target: 'Koperasi Bersatu', value: 18 },
    { source: 'Agen Sejahtera', target: 'Koperasi Tani Makmur', value: 25 },
    { source: 'Agen Sejahtera', target: 'Koperasi Hijau Lestari', value: 22 },
    { source: 'Agen Subur Mandiri', target: 'Koperasi Bersatu', value: 35 },
    { source: 'Agen Subur Mandiri', target: 'Koperasi Sawit Muda', value: 35 },
    { source: 'Koperasi Merah', target: 'Andes Agro Indonesia', value: 18 },
    { source: 'Koperasi Merah', target: 'Tebo Plasma Bersama', value: 15 },
    { source: 'Koperasi Merah', target: 'Tasik Raja Jaya', value: 12 },
    { source: 'Koperasi Kumpul Jaya', target: 'Tasik Raja Jaya', value: 15 },
    {
      source: 'Koperasi Kumpul Jaya',
      target: 'Perkebunan Nusantara',
      value: 18,
    },
    { source: 'Koperasi Kumpul Jaya', target: 'Mitrasari Prima', value: 17 },
    { source: 'Koperasi Sawit Muda', target: 'Bumi Mekar Sari', value: 30 },
    { source: 'Koperasi Sawit Muda', target: 'Bina Sawit Bahagia', value: 28 },
    { source: 'Koperasi Sawit Muda', target: 'Sawit Mas Sejahtera', value: 24 },
    {
      source: 'Koperasi Hijau Lestari',
      target: 'Agro Lestari Mandiri',
      value: 25,
    },
    {
      source: 'Koperasi Hijau Lestari',
      target: 'Palm Oil Industries',
      value: 20,
    },
    {
      source: 'Koperasi Hijau Lestari',
      target: 'Andes Agro Indonesia',
      value: 12,
    },
    {
      source: 'Koperasi Tani Makmur',
      target: 'Palm Oil Industries',
      value: 28,
    },
    {
      source: 'Koperasi Tani Makmur',
      target: 'Sawit Mas Sejahtera',
      value: 20,
    },
    {
      source: 'Koperasi Tani Makmur',
      target: 'Perkebunan Nusantara',
      value: 15,
    },
    { source: 'Koperasi Bersatu', target: 'Agro Lestari Mandiri', value: 30 },
    { source: 'Koperasi Bersatu', target: 'Mitrasari Prima', value: 18 },
    { source: 'Koperasi Bersatu', target: 'Tebo Plasma Bersama', value: 17 },
  ];

  const data = useMemo(() => {
    const yearMultiplier = {
      2020: 0.6,
      2021: 0.75,
      2022: 0.85,
      2023: 0.95,
      2024: 1.0,
    };

    const multiplier = yearMultiplier[selectedYear] || 1;

    if (selectedColumn === 'all') {
      return {
        nodes: baseNodes,
        links: baseLinks.map((link) => ({
          ...link,
          value: Math.round(link.value * multiplier),
        })),
      };
    }

    const relevantNodes = new Set();
    const filteredLinks = [];

    baseLinks.forEach((link) => {
      const sourceNode = baseNodes.find((n) => n.id === link.source);
      const targetNode = baseNodes.find((n) => n.id === link.target);

      if (
        sourceNode?.category === selectedColumn ||
        targetNode?.category === selectedColumn
      ) {
        relevantNodes.add(link.source);
        relevantNodes.add(link.target);
        filteredLinks.push({
          ...link,
          value: Math.round(link.value * multiplier),
        });
      }
    });

    const filteredNodes = baseNodes.filter((node) =>
      relevantNodes.has(node.id)
    );

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }, [selectedColumn, selectedYear]);

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
          <div className="w-28 sm:w-36">
            <Select
              placeholder="Filter"
              options={columnOptions}
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              containerClassName="!mb-0"
            />
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
        {/* Stage Headers - Vertical on mobile, horizontal on desktop */}
        <div className="hidden sm:mb-6 sm:flex sm:items-center sm:justify-between">
          <StageHeader label="Petani" />
          <ArrowSpacer />
          <StageHeader label="Agen" />
          <ArrowSpacer />
          <StageHeader label="Koperasi" />
          <ArrowSpacer />
          <StageHeader label="Pabrik" />
        </div>

        {/* Mobile: Vertical stage headers */}
        <div className="mb-3 flex flex-col gap-1 sm:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="font-semibold text-gray-700">Alur:</span>
              <StageHeaderMobile label="Petani" />
              <span>→</span>
              <StageHeaderMobile label="Agen" />
              <span>→</span>
              <StageHeaderMobile label="Koperasi" />
              <span>→</span>
              <StageHeaderMobile label="Pabrik" />
            </div>
          </div>
          <p className="text-[9px] italic text-gray-400">
            Geser ke kanan untuk melihat selengkapnya
          </p>
        </div>

        {/* Sankey Diagram Container - Responsive with horizontal scroll on mobile */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-0">
            <D3Sankey data={data} />
          </div>
        </div>
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

    // --- Text Labels (centered, dark text) - Responsive ---
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
