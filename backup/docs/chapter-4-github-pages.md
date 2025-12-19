---
title: Publishing Your AI-Assisted Book (GitHub Pages Deployment)
---

# Publishing Your AI-Assisted Book (GitHub Pages Deployment)

## Preparing Your GitHub Repository

Before deploying your AI-assisted book to GitHub Pages, you need to properly set up your GitHub repository. This foundational step ensures your book can be published and updated efficiently.

### Creating a New Repository

The first step is to create a GitHub repository for your Docusaurus project:

1. **Log into GitHub** and click the "New" button to create a repository
2. **Choose a repository name** that reflects your book's purpose (e.g., `my-ai-book`, `ai-book-creation-guide`)
3. **Set the visibility** - Public repositories are free and allow anyone to access your book
4. **Initialize with a README** (optional) - You can skip this since Docusaurus already provides one
5. **Do not add .gitignore or license yet** - Docusaurus will handle these appropriately

### Setting Up Git Locally

If you haven't already initialized Git in your Docusaurus project:

```bash
cd my-ai-book
git init
git add .
git commit -m "Initial Docusaurus setup"
```

### Connecting to GitHub

Link your local repository to GitHub and push your initial content:

```bash
git remote add origin https://github.com/your-username/your-repository-name.git
git branch -M main
git push -u origin main
```

### Repository Structure Best Practices

For AI-assisted books, consider this repository organization:

```
my-ai-book/
├── docs/                 # Your book chapters (this is what GitHub Pages serves)
├── blog/                 # Optional blog content
├── src/                  # Custom components and pages
├── static/               # Static assets (images, files)
├── .github/workflows/    # GitHub Actions for automated deployment
├── docusaurus.config.js  # Configuration for your site
├── sidebars.js           # Navigation configuration
├── package.json          # Project dependencies
├── README.md             # Repository overview
└── .gitignore           # Files to exclude from Git
```

### Security Considerations

- **Never commit sensitive information** like API keys or personal access tokens to your repository
- **Use environment variables** for any configuration that should remain private
- **Review your .gitignore** to ensure sensitive files are excluded

## Configuring Docusaurus for GitHub Pages

GitHub Pages requires specific configuration in your Docusaurus project to ensure proper deployment and routing. This involves updating your `docusaurus.config.js` file with GitHub-specific settings.

### GitHub Pages Configuration Settings

In your `docusaurus.config.js`, you need to set several key properties:

```javascript
// docusaurus.config.js
const config = {
  // ... other configuration
  url: 'https://your-username.github.io',  // Your GitHub Pages base URL
  baseUrl: '/your-repository-name/',       // Your repository name
  projectName: 'your-repository-name',     // GitHub repository name
  organizationName: 'your-username',       // GitHub username or organization
  trailingSlash: false,                    // Recommended for GitHub Pages
  // ... rest of configuration
};
```

### Understanding Each Configuration Option

**`url`**: This should be your GitHub Pages URL, typically in the format `https://your-username.github.io`. This is the base URL for your site.

**`baseUrl`**: This is the name of your GitHub repository. GitHub Pages serves content from a subdirectory matching your repository name.

**`projectName`**: Your GitHub repository name. This must match exactly what you named your repository on GitHub.

**`organizationName`**: Your GitHub username or organization name. This is the account that owns the repository.

**`trailingSlash`**: Set to `false` to ensure consistent URL handling across your site.

### Complete Configuration Example

Here's a complete example of the GitHub Pages configuration section:

```javascript
// docusaurus.config.js
const config = {
  title: 'My AI-Assisted Book',
  tagline: 'A guide to AI-enhanced content creation',
  favicon: 'img/favicon.ico',

  // GitHub Pages configuration
  url: 'https://your-username.github.io',
  baseUrl: '/my-ai-book/',
  projectName: 'my-ai-book',
  organizationName: 'your-username',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // GitHub-specific settings
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-username/my-ai-book/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/your-username/my-ai-book/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  // ... rest of configuration
};
```

### Testing Local Configuration

Before deploying, test your configuration locally with the production base URL:

```bash
npm run build
npm run serve
```

Visit `http://localhost:3000/my-ai-book/` (or whatever your baseUrl is) to verify everything works correctly with the GitHub Pages configuration.

## Manual Deployment to GitHub Pages

While automated deployment is preferred, understanding manual deployment helps when troubleshooting or for simple projects.

### Building Your Site

First, create a production build of your Docusaurus site:

```bash
npm run build
```

This creates a `build/` directory with static HTML files ready for deployment.

### Creating the gh-pages Branch

GitHub Pages can serve from a special `gh-pages` branch. To create and switch to this branch:

```bash
git checkout -b gh-pages
```

### Deploying the Build

Copy the contents of the `build/` directory to the root of your repository:

```bash
# Remove existing files (except .git directory)
rm -rf ./*
# Copy built files (replace 'build' with your build directory name)
cp -r build/* .
# Remove the build directory
rm -rf build/
```

### Commit and Push to gh-pages

Add, commit, and push the built files to the gh-pages branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Configure GitHub Pages

In your GitHub repository:

1. Go to **Settings** tab
2. Scroll down to **Pages** section
3. Under **Source**, select **Deploy from a branch**
4. Choose **gh-pages** as the branch
5. Select **/ (root)** as the folder
6. Click **Save**

### Alternative: Deploy to Main Branch

Instead of using the gh-pages branch, you can deploy to the `main` branch:

1. In GitHub repository settings, go to **Pages**
2. Set source to **Deploy from a branch**
3. Choose **main** branch
4. Select **/docs** folder (if your Docusaurus build outputs to docs) or **/ (root)**

## Automating Deployment with GitHub Actions

GitHub Actions provides automated deployment, ensuring your book updates whenever you push changes to your repository. This is the recommended approach for maintaining your AI-assisted book.

### Creating the GitHub Actions Workflow

Create a workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci
      - name: Build website
        run: npm run build

      # Popular action to deploy to GitHub Pages:
      # Docs: https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-docusaurus
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Understanding the Workflow

**Trigger**: The workflow runs on pushes to the `main` branch and pull requests to `main`.

**Environment**: Uses Ubuntu with Node.js 18 and caches npm dependencies.

**Steps**:
1. **Checkout**: Gets your repository code
2. **Setup Node**: Installs Node.js and caches dependencies
3. **Install Dependencies**: Runs `npm ci` to install dependencies
4. **Build Website**: Runs `npm run build` to create the static site
5. **Deploy**: Uses the `peaceiris/actions-gh-pages` action to deploy to GitHub Pages

### Enabling GitHub Actions

GitHub Actions are enabled by default for public repositories. For private repositories, ensure Actions are enabled in repository settings.

### Customizing the Workflow

You might want to customize the workflow for your specific needs:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]  # Trigger on pushes to main or master
  workflow_dispatch:         # Allow manual triggering

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build website
        run: npm run build
      - name: Upload Build Artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

### Monitoring Deployments

After setting up the workflow:

1. Check the **Actions** tab in your GitHub repository to see workflow runs
2. Monitor deployment status and troubleshoot any failures
3. The workflow will run automatically when you push to the configured branch

## Custom Domains and Advanced GitHub Pages Settings

For professional presentation, you might want to use a custom domain for your AI-assisted book. GitHub Pages supports custom domains with proper configuration.

### Setting Up a Custom Domain

1. **Purchase a domain** from a domain registrar (e.g., Namecheap, GoDaddy)
2. **Configure DNS settings** at your domain registrar to point to GitHub Pages
3. **Add the domain to your repository settings**

### Configuring the Custom Domain in GitHub

In your GitHub repository settings:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `mybook.com`)
3. Check **Enforce HTTPS** (recommended)
4. Click **Save**

### DNS Configuration at Your Registrar

Add these DNS records to your domain registrar:

**For apex domains (e.g., `mybook.com`)**:
```
A records:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**For subdomains (e.g., `docs.mybook.com`)**:
```
CNAME record:
docs.mybook.com → your-username.github.io
```

### The CNAME File

GitHub automatically creates a `CNAME` file in your published branch with your custom domain. This file should not be manually edited.

### Advanced GitHub Pages Settings

**HTTPS Enforcement**: Always enable HTTPS for security and SEO benefits.

**Branch Selection**: Choose the appropriate branch and folder for deployment.

**Cache Settings**: GitHub Pages automatically caches content for performance.

**Redirects**: GitHub Pages handles redirects automatically based on your Docusaurus configuration.

## Troubleshooting Deployment Issues

Deployment issues can occur for various reasons. Understanding common problems and their solutions helps maintain your AI-assisted book effectively.

### Common Build Failures

**Missing Dependencies**: Ensure all dependencies are listed in `package.json` and the build environment has access to them.

**Configuration Errors**: Verify that your `docusaurus.config.js` is valid JavaScript and all required fields are present.

**Path Issues**: Check that all internal links and asset paths work correctly with your GitHub Pages configuration.

### GitHub Actions Troubleshooting

**Workflow Permissions**: Ensure the workflow has appropriate permissions to deploy to GitHub Pages.

**Branch Protection**: If using branch protection rules, ensure they don't block the deployment workflow.

**Cache Issues**: Sometimes clearing the npm cache or updating workflow versions resolves deployment issues.

### DNS and Custom Domain Issues

**Propagation Time**: DNS changes can take up to 48 hours to propagate globally.

**HTTPS Certificate**: GitHub Pages automatically provisions HTTPS certificates, but this can take time after DNS changes.

**CNAME Conflicts**: Ensure you're not conflicting with other services using the same domain.

### Debugging Steps

1. **Check GitHub Actions logs** for detailed error information
2. **Verify local build** works before pushing to GitHub
3. **Test configuration** locally with production settings
4. **Review GitHub Pages settings** in repository configuration
5. **Check browser developer tools** for resource loading issues

### Verification Checklist

After deployment, verify:

- [ ] Site loads at your GitHub Pages URL
- [ ] All navigation works correctly
- [ ] Images and assets load properly
- [ ] Internal links function as expected
- [ ] Search functionality works (if enabled)
- [ ] Custom domain resolves correctly (if configured)

## Key Takeaways

- GitHub repository setup is the foundation for successful deployment
- Docusaurus configuration must include proper GitHub Pages settings
- Manual deployment involves building the site and pushing to a specific branch
- GitHub Actions provide automated deployment with minimal maintenance
- Custom domains enhance professional presentation
- Troubleshooting requires checking both build processes and GitHub configuration
- Proper testing ensures smooth deployment and user experience

---

### Checklist: Publishing Your AI-Assisted Book
- [ ] Created GitHub repository for the Docusaurus project
- [ ] Configured docusaurus.config.js with proper GitHub Pages settings
- [ ] Set up GitHub Actions workflow for automated deployment
- [ ] Tested build process locally before deployment
- [ ] Verified successful deployment and site functionality
- [ ] Configured custom domain if desired (with proper DNS settings)
- [ ] Enabled HTTPS for security and SEO benefits