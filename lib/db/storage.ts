import { sql } from '@vercel/postgres';
import { Topic, Role, StudySession } from '../types';

/**
 * Database storage layer using Vercel Postgres
 * This is used in production on Vercel
 */

export const dbStorage = {
  // Topics
  getTopics: async (): Promise<Topic[]> => {
    const { rows } = await sql`
      SELECT
        id,
        title,
        description,
        category,
        role_id as "roleId",
        created_at as "createdAt",
        completed,
        total_time_spent as "totalTimeSpent",
        sources
      FROM topics
      ORDER BY created_at DESC
    `;
    return rows as Topic[];
  },

  getTopic: async (id: string): Promise<Topic | null> => {
    const { rows } = await sql`
      SELECT
        id,
        title,
        description,
        category,
        role_id as "roleId",
        created_at as "createdAt",
        completed,
        total_time_spent as "totalTimeSpent",
        sources
      FROM topics
      WHERE id = ${id}
    `;
    return rows[0] as Topic || null;
  },

  saveTopic: async (topic: Topic): Promise<void> => {
    const { id, title, description, category, roleId, createdAt, completed, totalTimeSpent, sources } = topic;

    // Upsert (insert or update)
    await sql`
      INSERT INTO topics (id, title, description, category, role_id, created_at, completed, total_time_spent, sources)
      VALUES (${id}, ${title}, ${description}, ${category}, ${roleId || null}, ${createdAt}, ${completed}, ${totalTimeSpent}, ${JSON.stringify(sources)}::jsonb)
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        role_id = EXCLUDED.role_id,
        completed = EXCLUDED.completed,
        total_time_spent = EXCLUDED.total_time_spent,
        sources = EXCLUDED.sources,
        updated_at = CURRENT_TIMESTAMP
    `;
  },

  deleteTopic: async (topicId: string): Promise<void> => {
    await sql`DELETE FROM topics WHERE id = ${topicId}`;
  },

  // Study Sessions
  getSessions: async (): Promise<StudySession[]> => {
    const { rows } = await sql`
      SELECT
        topic_id as "topicId",
        start_time as "startTime",
        end_time as "endTime",
        duration
      FROM study_sessions
      ORDER BY start_time DESC
    `;
    return rows as StudySession[];
  },

  saveSession: async (session: StudySession): Promise<void> => {
    const { topicId, startTime, endTime, duration } = session;
    await sql`
      INSERT INTO study_sessions (topic_id, start_time, end_time, duration)
      VALUES (${topicId}, ${startTime}, ${endTime}, ${duration})
    `;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    const { rows } = await sql`
      SELECT id, label, icon, slug, "order"
      FROM roles
      ORDER BY "order" ASC
    `;
    return rows as Role[];
  },

  saveRole: async (role: Role): Promise<void> => {
    const { id, label, icon, slug, order } = role;

    await sql`
      INSERT INTO roles (id, label, icon, slug, "order")
      VALUES (${id}, ${label}, ${icon}, ${slug}, ${order})
      ON CONFLICT (id)
      DO UPDATE SET
        label = EXCLUDED.label,
        icon = EXCLUDED.icon,
        slug = EXCLUDED.slug,
        "order" = EXCLUDED."order"
    `;
  },

  deleteRole: async (roleId: string): Promise<void> => {
    await sql`DELETE FROM roles WHERE id = ${roleId}`;
  },

  // Initialize database (create tables)
  initializeDatabase: async (): Promise<void> => {
    // Create roles table
    await sql`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        icon TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        "order" INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create topics table
    await sql`
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
      )
    `;

    // Create study sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id SERIAL PRIMARY KEY,
        topic_id TEXT NOT NULL,
        start_time BIGINT NOT NULL,
        end_time BIGINT NOT NULL,
        duration INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_topics_role_id ON topics(role_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_topics_completed ON topics(completed)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_topic_id ON study_sessions(topic_id)`;

    // Insert default roles
    const defaultRoles: Role[] = [
      { id: '1', label: 'Personal', icon: '👤', slug: 'personal', order: 1 },
      { id: '2', label: 'Marriage', icon: '💑', slug: 'marriage', order: 2 },
      { id: '3', label: 'Parenting', icon: '👨‍👩‍👧‍👦', slug: 'parenting', order: 3 },
      { id: '4', label: 'Calling', icon: '📞', slug: 'calling', order: 4 },
      { id: '5', label: 'Work', icon: '💼', slug: 'work', order: 5 },
    ];

    for (const role of defaultRoles) {
      await sql`
        INSERT INTO roles (id, label, icon, slug, "order")
        VALUES (${role.id}, ${role.label}, ${role.icon}, ${role.slug}, ${role.order})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  },
};
