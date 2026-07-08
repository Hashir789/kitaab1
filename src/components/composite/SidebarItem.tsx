'use client';

import { isActiveLocation } from './utils';
import styles from './sidebaritem.module.css';
import { usePathname } from 'next/navigation';
import { sidebarItemProps } from './interface';

export default function SidebarItem({ text, logo, href }: sidebarItemProps) {

  const location = usePathname();
  return (
    <a href={href} className={`${styles.container} ${isActiveLocation(location, href, styles)}`}>
      {logo}
      <p className={styles.text}>{text}</p>
    </a>
  );
};