<script setup lang="ts">
import VPHomeHero from '@theme/VPHomeHero.vue'
import { Content } from 'vuepress/client'
</script>

<template>
  <main class="vp-home">
    <VPHomeHero />
    <div vp-content>
      <Content />
    </div>
  </main>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

.vp-home {
  padding-top: var(--navbar-height);

  [vp-content] {
    margin: 0;
    padding: 0;

    .mm-container {
      padding-block: var(--mm-section-space);

      > p {
        max-width: var(--mm-prose-width);
      }

      > :last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
