import dynamic from 'next/dynamic';

const ResponsiveSankey = dynamic(
  () => import('@nivo/sankey').then((m) => m.ResponsiveSankey),
  { ssr: false }
);

const SankeyDiagramCard = ({ title, data }) => {
  console.log('Rendering SankeyDiagramCard:', title, data);
  if (!data || !data.nodes || !data.links) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-[2px] border border-gray-300 bg-white p-4">
        <span>No data available for Sankey diagram</span>
      </div>
    );
  }

  return (
    <div className="mb-8 flex min-h-[500px] flex-col rounded-[2px] border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div
        className="h-[400px] w-full overflow-hidden"
        style={{ position: 'relative' }}
      >
        <ResponsiveSankey
          data={data}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: 'nivo' }}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
        />
      </div>
    </div>
  );
};

export default SankeyDiagramCard;
