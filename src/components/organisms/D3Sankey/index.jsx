'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

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
    setSankeyGraph(graph);
  }, [data, dimensions]);

  useEffect(() => {
    if (sankeyGraph.nodes.length === 0) return;

    const { nodes, links } = sankeyGraph;

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
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: {
            type: 'link',
            source: d.source.id,
            target: d.target.id,
            value: d.value,
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
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: {
            type: 'node',
            name: d.id,
            category: d.category,
            value: nodeValue,
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
      className="pointer-events-none absolute z-50 rounded-md border border-neutral-200 bg-white px-3 py-2 shadow-lg"
      style={{
        left: position.left,
        top: position.top,
        minWidth: '160px',
      }}
    >
      {content.type === 'node' ? (
        <>
          <p className="text-sm font-semibold text-neutral-900">{content.name}</p>
          <p className="mt-1 text-xs capitalize text-neutral-500">
            {content.category}
          </p>
          <div className="mt-2 border-t border-neutral-100 pt-2 text-xs text-neutral-600">
            <p>
              Volume: <span className="font-medium">{content.value}</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-neutral-900">
            {content.source} → {content.target}
          </p>
          <div className="mt-2 border-t border-neutral-100 pt-2 text-xs text-neutral-600">
            <p>
              Volume: <span className="font-medium">{content.value}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};


export default D3Sankey;
