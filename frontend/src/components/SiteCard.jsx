import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function SiteCard({ site, onDelete }) {
  const lastChecked = site.lastCheckedAt
    ? new Date(site.lastCheckedAt).toLocaleString()
    : 'Not checked yet';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link to={`/sites/${site._id}`} className="font-semibold text-slate-900 hover:underline">
            {site.name}
          </Link>
          <p className="text-sm text-slate-500 truncate max-w-[220px]">{site.url}</p>
        </div>
        <StatusBadge status={site.currentStatus} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mt-4">
        <div>
          <p className="text-slate-400 text-xs">Uptime</p>
          <p className="font-medium text-slate-900">
            {site.uptimePercentage !== null ? `${site.uptimePercentage}%` : '—'}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Total checks</p>
          <p className="font-medium text-slate-900">{site.totalChecks}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3">Last checked: {lastChecked}</p>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
        <Link
          to={`/sites/${site._id}`}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          View details
        </Link>
        <button
          onClick={() => onDelete(site._id)}
          className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
