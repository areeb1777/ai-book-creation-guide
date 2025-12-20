import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import AiIcon from '@site/static/img/ai-icon.svg';
import BookIcon from '@site/static/img/book-icon.svg';
import CodeIcon from '@site/static/img/code-icon.svg';

const FeatureList = [
  {
    title: 'Spec-Driven Development',
    Svg: CodeIcon,
    description: (
      <>
        Define your book's structure and content with precision using a spec-driven approach.
        Ensure consistency and clarity from outline to final draft.
      </>
    ),
  },
  {
    title: 'AI-Powered Content Generation',
    Svg: AiIcon,
    description: (
      <>
        Leverage advanced AI models to assist in writing, brainstorming, and refining your chapters.
        Accelerate your writing process with intelligent suggestions.
      </>
    ),
  },
  {
    title: 'Seamless Publication Workflow',
    Svg: BookIcon,
    description: (
      <>
        Go from idea to a fully published book with an integrated workflow.
        Generate, edit, and deploy your content to Docusaurus effortlessly.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}