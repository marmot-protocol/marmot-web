export function isTeamProject(href) {
  try {
    const url = new URL(href)
    return url.hostname === 'github.com' && url.pathname.split('/')[1].toLowerCase() === 'marmot-protocol'
  } catch { return false }
}

// Keep primary clients and developer entry points ahead of examples and utilities.
// Match exact project URLs so an integration inside MDK isn't ranked as the SDK.
const primaryApps = [
  'https://github.com/marmot-protocol/whitenoise-ios',
  'https://github.com/marmot-protocol/whitenoise-android',
  'https://github.com/marmot-protocol/whitenoise-mac',
  'https://github.com/marmot-protocol/whitenoise-linux',
  'https://github.com/marmot-protocol/mdk/tree/master/crates/cli',
  'https://github.com/marmot-protocol/marmots-web-chat',
]
const coreProjects = [
  'https://github.com/marmot-protocol/mdk',
  'https://github.com/marmot-protocol/marmot-ts',
  'https://github.com/marmot-protocol/marmot',
  'https://github.com/marmot-protocol/transponder',
]
const categories = ['SDKs and libraries', 'Tools and services', 'Agents and automation']

function coreRank(project) {
  const priorities = project.category === 'Apps' ? primaryApps : coreProjects
  const index = priorities.indexOf(project.href.replace(/\/$/, ''))
  return index < 0 ? priorities.length : index
}

const activity = ['active', 'unverified', 'inactive', 'archived']
function activityRank(project) {
  const index = activity.indexOf(project.labels[1])
  return index < 0 ? activity.indexOf('unverified') : index
}

export function compareProjects(a, b) {
  // Maintenance status comes before ownership and curated importance. Retired
  // projects must not outrank maintained alternatives, even if they were core.
  const activityOrder = activityRank(a) - activityRank(b)
  if (activityOrder) return activityOrder
  const teamOrder = Number(isTeamProject(b.href)) - Number(isTeamProject(a.href))
  if (teamOrder) return teamOrder
  const coreOrder = coreRank(a) - coreRank(b)
  if (coreOrder) return coreOrder
  return categories.indexOf(a.category) - categories.indexOf(b.category) ||
    a.name.localeCompare(b.name)
}
