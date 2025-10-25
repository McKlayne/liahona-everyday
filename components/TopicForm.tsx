'use client';

import { useState } from 'react';
import { topicsApi } from '@/lib/api';
import { Topic, Category } from '@/lib/types';
import { generateSuggestedSourcesAsync } from '@/lib/contentService';
import LoadingAnimation from './LoadingAnimation';
import styles from './TopicForm.module.css';

interface TopicFormProps {
  category: Category;
  roleId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TopicForm({ category, roleId, onSuccess, onCancel }: TopicFormProps) {
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

    try {
      // Generate suggested sources based on topic (async with loading animation)
      const suggestedSources = await generateSuggestedSourcesAsync(title.trim(), description.trim());

      const newTopic = {
        title: title.trim(),
        description: description.trim(),
        category,
        roleId, // Link to the role if provided
        sources: suggestedSources,
      };

      await topicsApi.create(newTopic);

      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating topic:', error);
      setIsSubmitting(false);
      alert('There was an error creating your topic. Please try again.');
    }
  };

  // Show loading animation while generating sources
  if (isSubmitting) {
    return (
      <div className={styles.form}>
        <LoadingAnimation message="Gathering sacred sources" />
      </div>
    );
  }

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
          Create Topic
        </button>
      </div>
    </form>
  );
}
