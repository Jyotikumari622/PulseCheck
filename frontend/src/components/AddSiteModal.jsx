import { useState } from 'react';
import api from '../api/axios';

export default function AddSiteModal({ onClose, onSiteAdded }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/sites', { name, url });
      onSiteAdded(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Add a site to monitor</h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="My Portfolio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 rounded-lg py-2 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 text-white rounded-lg py-2 font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
