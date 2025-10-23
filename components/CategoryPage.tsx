'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from './MainLayout';
import TopicForm from './TopicForm';
import { storage } from '@/lib/storage';
import { Topic, Category } from '@/lib/types';
import styles from './CategoryPage.module.css';

interface CategoryPageProps {
  category: Category;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTopics();
  }, [category]);

  const loadTopics = () => {
    const allTopics = storage.getTopics();
    setTopics(allTopics.filter(t => t.category === category));
  };

  const handleTopicCreated = () => {
    loadTopics();
    setShowForm(false);
  };

  const handleTopicClick = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <MainLayout>
      <div className={styles.categoryPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>{categoryTitle}</h1>
          <button
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            + Add Topic
          </button>
        </div>

        {showForm && (
          <div className={styles.formOverlay}>
            <div className={styles.formContainer}>
              <TopicForm
                category={category}
                onSuccess={handleTopicCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        <div className={styles.topicsGrid}>
          {topics.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No topics yet. Click "Add Topic" to get started!</p>
            </div>
          ) : (
            topics.map(topic => (
              <div
                key={topic.id}
                className={`${styles.topicCard} ${topic.completed ? styles.completed : ''}`}
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className={styles.topicHeader}>
                  <h3 className={styles.topicTitle}>{topic.title}</h3>
                  {topic.completed && (
                    <span className={styles.completedBadge}>✓</span>
                  )}
                </div>
                <p className={styles.topicDescription}>{topic.description}</p>
                <div className={styles.topicFooter}>
                  <span className={styles.topicTime}>
                    {formatTime(topic.totalTimeSpent)}
                  </span>
                  <span className={styles.topicSources}>
                    {topic.sources.length} sources
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
