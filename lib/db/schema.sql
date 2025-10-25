-- Liahona Everyday Database Schema

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  role_id TEXT,
  created_at BIGINT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  total_time_spent INTEGER DEFAULT 0,
  sources JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  topic_id TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_role_id ON topics(role_id);
CREATE INDEX IF NOT EXISTS idx_topics_completed ON topics(completed);
CREATE INDEX IF NOT EXISTS idx_sessions_topic_id ON study_sessions(topic_id);

-- Insert default roles
INSERT INTO roles (id, label, icon, slug, "order")
VALUES
  ('1', 'Personal', '👤', 'personal', 1),
  ('2', 'Marriage', '💑', 'marriage', 2),
  ('3', 'Parenting', '👨‍👩‍👧‍👦', 'parenting', 3),
  ('4', 'Calling', '📞', 'calling', 4),
  ('5', 'Work', '💼', 'work', 5)
ON CONFLICT (id) DO NOTHING;
