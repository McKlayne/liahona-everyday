import { Topic, StudySession } from './types';

const TOPICS_KEY = 'liahona_topics';
const SESSIONS_KEY = 'liahona_sessions';

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
};
