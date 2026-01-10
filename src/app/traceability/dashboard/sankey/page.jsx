'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Heading from '@/components/atoms/Typography/Heading';
import Button from '@/components/atoms/Button';
import Select from '@/components/molecules/Select';
import { ArrowRight, ChevronRight, DownloadCloudIcon } from 'lucide-react';

const ResponsiveSankey = dynamic(
  () => import('@nivo/sankey').then((m) => m.ResponsiveSankey),
  { ssr: false }
);

const SankeyPage = () => {
  const data = {
    nodes: [
      // Petani (Level 0)
      { id: 'Agung Nugraha' },
      { id: 'Fajar Willy' },
      { id: 'Toto Sutejo' },
      { id: 'Ryan Desril' },
      { id: 'Filbert Kusuma' },
      { id: 'Willy Ahn' },
      { id: 'Suparto W' },
      { id: 'Ridwan Harahap' },
      { id: 'Gusti Wulandari' },
      { id: 'Rendi Anugrah' },
      { id: 'Siti Sulastri' },
      { id: 'Reni Wulandari' },
      { id: 'Rosida Sukno' },
      { id: 'Agatha Jung' },
      { id: 'Hana Halda' },
      { id: 'Supri Supro' },

      // Agen (Level 1)
      { id: 'Agen Sawit' },
      { id: 'Agen Biru Bersamo' },
      { id: 'Tara Rusly' },
      { id: 'Agen Sawit Merdeka' },
      { id: 'Rully Sutisna' },

      // Koperasi (Level 2)
      { id: 'Koperasi Merah' },
      { id: 'Koperasi Kumpul Jaya' },
      { id: 'Koperasi Sawit Muda' },

      // Pabrik (Level 3)
      { id: 'Andes Agro Indonesia' },
      { id: 'Tebo Plasma Bersama' },
      { id: 'Tasik Raja Jaya' },
      { id: 'Perkebunan Nusantara' },
      { id: 'Mitrasari Prima' },
      { id: 'Bumi Mekar Sari' },
      { id: 'Bina Sawit Bahagia' },
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
      { source: 'Koperasi Kumpul Jaya', target: 'Tasik Raja Jaya', value: 15 },
      {
        source: 'Koperasi Kumpul Jaya',
        target: 'Perkebunan Nusantara',
        value: 15,
      },
      { source: 'Koperasi Kumpul Jaya', target: 'Mitrasari Prima', value: 15 },
      { source: 'Koperasi Kumpul Jaya', target: 'Bumi Mekar Sari', value: 15 },
      { source: 'Koperasi Sawit Muda', target: 'Bumi Mekar Sari', value: 25 },
      {
        source: 'Koperasi Sawit Muda',
        target: 'Bina Sawit Bahagia',
        value: 30,
      },
    ],
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Heading level={3} className="font-bold tracking-tight text-gray-800">
          SANKEY DIAGRAM
        </Heading>
        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select
              placeholder="Isi Kolom"
              options={[{ value: 'kolom1', label: 'Kolom 1' }]}
              containerClassName="!mb-0"
            />
          </div>
          <div className="w-48">
            <Select
              placeholder="Periode"
              options={[{ value: '2022', label: '2022' }]}
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

      <div className="rounded-[8px] border border-gray-200 bg-white p-6 shadow-sm">
        {/* Stage Headers */}
        <div className="mb-10 flex items-center justify-between px-2">
          <StageHeader label="Petani" />
          <ArrowSpacer />
          <StageHeader label="Agen" />
          <ArrowSpacer />
          <StageHeader label="Koperasi" />
          <ArrowSpacer />
          <StageHeader label="Pabrik" />
        </div>

        {/* Sankey Diagram Container */}
        <div className="h-[800px] w-full">
          <ResponsiveSankey
            data={data}
            margin={{ top: 0, right: 10, bottom: 0, left: 10 }}
            align="justify"
            colors={['#f3f4f6', '#dbeafe', '#eff6ff', '#e5e7eb']}
            nodeThickness={200}
            nodeSpacing={12}
            nodeBorderWidth={1}
            nodeBorderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            nodeComponent={CustomNode}
            linkOpacity={0.3}
            linkHoverOthersOpacity={0.1}
            enableLinkGradient={true}
            labelPosition="inside"
            labelOrientation="horizontal"
            labelPadding={16}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.5]],
            }}
            legends={[]}
          />
        </div>
      </div>
    </div>
  );
};

const StageHeader = ({ label }) => (
  <div className="flex w-40 items-center justify-center rounded-[4px] bg-[#D7E3F4] px-6 py-2">
    <span className="text-[14px] font-bold text-[#334155]">{label}</span>
  </div>
);

const ArrowSpacer = () => (
  <div className="flex flex-1 items-center justify-center px-2">
    <div className="h-[1.5px] flex-1 bg-gray-400"></div>
    <ChevronRight size={18} className="text-gray-400" />
  </div>
);

// Custom Node Component to match the design (outlined box with centered text)
const CustomNode = ({
  node,
  x,
  y,
  width,
  height,
  color,
  borderWidth,
  borderColor,
}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        width={width}
        height={height}
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth={1}
        rx={2}
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: '#334155',
          fontSize: '11px',
          fontWeight: '400',
          pointerEvents: 'none',
        }}
      >
        {node.id}
      </text>
    </g>
  );
};

export default SankeyPage;
