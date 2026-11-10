import { computed } from 'vue'
import { useRelatedLinks as useThemeRelatedLinks } from '@vuepress/theme-default/client'

export function useRelatedLinks() {
  const { prevLink, nextLink } = useThemeRelatedLinks()
  // Let the visible direction and title name the link. The theme otherwise
  // overrides the full slotted content with a title-only accessible name.
  return {
    prevLink: computed(() => prevLink.value && {
      ...prevLink.value,
      ariaLabel: '',
    }),
    nextLink: computed(() => nextLink.value && {
      ...nextLink.value,
      ariaLabel: '',
    }),
  }
}
