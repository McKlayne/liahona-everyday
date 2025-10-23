'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Topic, Category } from '@/lib/types';
import { generateSuggestedSources } from '@/lib/contentService';
import styles from './TopicForm.module.css';

interface TopicFormProps {
  category: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TopicForm({ category, onSuccess, onCancel }: TopicFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Generate suggested sources based on topic
    const suggestedSources = generateSuggestedSources(title.trim(), description.trim());

    const newTopic: Topic = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      createdAt: Date.now(),
      completed: false,
      totalTimeSpent: 0,
      sources: suggestedSources,
    };

    storage.saveTopic(newTopic);

    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Create New Topic</h2>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief phrase describing your topic"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the scenario, desire, or topic you'd like to study"
          rows={6}
          required
        />
      </div>

      <div className={styles.categoryLabel}>
        Category: <strong>{category}</strong>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Topic'}
        </button>
      </div>
    </form>
  );
}
