import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, MessageCircle, AlertTriangle, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Accueil', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'plan', label: 'Plan', icon: ClipboardList, path: '/plan' },
  { key: 'chat', label: 'Assistant', icon: MessageCircle, path: '/chat' },
  { key: 'urgence', label: 'Urgence', icon: AlertTriangle, path: '/urgence' },
  { key: 'apprendre', label: 'Apprendre', icon: BookOpen, path: '/apprendre' },
  { key: 'parametres', label: 'Reglages', icon: Settings, path: '/parametres' },
];

export default function Navigation({ active }) {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 z-40 safe-area-bottom"
      data-testid="bottom-navigation"
    >
      <div className="max-w-3xl mx-auto px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const isUrgence = item.key === 'urgence';
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 min-w-[48px] ${
                isActive
                  ? isUrgence
                    ? 'text-red-600'
                    : 'text-[#0F766E]'
                  : 'text-[#94A3B8] hover:text-[#64748B]'
              }`}
              data-testid={`nav-${item.key}`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? '' : ''}`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
