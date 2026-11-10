<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ value: string; label: string; href?: string }>()
const copied = ref(false)
const copying = ref(false)
const failed = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined
let mounted = true

// The local phone preview uses HTTP, where the modern Clipboard API is absent.
const copyWithSelection = () => {
  const previousFocus = document.activeElement
  const input = document.createElement('textarea')
  input.value = props.value
  input.readOnly = true
  input.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px'
  document.body.append(input)
  try {
    input.select()
    input.setSelectionRange(0, input.value.length)
    if (!document.execCommand('copy')) throw new Error('Copy unavailable')
  } finally {
    input.remove()
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
  }
}

const copyValue = async () => {
  if (copying.value) return
  copying.value = true
  failed.value = false
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(props.value)
      } catch {
        if (!mounted) return
        copyWithSelection()
      }
    } else {
      copyWithSelection()
    }
    if (!mounted) return
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => { copied.value = false }, 3000)
  } catch {
    if (mounted) {
      copied.value = false
      failed.value = true
    }
  } finally {
    if (mounted) copying.value = false
  }
}

onBeforeUnmount(() => {
  mounted = false
  clearTimeout(resetTimer)
})
</script>

<template>
  <div class="mm-copy-value">
    <div class="mm-copy-value-row">
      <a v-if="href" :href="href" class="no-external-link-icon">{{ value }}</a>
      <span v-else class="mm-copy-value-text">{{ value }}</span>
      <button
        type="button"
        class="mm-copy-value-copy"
        :disabled="copying"
        :aria-label="`${copied ? 'Copied' : 'Copy'} ${value}`"
        :title="copied ? 'Copied' : `Copy ${label.toLowerCase()}`"
        @click="copyValue"
      >
        <Transition name="mm-copy" mode="out-in">
          <svg
            :key="copied ? 'check' : 'copy'"
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
          >
            <path v-if="copied" d="m5 12 4 4L19 6" />
            <g v-else>
              <rect x="9" y="9" width="12" height="12" rx="1" />
              <path d="M5 15H3V3h12v2" />
            </g>
          </svg>
        </Transition>
      </button>
      <span class="mm-copy-value-status" role="status">{{ copied ? `${label} copied` : '' }}</span>
    </div>
    <p v-if="failed" class="mm-copy-value-error" role="alert">Couldn’t copy. Select the text to copy it manually.</p>
  </div>
</template>

<style scoped lang="scss">
.mm-copy-value-row {
  display: flex;
  align-items: center;
  gap: 4px;

  a, .mm-copy-value-text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  a { text-decoration: underline; }
}

.mm-copy-value-copy {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--mm-toner-600);
  cursor: pointer;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);

  &:hover {
    color: var(--mm-black);
    background: var(--mm-toner-100);
  }

  &:focus-visible {
    outline: 2px solid var(--mm-toner-800);
    outline-offset: 2px;
  }
}

.mm-copy-enter-active,
.mm-copy-leave-active {
  transition: opacity var(--mm-motion-fast) ease, transform var(--mm-motion-fast) ease;
}
.mm-copy-enter-from,
.mm-copy-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.mm-copy-value-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.mm-copy-value-error {
  color: var(--mm-toner-700);
  font-size: var(--mm-text-nav);
}
</style>
