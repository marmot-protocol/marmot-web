<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SelectField from './SelectField.vue'
import content from '../data/releases.json'

const route = useRoute()
const project = ref('MDK')
const limit = ref(10)
const projects = ['MDK', 'Marmot TypeScript']
const releases = content.updates.filter(item => item.status === 'Released' || item.status === 'Prerelease')
const filtered = computed(() => releases.filter(item => item.project === project.value))
const visible = computed(() => filtered.value.slice(0, limit.value))
watch(project, () => { limit.value = 10 }, { flush: 'sync' })
watch(() => route.hash, hash => {
  const item = releases.find(entry => `#${entry.id}` === hash)
  if (!item) return
  project.value = item.project
  limit.value = Math.max(10, filtered.value.indexOf(item) + 1)
}, { immediate: true })
function date(value: string) { return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) }
</script>

<template>
  <div class="mm-updates">
    <div class="mm-directory-controls mm-update-controls">
      <SelectField v-model="project" label="Project"
        :options="projects.map(value => ({ value, label: value }))" />
    </div>
    <article v-for="item in visible" :id="item.id" :key="item.id" class="mm-update-entry">
      <div class="mm-update-meta"><time v-if="item.publishedAt" :datetime="item.publishedAt">{{ date(item.publishedAt) }}</time></div>
      <h2>{{ item.version }}</h2>
      <p v-if="item.summary" class="mm-update-summary">{{ item.summary }}</p>
      <div class="mm-inline-links"><a :href="item.sourceUrl">Original notes</a><a v-if="item.releaseUrl && item.releaseUrl !== item.sourceUrl" :href="item.releaseUrl">GitHub release</a></div>
      <details :open="route.hash === `#${item.id}`" class="mm-release-details">
        <summary>Read full notes</summary>
        <!-- Generated with raw HTML disabled; relative links point to the source revision. -->
        <div class="mm-release-body" v-html="item.notesHtml" />
      </details>
    </article>
    <p v-if="!filtered.length">No releases for this project.</p>
    <button v-if="visible.length < filtered.length" type="button" class="mm-load-more" @click="limit += 10">Show older releases</button>
  </div>
</template>
