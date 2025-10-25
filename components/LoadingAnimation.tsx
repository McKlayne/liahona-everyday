'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingAnimation.module.css';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Finding sacred sources...' }: LoadingAnimationProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.scrollContainer}>
        {/* Left scroll */}
        <div className={styles.scroll}>
          <div className={styles.scrollRod} />
          <div className={styles.scrollPaper}>
            <div className={styles.scrollText}>
              <div className={styles.scrollLine} />
              <div className={styles.scrollLine} />
              <div className={styles.scrollLine} />
            </div>
          </div>
        </div>

        {/* Right scroll */}
        <div className={`${styles.scroll} ${styles.scrollRight}`}>
          <div className={styles.scrollRod} />
          <div className={styles.scrollPaper}>
            <div className={styles.scrollText}>
              <div className={styles.scrollLine} />
              <div className={styles.scrollLine} />
              <div className={styles.scrollLine} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.loadingMessage}>
        {message}{dots}
      </div>

      <div className={styles.subMessage}>
        Searching the Book of Mormon and General Conference
      </div>
    </div>
  );
}
