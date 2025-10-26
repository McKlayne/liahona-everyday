'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { rolesApi } from '@/lib/api';
import { storage } from '@/lib/storage';
import { Role, User } from '@/lib/types';
import RoleManager from './RoleManager';
import LiahonaIcon from './LiahonaIcon';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  useEffect(() => {
    loadRoles();
    // Note: User/auth still uses localStorage for now (not part of API yet)
    setUser(storage.getUser());
  }, []);

  const loadRoles = async () => {
    try {
      const loadedRoles = await rolesApi.getAll();
      setRoles(loadedRoles.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const handleSaveRole = async (role: Role) => {
    try {
      await rolesApi.create(role);
      await loadRoles();
      setShowRoleManager(false);
      setEditingRole(undefined);
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await rolesApi.delete(roleId);
      await loadRoles();
      setShowRoleManager(false);
      setEditingRole(undefined);
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleManager(true);
  };

  const handleAddRole = () => {
    setEditingRole(undefined);
    setShowRoleManager(true);
  };

  const handleCancel = () => {
    setShowRoleManager(false);
    setEditingRole(undefined);
  };

  const existingSlugs = roles.map(r => r.slug);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <LiahonaIcon size={32} />
        </div>
        <h1 className={styles.title}>Liahona Everyday</h1>
        <p className={styles.subtitle}>Book of Mormon Study</p>
      </div>

      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
        >
          <span className={styles.icon}>🏠</span>
          <span>Home</span>
        </Link>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Roles</span>
        </div>

        {roles.map((role) => (
          <div key={role.id} className={styles.navItemWrapper}>
            <Link
              href={`/role/${role.slug}`}
              className={`${styles.navItem} ${
                pathname === `/role/${role.slug}` ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>{role.icon}</span>
              <span>{role.label}</span>
            </Link>
            <button
              className={styles.editButton}
              onClick={() => handleEditRole(role)}
              title="Edit role"
            >
              ✎
            </button>
          </div>
        ))}

        <button
          className={styles.addRoleButton}
          onClick={handleAddRole}
          title="Add new role"
        >
          <span className={styles.icon}>+</span>
          <span>Add Role</span>
        </button>
      </nav>

      {showRoleManager && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <RoleManager
              role={editingRole}
              onSave={handleSaveRole}
              onCancel={handleCancel}
              onDelete={handleDeleteRole}
              existingSlugs={existingSlugs}
            />
          </div>
        </div>
      )}

      {user && (
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userData}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
          <Link
            href="/settings"
            className={`${styles.settingsLink} ${
              pathname === '/settings' ? styles.active : ''
            }`}
          >
            <span className={styles.icon}>⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
