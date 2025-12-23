import React from 'react';
import Layout from '@theme/Layout';

export default function AboutPage() {
  return (
    <Layout title="About" description="About this AI Book Creation Guide">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1 className="text--center">About This Guide</h1>
            <p>
              This AI-Assisted Book Creation Guide is designed to help you master
              the art of AI-enhanced content creation with Spec-Kit Plus and Claude Code.
            </p>
            <p>
              The guide covers everything from understanding AI tools to building
              and deploying your own AI-enhanced documentation site.
            </p>
            <h2>What You'll Learn</h2>
            <ul>
              <li>Spec-Kit Plus Fundamentals</li>
              <li>Crafting Content with Claude Code</li>
              <li>Building with Docusaurus</li>
              <li>GitHub Pages Deployment</li>
              <li>Best Practices for AI-Enhanced Content</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}