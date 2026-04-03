import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STATS = [
  { label: "Всего ответов", value: "195", delta: "+23 за неделю", icon: "Zap", positive: true },
  { label: "Комментариев", value: "50", delta: "+8 за неделю", icon: "MessageCircle", positive: true },
  { label: "Категорий", value: "4", delta: "", icon: "LayoutGrid", positive: true },
  { label: "Участников", value: "38", delta: "+4 за месяц", icon: "Users", positive: true },
];

const CATEGORIES = [
  { id: "1", name: "Что важно в работе", color: "#FBBF24", votes: 74, comments: 19 },
  { id: "2", name: "Частые вопросы", color: "#34D399", votes: 61, comments: 27 },
  { id: "3", name: "Что хотелось бы изменить", color: "#A78BFA", votes: 38, comments: 14 },
  { id: "4", name: "Что не важно", color: "#94A3B8", votes: 22, comments: 9 },
];

const maxVotes = Math.max(...CATEGORIES.map((c) => c.votes));

const RECENT = [
  { cat: "Что важно в работе", type: "vote", text: "Чёткие задачи", time: "5 мин назад" },
  { cat: "Частые вопросы", type: "comment", text: "Не могу найти актуальные регламенты...", time: "12 мин назад" },
  { cat: "Что не важно", type: "vote", text: "Долгие митинги", time: "34 мин назад" },
  { cat: "Что важно в работе", type: "comment", text: "Обратная связь от руководителя — это важно", time: "1 ч назад" },
  { cat: "Что хотелось бы изменить", type: "vote", text: "Скорость процессов", time: "2 ч назад" },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">Аналитика</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Сводка активности по всем категориям</p>
      </div>

      {/* Статы */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="border border-border rounded-xl p-4 bg-card animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={s.icon} size={13} className="text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">{s.value}</div>
            {s.delta && <div className="text-xs text-emerald-400 mt-1">{s.delta}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Активность по категориям */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h2 className="text-sm font-medium text-foreground mb-5">Активность по категориям</h2>
          <div className="flex flex-col gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="group text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="Zap" size={10} />{cat.votes}</span>
                    <span className="flex items-center gap-1"><Icon name="MessageCircle" size={10} />{cat.comments}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.round((cat.votes / maxVotes) * 100)}%`, backgroundColor: cat.color }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Лента активности */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h2 className="text-sm font-medium text-foreground mb-5">Последние события</h2>
          <div className="flex flex-col gap-1">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  r.type === "comment" ? "bg-primary/10" : "bg-amber-500/10"
                }`}>
                  <Icon
                    name={r.type === "comment" ? "MessageCircle" : "Zap"}
                    size={11}
                    className={r.type === "comment" ? "text-primary" : "text-amber-400"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground/70 mb-0.5">{r.cat}</div>
                  <div className="text-xs text-foreground truncate">{r.text}</div>
                </div>
                <span className="text-xs text-muted-foreground/40 flex-shrink-0">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
