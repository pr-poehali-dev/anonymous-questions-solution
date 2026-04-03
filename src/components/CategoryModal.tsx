import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useRole } from "@/hooks/useRole";

interface Option {
  id: string;
  label: string;
  votes: number;
}

interface CategoryModalProps {
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  onClose: () => void;
}

const CATEGORY_OPTIONS: Record<number, Option[]> = {
  9: [
    { id: "a", label: "Процессы согласования", votes: 12 },
    { id: "b", label: "Скорость обратной связи", votes: 8 },
    { id: "c", label: "Документооборот", votes: 15 },
    { id: "d", label: "Система постановки задач", votes: 6 },
  ],
  10: [
    { id: "a", label: "Как оформить отпуск?", votes: 23 },
    { id: "b", label: "Где найти регламенты?", votes: 17 },
    { id: "c", label: "Как получить доступ к системам?", votes: 19 },
    { id: "d", label: "Как согласовать расходы?", votes: 11 },
  ],
  11: [
    { id: "a", label: "Чёткие задачи и сроки", votes: 31 },
    { id: "b", label: "Поддержка команды", votes: 28 },
    { id: "c", label: "Прозрачность решений", votes: 24 },
    { id: "d", label: "Возможность роста", votes: 19 },
  ],
  12: [
    { id: "a", label: "Длинные совещания", votes: 27 },
    { id: "b", label: "Дублирующие отчёты", votes: 21 },
    { id: "c", label: "Микроменеджмент", votes: 18 },
    { id: "d", label: "Формальные KPI без смысла", votes: 14 },
  ],
};

const DEFAULT_OPTIONS: Option[] = [
  { id: "a", label: "Вариант А", votes: 5 },
  { id: "b", label: "Вариант Б", votes: 3 },
  { id: "c", label: "Вариант В", votes: 7 },
];

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
  const { isAdmin } = useRole();
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [options, setOptions] = useState<Option[]>(
    CATEGORY_OPTIONS[category.id] ?? DEFAULT_OPTIONS
  );

  const totalVotes = options.reduce((s, o) => s + o.votes, 0) + (submitted ? 1 : 0);

  const handleSubmit = () => {
    if (!selected && !custom.trim()) return;
    if (selected) {
      setOptions((prev) =>
        prev.map((o) => (o.id === selected ? { ...o, votes: o.votes + 1 } : o))
      );
    }
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl animate-slide-up mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon name={category.icon} size={15} style={{ color: category.color }} />
            </div>
            <span className="font-medium text-sm text-foreground">{category.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          {!submitted ? (
            <>
              <p className="text-xs text-muted-foreground mb-4">Выберите один из вариантов или напишите свой</p>

              <div className="flex flex-col gap-2 mb-4">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                      selected === opt.id
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-border/80"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                        selected === opt.id ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground block mb-1.5">Свой вариант</label>
                <textarea
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onFocus={() => setSelected(null)}
                  placeholder="Напишите свой ответ..."
                  rows={2}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selected && !custom.trim()}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Отправить ответ
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                <Icon name="Check" size={18} className="text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Ответ принят!</p>
              <p className="text-xs text-muted-foreground">Спасибо за участие</p>
            </div>
          )}

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="ShieldCheck" size={13} className="text-primary" />
                <span className="text-xs font-medium text-primary">Статистика (только для вас)</span>
              </div>
              <div className="flex flex-col gap-2">
                {options.map((opt) => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  return (
                    <div key={opt.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground truncate max-w-[70%]">{opt.label}</span>
                        <span className="text-xs text-foreground font-medium">{opt.votes} · {pct}%</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="text-xs text-muted-foreground/50 mt-1">Всего ответов: {totalVotes}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
