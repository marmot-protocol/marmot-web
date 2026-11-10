import { defineClientConfig } from 'vuepress/client'
import { defineAsyncComponent } from 'vue'
import Layout from './layouts/Layout.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    // Load page-specific controls and their data only where they are rendered.
    app.component('EmailLink', defineAsyncComponent(() => import('./components/EmailLink.vue')))
    app.component('CopyValue', defineAsyncComponent(() => import('./components/CopyValue.vue')))
    app.component('DeveloperPaths', defineAsyncComponent(() => import('./components/DeveloperPaths.vue')))
    app.component('CatalogDirectory', defineAsyncComponent(() => import('./components/CatalogDirectory.vue')))
    app.component('ReleasesFeed', defineAsyncComponent(() => import('./components/ReleasesFeed.vue')))
    app.component('DocumentationPage', defineAsyncComponent(() => import('./components/DocumentationPage.vue')))
    const scrollBehavior = router.options.scrollBehavior
    router.options.scrollBehavior = async (to, from, savedPosition) => {
      const position = await scrollBehavior?.(to, from, savedPosition)
      if (!position) return position
      // The theme waits for the page transition before resolving its position.
      // Only same-page section links should animate; page changes and history
      // restoration must not visibly travel through the previous scroll offset.
      const behavior = !savedPosition && to.path === from.path && to.hash &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'smooth' : 'instant'
      if ('el' in position) {
        // Vue Router's element scrolling does not apply CSS scroll padding.
        const offset = Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0
        return { ...position, top: offset, behavior }
      }
      return { ...position, behavior }
    }
  },
  layouts: {
    Layout,
  },
})
