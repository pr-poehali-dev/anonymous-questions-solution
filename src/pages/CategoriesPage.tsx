import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const CATEGORIES = [
  { id: 1, name: "Что хотелось бы изменить", icon: "Pencil", color: "#A78BFA", desc: "Предложения по улучшениям", comments: 14, reactions: 38 },
  { id: 2, name: "Частые вопросы", icon: "HelpCircle", color: "#34D399", desc: "То, что спрашивают чаще всего", comments: 27, reactions: 61 },
  { id: 3, name: "Что важно в работе", icon: "Star", color: "#FBBF24", desc: "Приоритеты и ценности команды", comments: 19, reactions: 74 },
  { id: 4, name: "Что не важно", icon: "MinusCircle", color: "#94A3B8", desc: "Что можно упростить или убрать", comments: 9, reactions: 22 },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground">Категории</h1>
        <p className="text-sm text-muted-foreground mt-1">Выберите тему — оставьте мини-ответ или комментарий</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="group text-left border border-border rounded-xl p-5 bg-card hover:border-primary/30 hover:bg-muted/10 transition-all animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}18` }}
              >
                <Icon name={cat.icon} size={20} style={{ color: cat.color }} />
              </div>
              <Icon
                name="ArrowUpRight"
                size={15}
                className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1"
              />
            </div>

            <div className="mb-3">
              <div className="font-medium text-foreground mb-1">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.desc}</div>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="MessageCircle" size={12} />
                {cat.comments} комментариев
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="Zap" size={12} />
                {cat.reactions} ответов
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
