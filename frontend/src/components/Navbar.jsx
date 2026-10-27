import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="font-semibold text-slate-900">Uptime Monitor</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
