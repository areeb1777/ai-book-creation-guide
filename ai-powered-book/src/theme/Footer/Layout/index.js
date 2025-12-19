import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css'; // Import the new styles

export default function FooterLayout({style, links, logo, copyright}) {
  return (
    <footer
      className={clsx(styles.footer)}> {/* Use our custom footer class */}
      <div className={styles.footerContainer}> {/* Custom container for overall layout */}
        <div className={styles.footerTop}>
          <div className={clsx(styles.footerSection, styles.footerSectionBrand)}>
            <div className={styles.footerLogoContainer}>
              {logo}
            </div>
            {/* You can add a custom title/description here if desired */}
            <p className={styles.footerDescription}>
              From Idea to Publication with Spec-Driven Development and AI. Your comprehensive guide to modern book creation.
            </p>
          </div>

          {links && ( // Render links if they exist
            <div className={styles.footerSection}>
              <h3 className={styles.footerHeading}>Explore</h3>
              {links} {/* FooterLinks component will be rendered here */}
            </div>
          )}

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Connect</h3>
            <ul className={styles.footerLinkList}>
              <li className={styles.footerLinkItem}>
                <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  GitHub
                </a>
              </li>
              <li className={styles.footerLinkItem}>
                <a href="/blog" className={styles.footerLink}>
                  Blog
                </a>
              </li>
              {/* Add more custom social/contact links here */}
            </ul>
          </div>
        </div>

        {(logo || copyright) && (
          <div className={styles.footerBottom}>
            {copyright}
            {/* You can add extra info here if needed */}
          </div>
        )}
      </div>
    </footer>
  );
}
