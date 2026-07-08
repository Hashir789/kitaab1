'use client';

import Image from 'next/image';
import SidebarItem from './SidebarItem';
import { FaGear } from 'react-icons/fa6';
import styles from './sidebar.module.css';
import logoNormal from '@/assets/logo.png';
import logoHover from '@/assets/logo-hover.png';
import logoNormalDark from '@/assets/logo-dark.png';
import { getBreakpoint } from '@/store/slices/utils';
import { PLACEHOLDERS } from '@/constants/placeholders';
import logoHoverDark from '@/assets/logo-hover-dark.png';
import { setSidebarExpanded } from '@/store/slices/uiSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectSidebarExpanded, selectViewportWidth } from '@/store/slices/selectors';
import { isMobile, isSidebarExpanded, isSidebarCollapsed, sidebarItems } from './utils';

export default function Sidebar() {
  const dispatch = useAppDispatch();

  const sidebarExpanded = useAppSelector(selectSidebarExpanded);
  const breakpoint = getBreakpoint(useAppSelector(selectViewportWidth));
  
  const {
    KITAAB_LOGO_ALT,
    SIDEBAR_BTN_SETTINGS,
    SIDEBAR_NAV_ARIA_LABEL,
    SIDEBAR_BTN_HREF_SETTINGS,
  } = PLACEHOLDERS;

  return (
    <>
      {sidebarExpanded && (<div
        className={styles.backdrop}
        onClick={() => dispatch(setSidebarExpanded(false))}
      />)}

      <aside className={`${styles.aside} ${isMobile(sidebarExpanded, breakpoint, styles)} ${isSidebarExpanded(sidebarExpanded, breakpoint, styles)} ${isSidebarCollapsed(sidebarExpanded, breakpoint, styles)}`}>
        <header>
          <div className={styles.logo__light}>
            <Image
              priority
              width={60}
              src={logoNormal}
              alt={KITAAB_LOGO_ALT}
              className={styles.logo__normal}
            />
            <Image
              priority
              width={60}
              src={logoHover}
              alt={KITAAB_LOGO_ALT}
              className={styles.logo__hover}
            />
          </div>

          <div className={styles.logo__dark}>
            <Image
              priority
              width={60}
              src={logoNormalDark}
              alt={KITAAB_LOGO_ALT}
              className={styles.logo__normal}
            />
            <Image
              priority
              width={60}
              src={logoHoverDark}
              alt={KITAAB_LOGO_ALT}
              className={styles.logo__hover}
            />
          </div>
        </header>

        <nav
          aria-label={SIDEBAR_NAV_ARIA_LABEL}
          className={styles.nav}
        >
          <ul className={styles.list}>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <SidebarItem
                  text={item.text}
                  logo={item.logo}
                  href={item.href}
                />
              </li>
            ))}
          </ul>
        </nav>

        <footer className={styles.footer}>
          <SidebarItem
            logo={<FaGear size={24} />}
            text={SIDEBAR_BTN_SETTINGS}
            href={SIDEBAR_BTN_HREF_SETTINGS}
          />
        </footer>
      </aside>
    </>
  );
}