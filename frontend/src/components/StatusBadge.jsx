export default function StatusBadge({ status }) {
  const styles = {
    up: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    down: 'bg-red-50 text-red-700 border-red-200',
    unknown: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const dot = {
    up: 'bg-emerald-500',
    down: 'bg-red-500',
    unknown: 'bg-slate-400',
  };

  const label = {
    up: 'Up',
    down: 'Down',
    unknown: 'Pending',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {label[status]}
    </span>
  );
}
