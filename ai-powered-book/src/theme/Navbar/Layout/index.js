import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {ThemeClassNames, useThemeConfig} from '@docusaurus/theme-common';
import {
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';
import styles from './styles.module.css';

function NavbarBackdrop(props) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx(styles.navbarSidebarBackdrop, props.className)}
    />
  );
}

// Custom implementation of useHideableNavbar to avoid clientHeight errors
function useCustomHideableNavbar(hideOnScroll) {
  const navbarRef = useRef(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!hideOnScroll || typeof window === 'undefined') {
      return undefined;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < 100) {
        // Always show when near top
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(!isScrollingDown);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll]);

  return {navbarRef, isNavbarVisible};
}

export default function NavbarLayout({children}) {
  const {
    navbar: {hideOnScroll},
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const {navbarRef, isNavbarVisible} = useCustomHideableNavbar(hideOnScroll);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navbarRef}
      aria-label={translate({
        id: 'theme.NavBar.navAriaLabel',
        message: 'Main',
        description: 'The ARIA label for the main navigation',
      })}
      className={clsx(
        styles.navbarLayout, // Custom class for the main navbar layout
        scrolled && styles.navbarLayoutScrolled,
        hideOnScroll && [
          styles.navbarHideable,
          !isNavbarVisible && styles.navbarHidden,
        ],
        mobileSidebar.shown && styles.navbarSidebarShow, // Custom class for when mobile sidebar is shown
      )}>
      <div className={styles.navbarContent}> {/* Custom class for content wrapper */}
        {children}
      </div>
      <NavbarBackdrop onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
    </nav>
  );
}