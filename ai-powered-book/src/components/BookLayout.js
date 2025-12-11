import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import { useDoc } from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import styles from './BookLayout.module.css';

function BookLayout(props) {
  const { children, title, description, image, keywords, permalink, editUrl, lastUpdatedAt, lastUpdatedBy, authors, toc, sidebar, sidebarBreadcrumbs } = props;
  const { metadata, content } = props;
  const location = useLocation();
  const isDocPage = location.pathname.startsWith('/docs/');

  return (
    <Layout
      title={title}
      description={description}
      image={image}
      wrapperClassName="main-wrapper"
    >
      <div className={styles.bookLayout}>
        {isDocPage && (
          <div className={styles.breadcrumbContainer}>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbItem}>
                <a href="/docs/intro" className={styles.breadcrumbLink}>Home</a>
              </span>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbItem}>
                <span className={styles.breadcrumbCurrent}>{title}</span>
              </span>
            </div>
          </div>
        )}

        <div className={styles.contentContainer}>
          {sidebar && <div className={styles.sidebar}>{sidebar}</div>}

          <main className={styles.mainContent}>
            {title && (
              <header className={styles.docHeader}>
                <Heading as="h1" className={styles.docTitle}>
                  {title}
                </Heading>
                {editUrl && (
                  <a href={editUrl} className={styles.editLink} target="_blank" rel="noopener noreferrer">
                    Edit this page
                  </a>
                )}
              </header>
            )}

            <div className={styles.contentWrapper}>
              <MDXContent>{children}</MDXContent>
            </div>

            {toc && (
              <div className={styles.toc}>
                <div className={styles.tocTitle}>On this page</div>
                {toc}
              </div>
            )}
          </main>
        </div>

        {/* Chapter Navigation */}
        {isDocPage && (
          <div className={styles.chapterNavigation}>
            <div className={styles.chapterNavButtons}>
              <button className={styles.navButton}>
                <span className={styles.navArrow}>←</span> Previous
              </button>
              <button className={styles.navButton}>
                Next <span className={styles.navArrow}>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookLayout;