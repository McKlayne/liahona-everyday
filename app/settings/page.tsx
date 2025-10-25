'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { storage } from '@/lib/storage';
import { UserSettings, User } from '@/lib/types';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
    setSettings(storage.getSettings());
  }, [router]);

  const applyTheme = (newSettings: UserSettings) => {
    // Apply theme immediately
    if (typeof document !== 'undefined') {
      if (newSettings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.body.setAttribute('data-theme', newSettings.theme);
      }

      // Apply font size
      document.body.style.fontSize = {
        small: '14px',
        medium: '16px',
        large: '18px',
      }[newSettings.fontSize];
    }
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
    applyTheme(newSettings);
  };

  const handleSave = () => {
    setIsSaving(true);
    storage.saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      storage.logout();
      router.push('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className={styles.settingsPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
        </div>

        <div className={styles.settingsContainer}>
          {/* User Profile Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Profile</h2>
            <div className={styles.settingGroup}>
              <label className={styles.label}>Name</label>
              <div className={styles.value}>{user.name}</div>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.value}>{user.email}</div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Appearance</h2>

            <div className={styles.settingGroup}>
              <label className={styles.label}>Theme</label>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.optionButton} ${
                    settings.theme === 'light' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, theme: 'light' })}
                >
                  ☀️ Light
                </button>
                <button
                  className={`${styles.optionButton} ${
                    settings.theme === 'dark' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, theme: 'dark' })}
                >
                  🌙 Dark
                </button>
                <button
                  className={`${styles.optionButton} ${
                    settings.theme === 'auto' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, theme: 'auto' })}
                >
                  🔄 Auto
                </button>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.label}>Font Size</label>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.optionButton} ${
                    settings.fontSize === 'small' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, fontSize: 'small' })}
                >
                  Small
                </button>
                <button
                  className={`${styles.optionButton} ${
                    settings.fontSize === 'medium' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, fontSize: 'medium' })}
                >
                  Medium
                </button>
                <button
                  className={`${styles.optionButton} ${
                    settings.fontSize === 'large' ? styles.active : ''
                  }`}
                  onClick={() => handleSettingsChange({ ...settings, fontSize: 'large' })}
                >
                  Large
                </button>
              </div>
            </div>
          </section>

          {/* Language Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Language</h2>
            <div className={styles.settingGroup}>
              <label className={styles.label}>Preferred Language</label>
              <select
                className={styles.select}
                value={settings.language}
                onChange={(e) =>
                  handleSettingsChange({ ...settings, language: e.target.value as any })
                }
              >
                <option value="en">English</option>
                <option value="es">Español (Spanish)</option>
                <option value="pt">Português (Portuguese)</option>
              </select>
            </div>
          </section>

          {/* Notifications Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notifications</h2>

            <div className={styles.settingGroup}>
              <div className={styles.toggleRow}>
                <div>
                  <label className={styles.label}>Email Notifications</label>
                  <p className={styles.description}>
                    Receive updates about your study progress
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleSettingsChange({ ...settings, emailNotifications: e.target.checked })
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.toggleRow}>
                <div>
                  <label className={styles.label}>Study Reminders</label>
                  <p className={styles.description}>
                    Get daily reminders to study the Book of Mormon
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={settings.studyReminders}
                    onChange={(e) =>
                      handleSettingsChange({ ...settings, studyReminders: e.target.checked })
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
