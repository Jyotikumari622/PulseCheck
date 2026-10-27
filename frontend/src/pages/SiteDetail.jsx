import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function SiteDetail() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSite = async () => {
    try {
      const { data } = await api.get(`/sites/${id}`);
      setSite(data);
    } catch (err) {
      setError('Failed to load site details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite();
    const interval = setInterval(fetchSite, 60000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-slate-500 text-sm text-center mt-10">Loading...</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-red-600 text-sm text-center mt-10">{error || 'Site not found'}</p>
      </div>
    );
  }

  const chartData = site.checks.map((c) => ({
    time: new Date(c.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    responseTime: c.responseTime,
    status: c.status,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to dashboard
        </Link>

        <div className="flex items-center justify-between mt-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{site.name}</h1>
            <p className="text-sm text-slate-500">{site.url}</p>
          </div>
          <StatusBadge status={site.currentStatus} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Uptime</p>
            <p className="text-lg font-semibold text-slate-900">
              {site.uptimePercentage !== null ? `${site.uptimePercentage}%` : '—'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Total checks</p>
            <p className="text-lg font-semibold text-slate-900">{site.checks.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Last checked</p>
            <p className="text-lg font-semibold text-slate-900">
              {site.lastCheckedAt ? new Date(site.lastCheckedAt).toLocaleTimeString() : '—'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Response time (ms)</h2>
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-400">No checks recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#0f172a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-700 px-5 py-4 border-b border-slate-100">
            Check history
          </h2>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {[...site.checks].reverse().map((check, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                <StatusBadge status={check.status} />
                <span className="text-slate-500">
                  {check.statusCode ?? 'N/A'}
                </span>
                <span className="text-slate-500">
                  {check.responseTime !== null ? `${check.responseTime}ms` : '—'}
                </span>
                <span className="text-slate-400 text-xs">
                  {new Date(check.checkedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
