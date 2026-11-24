import { defineConfig } from 'vitepress'

export default defineConfig({
  // Préfixe d'URL : "/" en local, "/<namespace>/<project>/" sur GitLab Pages
  // (injecté par la variable d'env VITEPRESS_BASE dans .gitlab-ci.yml).
  base: process.env.VITEPRESS_BASE ?? '/',
  title: 'Fexios',
  description: 'A tiny, type-safe AJAX client built on the native fetch API.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Fexios',
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'API', link: '/api/fexios', activeMatch: '/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Quick start', link: '/guide/quick-start' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Requests', link: '/guide/requests' },
          { text: 'Credentials', link: '/guide/credentials' },
          { text: 'Text responses', link: '/guide/text' },
          { text: 'Error handling', link: '/guide/errors' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Fexios', link: '/api/fexios' },
          { text: 'Response', link: '/api/response' },
          { text: 'Types', link: '/api/types' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Giildo/fexios' }],
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Giildo',
    },
  },
})
