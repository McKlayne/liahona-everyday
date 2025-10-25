'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import LiahonaIcon from './LiahonaIcon';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (isSignup && !name.trim()) {
      alert('Please enter your name');
      return;
    }

    // Create user object (in a real app, this would involve server-side auth)
    const user: User = {
      id: Date.now().toString(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      createdAt: Date.now(),
      hasCompletedOnboarding: !isSignup, // New signups need onboarding
    };

    onLogin(user);
  };

  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    // In a real app, this would redirect to OAuth provider
    // For demo purposes, we'll create a user with provider info
    const providerNames = {
      google: 'Google User',
      apple: 'Apple User'
    };

    const providerEmails = {
      google: 'user@gmail.com',
      apple: 'user@icloud.com'
    };

    const user: User = {
      id: Date.now().toString(),
      name: providerNames[provider],
      email: providerEmails[provider],
      createdAt: Date.now(),
      hasCompletedOnboarding: false, // OAuth users also need onboarding
    };

    onLogin(user);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <LiahonaIcon size={48} className={styles.logoIcon} />
            <h1 className={styles.logoText}>Liahona Everyday</h1>
          </div>
          <p className={styles.subtitle}>
            Your personal Book of Mormon study companion
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          <div className={styles.oauthButtons}>
            <button
              type="button"
              className={styles.googleButton}
              onClick={() => handleOAuthLogin('google')}
            >
              <svg className={styles.oauthIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className={styles.appleButton}
              onClick={() => handleOAuthLogin('apple')}
            >
              <svg className={styles.oauthIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          {isSignup && (
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required={isSignup}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>

          <div className={styles.toggleAuth}>
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setIsSignup(false)}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </form>

        <div className={styles.authQuote}>
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
