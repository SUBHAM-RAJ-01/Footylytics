import { NavLink } from 'react-router-dom';
import { FiHome, FiActivity, FiCalendar, FiBarChart2, FiTrendingUp, FiHeart, FiSettings, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAvatarForEmail, getAvatarColor } from '../utils/avatars';

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/live', icon: FiActivity, label: 'Live Scores' },
  { to: '/fixtures', icon: FiCalendar, label: 'Fixtures' },
  { to: '/standings/2001', icon: FiBarChart2, label: 'Standings' },
  { to: '/predictions', icon: FiTrendingUp, label: 'Predictions' },
  { to: '/my-team', icon: FiHeart, label: 'My Team' },
  { to: '/settings', icon: FiSettings, label: 'Settings' }
];

export default function Sidebar() {
  const { user, profile } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 fixed h-[calc(100vh-4rem)]">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-emerald-400'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <NavLink
            to="/settings"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              profile?.is_premium
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400/50 hover:border-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {/* Avatar with Premium Ring */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user.email)} flex items-center justify-center text-white text-xl font-bold shadow-lg ${
                profile?.is_premium ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : ''
              }`}>
                {getAvatarForEmail(user.email)}
              </div>
              {profile?.is_premium && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <FiAward className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.email?.split('@')[0] || 'User'}
              </p>
              <div className="flex items-center space-x-1">
                {profile?.is_premium ? (
                  <>
                    <span className="text-xs font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                      ⭐ Premium
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                )}
              </div>
            </div>
          </NavLink>
        </div>
      )}
    </aside>
  );
}
