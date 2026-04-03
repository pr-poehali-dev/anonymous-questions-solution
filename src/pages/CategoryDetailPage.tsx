import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useRole } from "@/hooks/useRole";

const CATEGORIES: Record<string, {
  name: string; icon: string; color: string; desc: string;
  options: { id: string; emoji: string; label: string }[];
}> = {
  "1": {
    name: "Что хотелось бы изменить",
    icon: "Pencil", color: "#A78BFA",
    desc: "Поделитесь, что мешает работать эффективнее",
    options: [
      { id: "a", emoji: "⚡", label: "Скорость процессов" },
      { id: "b", emoji: "📋", label: "Документооборот" },
      { id: "c", emoji: "💬", label: "Коммуникации" },
      { id: "d", emoji: "🎯", label: "Постановка задач" },
    ],
  },
  "2": {
    name: "Частые вопросы",
    icon: "HelpCircle", color: "#34D399",
    desc: "Что вы чаще всего спрашиваете у коллег",
    options: [
      { id: "a", emoji: "🏖️", label: "Отпуск и отгулы" },
      { id: "b", emoji: "📂", label: "Доступы и системы" },
      { id: "c", emoji: "💰", label: "Расходы и бюджет" },
      { id: "d", emoji: "📌", label: "Регламенты" },
    ],
  },
  "3": {
    name: "Что важно в работе",
    icon: "Star", color: "#FBBF24",
    desc: "Что для вас имеет наибольшее значение",
    options: [
      { id: "a", emoji: "🎯", label: "Чёткие задачи" },
      { id: "b", emoji: "🤝", label: "Поддержка команды" },
      { id: "c", emoji: "🔍", label: "Прозрачность" },
      { id: "d", emoji: "🚀", label: "Рост и развитие" },
    ],
  },
  "4": {
    name: "Что не важно",
    icon: "MinusCircle", color: "#94A3B8",
    desc: "Что можно убрать или сократить без потерь",
    options: [
      { id: "a", emoji: "🗓️", label: "Долгие митинги" },
      { id: "b", emoji: "📊", label: "Лишние отчёты" },
      { id: "c", emoji: "👀", label: "Микроменеджмент" },
      { id: "d", emoji: "📏", label: "Формальные KPI" },
    ],
  },
};

interface Comment {
  id: number;
  text: string;
  time: string;
  isOwn?: boolean;
}

const SEED_COMMENTS: Record<string, Comment[]> = {
  "1": [
    { id: 1, text: "Согласование занимает слишком много времени, особенно на финальном этапе", time: "2 ч. назад" },
    { id: 2, text: "Хотелось бы единый инструмент для всех задач", time: "вчера" },
  ],
  "2": [
    { id: 1, text: "Часто не могу найти актуальные регламенты — всё разбросано по папкам", time: "3 ч. назад" },
  ],
  "3": [
    { id: 1, text: "Для меня важнее всего понимать, как моя работа влияет на общий результат", time: "1 ч. назад" },
    { id: 2, text: "Обратная связь от руководителя — это то, чего не хватает", time: "вчера" },
    { id: 3, text: "Гибкий график сильно помогает концентрироваться", time: "2 дня назад" },
  ],
  "4": [
    { id: 1, text: "Еженедельные статус-митинги на час — это явно лишнее", time: "5 ч. назад" },
  ],
};

export default function CategoryDetailPage() {
  const { id = "1" } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const cat = CATEGORIES[id];

  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({ a: 12, b: 8, c: 15, d: 6 });

  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS[id] ?? []);
  const [commentText, setCommentText] = useState("");

  if (!cat) return null;

  const totalVotes = Object.values(votes).reduce((s, v) => s + v, 0);

  const handleVote = (optId: string) => {
    if (voted) return;
    setSelected(optId);
    setVotes((prev) => ({ ...prev, [optId]: prev[optId] + 1 }));
    setVoted(true);
  };

  const handleComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [
      { id: Date.now(), text, time: "только что", isOwn: true },
      ...prev,
    ]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div
        className="border-b border-border px-8 py-5 flex items-center gap-4"
        style={{ background: `linear-gradient(to right, ${cat.color}08, transparent)` }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${cat.color}20` }}
        >
          <Icon name={cat.icon} size={16} style={{ color: cat.color }} />
        </div>
        <div>
          <h1 className="font-semibold text-foreground text-sm">{cat.name}</h1>
          <p className="text-xs text-muted-foreground">{cat.desc}</p>
        </div>
      </div>

      <div className="px-8 py-6 max-w-xl">

        {/* Мини-ответы */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Быстрый ответ</span>
            {voted && <span className="text-xs text-emerald-400 flex items-center gap-1"><Icon name="Check" size={11} />Принято</span>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cat.options.map((opt) => {
              const pct = totalVotes > 0 ? Math.round((votes[opt.id] / totalVotes) * 100) : 0;
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={voted}
                  className={`relative overflow-hidden text-left rounded-xl border px-4 py-3 transition-all ${
                    isSelected
                      ? "border-primary/50 bg-primary/10"
                      : voted
                      ? "border-border/50 bg-card opacity-60"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/20"
                  }`}
                >
                  {voted && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-10 transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  )}
                  <div className="relative">
                    <div className="text-xl mb-1">{opt.emoji}</div>
                    <div className="text-xs font-medium text-foreground">{opt.label}</div>
                    {voted && (
                      <div className="text-xs text-muted-foreground mt-0.5">{pct}%</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Комментарии */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Комментарии</span>
            <span className="text-xs text-muted-foreground/50">{comments.length}</span>
          </div>

          <div className="flex gap-3 mb-5">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
              placeholder="Напишите комментарий..."
              rows={2}
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="self-end w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Icon name="Send" size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl px-4 py-3 text-sm animate-fade-in ${
                  c.isOwn ? "bg-primary/8 border border-primary/20" : "bg-secondary/60 border border-border/40"
                }`}
              >
                <p className="text-foreground leading-relaxed">{c.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground/60">{c.time}</span>
                  {c.isOwn && <span className="text-xs text-primary/60">Вы</span>}
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground/50 text-sm">
              Пока нет комментариев — будьте первым
            </div>
          )}
        </div>

        {/* Аналитика для admin */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="ShieldCheck" size={13} className="text-primary" />
              <span className="text-xs font-medium text-primary">Детали голосования</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {cat.options.map((opt) => {
                const pct = totalVotes > 0 ? Math.round((votes[opt.id] / totalVotes) * 100) : 0;
                return (
                  <div key={opt.id} className="flex items-center gap-3">
                    <span className="text-base w-6">{opt.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{opt.label}</span>
                        <span className="text-xs font-medium text-foreground">{votes[opt.id]} · {pct}%</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="text-xs text-muted-foreground/40 mt-1">Всего голосов: {totalVotes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
