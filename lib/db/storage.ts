import { sql } from '@vercel/postgres';
import { Topic, Role, StudySession } from '../types';

/**
 * Database storage layer using Vercel Postgres
 * This is used in production on Vercel
 */

export const dbStorage = {
  // Topics
  getTopics: async (userId: string): Promise<Topic[]> => {
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
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return rows as Topic[];
  },

  getTopic: async (userId: string, id: string): Promise<Topic | null> => {
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
      WHERE id = ${id} AND user_id = ${userId}
    `;
    return rows[0] as Topic || null;
  },

  saveTopic: async (userId: string, topic: Topic): Promise<void> => {
    const { id, title, description, category, roleId, createdAt, completed, totalTimeSpent, sources } = topic;

    // Upsert (insert or update)
    await sql`
      INSERT INTO topics (id, user_id, title, description, category, role_id, created_at, completed, total_time_spent, sources)
      VALUES (${id}, ${userId}, ${title}, ${description}, ${category}, ${roleId || null}, ${createdAt}, ${completed}, ${totalTimeSpent}, ${JSON.stringify(sources)}::jsonb)
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

  deleteTopic: async (userId: string, topicId: string): Promise<void> => {
    await sql`DELETE FROM topics WHERE id = ${topicId} AND user_id = ${userId}`;
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
  getRoles: async (userId: string): Promise<Role[]> => {
    const { rows } = await sql`
      SELECT id, label, icon, slug, "order"
      FROM roles
      WHERE user_id = ${userId}
      ORDER BY "order" ASC
    `;
    return rows as Role[];
  },

  saveRole: async (userId: string, role: Role): Promise<void> => {
    const { id, label, icon, slug, order } = role;

    await sql`
      INSERT INTO roles (id, user_id, label, icon, slug, "order")
      VALUES (${id}, ${userId}, ${label}, ${icon}, ${slug}, ${order})
      ON CONFLICT (id)
      DO UPDATE SET
        label = EXCLUDED.label,
        icon = EXCLUDED.icon,
        slug = EXCLUDED.slug,
        "order" = EXCLUDED."order"
    `;
  },

  deleteRole: async (userId: string, roleId: string): Promise<void> => {
    await sql`DELETE FROM roles WHERE id = ${roleId} AND user_id = ${userId}`;
  },

  // Initialize database (create tables) - now uses schema from lib/db/schema.sql
  initializeDatabase: async (): Promise<void> => {
    console.log('Initializing database with schema.sql...');

    // Read and execute schema.sql
    const fs = await import('fs/promises');
    const path = await import('path');

    const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await sql.query(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (!error.message?.includes('already exists')) {
          console.error('Schema execution error:', error);
          throw error;
        }
      }
    }

    console.log('Database schema initialization complete');
  },

  // Initialize default roles for a new user
  initializeUserRoles: async (userId: string): Promise<void> => {
    const defaultRoles: Role[] = [
      { id: `${userId}-1`, label: 'Personal', icon: '👤', slug: 'personal', order: 1 },
      { id: `${userId}-2`, label: 'Marriage', icon: '💑', slug: 'marriage', order: 2 },
      { id: `${userId}-3`, label: 'Parenting', icon: '👨‍👩‍👧‍👦', slug: 'parenting', order: 3 },
      { id: `${userId}-4`, label: 'Calling', icon: '📞', slug: 'calling', order: 4 },
      { id: `${userId}-5`, label: 'Work', icon: '💼', slug: 'work', order: 5 },
    ];

    for (const role of defaultRoles) {
      await sql`
        INSERT INTO roles (id, user_id, label, icon, slug, "order")
        VALUES (${role.id}, ${userId}, ${role.label}, ${role.icon}, ${role.slug}, ${role.order})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  },
};
