import { Topic, StudySession, Role, User, UserSettings } from './types';

const TOPICS_KEY = 'liahona_topics';
const SESSIONS_KEY = 'liahona_sessions';
const ROLES_KEY = 'liahona_roles';
const USER_KEY = 'liahona_user';
const SETTINGS_KEY = 'liahona_settings';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  language: 'en',
  fontSize: 'medium',
  emailNotifications: true,
  studyReminders: true,
};

// Default roles matching the original categories
const DEFAULT_ROLES: Role[] = [
  { id: '1', label: 'Personal', icon: '👤', slug: 'personal', order: 1 },
  { id: '2', label: 'Marriage', icon: '💑', slug: 'marriage', order: 2 },
  { id: '3', label: 'Parenting', icon: '👨‍👩‍👧‍👦', slug: 'parenting', order: 3 },
  { id: '4', label: 'Calling', icon: '📞', slug: 'calling', order: 4 },
  { id: '5', label: 'Work', icon: '💼', slug: 'work', order: 5 },
];

export const storage = {
  // Topics
  getTopics: (): Topic[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TOPICS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTopic: (topic: Topic): void => {
    if (typeof window === 'undefined') return;
    const topics = storage.getTopics();
    const existingIndex = topics.findIndex(t => t.id === topic.id);

    if (existingIndex >= 0) {
      topics[existingIndex] = topic;
    } else {
      topics.push(topic);
    }

    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  },

  deleteTopic: (topicId: string): void => {
    if (typeof window === 'undefined') return;
    const topics = storage.getTopics().filter(t => t.id !== topicId);
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  },

  // Study Sessions
  getSessions: (): StudySession[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSession: (session: StudySession): void => {
    if (typeof window === 'undefined') return;
    const sessions = storage.getSessions();
    sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  // Roles
  getRoles: (): Role[] => {
    if (typeof window === 'undefined') return DEFAULT_ROLES;
    const data = localStorage.getItem(ROLES_KEY);
    if (!data) {
      // Initialize with default roles
      storage.saveRoles(DEFAULT_ROLES);
      return DEFAULT_ROLES;
    }
    return JSON.parse(data);
  },

  saveRoles: (roles: Role[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  },

  saveRole: (role: Role): void => {
    if (typeof window === 'undefined') return;
    const roles = storage.getRoles();
    const existingIndex = roles.findIndex(r => r.id === role.id);

    if (existingIndex >= 0) {
      roles[existingIndex] = role;
    } else {
      roles.push(role);
    }

    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  },

  deleteRole: (roleId: string): void => {
    if (typeof window === 'undefined') return;
    const roles = storage.getRoles().filter(r => r.id !== roleId);
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  },

  // User Authentication
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  // User Settings
  getSettings: (): UserSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: UserSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
