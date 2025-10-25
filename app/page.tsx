'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/MainLayout';
import OnboardingWizard from '@/components/OnboardingWizard';
import { topicsApi, rolesApi } from '@/lib/api';
import { Topic, Role } from '@/lib/types';
import styles from './page.module.css';

export default function Home() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [topicsData, rolesData] = await Promise.all([
          topicsApi.getAll(),
          rolesApi.getAll(),
        ]);
        setTopics(topicsData);
        setRoles(rolesData.sort((a, b) => a.order - b.order));

        // Show onboarding if user has no roles (first time user)
        if (rolesData.length === 0) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getRoleStats = (role: Role) => {
    // Find topics that match this role by slug or by legacy category
    const roleTopics = topics.filter(t =>
      t.roleId === role.id ||
      t.category === role.slug
    );
    const totalTime = roleTopics.reduce((sum, t) => sum + t.totalTimeSpent, 0);
    const completed = roleTopics.filter(t => t.completed).length;

    return {
      total: roleTopics.length,
      completed,
      timeSpent: formatTime(totalTime),
    };
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.completed).length;
  const totalTimeSpent = topics.reduce((sum, t) => sum + t.totalTimeSpent, 0);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    // Reload roles after onboarding
    try {
      const rolesData = await rolesApi.getAll();
      setRoles(rolesData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to reload roles:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.home}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (showOnboarding && session?.user) {
    return (
      <OnboardingWizard
        userName={session.user.name || 'Friend'}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <MainLayout>
      <div className={styles.home}>
        <div className={styles.quoteSection}>
          <blockquote className={styles.quote}>
            <p>
              "My dear brothers and sisters, I promise that as you prayerfully study the Book of Mormon every day, you will make better decisions—every day. I promise that as you ponder what you study, the windows of heaven will open, and you will receive answers to your own questions and direction for your own life."
            </p>
            <footer className={styles.quoteAuthor}>— President Russell M. Nelson</footer>
          </blockquote>
        </div>

        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Study Overview</h2>

          <div className={styles.overallStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalTopics}</div>
              <div className={styles.statLabel}>Total Topics</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{completedTopics}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatTime(totalTimeSpent)}</div>
              <div className={styles.statLabel}>Time Spent</div>
            </div>
          </div>

          <h3 className={styles.categoryTitle}>Topics by Role</h3>
          <div className={styles.categoryGrid}>
            {roles.map(role => {
              const stats = getRoleStats(role);
              return (
                <div key={role.id} className={styles.categoryCard}>
                  <h4 className={styles.categoryName}>
                    <span className={styles.roleIcon}>{role.icon}</span>
                    {role.label}
                  </h4>
                  <div className={styles.categoryStats}>
                    <div className={styles.categoryStat}>
                      <span className={styles.categoryStatLabel}>Topics:</span>
                      <span className={styles.categoryStatValue}>{stats.total}</span>
                    </div>
                    <div className={styles.categoryStat}>
                      <span className={styles.categoryStatLabel}>Completed:</span>
                      <span className={styles.categoryStatValue}>{stats.completed}</span>
                    </div>
                    <div className={styles.categoryStat}>
                      <span className={styles.categoryStatLabel}>Time:</span>
                      <span className={styles.categoryStatValue}>{stats.timeSpent}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
