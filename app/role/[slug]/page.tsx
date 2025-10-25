'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import TopicForm from '@/components/TopicForm';
import { topicsApi, rolesApi } from '@/lib/api';
import { Topic, Role } from '@/lib/types';
import styles from './page.module.css';

interface RolePageProps {
  params: {
    slug: string;
  };
}

export default function RolePage({ params }: RolePageProps) {
  const [role, setRole] = useState<Role | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // Find the role by slug
        const roles = await rolesApi.getAll();
        const foundRole = roles.find(r => r.slug === params.slug);

        if (!foundRole) {
          // Redirect to home if role not found
          router.push('/');
          return;
        }

        setRole(foundRole);
        await loadTopics(foundRole);
      } catch (error) {
        console.error('Failed to load role data:', error);
      }
    }
    loadData();
  }, [params.slug, router]);

  const loadTopics = async (currentRole: Role) => {
    try {
      const allTopics = await topicsApi.getAll();
      // Filter topics by roleId or legacy category matching the slug
      setTopics(allTopics.filter(t =>
        t.roleId === currentRole.id ||
        t.category === currentRole.slug
      ));
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleTopicCreated = () => {
    if (role) {
      loadTopics(role);
    }
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

  if (!role) {
    return (
      <MainLayout>
        <div className={styles.loading}>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.rolePage}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>{role.icon}</span>
            {role.label}
          </h1>
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
                category={role.slug as any}
                roleId={role.id}
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
