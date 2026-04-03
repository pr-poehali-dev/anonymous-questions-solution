
INSERT INTO t_p7020977_anonymous_questions_.categories (name, icon, color) VALUES
  ('Что хотелось бы изменить', 'Pencil',     '#A78BFA'),
  ('Частые вопросы',           'HelpCircle', '#34D399'),
  ('Что важно в работе',       'Star',        '#FBBF24'),
  ('Что не важно',             'MinusCircle', '#94A3B8');

INSERT INTO t_p7020977_anonymous_questions_.options (category_id, label)
SELECT c.id, v.label
FROM t_p7020977_anonymous_questions_.categories c,
     LATERAL (
       SELECT unnest(ARRAY[
         CASE c.name
           WHEN 'Что хотелось бы изменить' THEN 'Процессы согласования'
           WHEN 'Частые вопросы'           THEN 'Как оформить отпуск?'
           WHEN 'Что важно в работе'       THEN 'Чёткие задачи и сроки'
           WHEN 'Что не важно'             THEN 'Длинные совещания'
         END,
         CASE c.name
           WHEN 'Что хотелось бы изменить' THEN 'Скорость обратной связи'
           WHEN 'Частые вопросы'           THEN 'Где найти регламенты?'
           WHEN 'Что важно в работе'       THEN 'Поддержка команды'
           WHEN 'Что не важно'             THEN 'Дублирующие отчёты'
         END,
         CASE c.name
           WHEN 'Что хотелось бы изменить' THEN 'Документооборот'
           WHEN 'Частые вопросы'           THEN 'Как получить доступ к системам?'
           WHEN 'Что важно в работе'       THEN 'Прозрачность решений'
           WHEN 'Что не важно'             THEN 'Микроменеджмент'
         END,
         CASE c.name
           WHEN 'Что хотелось бы изменить' THEN 'Система постановки задач'
           WHEN 'Частые вопросы'           THEN 'Как согласовать расходы?'
           WHEN 'Что важно в работе'       THEN 'Возможность роста'
           WHEN 'Что не важно'             THEN 'Формальные KPI без смысла'
         END
       ]) AS label
     ) v
WHERE v.label IS NOT NULL;
