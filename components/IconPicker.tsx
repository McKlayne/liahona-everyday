'use client';

import { useState } from 'react';
import styles from './IconPicker.module.css';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

const AVAILABLE_ICONS = [
  '👤', '👨', '👩', '🧑', '👶', '👪', '👨‍👩‍👧‍👦', '👨‍👩‍👧', '👨‍👩‍👦',
  '💑', '💏', '👫', '👬', '👭', '❤️', '💕', '💖', '💗',
  '📖', '📚', '📝', '✍️', '📜', '📋', '📄', '📃',
  '⛪', '✝️', '🙏', '⭐', '✨', '🌟', '💫', '🕊️',
  '💼', '💻', '📱', '⚙️', '🔧', '🔨', '📞', '📧',
  '🎓', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎵',
  '🏠', '🏡', '🏢', '🏫', '🏥', '🏪', '🏛️', '🏰',
  '🌈', '🌺', '🌸', '🌼', '🌻', '🌹', '🍀', '🌿',
  '🦁', '🦅', '🐑', '🕊️', '🦌', '🐘', '🦋', '🐝',
];

export default function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (icon: string) => {
    onSelect(icon);
    setIsOpen(false);
  };

  return (
    <div className={styles.iconPicker}>
      <button
        type="button"
        className={styles.selectedIcon}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.iconDisplay}>{selectedIcon}</span>
        <span className={styles.changeText}>Change Icon</span>
      </button>

      {isOpen && (
        <div className={styles.iconGrid}>
          {AVAILABLE_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`${styles.iconOption} ${
                icon === selectedIcon ? styles.selected : ''
              }`}
              onClick={() => handleSelect(icon)}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
