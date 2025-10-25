export type Category = 'personal' | 'marriage' | 'parenting' | 'calling' | 'work';

export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'en' | 'es' | 'pt';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  hasCompletedOnboarding: boolean;
}

export interface UserSettings {
  theme: Theme;
  language: Language;
  fontSize: 'small' | 'medium' | 'large';
  emailNotifications: boolean;
  studyReminders: boolean;
}

export interface Role {
  id: string;
  label: string;
  icon: string;
  slug: string; // URL-friendly identifier
  order: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: Category;
  roleId?: string; // New field to link to custom roles
  createdAt: number;
  completed: boolean;
  totalTimeSpent: number; // in seconds
  sources: Source[];
}

export interface Source {
  id: string;
  type: 'scripture' | 'conference' | 'manual' | 'custom';
  title: string;
  url: string;
  content?: string;
  notes?: string;
}

export interface StudySession {
  topicId: string;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
}
