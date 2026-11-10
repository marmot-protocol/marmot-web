// Editorial snapshot, checked against project sources on 2026-11-10.
// Protocol generation, release status, and interoperability are separate claims.
export interface DeveloperResource {
  name: string
  description: string
  href: string
  label: string
  note?: string
}

export const integrationPaths: DeveloperResource[] = [
  {
    name: 'Native apps',
    description: 'Use MarmotKit from Swift or Kotlin to build for iOS, macOS, and Android.',
    href: '/docs/native-apps.html',
    label: 'MarmotKit guide',
  },
  {
    name: 'Rust applications',
    description: 'Build on the multi-account runtime, or work directly with the protocol, storage, and transport crates.',
    href: '/docs/rust-runtime.html',
    label: 'Runtime guide',
  },
  {
    name: 'C and native hosts',
    description: 'Integrate the same application runtime through MDK’s C interface.',
    href: '/docs/c-interface.html',
    label: 'C integration guide',
  },
  {
    name: 'Bots and agents',
    description: 'Connect an existing agent to White Noise, or build your own client around wn-agent.',
    href: '/docs/agents.html',
    label: 'Agent quickstart',
  },
  {
    name: 'Terminal and scripts',
    description: 'Use wn, its background daemon, JSON commands, and terminal interface.',
    href: '/docs/cli.html',
    label: 'CLI guide',
  },
  {
    name: 'Web and TypeScript',
    description: 'Explore marmot-ts, an independent implementation for browsers and JavaScript runtimes.',
    href: '/docs/typescript.html',
    label: 'TypeScript guide',
    note: 'Alpha. Its maintainers advise against production use.',
  },
]
