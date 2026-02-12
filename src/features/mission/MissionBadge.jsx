const GLOW_CLASSES = {
  'Basic 4': 'badge-glow-basic',
  'React 7': 'badge-glow-react',
  'Next 13': 'badge-glow-next',
};

function MissionBadge({ title }) {
  return (
    <span
      className={`rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800 ${
        GLOW_CLASSES[title] ?? ''
      }`}
    >
      {title}
    </span>
  );
}

export { MissionBadge };
