import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

type Status = "active" | "draft" | "archived";

interface Question {
  id: number;
  text: string;
  category: string;
  status: Status;
  answers: number;
  date: string;
}

const MOCK_QUESTIONS: Question[] = [
  { id: 1, text: "Как оценить стоимость проекта на начальном этапе?", category: "Финансы", status: "active", answers: 14, date: "02.04.2026" },
  { id: 2, text: "Какие инструменты используете для управления командой?", category: "Менеджмент", status: "active", answers: 9, date: "01.04.2026" },
  { id: 3, text: "Как привлечь первых клиентов без бюджета?", category: "Маркетинг", status: "active", answers: 22, date: "31.03.2026" },
  { id: 4, text: "Правила составления коммерческого предложения", category: "Продажи", status: "draft", answers: 0, date: "30.03.2026" },
  { id: 5, text: "Как выстроить систему лояльности клиентов?", category: "Маркетинг", status: "active", answers: 7, date: "29.03.2026" },
  { id: 6, text: "Методики расчёта юнит-экономики", category: "Финансы", status: "archived", answers: 31, date: "20.03.2026" },
  { id: 7, text: "Как провести грамотный onboarding сотрудника?", category: "HR", status: "active", answers: 5, date: "28.03.2026" },
  { id: 8, text: "CRM системы для малого бизнеса: выбор и внедрение", category: "Технологии", status: "draft", answers: 0, date: "27.03.2026" },
];

const STATUS_LABELS: Record<Status, string> = {
  active: "Активный",
  draft: "Черновик",
  archived: "Архив",
};

const STATUS_COLORS: Record<Status, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  const filtered = MOCK_QUESTIONS.filter((q) => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) || q.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || q.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Вопросы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{MOCK_QUESTIONS.length} вопросов в базе</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={15} />
          Добавить вопрос
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск вопросов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "active", "draft", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {s === "all" ? "Все" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Вопрос</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-32">Категория</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-28">Статус</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-24">Ответов</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-28">Дата</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground text-sm py-12">
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              filtered.map((q, i) => (
                <tr
                  key={q.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-foreground line-clamp-1">{q.text}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{q.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[q.status]}`}>
                      {STATUS_LABELS[q.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted-foreground">{q.answers}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted-foreground">{q.date}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="MoreHorizontal" size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
