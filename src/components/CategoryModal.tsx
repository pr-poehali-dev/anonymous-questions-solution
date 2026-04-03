import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useRole } from "@/hooks/useRole";

const URLS = {
  options: "https://functions.poehali.dev/c0cb3113-03d5-4059-beeb-640fb8fd9c4b",
  vote: "https://functions.poehali.dev/bd2b4020-8479-40cf-aa4d-323bdc075f49",
};

interface Option {
  id: number;
  label: string;
  votes: number;
}

interface CustomAnswer {
  text: string;
  date: string;
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

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
  const { isAdmin } = useRole();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [customAnswers, setCustomAnswers] = useState<CustomAnswer[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`${URLS.options}?category_id=${category.id}`)
      .then((r) => r.json())
      .then((raw) => {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        setOptions(data.options ?? []);
        setCustomAnswers(data.custom_answers ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [category.id]);

  const handleSubmit = async () => {
    if (!selected && !custom.trim()) return;
    setSubmitting(true);
    try {
      await fetch(URLS.vote, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: category.id,
          option_id: selected ?? null,
          custom_text: custom.trim() || null,
        }),
      });
      if (selected) {
        setOptions((prev) =>
          prev.map((o) => (o.id === selected ? { ...o, votes: o.votes + 1 } : o))
        );
        setTotal((t) => t + 1);
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const totalVotes = total;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl animate-slide-up mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
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
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : !submitted ? (
            <>
              <p className="text-xs text-muted-foreground mb-4">Выберите один из вариантов или напишите свой</p>

              <div className="flex flex-col gap-2 mb-4">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSelected(opt.id); setCustom(""); }}
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
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  placeholder="Напишите свой ответ..."
                  rows={2}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={(!selected && !custom.trim()) || submitting}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />}
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

          {isAdmin && !loading && (
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

              {customAnswers.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Свои варианты:</p>
                  <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                    {customAnswers.map((a, i) => (
                      <div key={i} className="text-xs text-muted-foreground bg-secondary/50 rounded px-2.5 py-1.5">
                        {a.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
