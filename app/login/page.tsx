'use client';

import { signIn } from 'next-auth/react';
import LiahonaIcon from '@/components/LiahonaIcon';
import styles from './login.module.css';

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <LiahonaIcon size={64} className={styles.logoIcon} />
            <h1 className={styles.logoText}>Liahona Everyday</h1>
          </div>
          <p className={styles.subtitle}>
            Your personal Book of Mormon study companion
          </p>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Welcome</h2>
          <p className={styles.description}>
            Sign in to organize your study topics by life roles, discover relevant scriptures,
            and track your spiritual growth.
          </p>

          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
          >
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className={styles.quote}>
          <p>
            "My dear brothers and sisters, I promise that as you prayerfully study
            the Book of Mormon every day, you will make better decisions—every day."
          </p>
          <footer>— President Russell M. Nelson</footer>
        </div>
      </div>
    </div>
  );
}
