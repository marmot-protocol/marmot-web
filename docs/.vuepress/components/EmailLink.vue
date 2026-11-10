<script setup lang="ts">
import CopyValue from './CopyValue.vue'

defineProps<{ email: string }>()
</script>

<template>
  <CopyValue :value="email" label="Email" :href="`mailto:${email}`" />
</template>
