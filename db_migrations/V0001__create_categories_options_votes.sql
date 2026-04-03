
CREATE TABLE IF NOT EXISTS t_p7020977_anonymous_questions_.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Tag',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p7020977_anonymous_questions_.options (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES t_p7020977_anonymous_questions_.categories(id),
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p7020977_anonymous_questions_.votes (
  id SERIAL PRIMARY KEY,
  option_id INTEGER REFERENCES t_p7020977_anonymous_questions_.options(id),
  custom_text TEXT,
  category_id INTEGER NOT NULL REFERENCES t_p7020977_anonymous_questions_.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
