import { Topic, Role, StudySession } from './types';
import { serverStorage } from './serverStorage';
import { dbStorage } from './db/storage';

/**
 * Storage adapter that automatically chooses between file storage (dev) and database (production)
 * Based on environment variables
 */

const isProduction = process.env.POSTGRES_URL !== undefined;

export const storage = {
  // Topics
  getTopics: async (): Promise<Topic[]> => {
    if (isProduction) {
      return await dbStorage.getTopics();
    }
    return serverStorage.getTopics();
  },

  getTopic: async (id: string): Promise<Topic | null> => {
    if (isProduction) {
      return await dbStorage.getTopic(id);
    }
    const topics = serverStorage.getTopics();
    return topics.find(t => t.id === id) || null;
  },

  saveTopic: async (topic: Topic): Promise<void> => {
    if (isProduction) {
      await dbStorage.saveTopic(topic);
    } else {
      serverStorage.saveTopic(topic);
    }
  },

  deleteTopic: async (topicId: string): Promise<void> => {
    if (isProduction) {
      await dbStorage.deleteTopic(topicId);
    } else {
      serverStorage.deleteTopic(topicId);
    }
  },

  // Study Sessions
  getSessions: async (): Promise<StudySession[]> => {
    if (isProduction) {
      return await dbStorage.getSessions();
    }
    return serverStorage.getSessions();
  },

  saveSession: async (session: StudySession): Promise<void> => {
    if (isProduction) {
      await dbStorage.saveSession(session);
    } else {
      serverStorage.saveSession(session);
    }
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    if (isProduction) {
      return await dbStorage.getRoles();
    }
    return serverStorage.getRoles();
  },

  saveRole: async (role: Role): Promise<void> => {
    if (isProduction) {
      await dbStorage.saveRole(role);
    } else {
      serverStorage.saveRole(role);
    }
  },

  deleteRole: async (roleId: string): Promise<void> => {
    if (isProduction) {
      await dbStorage.deleteRole(roleId);
    } else {
      serverStorage.deleteRole(roleId);
    }
  },

  // Initialize (for production only)
  initialize: async (): Promise<void> => {
    if (isProduction) {
      await dbStorage.initializeDatabase();
    }
  },
};
