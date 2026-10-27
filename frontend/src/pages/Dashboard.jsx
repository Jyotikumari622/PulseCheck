import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SiteCard from '../components/SiteCard';
import AddSiteModal from '../components/AddSiteModal';

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchSites = async () => {
    try {
      const { data } = await api.get('/sites');
      setSites(data);
    } catch (err) {
      setError('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
    // Refresh every 60s so status updates without a manual reload
    const interval = setInterval(fetchSites, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this site from monitoring?')) return;
    try {
      await api.delete(`/sites/${id}`);
      setSites((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert('Failed to delete site');
    }
  };

  const handleSiteAdded = (newSite) => {
    // New site won't have uptime stats yet — normalize shape to match list response
    setSites((prev) => [
      {
        _id: newSite._id,
        name: newSite.name,
        url: newSite.url,
        currentStatus: 'unknown',
        lastCheckedAt: null,
        uptimePercentage: null,
        totalChecks: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Monitored Sites</h1>
            <p className="text-sm text-slate-500">
              Checks run automatically every 5 minutes.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            + Add Site
          </button>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && sites.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500 mb-3">No sites yet — add your first one to start monitoring.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-slate-900 font-medium hover:underline text-sm"
            >
              Add a site
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <SiteCard key={site._id} site={site} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {showModal && (
        <AddSiteModal onClose={() => setShowModal(false)} onSiteAdded={handleSiteAdded} />
      )}
    </div>
  );
}
