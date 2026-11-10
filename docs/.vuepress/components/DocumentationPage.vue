<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, withBase } from 'vuepress/client'
import { normalizeDocumentHeadings } from '../utils/document-headings.mjs'

const props = defineProps<{ document: {
  repo: string
  version: string
  sourceUrl: string
  html: string
} }>()
const router = useRouter()
const html = computed(() => normalizeDocumentHeadings(props.document.html).replaceAll('__MARMOT_BASE__', withBase('/')))
function followLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
  if (!link || link.target || link.hasAttribute('download')) return
  const target = new URL(link.href)
  if (target.origin !== window.location.origin || !target.pathname.startsWith(withBase('/docs/'))) return
  event.preventDefault()
  // Vue Router adds the configured history base itself.
  router.push(target.pathname.slice(withBase('/').length - 1) + target.search + target.hash)
}
</script>

<template>
  <div class="mm-documentation">
    <div class="mm-doc-source">
      <span>{{ document.repo === 'mdk' ? 'MDK' : 'Marmot TypeScript' }} {{ document.version }}</span>
      <a :href="document.sourceUrl">View source on GitHub</a>
    </div>
    <p class="mm-doc-version-note">This guide follows the latest stable release. Use the documentation at your installed version’s tag when working with an older release.</p>
    <div class="mm-doc-body" @click="followLink" v-html="html" />
  </div>
</template>
