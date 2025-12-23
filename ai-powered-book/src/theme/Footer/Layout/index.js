import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function FooterLayout({style, links, logo, copyright}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Links Sections */}
        {links && <div className={styles.footerTop}>{links}</div>}

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          {copyright && <div>{copyright}</div>}
        </div>
      </div>
    </footer>
  );
}