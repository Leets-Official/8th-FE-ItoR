const { existsSync } = require('node:fs');

const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromePath =
  process.env.CHROME_PATH ?? (existsSync(macChromePath) ? macChromePath : undefined);

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --host localhost --port 3000 --strictPort',
      startServerReadyPattern: 'Local',
      url: ['http://localhost:3000/', 'http://localhost:3000/register'],
      numberOfRuns: 3,
      chromePath,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
