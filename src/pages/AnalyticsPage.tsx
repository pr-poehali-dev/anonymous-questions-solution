import Icon from "@/components/ui/icon";

const STATS = [
  { label: "Всего вопросов", value: "102", delta: "+12 за месяц", icon: "MessageSquare", positive: true },
  { label: "Активных", value: "67", delta: "+5 за неделю", icon: "CheckCircle", positive: true },
  { label: "Черновиков", value: "18", delta: "-3 за неделю", icon: "FileText", positive: false },
  { label: "Всего ответов", value: "847", delta: "+104 за месяц", icon: "MessageCircle", positive: true },
];

const WEEKLY_DATA = [
  { day: "Пн", questions: 4, answers: 18 },
  { day: "Вт", questions: 7, answers: 31 },
  { day: "Ср", questions: 3, answers: 12 },
  { day: "Чт", questions: 9, answers: 44 },
  { day: "Пт", questions: 6, answers: 27 },
  { day: "Сб", questions: 2, answers: 8 },
  { day: "Вс", questions: 1, answers: 5 },
];

const TOP_CATEGORIES = [
  { name: "Маркетинг", count: 24, pct: 94 },
  { name: "Финансы", count: 18, pct: 71 },
  { name: "Продажи", count: 15, pct: 59 },
  { name: "Стратегия", count: 13, pct: 51 },
  { name: "Менеджмент", count: 11, pct: 43 },
];

const RECENT_ACTIVITY = [
  { action: "Новый вопрос добавлен", item: "Как привлечь первых клиентов?", time: "2 ч. назад", icon: "Plus" },
  { action: "Получен ответ", item: "Методики расчёта юнит-экономики", time: "4 ч. назад", icon: "MessageCircle" },
  { action: "Статус изменён", item: "CRM системы для малого бизнеса", time: "вчера", icon: "RefreshCw" },
  { action: "Категория создана", item: "Право", time: "вчера", icon: "Tag" },
  { action: "Вопрос архивирован", item: "Правила GDPR для стартапов", time: "2 дня назад", icon: "Archive" },
];

const maxAnswers = Math.max(...WEEKLY_DATA.map((d) => d.answers));

export default function AnalyticsPage() {
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">Аналитика</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Данные за последние 30 дней</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="border border-border rounded-lg p-4 bg-card animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
                <Icon name={stat.icon} size={13} className="text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground mb-1">{stat.value}</div>
            <div className={`text-xs ${stat.positive ? "text-emerald-400" : "text-rose-400"}`}>
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-medium text-foreground mb-4">Активность за неделю</h2>
          <div className="flex items-end gap-2 h-36">
            {WEEKLY_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
                    style={{ height: `${(d.answers / maxAnswers) * 120}px` }}
                    title={`${d.answers} ответов`}
                  />
                  <div
                    className="w-full rounded-sm bg-primary/25"
                    style={{ height: `${(d.questions / 9) * 30}px` }}
                    title={`${d.questions} вопросов`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
              <span className="text-xs text-muted-foreground">Ответы</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary/25" />
              <span className="text-xs text-muted-foreground">Вопросы</span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-medium text-foreground mb-4">Топ категорий</h2>
          <div className="flex flex-col gap-3">
            {TOP_CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 border border-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-medium text-foreground mb-4">Последние события</h2>
          <div className="flex flex-col gap-1">
            {RECENT_ACTIVITY.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0"
              >
                <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name={event.icon} size={13} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground">{event.action}: </span>
                  <span className="text-xs text-foreground">{event.item}</span>
                </div>
                <span className="text-xs text-muted-foreground/60 flex-shrink-0">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
