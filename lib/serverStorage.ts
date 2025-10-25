import fs from 'fs';
import path from 'path';
import { Topic, StudySession, Role, User, UserSettings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const TOPICS_FILE = path.join(DATA_DIR, 'topics.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const ROLES_FILE = path.join(DATA_DIR, 'roles.json');
const USER_FILE = path.join(DATA_DIR, 'user.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Default roles matching the original categories
const DEFAULT_ROLES: Role[] = [
  { id: '1', label: 'Personal', icon: '👤', slug: 'personal', order: 1 },
  { id: '2', label: 'Marriage', icon: '💑', slug: 'marriage', order: 2 },
  { id: '3', label: 'Parenting', icon: '👨‍👩‍👧‍👦', slug: 'parenting', order: 3 },
  { id: '4', label: 'Calling', icon: '📞', slug: 'calling', order: 4 },
  { id: '5', label: 'Work', icon: '💼', slug: 'work', order: 5 },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  language: 'en',
  fontSize: 'medium',
  emailNotifications: true,
  studyReminders: true,
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read JSON file
function readJSON<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

// Write JSON file
function writeJSON<T>(filePath: string, data: T): void {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

export const serverStorage = {
  // Topics
  getTopics: (): Topic[] => {
    return readJSON<Topic[]>(TOPICS_FILE, []);
  },

  saveTopic: (topic: Topic): void => {
    const topics = serverStorage.getTopics();
    const existingIndex = topics.findIndex(t => t.id === topic.id);

    if (existingIndex >= 0) {
      topics[existingIndex] = topic;
    } else {
      topics.push(topic);
    }

    writeJSON(TOPICS_FILE, topics);
  },

  deleteTopic: (topicId: string): void => {
    const topics = serverStorage.getTopics().filter(t => t.id !== topicId);
    writeJSON(TOPICS_FILE, topics);
  },

  // Study Sessions
  getSessions: (): StudySession[] => {
    return readJSON<StudySession[]>(SESSIONS_FILE, []);
  },

  saveSession: (session: StudySession): void => {
    const sessions = serverStorage.getSessions();
    sessions.push(session);
    writeJSON(SESSIONS_FILE, sessions);
  },

  // Roles
  getRoles: (): Role[] => {
    const roles = readJSON<Role[]>(ROLES_FILE, []);
    if (roles.length === 0) {
      writeJSON(ROLES_FILE, DEFAULT_ROLES);
      return DEFAULT_ROLES;
    }
    return roles;
  },

  saveRoles: (roles: Role[]): void => {
    writeJSON(ROLES_FILE, roles);
  },

  saveRole: (role: Role): void => {
    const roles = serverStorage.getRoles();
    const existingIndex = roles.findIndex(r => r.id === role.id);

    if (existingIndex >= 0) {
      roles[existingIndex] = role;
    } else {
      roles.push(role);
    }

    writeJSON(ROLES_FILE, roles);
  },

  deleteRole: (roleId: string): void => {
    const roles = serverStorage.getRoles().filter(r => r.id !== roleId);
    writeJSON(ROLES_FILE, roles);
  },

  // User Authentication
  getUser: (): User | null => {
    return readJSON<User | null>(USER_FILE, null);
  },

  saveUser: (user: User): void => {
    writeJSON(USER_FILE, user);
  },

  logout: (): void => {
    if (fs.existsSync(USER_FILE)) {
      fs.unlinkSync(USER_FILE);
    }
  },

  // User Settings
  getSettings: (): UserSettings => {
    return readJSON<UserSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  },

  saveSettings: (settings: UserSettings): void => {
    writeJSON(SETTINGS_FILE, settings);
  },
};
