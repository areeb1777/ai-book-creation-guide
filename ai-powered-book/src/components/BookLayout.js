import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import { useDoc } from '@docusaurus/theme-common/internal';
import styles from './BookLayout.module.css';

function BookLayout(props) {
  const { children, title, description, image, keywords, permalink, editUrl, lastUpdatedAt, lastUpdatedBy, authors, toc, sidebar, sidebarBreadcrumbs } = props;
  const location = useLocation();
  const isDocPage = location.pathname.startsWith('/docs/');

  // Get the doc context to access navigation, but only in doc context
  let next = null;
  let previous = null;

  if (isDocPage) {
    try {
      const docContext = useDoc?.();
      if (docContext && docContext.frontMatter) {
        const { frontMatter } = docContext;
        // Safely access next and previous from frontMatter
        next = frontMatter.next || frontMatter.navItem?.next;
        previous = frontMatter.previous || frontMatter.navItem?.previous;
      }
    } catch (e) {
      // If not in a doc context or error occurs, silently continue without navigation
    }
  }

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
                <Link to="/docs/intro" className={styles.breadcrumbLink}>Home</Link>
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

        {/* Chapter Navigation - only render if both exist and are valid objects */}
        {isDocPage && (next || previous) && (
          <div className={styles.chapterNavigation}>
            <div className={styles.chapterNavButtons}>
              {previous && (typeof previous === 'object' ?
                (previous.permalink && (
                  <Link to={previous.permalink} className={styles.navButton}>
                    <span className={styles.navArrow}>←</span> {previous.title || previous.label || 'Previous'}
                  </Link>
                )) :
                (
                  <Link to={previous} className={styles.navButton}>
                    <span className={styles.navArrow}>←</span> Previous
                  </Link>
                )
              )}
              {next && (typeof next === 'object' ?
                (next.permalink && (
                  <Link to={next.permalink} className={styles.navButton}>
                    {next.title || next.label || 'Next'} <span className={styles.navArrow}>→</span>
                  </Link>
                )) :
                (
                  <Link to={next} className={styles.navButton}>
                    Next <span className={styles.navArrow}>→</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookLayout;