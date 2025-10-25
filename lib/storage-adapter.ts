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
  getTopics: async (userId: string): Promise<Topic[]> => {
    if (isProduction) {
      return await dbStorage.getTopics(userId);
    }
    return serverStorage.getTopics(userId);
  },

  getTopic: async (userId: string, id: string): Promise<Topic | null> => {
    if (isProduction) {
      return await dbStorage.getTopic(userId, id);
    }
    const topics = serverStorage.getTopics(userId);
    return topics.find(t => t.id === id) || null;
  },

  saveTopic: async (userId: string, topic: Topic): Promise<void> => {
    if (isProduction) {
      await dbStorage.saveTopic(userId, topic);
    } else {
      serverStorage.saveTopic(userId, topic);
    }
  },

  deleteTopic: async (userId: string, topicId: string): Promise<void> => {
    if (isProduction) {
      await dbStorage.deleteTopic(userId, topicId);
    } else {
      serverStorage.deleteTopic(userId, topicId);
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
  getRoles: async (userId: string): Promise<Role[]> => {
    if (isProduction) {
      return await dbStorage.getRoles(userId);
    }
    return serverStorage.getRoles(userId);
  },

  saveRole: async (userId: string, role: Role): Promise<void> => {
    if (isProduction) {
      await dbStorage.saveRole(userId, role);
    } else {
      serverStorage.saveRole(userId, role);
    }
  },

  deleteRole: async (userId: string, roleId: string): Promise<void> => {
    if (isProduction) {
      await dbStorage.deleteRole(userId, roleId);
    } else {
      serverStorage.deleteRole(userId, roleId);
    }
  },

  // Initialize default roles for a new user
  initializeUserRoles: async (userId: string): Promise<void> => {
    if (isProduction) {
      await dbStorage.initializeUserRoles(userId);
    } else {
      serverStorage.initializeUserRoles(userId);
    }
  },

  // Initialize (for production only)
  initialize: async (): Promise<void> => {
    if (isProduction) {
      await dbStorage.initializeDatabase();
    }
  },
};
