import { NavLink } from 'react-router-dom';
import { MessageSquare, Database, Search, Code2, PanelLeftClose, PanelLeft, Layers } from 'lucide-react';

const links = [
  { to: '/', label: 'Ask', icon: MessageSquare },
  { to: '/ingest', label: 'Ingestion', icon: Database },
  { to: '/services', label: 'Services', icon: Layers },
  { to: '/explore', label: 'Explorer', icon: Search },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen transition-all duration-200`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-5'} py-5 border-b border-gray-800`}>
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/15 rounded-lg">
                <Code2 size={20} className="text-indigo-400" />
              </div>
              <span className="text-lg font-semibold text-gray-100">ServiceLens</span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">Code Intelligence Platform</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft size={20} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-4 space-y-1`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-5 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-600">Groq LLaMA 3.3 70B + pgvector + Neo4j</p>
        </div>
      )}
    </aside>
  );
}
