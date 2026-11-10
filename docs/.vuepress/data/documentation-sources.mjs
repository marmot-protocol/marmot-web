// Routes stay stable when the imported release changes.
export const documentationSources = [
  { id: 'overview', title: 'Documentation', group: 'Start here', repo: 'mdk', path: 'README.md', route: '/docs/' },
  { id: 'native-apps', title: 'Native apps · MarmotKit', group: 'Integration guides', repo: 'mdk', path: 'crates/marmot-uniffi/README.md' },
  { id: 'rust-runtime', title: 'Rust application runtime', group: 'Integration guides', repo: 'mdk', path: 'crates/marmot-app/README.md' },
  { id: 'c-interface', title: 'C and native hosts', group: 'Integration guides', repo: 'mdk', path: 'crates/marmot-c/README.md' },
  { id: 'agents', title: 'Bots and agents', group: 'Integration guides', repo: 'mdk', path: 'integrations/README.md' },
  { id: 'cli', title: 'Terminal and scripts', group: 'Integration guides', repo: 'mdk', path: 'crates/cli/README.md' },
  { id: 'typescript', title: 'TypeScript quickstart', group: 'Integration guides', repo: 'marmot-ts', path: 'docs/getting-started.md' },
  { id: 'typescript-storage', title: 'TypeScript storage', group: 'Integration guides', repo: 'marmot-ts', path: 'docs/client/storage.md' },
  { id: 'typescript-network', title: 'TypeScript networking', group: 'Integration guides', repo: 'marmot-ts', path: 'docs/client/network.md' },
  { id: 'distribution', title: 'MarmotKit distribution', group: 'Reference', repo: 'mdk', path: 'crates/marmot-uniffi/DISTRIBUTION.md' },
  { id: 'native-api', title: 'MarmotKit API', group: 'Reference', repo: 'mdk', path: 'crates/marmot-uniffi/API-REFERENCE.md' },
  { id: 'c-api', title: 'C API', group: 'Reference', repo: 'mdk', path: 'crates/marmot-c/API-REFERENCE.md' },
  { id: 'architecture', title: 'Architecture', group: 'Reference', repo: 'mdk', path: 'docs/marmot-architecture/index.md' },
  { id: 'upgrading', title: 'Upgrade guide', group: 'Reference', repo: 'mdk', path: 'docs/integration/{version}.md' },
].map(source => ({ ...source, route: source.route || `/docs/${source.id}.html` }))
