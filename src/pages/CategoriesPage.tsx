import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
  color: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Финансы", icon: "TrendingUp", count: 18, color: "#3B82F6" },
  { id: 2, name: "Маркетинг", icon: "Megaphone", count: 24, color: "#10B981" },
  { id: 3, name: "Менеджмент", icon: "Users", count: 11, color: "#8B5CF6" },
  { id: 4, name: "Продажи", icon: "ShoppingCart", count: 15, color: "#F59E0B" },
  { id: 5, name: "HR", icon: "UserCheck", count: 9, color: "#EC4899" },
  { id: 6, name: "Технологии", icon: "Cpu", count: 7, color: "#06B6D4" },
  { id: 7, name: "Право", icon: "Scale", count: 5, color: "#EF4444" },
  { id: 8, name: "Стратегия", icon: "Target", count: 13, color: "#F97316" },
  { id: 9, name: "Что хотелось бы изменить", icon: "Pencil", count: 0, color: "#A78BFA" },
  { id: 10, name: "Частые вопросы", icon: "HelpCircle", count: 0, color: "#34D399" },
  { id: 11, name: "Что важно в работе", icon: "Star", count: 0, color: "#FBBF24" },
  { id: 12, name: "Что не важно", icon: "MinusCircle", count: 0, color: "#94A3B8" },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = MOCK_CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Категории</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{MOCK_CATEGORIES.length} категорий · {total} вопросов</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={15} />
          Создать категорию
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск категорий..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((cat, i) => (
          <div
            key={cat.id}
            className="group border border-border rounded-lg p-4 bg-card hover:border-border/80 hover:bg-muted/20 transition-all cursor-pointer animate-slide-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Icon name={cat.icon} size={17} style={{ color: cat.color }} />
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
                <Icon name="MoreHorizontal" size={15} />
              </button>
            </div>

            <div>
              <div className="font-medium text-sm text-foreground mb-1">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.count} вопросов</div>
            </div>

            <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((cat.count / total) * 100)}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              {Math.round((cat.count / total) * 100)}% от всех вопросов
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground text-sm py-12">
            Категории не найдены
          </div>
        )}
      </div>
    </div>
  );
}