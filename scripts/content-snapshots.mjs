// Keep browser payloads separate: catalogs do not need the release history,
// and releases do not need catalog metadata or sync bookkeeping.
export function browserSnapshots(content) {
  return {
    'catalog.json': {
      syncedAt: content.syncedAt,
      catalogSource: content.catalogSource,
      catalog: content.catalog,
    },
    'releases.json': { updates: content.updates },
  }
}
