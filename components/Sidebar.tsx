'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { rolesApi } from '@/lib/api';
import { Role } from '@/lib/types';
import RoleManager from './RoleManager';
import LiahonaIcon from './LiahonaIcon';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [roles, setRoles] = useState<Role[]>([]);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  useEffect(() => {
    loadRoles();
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

      {session?.user && (
        <div className={styles.userSection}>
          <button
            onClick={() => router.push('/settings')}
            className={styles.userButton}
          >
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className={styles.userImage}
                  />
                ) : (
                  <span className={styles.userInitial}>
                    {session.user.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div className={styles.userData}>
                <div className={styles.userName}>{session.user.name}</div>
                <div className={styles.userEmail}>{session.user.email}</div>
              </div>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
