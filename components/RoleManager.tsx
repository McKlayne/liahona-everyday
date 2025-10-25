'use client';

import { useState } from 'react';
import { Role } from '@/lib/types';
import IconPicker from './IconPicker';
import styles from './RoleManager.module.css';

interface RoleManagerProps {
  role?: Role; // If provided, we're editing; otherwise, we're adding
  onSave: (role: Role) => void;
  onCancel: () => void;
  onDelete?: (roleId: string) => void;
  existingSlugs: string[]; // To prevent duplicate slugs
}

export default function RoleManager({
  role,
  onSave,
  onCancel,
  onDelete,
  existingSlugs,
}: RoleManagerProps) {
  const [label, setLabel] = useState(role?.label || '');
  const [icon, setIcon] = useState(role?.icon || '👤');
  const [slug, setSlug] = useState(role?.slug || '');
  const isEditing = !!role;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      alert('Please enter a role name');
      return;
    }

    // Generate slug from label if not manually set
    const finalSlug = slug || label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check for duplicate slug (excluding current role when editing)
    if (existingSlugs.includes(finalSlug) && (!role || role.slug !== finalSlug)) {
      alert('A role with this URL name already exists. Please choose a different name.');
      return;
    }

    const newRole: Role = {
      id: role?.id || Date.now().toString(),
      label: label.trim(),
      icon,
      slug: finalSlug,
      order: role?.order || Date.now(),
    };

    onSave(newRole);
  };

  const handleDelete = () => {
    if (!role) return;
    if (confirm(`Are you sure you want to delete the "${role.label}" role? This cannot be undone.`)) {
      onDelete?.(role.id);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        {isEditing ? 'Edit Role' : 'Add New Role'}
      </h2>

      <div className={styles.formGroup}>
        <label htmlFor="label" className={styles.label}>
          Role Name
        </label>
        <input
          type="text"
          id="label"
          className={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Husband, Wife, Father, etc."
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Icon</label>
        <IconPicker selectedIcon={icon} onSelect={setIcon} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="slug" className={styles.label}>
          URL Name (optional)
        </label>
        <input
          type="text"
          id="slug"
          className={styles.input}
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          placeholder={label ? label.toLowerCase().replace(/\s+/g, '-') : 'auto-generated'}
        />
        <p className={styles.helpText}>
          This will be used in the URL. Leave blank to auto-generate.
        </p>
      </div>

      <div className={styles.formActions}>
        {isEditing && onDelete && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Delete Role
          </button>
        )}
        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Save Changes' : 'Add Role'}
          </button>
        </div>
      </div>
    </form>
  );
}
