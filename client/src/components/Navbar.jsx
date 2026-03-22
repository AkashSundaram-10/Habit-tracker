import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Bell, Settings } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const items = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/progress', icon: BarChart3, label: 'Stats' },
    { path: '/reminders', icon: Bell, label: 'Alerts' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
        <div className="flex justify-around items-center h-16">
          {items.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all duration-300 ${
                  active
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-xl" />
                )}
                <div className={`relative transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                  <Icon
                    size={22}
                    className={`transition-all duration-300 ${
                      active ? 'text-violet-400' : ''
                    }`}
                  />
                  {active && (
                    <div className="absolute -inset-1 bg-violet-500/30 blur-lg rounded-full" />
                  )}
                </div>
                <span className={`relative text-xs font-medium transition-all duration-300 ${
                  active ? 'text-violet-400' : ''
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
