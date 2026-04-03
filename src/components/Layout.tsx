import { Outlet, NavLink } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useRole } from "@/hooks/useRole";

const navItems = [
  { to: "/", label: "Вопросы", icon: "MessageSquare" },
  { to: "/categories", label: "Категории", icon: "Tag" },
  { to: "/analytics", label: "Аналитика", icon: "BarChart2" },
];

export default function Layout() {
  const { role, toggle, isAdmin } = useRole();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 border-r border-border flex flex-col py-6 px-4 gap-2 fixed h-full">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">QBase</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 px-2">
          <button
            onClick={toggle}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs font-medium transition-colors border ${
              isAdmin
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={isAdmin ? "ShieldCheck" : "User"} size={13} />
            {isAdmin ? "Администратор" : "Пользователь"}
            <Icon name="RefreshCw" size={11} className="ml-auto opacity-50" />
          </button>
          <div className="text-xs text-muted-foreground/40">v1.0</div>
        </div>
      </aside>

      <main className="ml-56 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
