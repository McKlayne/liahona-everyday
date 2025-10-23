'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { storage } from '@/lib/storage';
import { Topic, Category } from '@/lib/types';
import styles from './page.module.css';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    setTopics(storage.getTopics());
  }, []);

  const getCategoryStats = (category: Category) => {
    const categoryTopics = topics.filter(t => t.category === category);
    const totalTime = categoryTopics.reduce((sum, t) => sum + t.totalTimeSpent, 0);
    const completed = categoryTopics.filter(t => t.completed).length;

    return {
      total: categoryTopics.length,
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

  const categories: Category[] = ['personal', 'marriage', 'parenting', 'calling', 'work'];

  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.completed).length;
  const totalTimeSpent = topics.reduce((sum, t) => sum + t.totalTimeSpent, 0);

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

          <h3 className={styles.categoryTitle}>Topics by Category</h3>
          <div className={styles.categoryGrid}>
            {categories.map(category => {
              const stats = getCategoryStats(category);
              return (
                <div key={category} className={styles.categoryCard}>
                  <h4 className={styles.categoryName}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
