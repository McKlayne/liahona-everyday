'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { topicsApi } from '@/lib/api';
import { Topic, Source } from '@/lib/types';
import styles from './page.module.css';

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  useEffect(() => {
    async function loadTopic() {
      try {
        const foundTopic = await topicsApi.getById(topicId);
        setTopic(foundTopic);
      } catch (error) {
        console.error('Failed to load topic:', error);
      }
    }
    loadTopic();
  }, [topicId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStudying) {
      interval = setInterval(() => {
        setCurrentSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStudying]);

  const handleStartStudy = () => {
    setIsStudying(true);
    setSessionStartTime(Date.now());
    setCurrentSessionTime(0);
  };

  const handleStopStudy = async () => {
    if (!topic || sessionStartTime === null) return;

    setIsStudying(false);

    try {
      const updatedTopic = await topicsApi.update(topic.id, {
        totalTimeSpent: topic.totalTimeSpent + currentSessionTime,
      });
      setTopic(updatedTopic);

      // TODO: Add API endpoint for sessions if needed
      // For now, we just update the topic time
    } catch (error) {
      console.error('Failed to update topic:', error);
    }

    setCurrentSessionTime(0);
    setSessionStartTime(null);
  };

  const handleToggleCompleted = async () => {
    if (!topic) return;

    try {
      const updatedTopic = await topicsApi.update(topic.id, {
        completed: !topic.completed,
      });
      setTopic(updatedTopic);
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic || !newSourceTitle.trim() || !newSourceUrl.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newSource: Source = {
      id: Date.now().toString(),
      type: 'custom',
      title: newSourceTitle.trim(),
      url: newSourceUrl.trim(),
    };

    try {
      const updatedTopic = await topicsApi.addSources(topic.id, [newSource]);
      setTopic(updatedTopic);
      setNewSourceTitle('');
      setNewSourceUrl('');
      setShowAddSource(false);
    } catch (error) {
      console.error('Failed to add source:', error);
      alert('Failed to add source. Please try again.');
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  if (!topic) {
    return (
      <MainLayout>
        <div className={styles.notFound}>Topic not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.topicPage}>
        <div className={styles.topicHeader}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ← Back
          </button>
          <h1 className={styles.topicTitle}>{topic.title}</h1>
          <div className={styles.categoryBadge}>
            {topic.category}
          </div>
        </div>

        <div className={styles.topicDescription}>
          <h3>Description</h3>
          <p>{topic.description}</p>
        </div>

        <div className={styles.studySection}>
          <div className={styles.timerCard}>
            <div className={styles.timerDisplay}>
              {isStudying ? (
                <div className={styles.activeTimer}>
                  <div className={styles.timerTime}>{formatTime(currentSessionTime)}</div>
                  <div className={styles.timerLabel}>Current Session</div>
                </div>
              ) : (
                <div className={styles.inactiveTimer}>
                  <div className={styles.totalTime}>{formatTime(topic.totalTimeSpent)}</div>
                  <div className={styles.timerLabel}>Total Time Spent</div>
                </div>
              )}
            </div>

            <div className={styles.timerActions}>
              {!isStudying ? (
                <button className={styles.playButton} onClick={handleStartStudy}>
                  ▶ Start Studying
                </button>
              ) : (
                <button className={styles.stopButton} onClick={handleStopStudy}>
                  ■ Stop
                </button>
              )}

              <button
                className={`${styles.completeButton} ${topic.completed ? styles.completed : ''}`}
                onClick={handleToggleCompleted}
              >
                {topic.completed ? '✓ Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.sourcesSection}>
          <div className={styles.sourcesHeader}>
            <h2>Study Sources</h2>
            <button
              className={styles.addSourceButton}
              onClick={() => setShowAddSource(!showAddSource)}
            >
              + Add Source
            </button>
          </div>

          {showAddSource && (
            <form className={styles.addSourceForm} onSubmit={handleAddSource}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Source title"
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  className={styles.sourceInput}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className={styles.sourceInput}
                />
                <button type="submit" className={styles.saveSourceButton}>
                  Save
                </button>
                <button
                  type="button"
                  className={styles.cancelSourceButton}
                  onClick={() => {
                    setShowAddSource(false);
                    setNewSourceTitle('');
                    setNewSourceUrl('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className={styles.sourcesList}>
            {topic.sources.length === 0 ? (
              <div className={styles.emptyState}>
                No sources yet. Add sources to enhance your study.
              </div>
            ) : (
              topic.sources.map(source => (
                <div key={source.id} className={styles.sourceCard}>
                  <div className={styles.sourceHeader}>
                    <h4 className={styles.sourceTitle}>{source.title}</h4>
                    <span className={styles.sourceType}>{source.type}</span>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    Open Source →
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
