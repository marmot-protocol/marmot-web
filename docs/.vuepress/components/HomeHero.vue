<script setup lang="ts">
import VPAutoLink from '@theme/VPAutoLink.vue'
import { useDarkMode } from '@theme/useDarkMode'
import { useData } from '@theme/useData'
import type { FunctionalComponent } from 'vue'
import { computed, h } from 'vue'
import { ClientOnly, withBase } from 'vuepress/client'
import type { DefaultThemeHomePageFrontmatter } from '@vuepress/theme-default/client'

const { frontmatter, siteLocale } = useData<DefaultThemeHomePageFrontmatter>()
const isDarkMode = useDarkMode()

const heroText = computed(() => {
  if (frontmatter.value.heroText === null) {
    return null
  }

  return (
    frontmatter.value.heroText ||
    siteLocale.value.title
  )
})
const tagline = computed(() => {
  if (frontmatter.value.tagline === null) {
    return null
  }

  return (
    frontmatter.value.tagline ||
    siteLocale.value.description
  )
})
const taglineHtml = computed(() => frontmatter.value.taglineHtml)
const heroImage = computed(() => {
  if (isDarkMode.value && frontmatter.value.heroImageDark !== undefined) {
    return frontmatter.value.heroImageDark
  }
  return frontmatter.value.heroImage
})
const heroAlt = computed(() => siteLocale.value.title,)

const actions = computed(() => {
  if (!Array.isArray(frontmatter.value.actions)) {
    return []
  }

  return frontmatter.value.actions.map(({ type = 'primary', ...rest }) => ({
    type,
    ...rest,
  }))
})

const HomeHeroImage: FunctionalComponent = () => {
  if (!heroImage.value) return null

  const img = h('img', {
    class: 'vp-hero-image',
    src: withBase(heroImage.value),
    alt: heroAlt.value,
    width: 748,
    height: 759,
  })

  if (frontmatter.value.heroImageDark === undefined) {
    return img
  }

  // wrap hero image with <ClientOnly> to avoid ssr-mismatch
  // when using a different hero image in dark mode
  return h(ClientOnly, () => img)
}
</script>

<template>
  <header class="vp-hero">
    <div class="mm-container">
      <HomeHeroImage />
      <div class="mm-hero-content">
        <h1 v-if="heroText" id="main-title">
          {{ heroText }}
        </h1>

        <div v-if="taglineHtml" class="vp-hero-description" v-html="tagline"/>
        <div v-else class="vp-hero-description" v-text="tagline" />

        <div v-if="actions.length" class="vp-hero-actions">
          <VPAutoLink
            v-for="action in actions"
            :key="action.text"
            class="vp-hero-action-button"
            :class="[action.type, { 'no-external-link-icon': frontmatter.pageClass?.includes('mm-editorial') }]"
            :config="action"
          >
            <template #after>
              <img
                :src="withBase('/images/arrow-right.svg')"
                alt=""
                aria-hidden="true"
                width="32"
                height="32"
                class="mm-cta-arrow">
            </template>
          </VPAutoLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

.vp-hero {
  color: var(--mm-header-text);
  background: var(--mm-header-bg);
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
  padding-block: var(--mm-section-space);

  .mm-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--mm-space-40);

    @media (max-width: $MQMobile) {
      flex-direction: column;
      gap: var(--mm-space-24);
    }
  }

  #main-title {
    margin-top: 0;
  }
}

.mm-hero-content {
  min-width: 0;
  max-width: 36rem;

  > :last-child {
    margin-bottom: 0;
  }
}

.vp-hero-image {
  display: block;
  flex-shrink: 0;
  max-width: 100%;
  width: auto;
  height: calc(69px * 4);

  @media (max-width: $MQMobileNarrow) {
    height: calc(69px * 2);
    margin: 0 auto;
  }
  @media (min-width: ($MQMobileNarrow + 1)) and (max-width: $MQMobile) {
    height: calc(69px * 3);
  }
}

.vp-hero-description {
  font-size: var(--mm-text-hero);
  line-height: 1.4;
  max-width: 21em;
  margin: 0 auto var(--mm-space-24);
  @media (min-width: ($MQMobileNarrow + 1)) and (max-width: $MQMobile) {
    text-align: center;
  }

  p {
    margin: 0;

    + p {
      margin-top: var(--mm-space-16);
    }

    span:nth-child(1) {
      color: var(--mm-lilac-900);
    }

    span:nth-child(2) {
      color: var(--mm-marine-700);
    }

    span:nth-child(3) {
      color: var(--mm-moss-900);
    }
  }
}

.vp-hero-actions {
  @media (min-width: ($MQMobileNarrow + 1)) and (max-width: $MQMobile) {
    text-align: center;
  }
}

.vp-hero-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  min-height: 3rem;
  padding: var(--mm-space-8) var(--mm-space-24);
  border: 2px solid var(--vp-c-accent-bg);

  background-color: var(--vp-c-bg);
  color: var(--vp-c-accent);

  font-size: var(--mm-text-button);
  font-weight: 500;
  line-height: 1.5;

  transition:
    background-color var(--vp-t-color),
    border-color var(--vp-t-color),
    color var(--vp-t-color);

  @media (max-width: $MQMobileNarrow) {
    width: 100%;
  }

  &:hover {
    background-color: var(--mm-toner-50);
    color: var(--vp-c-accent);
  }

  &.primary {
    background-color: var(--vp-c-accent-bg);
    color: var(--vp-c-accent-text);

    &:hover {
      border-color: var(--vp-c-accent-hover);
      background-color: var(--vp-c-accent-hover);
    }
  }
}

.mm-cta-arrow {
  margin-left: var(--mm-space-8);
  width: 1em;
  height: 1em;
  transition: transform var(--mm-motion-fast) ease;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .vp-hero-action-button:hover .mm-cta-arrow {
    transform: translateX(3px);
  }
}
</style>
