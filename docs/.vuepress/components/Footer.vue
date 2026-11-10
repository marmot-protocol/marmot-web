<script setup lang="ts">
import VPAutoLink from '@theme/VPAutoLink.vue'
import { computed } from 'vue'
import BrandLink from './BrandLink.vue'
import { useNavbarConfig } from '@theme/useNavbarConfig'
import { useNavbarRepo } from '@theme/useNavbarRepo'

const navbarConfig = useNavbarConfig()
const navbarRepo = useNavbarRepo()

const navfootLinks = computed(() => [
  ...navbarConfig.value,
  ...navbarRepo.value,
])
</script>

<template>
  <div id="mm-footer-wrap">
    <div class="mm-container">
      <nav
        v-if="navfootLinks.length"
        class="navfoot-items"
        :style="{ '--mm-footer-link-rows': Math.ceil(navfootLinks.length / 2) }"
      >
        <div v-for="item in navfootLinks" :key="item.text" class="navfoot-item">
          <VPAutoLink :config="item" />
        </div>
      </nav>
      <div class="bottom">
        <div class="copyright">
          <span>©2025 Internet Privacy Foundation. </span>
          <span>All rights reserved.</span>
        </div>
        <BrandLink />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

#mm-footer-wrap {
  background: var(--mm-black);
  color: var(--mm-toner-50);
}

.navfoot-items {
  display: flex;
  flex-direction: column;
  gap: var(--mm-space-12);
  padding: var(--mm-space-32) 0 0;
  font-size: var(--mm-text-nav);

  @media (min-width: ($MQMobile + 1)) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(var(--mm-footer-link-rows), auto);
    grid-auto-flow: column;
    column-gap: var(--mm-space-40);
    max-width: 36rem;
  }
}

.navfoot-item {
  .auto-link {
    color: var(--mm-toner-50);
    &:hover,
    &.route-link-active {
      color: var(--mm-toner-200);
    }
    &.external-link::after {
      background-color: currentColor;
    }
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding: var(--mm-space-32) 0;
  gap: var(--mm-space-24);

  @media (max-width: $MQMobile) {
    flex-direction: column;

    .copyright {
      order: 1;
    }
  }

  @media (min-width: ($MQMobile + 1)) {
    align-items: flex-end;
  }
}

.copyright {
  color: var(--mm-toner-400);
  font-size: 0.875rem;

  span:last-child {
    white-space: nowrap;
  }
}
</style>
