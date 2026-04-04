interface StandupCardProps {
  label: string;
  value: string;
  color: string;
}

export default function StandupCard({ label, value, color }: StandupCardProps) {
  return (
    <div
      className="standup-card p-5 mb-3"
      style={{
        border: `1px solid ${color}33`,
        background: `${color}08`,
      }}
    >
      <div
        className="text-[0.58rem] tracking-[4px] mb-2"
        style={{ color: `${color}88` }}
      >
        {label}
      </div>
      <div
        className="text-[0.85rem] leading-relaxed"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
