import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { getDirname, path } from 'vuepress/utils'
import { readFileSync } from 'node:fs'

import { documentationSources } from './data/documentation-sources.mjs'

const __dirname = import.meta.dirname || getDirname(import.meta.url)
const base = process.env.NODE_ENV === 'production' ? '/marmot-web/' : '/'
// These small declarations belong in the initial HTML, avoiding two blocking
// stylesheet requests before the browser can discover the local font files.
const fontFaces = ['zilla-slab.css', 'jetbrains-mono.css']
  .map(file => readFileSync(path.resolve(__dirname, `public/fonts/${file}`), 'utf8'))
  .join('\n')
  .replaceAll("url('./", `url('${base}fonts/`)

export default defineUserConfig({
  bundler: viteBundler(),
  // Preload the current route, but do not download every guide and release
  // chunk speculatively on every visit (especially on mobile connections).
  shouldPrefetch: false,
  base,
  lang: 'en-US',
  title: 'Marmot',
  description: 'Decentralized group messaging that protects people by encrypting content and metadata.',
  // https://vuejs.press/reference/config.html#head
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.ico`, sizes: '16x16 32x32 48x48' }],
    ['link', { rel: 'icon', href: `${base}favicon-32x32.png`, type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml', sizes: 'any' }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png`, sizes: '180x180' }],
    ['link', { rel: 'manifest', href: `${base}site.webmanifest` }],
    ['link', { rel: 'preload', href: `${base}fonts/zilla-slab-v12-latin-500.woff2`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }],
    ['link', { rel: 'preload', href: `${base}fonts/zilla-slab-v12-latin-600.woff2`, as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }],
    ['style', {}, fontFaces],
  ],
  theme: defaultTheme({
    // https://ecosystem.vuejs.press/themes/default/config.html
    logo: '/images/logo-light.svg',
    navbar: [
      {
        text: 'Protocol',
        link: '/',
      },
      {
        text: 'Development Kit',
        link: '/development-kit',
      },
      {
        text: 'Documentation',
        link: '/docs/',
      },
      {
        text: 'Apps',
        link: '/apps',
      },
      {
        text: 'Releases',
        link: '/updates',
      },
      {
        text: 'Community',
        link: '/community',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/marmot-protocol',
      },
      {
        text: 'Donate',
        link: '/donate',
      },
      {
        text: 'Contact',
        link: '/contact',
      },
    ],
    sidebar: {
      '/docs/': [...new Set(documentationSources.map(item => item.group))].map(group => ({
        text: group,
        children: documentationSources.filter(item => item.group === group).map(item => ({ text: item.title, link: item.route })),
      })),
    },
    colorMode: 'light',
    colorModeSwitch: false,
    lastUpdated: false,
    contributors: false,
    themePlugins: {
      backToTop: false,
    },
  }),
  // https://ecosystem.vuejs.press/themes/default/extending.html
  alias: {
    '@theme/useRelatedLinks': path.resolve(__dirname, './composables/useRelatedLinks.ts'),
    '@documentation': path.resolve(__dirname, './data/documentation'),
    '@theme/VPNavbar.vue': path.resolve(__dirname, './components/Navbar.vue'),
    '@theme/VPHome.vue': path.resolve(__dirname, './components/Home.vue'),
    '@theme/VPHomeHero.vue': path.resolve(__dirname, './components/HomeHero.vue'),
  },
})
