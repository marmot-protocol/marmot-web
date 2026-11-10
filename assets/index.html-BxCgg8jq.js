import{c as r,b as t,d as n,u as e,r as l,o as d}from"./app-DZvVNV9l.js";const c="mdk",i="0.15.0",s="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/README.md",m=`<div id="mdk--marmot-development-kit" class="mm-source-title">MDK — Marmot Development Kit</div>
<p>MDK is the Rust implementation of <a href="https://github.com/marmot-protocol/marmot">Marmot</a>, an end-to-end encrypted group
messaging protocol built on <a href="https://www.rfc-editor.org/rfc/rfc9420">MLS (RFC 9420)</a> with Nostr identity. It powers
White Noise: the protocol engine, encrypted storage, Nostr transport, the app runtime behind the mobile bindings, the
<code>wn</code> command-line app, and the <code>wn-agent</code> connector that brings AI agents into encrypted chats.</p>
<p>The protocol specification lives in <a href="https://github.com/marmot-protocol/marmot">marmot-protocol/marmot</a>. This repository
holds the implementation, its architecture notes, conformance tests, formal models, and release tooling.</p>
<h2 id="contents">Contents</h2>
<ul>
<li><a href="#find-your-way">Find your way</a></li>
<li><a href="#chat-with-an-ai-agent">Chat with an AI agent</a></li>
<li><a href="#the-wn-command-line-app">The <code>wn</code> command-line app</a></li>
<li><a href="#build-an-app-on-mdk">Build an app on MDK</a></li>
<li><a href="#how-mdk-is-built">How MDK is built</a></li>
<li><a href="#how-convergence-works">How convergence works</a></li>
<li><a href="#crate-map">Crate map</a></li>
<li><a href="#development">Development</a></li>
<li><a href="#releases">Releases</a></li>
<li><a href="#license">License</a></li>
</ul>
<h2 id="find-your-way">Find your way</h2>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">I want to…</th>
<th scope="col" role="columnheader">Start here</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="I want to…" role="cell">Talk to Hermes, OpenClaw, Claude Code, Codex, OpenCode, Pi, or Goose from White Noise</td>
<td data-label="Start here" role="cell"><a href="__MARMOT_BASE__docs/agents.html">White Noise + Agents quickstart</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Write your own bot or client against <code>wn-agent</code></td>
<td data-label="Start here" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/custom-client.md">Build your own client</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Use White Noise from a terminal (CLI, daemon, TUI)</td>
<td data-label="Start here" role="cell"><a href="__MARMOT_BASE__docs/cli.html"><code>wn</code> guide</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Integrate MDK into an iOS, macOS, or Android app</td>
<td data-label="Start here" role="cell"><a href="__MARMOT_BASE__docs/native-apps.html">MarmotKit integration guide</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Integrate from C or another raw-FFI host</td>
<td data-label="Start here" role="cell"><a href="__MARMOT_BASE__docs/c-interface.html">C ABI guide</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Upgrade an app to a new MDK release</td>
<td data-label="Start here" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/integration/README.md">Version upgrade guides</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Understand the Marmot protocol</td>
<td data-label="Start here" role="cell"><a href="https://github.com/marmot-protocol/marmot">Marmot specification</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Understand MDK's architecture</td>
<td data-label="Start here" role="cell"><a href="__MARMOT_BASE__docs/architecture.html">Architecture index</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Understand how clients agree on group state</td>
<td data-label="Start here" role="cell"><a href="#how-convergence-works">How convergence works</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Contribute code</td>
<td data-label="Start here" role="cell"><a href="#development">Development</a></td>
</tr>
<tr role="row">
<td data-label="I want to…" role="cell">Cut a release</td>
<td data-label="Start here" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md">Release guide</a></td>
</tr>
</tbody>
</table>
<h2 id="chat-with-an-ai-agent">Chat with an AI agent</h2>
<p><code>wn-agent</code> gives an agent runtime its own White Noise identity and bridges encrypted Marmot chats to it over a local
control socket (same-user by default, optional bearer token). You invite the agent from White Noise on your phone like any other contact; only accounts
you allowlist can invite or message it.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Runtime</th>
<th scope="col" role="columnheader">Connector</th>
<th scope="col" role="columnheader">Docs</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Runtime" role="cell">Hermes</td>
<td data-label="Connector" role="cell">Gateway plugin</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md">integrations/hermes</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">OpenClaw</td>
<td data-label="Connector" role="cell">Channel plugin</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/openclaw/marmot/README.md">integrations/openclaw</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Claude Code</td>
<td data-label="Connector" role="cell">Terminal harness</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/claude/marmot/README.md">integrations/claude</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Codex</td>
<td data-label="Connector" role="cell">Terminal harness</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/codex/marmot/README.md">integrations/codex</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">OpenCode</td>
<td data-label="Connector" role="cell">Terminal harness</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/opencode/marmot/README.md">integrations/opencode</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Pi</td>
<td data-label="Connector" role="cell">Terminal harness</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/pi/marmot/README.md">integrations/pi</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Goose</td>
<td data-label="Connector" role="cell">Terminal harness</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/goose/marmot/README.md">integrations/goose</a></td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Your own client</td>
<td data-label="Connector" role="cell"><code>wn-agent</code> only</td>
<td data-label="Docs" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/custom-client.md">Build your own client</a></td>
</tr>
</tbody>
</table>
<p>The <a href="__MARMOT_BASE__docs/agents.html">quickstart</a> installs a checksum-verified release on macOS or Linux and gets you to a first
encrypted chat. For how connectors share one machine, identities, and allowlists, see
<a href="__MARMOT_BASE__docs/agents.html#how-the-connectors-fit-together">How the connectors fit together</a>. The connector daemon itself is documented in
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/agent-connector/README.md"><code>crates/agent-connector</code></a>.</p>
<h2 id="the-wn-command-line-app">The <code>wn</code> command-line app</h2>
<p><code>wn</code> manages accounts, relays, KeyPackages, chats, groups, and messages, and includes a terminal UI (<code>wn tui</code>). <code>wnd</code>
is the background daemon that keeps accounts synced and serves the CLI and TUI. Install both from a checkout:</p>
<pre><code class="language-sh">cargo install --path crates/cli --locked --bins
</code></pre>
<p>The <a href="__MARMOT_BASE__docs/cli.html"><code>wn</code> guide</a> covers configuration, a two-account quick start against local relays, the full
command map, the daemon, the TUI, and JSON output for scripting.
Explicit dev builds can <a href="__MARMOT_BASE__docs/cli.html#device-linking-dev-builds">link and list account devices</a> through
<code>wn devices</code> and persistent <code>wnd</code>, using <code>--features dev-device-groups</code> independently of policy-test timing.
The explicit <code>wn devices link reset --confirm</code> action discards only the local hidden device-group copy before fresh
code pairing; ordinary chat data and credentials survive, while admission and membership limits still apply.
Ordinary release builds keep this off.</p>
<h2 id="build-an-app-on-mdk">Build an app on MDK</h2>
<p>Apps embed MDK through the multi-account app runtime (<a href="__MARMOT_BASE__docs/rust-runtime.html"><code>marmot-app</code></a>), exposed as:</p>
<ul>
<li><strong>MarmotKit</strong> — UniFFI bindings for Swift (iOS, macOS) and Kotlin (Android). Start with the
<a href="__MARMOT_BASE__docs/native-apps.html">integration guide</a>, then the <a href="__MARMOT_BASE__docs/native-api.html">complete method reference</a>
and <a href="__MARMOT_BASE__docs/distribution.html">distribution notes</a>.
Controlled device-group host test builds use the separate
<a href="__MARMOT_BASE__docs/native-apps.html#experimental-device-group-test-builds">experimental constructor and artifact opt-in</a>;
ordinary constructors and release artifacts remain disabled.</li>
<li><strong>Marmot C</strong> — a C ABI over the same runtime, with ownership and blocking-call rules in the
<a href="__MARMOT_BASE__docs/c-interface.html">C guide</a> and every symbol in its <a href="__MARMOT_BASE__docs/c-api.html">reference</a>.</li>
</ul>
<p>Each release ships a concise <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/release/">release note</a> and a detailed <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/integration/README.md">upgrade guide</a>
with required changes, new defaults, and optional features. The latest is <a href="__MARMOT_BASE__docs/upgrading.html">0.14.0 → 0.15.0</a>;
read every intervening guide when skipping releases. Read docs at the tag matching your binaries — <code>master</code> may describe
unreleased APIs.</p>
<h2 id="how-mdk-is-built">How MDK is built</h2>
<p>MDK separates the protocol engine from storage, transport, and application concerns so each can be tested, replaced,
and reasoned about on its own:</p>
<pre><code class="language-text"> apps (MarmotKit / C)    wn CLI · wnd · TUI    wn-agent ──► agent runtimes
            └────────────────┬─────┴──────────────┘
                     marmot-app        multi-account runtime, projections
                     marmot-session    account-device runtime over one encrypted session
                     cgka-engine       OpenMLS group state machine + commit convergence
                     storage-sqlite    SQLCipher persistence (one DB per account-device)

 transport-nostr                     the relay plane: shared relay sessions, delivery, directory fetches
 transport-nostr-peeler / -adapter   Nostr events ⇄ engine messages, relay I/O
 transport-quic-stream / -broker     transient live previews for agent replies
 marmot-account                      account homes, signing keys, secret storage
</code></pre>
<ul>
<li>The engine is generic over a storage trait and knows nothing about Nostr; transport code lives in the peeler and
adapter.</li>
<li>Nostr plays three roles — identity, app message format, and (pluggable) transport. See
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/nostr-role.md">Nostr's role</a>.</li>
<li>For the full picture, start with the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/executive-summary.md">executive summary</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/target-architecture.md">target architecture</a>, and
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/protocol-boundary.md">protocol boundary</a>, all linked from the
<a href="__MARMOT_BASE__docs/architecture.html">architecture index</a>.</li>
</ul>
<h2 id="how-convergence-works">How convergence works</h2>
<p>In Marmot, commits are the consensus log. Clients fetch from several relays, see messages in different orders, and may
come back online holding commits from abandoned branches. Every honest client that receives the same valid messages must
still land on the same epoch and group state. The engine — not relay order or timestamps — picks the canonical branch.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">To understand…</th>
<th scope="col" role="columnheader">Read</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="To understand…" role="cell">The convergence model</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/distributed-convergence.md">Distributed convergence</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">The engine's canonicalization contract</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/cgka-engine-canonicalization-contract.md">Canonicalization contract</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">Temporal convergence and device-linking models</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/formal/liveness/README.md">Lifecycle models and implementation correspondence</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">How it is tested: scenarios, vectors, generated chaos, property tests</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/cgka-conformance-simulator/README.md">Conformance simulator</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">Multi-process and container campaigns</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/convergence-campaign-runner/README.md">Campaign runner</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">Formal proofs and how they map to Rust tests</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/formal/tamarin/README.md">Convergence model</a>, <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/formal/pairing/README.md">pairing authentication</a></td>
</tr>
<tr role="row">
<td data-label="To understand…" role="cell">What the engine owns and leaves out</td>
<td data-label="Read" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/cgka-engine/README.md"><code>cgka-engine</code></a></td>
</tr>
</tbody>
</table>
<h2 id="crate-map">Crate map</h2>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Area</th>
<th scope="col" role="columnheader">Crate</th>
<th scope="col" role="columnheader">What it is</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Area" role="cell">Engine</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/cgka-engine/README.md"><code>cgka-engine</code></a></td>
<td data-label="What it is" role="cell">OpenMLS-backed group state machine and commit convergence</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/traits/README.md"><code>traits</code></a> (<code>cgka-traits</code>)</td>
<td data-label="What it is" role="cell">Shared traits and cross-boundary types</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Storage</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/storage-sqlite/README.md"><code>storage-sqlite</code></a></td>
<td data-label="What it is" role="cell">SQLCipher persistence for engine, session, and simulator</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/fs-private/README.md"><code>fs-private</code></a></td>
<td data-label="What it is" role="cell">Owner-only file, directory, and socket creation</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/media-store/README.md"><code>media-store</code></a></td>
<td data-label="What it is" role="cell">Encrypted per-file media store: file format and file lifecycle</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Transport</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/transport-nostr-peeler/README.md"><code>transport-nostr-peeler</code></a></td>
<td data-label="What it is" role="cell">Nostr event ⇄ engine message boundary</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/transport-nostr-adapter/README.md"><code>transport-nostr-adapter</code></a></td>
<td data-label="What it is" role="cell">Relay I/O behind an injectable client</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/transport-nostr/README.md"><code>transport-nostr</code></a></td>
<td data-label="What it is" role="cell">The relay plane: per-account relay sessions, delivery and directory fetches</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/transport-quic-stream/README.md"><code>transport-quic-stream</code></a></td>
<td data-label="What it is" role="cell">QUIC transport for live agent text previews</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/transport-quic-broker/README.md"><code>transport-quic-broker</code></a></td>
<td data-label="What it is" role="cell">Memory-only preview broker (<code>marmot-quic-broker</code>); <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/quic-broker-deployment.md">deployment</a></td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">App</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-session/README.md"><code>marmot-session</code></a></td>
<td data-label="What it is" role="cell">Account-device runtime over an encrypted engine session: publish, routing, KeyPackages; <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-session/README.md#tests">tests</a></td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-account/README.md"><code>marmot-account</code></a></td>
<td data-label="What it is" role="cell">Account homes, signing keys, secret storage</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-pairing/README.md"><code>marmot-pairing</code></a></td>
<td data-label="What it is" role="cell">Device pairing: the code both screens show before a new device links (unreleased)</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="__MARMOT_BASE__docs/rust-runtime.html"><code>marmot-app</code></a></td>
<td data-label="What it is" role="cell">Multi-account app runtime, projections and host background controls used by every front end</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/nostr-directory/README.md"><code>nostr-directory</code></a></td>
<td data-label="What it is" role="cell">Directory of other people's public Nostr data: lookups, search, KeyPackage resolution</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-observability/README.md"><code>marmot-observability</code></a></td>
<td data-label="What it is" role="cell">Diagnostics exporters: relay telemetry, product analytics and its consent state, audit delivery</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-markdown/README.md"><code>marmot-markdown</code></a></td>
<td data-label="What it is" role="cell">Odin CommonMark + Nostr parser with a Rust AST bridge</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-markdown-ast/README.md"><code>marmot-markdown-ast</code></a></td>
<td data-label="What it is" role="cell">Owned Markdown types and serde implementations; compiled alongside the native parser</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-forensics/README.md"><code>marmot-forensics</code></a></td>
<td data-label="What it is" role="cell">Append-only JSONL forensic audit schema</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Bindings</td>
<td data-label="Crate" role="cell"><a href="__MARMOT_BASE__docs/native-apps.html"><code>marmot-uniffi</code></a></td>
<td data-label="What it is" role="cell">MarmotKit: Swift and Kotlin bindings</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi-macros/README.md"><code>marmot-uniffi-macros</code></a></td>
<td data-label="What it is" role="cell">Runs MarmotKit's async exports on its own Tokio runtime</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="__MARMOT_BASE__docs/c-interface.html"><code>marmot-c</code></a></td>
<td data-label="What it is" role="cell">C ABI bindings</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Front ends</td>
<td data-label="Crate" role="cell"><a href="__MARMOT_BASE__docs/cli.html"><code>cli</code></a> (<code>wn-cli</code>)</td>
<td data-label="What it is" role="cell"><code>wn</code>, <code>wnd</code>, and <code>wn tui</code></td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Agents</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/agent-connector/README.md"><code>agent-connector</code></a></td>
<td data-label="What it is" role="cell">The <code>wn-agent</code> connector daemon and its <code>doctor</code> setup check</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/agent-control/README.md"><code>agent-control</code></a></td>
<td data-label="What it is" role="cell">Agent control protocol messages and framing</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/agent-stream-compose/README.md"><code>agent-stream-compose</code></a></td>
<td data-label="What it is" role="cell">Live-preview stream composition</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="__MARMOT_BASE__docs/agents.html"><code>integrations/</code></a></td>
<td data-label="What it is" role="cell">Per-runtime plugins and terminal harnesses</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell">Verification</td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/cgka-conformance-simulator/README.md"><code>cgka-conformance-simulator</code></a></td>
<td data-label="What it is" role="cell">Multi-client scenarios, vectors, chaos, property tests</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/convergence-campaign-runner/README.md"><code>convergence-campaign-runner</code></a></td>
<td data-label="What it is" role="cell">Distributed container/VM campaigns</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/incident-replay/README.md"><code>incident-replay</code></a></td>
<td data-label="What it is" role="cell">Triages forensic exports of real incidents into verdicts and simulator vectors</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/formal/tamarin/README.md"><code>formal/tamarin</code></a></td>
<td data-label="What it is" role="cell">Tamarin models for convergence and lifecycle</td>
</tr>
<tr role="row">
<td data-label="Area" role="cell"></td>
<td data-label="Crate" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/formal/pairing/README.md"><code>formal/pairing</code></a></td>
<td data-label="What it is" role="cell">Symbolic pairing authentication and Welcome binding</td>
</tr>
</tbody>
</table>
<h2 id="development">Development</h2>
<p>The toolchain is pinned in <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/rust-toolchain.toml"><code>rust-toolchain.toml</code></a>; most tasks run through <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/Justfile"><code>just</code></a>.</p>
<p>Builds that include <code>marmot-markdown</code> also require Odin <code>dev-2026-10</code>. The shared installer verifies pinned release
checksums before extraction:</p>
<pre><code class="language-sh">bash scripts/install-odin.sh &quot;$HOME/.local/share/mdk-odin&quot;
export ODIN=&quot;$HOME/.local/share/mdk-odin/odin&quot;
</code></pre>
<p>See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-markdown/README.md#build-requirements">Markdown crate</a> for the compiler pin and native ownership
boundary. CI and the campaign/integration container builds install this toolchain automatically.</p>
<p>&lt;details&gt;
&lt;summary&gt;Nix / NixOS (x86_64 Linux)&lt;/summary&gt;</p>
<p>From this checkout, enter the environment in <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/flake.nix"><code>flake.nix</code></a>:</p>
<pre><code class="language-bash">nix --extra-experimental-features 'nix-command flakes' develop
</code></pre>
<p>The FHS shell provides Clang, pkg-config, nextest, cargo-audit, cargo-llvm-cov,
cbindgen, valgrind, Python with uv, Tamarin, Java for TLC and rustup.
Rustup reads the toolchain and required components from
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/rust-toolchain.toml"><code>rust-toolchain.toml</code></a>. Cargo keeps its usual <code>target/</code>
output directory so the TUI recipes find the binaries they build.
The packages are pinned by <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/flake.lock"><code>flake.lock</code></a>; no global <code>nix-ld</code>
configuration is required.</p>
<p>For a single command, use the app entrypoint rather than <code>nix develop -c</code>,
whose arguments the FHS shell hook does not forward:</p>
<pre><code class="language-bash">nix --extra-experimental-features 'nix-command flakes' run . -- rustc --version
</code></pre>
<p>The relay recipes need a separate <code>docker compose</code> command, provided by rootless
Podman with Docker compatibility. The FHS shell replaces the host's <code>/usr</code>, so
clients installed in <code>/usr/bin</code> are unavailable inside it. Run relay recipes
outside the shell on those hosts, or install the client through Nix on the host.</p>
<p>&lt;/details&gt;</p>
<pre><code class="language-sh">just fast-ci                 # formatting, static gates, CI's two clippy passes; skips the \`just test\` matrix
cargo test -p &lt;crate&gt;        # targeted tests for the crate you changed
just ci                      # full local parity with GitHub CI (slow)
</code></pre>
<p>Pull requests run a pre-check of a few minutes: formatting, the static and
contract gates (the tracing audit among them), dependency audit, workspace
clippy, the WASM build, and the workspace tests with the <code>precheck</code> nextest
profile. That profile stops each test after half a second and counts it as
passed, so the pre-check fails on a test that fails quickly and leaves the
slower ones to the queue. The merge queue runs the full matrix on the exact
commit it merges: every workspace test with the <code>ci</code> nextest profile, the CLI
and relay end-to-end suites, simulator lanes, C bindings, iOS clippy, Windows
filesystem contracts, Tamarin, Hermes and installer checks. <code>Required CI</code> must
pass there before a change lands. A queue run stops at its first failed job, so
the queue ejects a failing change within minutes rather than after the whole
run. Master pushes run CI only to refresh the Rust dependency caches that pull
requests and merge groups restore, and only when <code>Cargo.lock</code>, a <code>Cargo.toml</code>,
the toolchain pin, Cargo config or <code>ci.yml</code> changes.</p>
<p>Workspace test shards keep the runner's unused SDKs when at least 32 GiB is
free; below that budget they reclaim SDK space before downloading the test
archive. Builders still reclaim it unconditionally. Archive consumers verify
the checksum and require the manifest's expanded size plus a 2 GiB disk reserve
before extraction, regardless of whether cleanup ran.</p>
<p>To compare archive layouts before merge, run
<code>gh workflow run ci.yml --ref &lt;branch&gt; -f archive_layout_experiment=true</code> on a
branch at the exact revision under investigation. This also runs the normal
manual CI suite. After merge, you can dispatch <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/.github/workflows/archive-layout-experiment.yml">Archive layout experiment</a>
directly. The experiment builds once and compares fourteen
full-archive <code>slice:14</code> consumers with two binary-local groups of seven slices,
balanced by selected test counts, not measured duration. Download the one-day
diagnostics: compare archive bytes and creation time, download/extraction time,
and test-duration skew within each layout. Compare paired runs; do not add
medians from unrelated jobs. Main CI defaults stay unchanged until measurements show an
improvement without worse tail latency or lost coverage.</p>
<p>Add <code>ci:full</code> and re-run all jobs to run the full matrix on a pull request,
along with complete Android/Apple candidate packaging. <code>ci:apple</code> adds the iOS
clippy lane and Apple packaging, and <code>ci:android</code> adds Android packaging; for
packaging, re-run all candidate-workflow jobs or push a new commit. Ordinary PRs
skip complete native candidate packaging, including Android target compilation
and linking; use the opt-in when a change needs that signal before merging.
Candidate packaging also runs on master when its inputs change, and the
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#nightly-builds">nightly release</a> builds and validates the same
packages on nights it does not skip.
Existing nightly and weekly campaigns retain their wider coverage. Broker image
publishing stays serialized per ref so an older build cannot overwrite a newer
<code>latest</code> image.</p>
<p>Common targeted runs:</p>
<pre><code class="language-sh">cargo test -p cgka-engine
cargo test -p cgka-conformance-simulator                            # scenarios, vectors, property tests
cargo test -p cgka-conformance-simulator --features conformance-slow  # wider property-test run
just tamarin                                                        # formal models
</code></pre>
<p>The CLI's real-relay end-to-end tests need the local relay stack:</p>
<pre><code class="language-sh">just relay-up
just e2e-test
just relay-down
</code></pre>
<p>Notes:</p>
<ul>
<li><strong>Stack size.</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/.cargo/config.toml"><code>.cargo/config.toml</code></a> sets <code>RUST_MIN_STACK=4194304</code> for Cargo-launched tests and
debug binaries; unoptimized OpenMLS can overflow the default 2 MiB thread stack. Export the same value if you run a
debug binary directly.</li>
<li><strong>WASM.</strong> <code>just wasm-check</code> is a compile-only gate for <code>cgka-traits</code>, <code>cgka-engine</code>, and <code>transport-nostr-peeler</code> on
<code>wasm32-unknown-unknown</code> (<code>rustup target add wasm32-unknown-unknown</code>; set <code>CC_wasm32_unknown_unknown</code> to a Clang with a
wasm32 backend if needed). It does not claim browser support for storage, the runtime, bindings, or the CLI.</li>
<li><strong>Commits</strong> must be cryptographically signed.</li>
</ul>
<h2 id="releases">Releases</h2>
<p>MDK versions the whole workspace as one compatibility cohort and publishes separate artifact tracks from the same
commit: the source snapshot (<code>v&lt;version&gt;</code>), the <code>wn-agent</code> connector (<code>wn-agent-v&lt;version&gt;</code>), MarmotKit bindings
(<code>marmotkit-v&lt;version&gt;</code>), and the C bindings (<code>marmotc-v&lt;version&gt;</code>). The <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md">release guide</a> is the checklist;
per-release notes live in <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/release/"><code>docs/release/</code></a>.</p>
<p>Nightly pre-releases such as <code>marmotkit-v0.14.0-nightly.20261020</code> are built every day from the newest master commit that
passed CI. They are for testing only: pin a formal release for anything you ship, expect each nightly to be deleted
after 30 days, and don't count on going back to an older nightly. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#nightly-builds">nightly builds</a>.</p>
<h2 id="license">License</h2>
<p><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/LICENSE">MIT</a>.</p>
`,u={__name:"index.html",setup(b){return(h,a)=>{const o=l("DocumentationPage");return d(),r("div",null,[a[0]||(a[0]=t("h1",{id:"documentation",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#documentation"},[t("span",null,"Documentation")])],-1)),n(o,{document:{repo:e(c),version:e(i),sourceUrl:e(s),html:e(m)}},null,8,["document"])])}}},f=JSON.parse('{"path":"/docs/","title":"Documentation","lang":"en-US","frontmatter":{"title":"Documentation","description":"Documentation — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Dennis Reimann","username":"","email":"mail@dennisreimann.de","commits":2},{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"},{"hash":"b5c38087e37fd3cff6ecd0a321992f85905891ba","time":1764872196000,"email":"mail@dennisreimann.de","author":"Dennis Reimann","message":"General layout updates"},{"hash":"48d901cdf283aa131c9dd7c85ca1bb70468c64b8","time":1762353525000,"email":"mail@dennisreimann.de","author":"Dennis Reimann","message":"Initial commit"}]},"filePathRelative":"docs/README.md"}');export{u as comp,f as data};
