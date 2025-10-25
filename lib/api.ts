// API service layer for frontend components
import { Topic, Role, Source } from './types';

const API_BASE = '/api';

// Topics API
export const topicsApi = {
  async getAll(): Promise<Topic[]> {
    const response = await fetch(`${API_BASE}/topics`);
    if (!response.ok) throw new Error('Failed to fetch topics');
    const data = await response.json();
    return data.topics;
  },

  async getById(id: string): Promise<Topic> {
    const response = await fetch(`${API_BASE}/topics/${id}`);
    if (!response.ok) throw new Error('Failed to fetch topic');
    const data = await response.json();
    return data.topic;
  },

  async create(topic: Omit<Topic, 'id' | 'createdAt' | 'completed' | 'totalTimeSpent'>): Promise<Topic> {
    const response = await fetch(`${API_BASE}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topic),
    });
    if (!response.ok) throw new Error('Failed to create topic');
    const data = await response.json();
    return data.topic;
  },

  async update(id: string, updates: Partial<Topic>): Promise<Topic> {
    const response = await fetch(`${API_BASE}/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update topic');
    const data = await response.json();
    return data.topic;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/topics/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete topic');
  },

  async addSources(id: string, sources: Source[]): Promise<Topic> {
    const topic = await this.getById(id);
    const updatedSources = [...topic.sources, ...sources];
    return this.update(id, { sources: updatedSources });
  },
};

// Roles API
export const rolesApi = {
  async getAll(): Promise<Role[]> {
    const response = await fetch(`${API_BASE}/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    const data = await response.json();
    return data.roles;
  },

  async create(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create role');
    }
    const data = await response.json();
    return data.role;
  },

  async update(id: string, updates: Partial<Role>): Promise<Role> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update role');
    const data = await response.json();
    return data.role;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete role');
  },
};
