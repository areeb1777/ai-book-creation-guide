import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css'; // Import the new styles

export default function FooterLayout({style, links, logo, copyright}) {
  return (
    <footer
      className={styles.footer}> {/* Use our custom footer class */}
      <div className={styles.footerContainer}> {/* Custom container for overall layout */}
        <div className={styles.footerTop}>
          <div className={clsx(styles.footerSection, styles.footerSectionBrand)}>
            <div className={styles.footerLogoContainer}>
              {logo}
            </div>
            <p className={styles.footerDescription}>
              From Idea to Publication with Spec-Driven Development and AI. Your comprehensive guide to modern book creation.
            </p>
          </div>

          {links && links.length > 0 && ( // Render links if they exist
            <div className={styles.footerSection}>
              {links}
            </div>
          )}
        </div>

        {(logo || copyright) && (
          <div className={styles.footerBottom}>
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}