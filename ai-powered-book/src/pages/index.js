import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import AiIcon from '@site/static/img/ai-icon.svg';
import BookIcon from '@site/static/img/book-icon.svg';
import CodeIcon from '@site/static/img/code-icon.svg';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.leftPane}>
          <Heading as="h1" className={styles.heroTitle}>
            The AI-Powered Guide to Book Creation
          </Heading>
          <p className={styles.heroSubtitle}>
            From Idea to Publication with Spec-Driven Development and AI. Create, write, and deploy a beautiful, production-ready book with AI assistance.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              Get Started
            </Link>
          </div>
        </div>
        <div className={styles.rightPane}>
          <div className={styles.iconFlow}>
            <CodeIcon className={clsx(styles.heroIcon, styles.codeIcon)} />
            <div className={styles.connector}></div>
            <AiIcon className={clsx(styles.heroIcon, styles.aiIcon)} />
            <BookIcon className={clsx(styles.heroIcon, styles.bookIcon)} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="An AI-powered guide to creating a book from scratch using spec-driven development.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}