'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import MainLayout from '@/components/MainLayout';
import { storage } from '@/lib/storage';
import { UserSettings, ApiKey } from '@/lib/types';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      loadApiKeys();
    }
  }, [session]);

  const loadApiKeys = async () => {
    setIsLoadingKeys(true);
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    setIsCreatingKey(true);
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName: newKeyName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewlyCreatedKey(data.fullKey);
        setShowNewKeyModal(true);
        setNewKeyName('');
        loadApiKeys();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      alert('Failed to create API key');
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to revoke the API key "${keyName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadApiKeys();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      alert('Failed to revoke API key');
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(newlyCreatedKey);
    alert('API key copied to clipboard!');
  };

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

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut({ callbackUrl: '/welcome' });
    }
  };

  if (status === 'loading') {
    return (
      <MainLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </MainLayout>
    );
  }

  if (!session?.user) {
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
            {session.user.image && (
              <div className={styles.settingGroup}>
                <label className={styles.label}>Profile Picture</label>
                <div className={styles.profilePictureContainer}>
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className={styles.profilePicture}
                  />
                </div>
              </div>
            )}
            <div className={styles.settingGroup}>
              <label className={styles.label}>Name</label>
              <div className={styles.value}>{session.user.name}</div>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.value}>{session.user.email}</div>
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

          {/* API Keys Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>API Keys</h2>
            <p className={styles.description}>
              Create API keys to integrate Liahona Everyday with Claude Desktop or other applications via MCP (Model Context Protocol).
            </p>

            <div className={styles.apiKeyCreate}>
              <input
                type="text"
                placeholder="Enter a name for this key (e.g., 'Claude Desktop')"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateApiKey()}
              />
              <button
                onClick={handleCreateApiKey}
                disabled={isCreatingKey || !newKeyName.trim()}
                className={styles.createButton}
              >
                {isCreatingKey ? 'Creating...' : 'Create API Key'}
              </button>
            </div>

            {isLoadingKeys ? (
              <div className={styles.loadingKeys}>Loading API keys...</div>
            ) : apiKeys.length === 0 ? (
              <div className={styles.noKeys}>
                No API keys yet. Create one to get started.
              </div>
            ) : (
              <div className={styles.apiKeysList}>
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className={`${styles.apiKeyItem} ${key.revoked ? styles.revoked : ''}`}
                  >
                    <div className={styles.keyInfo}>
                      <div className={styles.keyName}>{key.keyName}</div>
                      <div className={styles.keyMeta}>
                        <span className={styles.keyPrefix}>{key.keyPrefix}...</span>
                        <span className={styles.keyDate}>
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                        {key.lastUsedAt && (
                          <span className={styles.keyDate}>
                            Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                        {key.revoked && (
                          <span className={styles.revokedBadge}>Revoked</span>
                        )}
                      </div>
                    </div>
                    {!key.revoked && (
                      <button
                        onClick={() => handleRevokeApiKey(key.id, key.keyName)}
                        className={styles.revokeButton}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.mcpInstructions}>
              <h3>Setting up MCP with Claude Desktop</h3>
              <ol>
                <li>Create an API key above</li>
                <li>Open Claude Desktop settings</li>
                <li>Navigate to the MCP Servers section</li>
                <li>Add a new server with the following configuration:</li>
              </ol>
              <pre className={styles.codeBlock}>
{`{
  "liahona-everyday": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-fetch",
      "https://liahona-everyday.vercel.app/api/mcp"
    ],
    "env": {
      "LIAHONA_API_KEY": "your-api-key-here"
    }
  }
}`}
              </pre>
              <p className={styles.note}>
                Replace <code>your-api-key-here</code> with the API key you created above.
              </p>
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

        {/* New API Key Modal */}
        {showNewKeyModal && (
          <div className={styles.modal} onClick={() => setShowNewKeyModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>API Key Created Successfully!</h2>
              <p className={styles.warning}>
                ⚠️ <strong>Important:</strong> Copy this key now. You won't be able to see it again!
              </p>
              <div className={styles.keyDisplay}>
                <code>{newlyCreatedKey}</code>
              </div>
              <div className={styles.modalActions}>
                <button onClick={handleCopyKey} className={styles.copyButton}>
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowNewKeyModal(false)}
                  className={styles.closeButton}
                >
                  I've Saved It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
