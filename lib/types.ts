export type Category = 'personal' | 'marriage' | 'parenting' | 'calling' | 'work';

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: Category;
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
