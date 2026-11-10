<script setup lang="ts">
import VPHome from '@theme/VPHome.vue'
import VPNavbar from '@theme/VPNavbar.vue'
import VPPage from '@theme/VPPage.vue'
import VPSidebar from '@theme/VPSidebar.vue'
import Footer from '../components/Footer.vue'
import { useData } from '@theme/useData'
import { useSidebarItems } from '@theme/useSidebarItems'
import type { Slot } from '@vuepress/helper/client'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onContentUpdated, useRoute } from 'vuepress/client'

defineSlots<{
  'navbar'?: Slot
  'navbar-before'?: Slot
  'navbar-after'?: Slot
  'sidebar'?: Slot
  'sidebar-top'?: Slot
  'sidebar-bottom'?: Slot
  'page'?: Slot
  'page-top'?: Slot
  'page-bottom'?: Slot
  'page-content-top'?: Slot
  'page-content-bottom'?: Slot
}>()

const { frontmatter, page, themeLocale } = useData()
const route = useRoute()

const container = ref<HTMLElement | null>(null)
let stopPageBackground = () => {}

onMounted(() => {
  const element = container.value!
  const root = document.documentElement
  const footer = element.querySelector<HTMLElement>('#mm-footer-wrap')!
  let pulledEdge: 'top' | 'bottom' = 'bottom'
  let touchY: number | undefined
  const updatePageBackground = () => {
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight)
    // The footer may be visible while we are still at the top. A page that
    // fits the viewport needs the pull direction to distinguish its two edges.
    const atTop = window.scrollY < 0 ||
      (window.scrollY <= 1 && (maxScroll > 1 || pulledEdge === 'top'))
    const atFooter = !atTop && footer.getBoundingClientRect().top < window.innerHeight
    const colour = atFooter
      ? 'var(--mm-black)'
      : getComputedStyle(element).getPropertyValue('--mm-header-bg').trim()
    if (root.style.getPropertyValue('--mm-page-edge-bg') !== colour) {
      root.style.setProperty('--mm-page-edge-bg', colour)
    }
  }

  const updatePulledEdge = (deltaY: number) => {
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight)
    if (deltaY < 0 && window.scrollY <= 1) pulledEdge = 'top'
    else if (deltaY > 0 && window.scrollY >= maxScroll - 1) pulledEdge = 'bottom'
    else return
    updatePageBackground()
  }
  // Some browsers clamp scrollY at the boundary and emit no further scroll
  // events during a bounce. Observe gestures without preventing native scrolling.
  const onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      updatePulledEdge(event.deltaY)
    }
  }
  const onTouchStart = (event: TouchEvent) => {
    touchY = event.touches.length === 1 ? event.touches[0].clientY : undefined
  }
  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      touchY = undefined
      return
    }
    const nextY = event.touches[0].clientY
    if (touchY !== undefined) updatePulledEdge(touchY - nextY)
    touchY = nextY
  }

  window.addEventListener('scroll', updatePageBackground, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', updatePageBackground)
  const observer = new ResizeObserver(updatePageBackground)
  observer.observe(element)
  const stopWatchingHeader = watch(
    () => frontmatter.value.pageClass, () => {
      pulledEdge = 'bottom'
      updatePageBackground()
    }, { flush: 'post' },
  )
  updatePageBackground()
  stopPageBackground = () => {
    window.removeEventListener('scroll', updatePageBackground)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('resize', updatePageBackground)
    observer.disconnect()
    stopWatchingHeader()
    root.style.removeProperty('--mm-page-edge-bg')
  }
})

onBeforeUnmount(() => stopPageBackground())

// navbar
const shouldShowNavbar = computed(
  () => frontmatter.value.navbar ?? themeLocale.value.navbar ?? true,
)

// sidebar
const sidebarItems = useSidebarItems()
const isSidebarOpen = ref(false)
const toggleSidebar = (to?: boolean): void => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value
}
// Section links update the hash without replacing the page content.
watch(() => route.hash, () => toggleSidebar(false))
// external-link-icon
const enableExternalLinkIcon = computed(
  () =>
    frontmatter.value.externalLinkIcon ??
    themeLocale.value.externalLinkIcon ??
    true,
)

// classes
const containerClass = computed(() => [
  {
    'no-navbar': !shouldShowNavbar.value,
    'no-sidebar': !sidebarItems.value.length,
    'sidebar-open': isSidebarOpen.value,
    'external-link-icon': enableExternalLinkIcon.value,
  },
  frontmatter.value.pageClass,
])

// close sidebar when content changes
onContentUpdated(() => {
  toggleSidebar(false)
})

</script>

<template>
  <div
    ref="container"
    class="vp-theme-container"
    :class="containerClass"
    vp-container
    @keydown.esc="toggleSidebar(false)"
  >
    <slot name="navbar">
      <VPNavbar v-if="shouldShowNavbar" :sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar">
        <template #before>
          <slot name="navbar-before" />
        </template>
        <template #after>
          <slot name="navbar-after" />
        </template>
      </VPNavbar>
    </slot>

    <div id="mm-page-wrap">
      <div class="vp-sidebar-mask" @click="toggleSidebar(false)" />
      <slot name="sidebar">
        <VPSidebar id="mm-site-menu">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </VPSidebar>
      </slot>
      <slot name="page">
        <VPHome v-if="frontmatter.home" :key="page.path" />
        <VPPage v-else :key="page.path">
          <template #top>
            <slot name="page-top" />
          </template>
          <template #content-top>
            <slot name="page-content-top" />
          </template>
          <template #content-bottom>
            <slot name="page-content-bottom" />
          </template>
          <template #bottom>
            <slot name="page-bottom" />
          </template>
        </VPPage>
      </slot>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

#mm-page-wrap {
  flex-grow: 1;
  position: relative;
  width: 100%;
  min-width: 0;
}
.mm-container {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--mm-container-width);
  margin: 0 auto;
  padding-inline: var(--mm-gutter);
}
.vp-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--mm-container-width);
  margin-inline: auto;
  padding-bottom: 0;

  [vp-content] {
    flex-grow: 1;
    box-sizing: border-box;
    width: 100%;
    max-width: calc(var(--mm-prose-width) + 2 * var(--mm-gutter));
    margin-inline: 0;
    padding: var(--mm-section-space) var(--mm-gutter);

    h2 {
      margin-top: var(--mm-space-40);
      padding-bottom: 0;
      border-bottom: 0;
    }

    > :last-child > :last-child {
      margin-bottom: 0;
    }
  }
}

@media (min-width: ($MQMobile + 1)) {
  .vp-theme-container:not(.no-sidebar) #mm-page-wrap {
    display: grid;
    grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
    gap: var(--mm-space-40);
    align-items: start;
    box-sizing: border-box;
    max-width: var(--mm-container-width);
    margin-inline: auto;
    padding-inline: var(--mm-gutter);

    .vp-page {
      grid-column: 2;
      min-width: 0;
      padding-inline-start: 0;

      [vp-content] {
        max-width: var(--mm-prose-width);
        padding-inline: 0;
      }
    }
  }
}

.vp-site-logo {
  display: block;
  width: 180px;
  height: auto;

  @media (max-width: $MQMobileNarrow) {
    width: 144px;
  }
}
.vp-site-name {
  display: none;
}

.vp-navbar-item .external-link::after {
  background-color: currentColor;
}

.vp-sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;

  display: none;

  width: 100vw;
  height: 100vh;
}

.vp-sidebar {
  font-size: var(--mm-text-nav);

  .vp-sidebar-heading {
    font-size: var(--mm-text-body);
  }

  @media (max-width: $MQMobile) {
    --vp-sidebar-c-bg: var(--mm-black);
    --vp-c-text: var(--mm-toner-200);
    --vp-c-accent: var(--mm-white);
    --vp-c-border: var(--mm-toner-800);
    --vp-c-divider: var(--mm-toner-800);
    color: var(--mm-toner-200);
    top: var(--navbar-height);
    bottom: auto;
    width: 100%;
    max-width: none;
    min-height: 0;
    height: auto;
    max-height: calc(100dvh - var(--navbar-height));
    padding-top: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    border-inline-end: 0;
    overscroll-behavior-y: contain;
    visibility: hidden;
    transform: translateY(calc(-100% - var(--navbar-height)));
    transition:
      transform var(--vp-t-transform),
      visibility 0s linear var(--mm-motion-drawer);

    .vp-navbar-items {
      padding-block: var(--mm-space-16);
      border-block: 0;
    }

    [dir='rtl'] & {
      transform: translateY(calc(-100% - var(--navbar-height)));
    }
  }
  @media (min-width: ($MQMobile + 1)) {
    position: sticky;
    top: var(--navbar-height);
    bottom: auto;
    inset-inline-start: auto;
    grid-column: 1;
    max-height: calc(100dvh - var(--navbar-height));
    width: var(--sidebar-width);
    border-inline-end: none;

    .vp-sidebar-items {
      padding-block: var(--mm-section-space);
    }

    .vp-sidebar-heading {
      padding-inline: 0;
    }

    .vp-sidebar-item:not(.vp-sidebar-heading) {
      padding-inline: var(--mm-space-16) 0;
    }
  }

  .vp-navbar-item {
    padding-inline: var(--mm-gutter);
    font-size: var(--mm-text-nav);

    @media (max-width: $MQMobile) {
      font-size: 1.375rem;
      line-height: 1.45;

      .external-link::after {
        width: 0.75em;
        height: 0.75em;
        mask-size: contain;
      }
    }
  }

  .vp-navbar-items .auto-link {
    font-weight: 500;
  }

  .vp-sidebar-item.active:not(p.vp-sidebar-heading) {
    border-inline-start-color: transparent;
  }
}

.vp-sidebar-mask {
  border-inline-end: none;
  @media (min-width: ($MQMobile + 1)) {
    transition: none;
    inset-inline-start: unset;
  }
}

.vp-theme-container {
  // Elastic scrolling can expose the navbar spacer beneath the fixed header.
  // Paint that strip with the same colour as the header/hero on every route.
  background-color: var(--vp-c-bg);
  background-image: linear-gradient(var(--mm-header-bg), var(--mm-header-bg));
  background-size: 100% var(--navbar-height);
  background-repeat: no-repeat;

  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  // navbar is disabled
  &.no-navbar {
    background-image: none;

    .vp-sidebar {
      top: 0;

      @media (max-width: $MQMobile) {
        padding-top: 0;
      }
    }

    .vp-page {
      padding-top: 0;
    }

    // adjust heading margin and padding;
    [vp-content] {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin-top: 1.5rem;
        padding-top: 0;
      }
    }
  }

  &.no-sidebar {
    // hide sidebar
    .vp-sidebar {
      display: none;

      // show sidebar on mobile because it has navbar links
      @media (max-width: $MQMobile) {
        display: block;
      }
    }

    .vp-page {
      padding-inline-start: 0;
    }
  }

  &.sidebar-open {
    .vp-toggle-sidebar-button .icon span:nth-child(1) {
      transform: rotate(45deg) translate3d(6.5px, 6.5px, 0);
    }
    @media (max-width: $MQMobile) {
      // show sidebar
      .vp-sidebar {
        transform: translateY(0);
        visibility: visible;
        transition-delay: 0s;
      }

      // show sidebar mask
      .vp-sidebar-mask {
        display: block;
      }
    }
  }
}
@media (max-width: $MQMobile) {
  html:has(.vp-theme-container.sidebar-open) {
    overflow: hidden;
  }
}
</style>
