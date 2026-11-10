<script setup lang="ts">
import { useData } from '@theme/useData'
import { RouteLink, withBase } from 'vuepress/client'

const { routeLocale, siteLocale, themeLocale } = useData()
</script>

<template>
  <RouteLink :to="themeLocale.home || routeLocale">
    <img v-if="themeLocale.logo" class="vp-site-logo"
      :src="withBase(themeLocale.logo)"
      :alt="themeLocale.logoAlt ?? siteLocale.title"
      width="238" height="36">
    <span v-else>{{ siteLocale.title }}</span>
  </RouteLink>
</template>
