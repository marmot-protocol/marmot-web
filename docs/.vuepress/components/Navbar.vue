<script setup lang="ts">
import BrandLink from './BrandLink.vue'
import VPNavbarItems from '@theme/VPNavbarItems.vue'
import VPToggleColorModeButton from '@theme/VPToggleColorModeButton.vue'
import VPToggleSidebarButton from '@theme/VPToggleSidebarButton.vue'
import { useData } from '@theme/useData'
import { DeviceType, useUpdateDeviceStatus } from '@theme/useUpdateDeviceStatus'
import type { Slot } from '@vuepress/helper/client'
import { hasGlobalComponent } from '@vuepress/helper/client'
import { computed, ref, resolveComponent, useTemplateRef } from 'vue'

defineProps<{ sidebarOpen?: boolean }>()

defineEmits<{
  toggleSidebar: []
}>()

defineSlots<{
  before?: Slot
  after?: Slot
}>()

const SearchBox = hasGlobalComponent('SearchBox')
  ? resolveComponent('SearchBox')
  : (): null => null

const { themeLocale } = useData()

const navbar = useTemplateRef<HTMLElement | null>('navbar')
const navbarBrand = useTemplateRef<HTMLElement | null>('navbar-brand')

const linksWrapperMaxWidth = ref(0)
const linksWrapperStyle = computed(() => {
  if (!linksWrapperMaxWidth.value) {
    return {}
  }
  return {
    maxWidth: `${linksWrapperMaxWidth.value}px`,
  }
})

const getCssValue = (el: HTMLElement | null, property: string): number => {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const val = el?.ownerDocument.defaultView?.getComputedStyle(el, null)[
    property as keyof CSSStyleDeclaration
  ]

  const num = Number.parseInt(val as string, 10)

  return Number.isNaN(num) ? 0 : num
}

useUpdateDeviceStatus(
  DeviceType.Mobile,
  (mobileDesktopBreakpoint: number): void => {
    // avoid overlapping of long title and long navbar links
    const navbarHorizontalPadding =
      getCssValue(navbar.value, 'paddingLeft') +
      getCssValue(navbar.value, 'paddingRight')
    if (window.innerWidth < mobileDesktopBreakpoint) {
      linksWrapperMaxWidth.value = 0
    } else {
      linksWrapperMaxWidth.value =
        navbar.value!.offsetWidth -
        navbarHorizontalPadding -
        (navbarBrand.value?.offsetWidth ?? 0)
    }
  },
)
</script>

<template>
  <header ref="navbar" class="vp-navbar" vp-navbar>
    <div class="mm-container">
      <VPToggleSidebarButton
        :aria-expanded="sidebarOpen ?? false"
        aria-controls="mm-site-menu"
        @toggle="$emit('toggleSidebar')"
        @keydown.enter.prevent="$emit('toggleSidebar')"
        @keydown.space.prevent="$emit('toggleSidebar')"
      />

      <span ref="navbar-brand">
        <BrandLink />
      </span>

      <div class="vp-navbar-items-wrapper" :style="linksWrapperStyle">
        <slot name="before" />
        <VPNavbarItems class="vp-hide-mobile" />
        <slot name="after" />
        <VPToggleColorModeButton v-if="themeLocale.colorModeSwitch" />
        <SearchBox />
      </div>
    </div>
  </header>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

.vp-navbar {
  --vp-c-text: var(--mm-toner-200);
  --vp-c-accent: var(--mm-white);
  --navbar-line-height: calc(
    var(--navbar-height) - 2 * var(--navbar-padding-v)
  );

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;

  box-sizing: border-box;
  height: var(--navbar-height);
  padding: 0;
  border-bottom: none;

  background: var(--mm-black);
  color: var(--mm-toner-200);

  transition: none;

  @media print {
    display: none;
  }

  .mm-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    line-height: unset;
    padding-top: var(--navbar-padding-v);
    padding-bottom: var(--navbar-padding-v);

    > span {
      order: 0;

      a {
        display: block;
        line-height: 0;
      }
    }
  }
}


.vp-toggle-sidebar-button {
  position: static;
  order: 1;
  padding: 0.25rem;
}
.vp-toggle-sidebar-button .icon {
  --size: 1.5rem;
  width: var(--size);
  height: var(--size);
}
.vp-toggle-sidebar-button .icon span {
  height: 3px;
  border-radius: 0;
  background-color: var(--mm-toner-200);
}

.vp-navbar-items-wrapper {
  position: static;
  inset-inline-end: var(--navbar-padding-h);

  display: flex;

  box-sizing: border-box;
  height: var(--navbar-line-height);
  padding-inline-start: var(--navbar-padding-h);

  font-size: var(--mm-text-nav);
  white-space: nowrap;
}

@media (min-width: ($MQMobile + 1)) and (max-width: $MQNarrow) {
  .vp-navbar .vp-navbar-item + .vp-navbar-item {
    margin-inline-start: 1.25rem;
  }
}

@media (max-width: $MQMobile) {
  .vp-navbar-items-wrapper {
    padding-inline-start: 0;
  }

  .vp-navbar-items {
    border-top: 1px solid var(--vp-c-border)
  }
}
</style>
