<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = defineProps<{ label: string; options: { value: string; label: string }[] }>()
const model = defineModel<string>({ required: true })
const id = useId()
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()
const open = ref(false)
const active = ref(0)
const above = ref(false)
const menuHeight = ref(320)
const selected = computed(() => props.options.find(option => option.value === model.value))
let search = '', lastTypedAt = 0

function positionMenu() {
  if (!open.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80
  const below = window.innerHeight - rect.bottom - 12
  const top = rect.top - header - 12
  above.value = below < Math.min(320, props.options.length * 48) && top > below
  menuHeight.value = Math.max(48, Math.min(320, above.value ? top : below))
}
async function revealActive() {
  await nextTick()
  const option = menu.value?.children[active.value] as HTMLElement | undefined
  if (!option || !menu.value) return
  const top = option.offsetTop, bottom = top + option.offsetHeight
  if (top < menu.value.scrollTop) menu.value.scrollTop = top
  else if (bottom > menu.value.scrollTop + menu.value.clientHeight) menu.value.scrollTop = bottom - menu.value.clientHeight
}
function close() { open.value = false; search = '' }
function show() {
  if (!props.options.length) return
  active.value = Math.max(0, props.options.findIndex(option => option.value === model.value))
  open.value = true
  positionMenu()
  void revealActive()
}
function choose(index: number) {
  const option = props.options[index]
  if (!option) return
  model.value = option.value
  close()
  trigger.value?.focus({ preventScroll: true })
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Tab') { close(); return }
  if (event.key === 'Escape') {
    if (open.value) { event.preventDefault(); event.stopPropagation(); close() }
    return
  }
  if (event.key === 'Enter' || (event.key === ' ' && (!search || Date.now() - lastTypedAt > 700))) {
    event.preventDefault()
    if (open.value) choose(active.value)
    else show()
    return
  }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    if (!open.value) show()
    else if (event.key === 'ArrowDown') active.value = Math.min(props.options.length - 1, active.value + 1)
    else if (event.key === 'ArrowUp') active.value = Math.max(0, active.value - 1)
    if (event.key === 'Home') active.value = 0
    if (event.key === 'End') active.value = props.options.length - 1
    search = ''
    void revealActive()
    return
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    if (!open.value) show()
    const now = Date.now()
    search = now - lastTypedAt < 700 ? search + event.key.toLowerCase() : event.key.toLowerCase()
    lastTypedAt = now
    const term = [...search].every(char => char === search[0]) ? search[0] : search
    const start = term.length === 1 ? active.value + 1 : active.value
    for (let offset = 0; offset < props.options.length; offset++) {
      const index = (start + offset) % props.options.length
      if (props.options[index].label.toLowerCase().startsWith(term)) { active.value = index; break }
    }
    void revealActive()
  }
}
function outside(event: Event) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) close()
}
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  document.addEventListener('focusin', outside)
  window.addEventListener('resize', positionMenu)
  window.addEventListener('scroll', positionMenu, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('focusin', outside)
  window.removeEventListener('resize', positionMenu)
  window.removeEventListener('scroll', positionMenu, true)
})
</script>

<template>
  <div ref="root" class="mm-select-field">
    <label :id="`${id}-label`" :for="id">{{ label }}</label>
    <div class="mm-select-anchor">
      <button :id="id" ref="trigger" class="mm-select-trigger" type="button" role="combobox"
        :aria-labelledby="`${id}-label ${id}-value`" aria-haspopup="listbox" :aria-expanded="open"
        :aria-controls="`${id}-options`" :aria-activedescendant="open ? `${id}-option-${active}` : undefined"
        @click="open ? close() : show()" @keydown="keydown">
        <span :id="`${id}-value`">{{ selected?.label }}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" :class="{ 'is-open': open }"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <ul v-if="open" :id="`${id}-options`" ref="menu" class="mm-select-options" :class="{ 'opens-above': above }"
        role="listbox" :aria-labelledby="`${id}-label`" :style="{ maxHeight: `${menuHeight}px` }">
        <li v-for="(option, index) in options" :id="`${id}-option-${index}`" :key="option.value"
          role="option" :aria-selected="option.value === model" :class="{ 'is-active': index === active }"
          @pointermove="active = index" @mousedown.prevent @click="choose(index)">
          <span>{{ option.label }}</span>
          <svg v-if="option.value === model" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/variables' as *;

.mm-select-field {
  flex: 1 1 12rem;
  min-width: 0;
  color: var(--mm-toner-900);
  font-size: var(--mm-text-nav);

  @media (max-width: $MQMobile) {
    flex-basis: 100%;
    width: 100%;
  }

  > label { display: block; margin-bottom: var(--mm-space-8); }
  .mm-select-anchor { position: relative; }
  .mm-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    padding: 8px 16px 8px 12px;
    border: 1px solid var(--mm-toner-200);
    border-radius: 0;
    background: var(--mm-white);
    color: inherit;
    font: inherit;
    font-size: var(--mm-text-body);
    line-height: var(--mm-leading-body);
    text-align: left;
    cursor: pointer;
    transition: border-color var(--mm-motion-fast);
    &:hover { border-color: var(--mm-toner-600); }
    &[aria-expanded='true'] { border-color: var(--mm-toner-900); }
    &:focus-visible { outline: 2px solid var(--mm-black); outline-offset: 2px; }
  }
  svg {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .mm-select-trigger svg {
    transition: transform var(--mm-motion-fast);
    &.is-open { transform: rotate(180deg); }
  }
  ul.mm-select-options {
    position: absolute;
    z-index: 15;
    inset: calc(100% + 4px) 0 auto;
    box-sizing: border-box;
    margin: 0;
    padding: 4px;
    list-style: none;
    overflow-y: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--mm-toner-200);
    border-radius: 0;
    background: var(--mm-white);
    color: var(--mm-toner-900);
    font-size: var(--mm-text-body);
    line-height: var(--mm-leading-body);
    &.opens-above { inset: auto 0 calc(100% + 4px); }
    li {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-sizing: border-box;
      min-height: 44px;
      margin: 0;
      padding: 8px;
      cursor: pointer;
      &.is-active { background: var(--mm-toner-50); }
      &[aria-selected='true'] { font-weight: 600; }
      span { overflow-wrap: anywhere; }
    }
  }
}
</style>
