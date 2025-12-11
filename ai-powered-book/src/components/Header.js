import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useAnnouncementBar } from '@theme/hooks/useAnnouncementBar';
import SearchBar from '@theme/SearchBar';
import styles from './Header.module.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { siteConfig, isClient } = useDocusaurusContext();
  const { navbar: themeConfig } = useThemeConfig();
  const { isAnnouncementBarClosed } = useAnnouncementBar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { title, logo = {} } = siteConfig;
  const { alt, src, srcDark, width, height } = logo;
  const logoLink = useBaseUrl(logo.href || '/');
  const logoSrc = logo.src;

  const navigationItems = [
    { label: 'Home', to: '/' },
    { label: 'Chapters', to: '/docs/intro' },
    { label: 'About', to: '/about' },
    { label: 'GitHub', to: 'https://github.com/your-username/your-repo', external: true }
  ];

  return (
    <header
      className={clsx(
        'navbar',
        'navbar--fixed-top',
        scrolled && 'navbar--dark',
        styles.navbar,
        scrolled && styles.navbarScrolled
      )}
    >
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to={logoLink}>
            {logo != null && (
              <img
                src={useBaseUrl(logoSrc)}
                alt={alt}
                width={width}
                height={height}
                className="navbar__logo"
              />
            )}
            <strong className="navbar__title">{title}</strong>
          </Link>
        </div>

        <div className="navbar__items navbar__items--right">
          <nav className={styles.navMenu}>
            <ul className={styles.navList}>
              {navigationItems.map((item, index) => (
                <li key={index} className={styles.navItem}>
                  {item.external ? (
                    <a
                      href={item.to}
                      className={clsx('navbar__item navbar__link', styles.navLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className={clsx('navbar__item navbar__link', styles.navLink, {
                        [styles.navLinkActive]: location.pathname === item.to,
                      })}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar__items navbar__items--right">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <div className={styles.hamburgerLine}></div>
        <div className={styles.hamburgerLine}></div>
        <div className={styles.hamburgerLine}></div>
      </div>
    </header>
  );
}

export default Header;