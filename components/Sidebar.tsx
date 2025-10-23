'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Personal', path: '/personal', icon: '👤' },
  { label: 'Marriage', path: '/marriage', icon: '💑' },
  { label: 'Parenting', path: '/parenting', icon: '👨‍👩‍👧‍👦' },
  { label: 'Calling', path: '/calling', icon: '📞' },
  { label: 'Work', path: '/work', icon: '💼' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Liahona Everyday</h1>
        <p className={styles.subtitle}>Book of Mormon Study</p>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${
              pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
