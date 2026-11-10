<script setup lang="ts">
import { RouteLink } from 'vuepress/client'
import { integrationPaths } from '../data/development'
</script>

<template>
  <div class="mm-card-grid">
    <article v-for="path in integrationPaths" :key="path.name" class="mm-resource-card">
      <h3>{{ path.name }}</h3>
      <p>{{ path.description }}</p>
      <p v-if="path.note" class="mm-caption">{{ path.note }}</p>
      <RouteLink :to="path.href" class="mm-card-link">{{ path.label }}</RouteLink>
    </article>
  </div>
</template>
