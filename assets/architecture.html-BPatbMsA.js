import{c as n,b as t,d as a,u as e,r as i,o as c}from"./app-BEdUGG9u.js";const s="mdk",d="0.15.0",l="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/index.md",m=`<div id="marmot-architecture--index" class="mm-source-title">Marmot Architecture — Index</div>
<p>A technical reference for the Marmot stack: where the current architecture stands, which contracts are becoming spec
text, and which older notes are kept only for background.</p>
<p>This wiki is organized in two tiers:</p>
<ol>
<li><strong><code>overview/</code></strong> — <strong>short, one-page docs</strong>. Each covers one theme. Read these first; these are the docs to share with
a new engineer.</li>
<li><strong><code>further-context/</code></strong> — <strong>deep reference material</strong>. Longer design docs, historical decision tracking, codebase
surveys, and older exploration notes. Check the status banner before treating a further-context doc as current.</li>
</ol>
<hr>
<h2 id="start-here--overview-one-page-each">Start here — overview (one page each)</h2>
<p>Written to be readable in 5 minutes each, shareable as a package.</p>
<ul>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/executive-summary.md"><strong><code>overview/executive-summary.md</code></strong></a></p>
<ul>
<li><strong>What it covers:</strong> <strong>The one-pager.</strong> Problem, what we're optimizing for, what we're NOT optimizing for, target
state. Share this with a new engineer.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/protocol-boundary.md"><code>overview/protocol-boundary.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Where the line is between protocol and application. The test for putting new features on the
correct side.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/target-architecture.md"><code>overview/target-architecture.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The four components (CgkaEngine, TransportPeeler, TransportAdapter, application) and their trait
boundaries.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/capability-negotiation.md"><code>overview/capability-negotiation.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Why the capability system is load-bearing and what every client must implement.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/custom-extensions.md"><code>overview/custom-extensions.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The inherit-vs-define decision framework. The MLS Safe Extensions framework (draft-09).</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/nostr-role.md"><code>overview/nostr-role.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Nostr's three distinct roles — identity, app message format, transport — and which are
pluggable.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/nostr-account-transport.md"><code>overview/nostr-account-transport.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Working note on Nostr user directory, account bootstrap, relay plane, group routing, and relay
safety policy.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/nostr-bounded-acquisition-interface.md"><code>overview/nostr-bounded-acquisition-interface.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Optional owned acquisition and notification-loss evidence at the existing relay-client boundary.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/transport-agnosticism.md"><code>overview/transport-agnosticism.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Working note on where transport pluggability stops today: leak inventory from the FIPS spike and
PRs #1513/#1521/#1514, the five seams (directory, peeler injection, endpoint type, blob store, composition-root
bundle), and the sequencing to real carrier swaps.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/app-core-boundary.md"><code>overview/app-core-boundary.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The MDK/host-app ownership contract, including Android as a minimal display/platform layer,
shared runtime rules, bindings and storage boundaries.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/marmot-app-runtime.md"><code>overview/marmot-app-runtime.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The implemented first slice of the multi-account <code>marmot-app</code> runtime, its shared Nostr relay
plane, and the daemon, CLI, TUI boundary.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/hermes-openclaw-agent-integration-plan.md"><code>hermes-openclaw-agent-integration-plan.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Working plan for hosting Hermes Agent and OpenClaw as server-side Marmot members with a
<code>wn-agent</code> connector, local gateway shims, invite allowlists, and QUIC previews.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/hermes-agent-production-runbook.md"><code>hermes-agent-production-runbook.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Supervised deployment path for Hermes Agent with <code>wn-agent</code>, token-gated local control sockets,
systemd templates, and a Docker-to-phone manual test.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/cgka-engine-quality-and-vectors.md"><code>overview/cgka-engine-quality-and-vectors.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Near-term engine quality target: whitenoise-rs integration, chaos coverage, scenario vectors,
and byte-level vectors.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/convergence-reliability-plan.md"><code>convergence-reliability-plan.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Tracked assurance, constant review, simulator architecture, verification gates, workload
campaigns, and the path from an engine black box to app/process/container simulation.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/distributed-convergence-campaigns.md"><code>distributed-convergence-campaigns.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Container-first distributed campaign operation, the narrow VM escalation boundary, reproducible
manifests, private evidence, and the scope of distributed test claims.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/whitenoise-integration-map.md"><code>overview/whitenoise-integration-map.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> First shim map from whitenoise-rs account/relay flows to the current engine/session/account
boundary.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/observability.md"><code>overview/observability.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Privacy-safe tracing/logging rules and the repo-wide tracing audit guardrail.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/local-artifact-safety.md"><code>overview/local-artifact-safety.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Restrictive-by-construction creation of local files, sockets, and databases: the
<code>fs-private</code> helpers, the one octal-mode parser, the DB sidecar/PRAGMA-at-open rules, and the close-before-host-
suspension rules that release WAL and root-lease file locks.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/terminal-harness-execution-profiles.md"><code>overview/terminal-harness-execution-profiles.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Typed execution intent across Claude Code, Pi, OpenCode, and Codex; backend mappings, installer
acknowledgement, and the remote-execution containment boundary.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/multi-step-state-changes.md"><code>overview/multi-step-state-changes.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The no-torn-writes convention for multi-step operations: validate-before-mutate, full
compensation on error paths, intent-before-side-effects, and confirmation that reflects reality (mdk#711).</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/current-state.md"><code>overview/current-state.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Implementations, merged MIPs, the current CGKA engine workspace, and known gaps.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/direction.md"><code>overview/direction.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Where we're going after the CGKA engine/convergence work.</li>
</ul>
</li>
</ul>
<p><strong>Read order for a new engineer:</strong> executive-summary → protocol-boundary → target-architecture → capability-negotiation
→ nostr-role → app-core-boundary → marmot-app-runtime → cgka-engine-quality-and-vectors → whitenoise-integration-map →
observability → custom-extensions → current-state → direction.</p>
<hr>
<h2 id="deeper-reference--further-context">Deeper reference — further-context</h2>
<p>These are longer working documents. Go here when you need depth, not orientation.</p>
<h3 id="protocol--architecture-reference">Protocol &amp; architecture reference</h3>
<ul>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/cgka-engine-spec.md"><code>cgka-engine-spec.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Draft normative CGKA engine spec: boundary, state, convergence, storage, conformance
requirements.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/cgka-engine-canonicalization-contract.md"><code>cgka-engine-canonicalization-contract.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Draft CGKA engine canonicalization contract: post-peeling inputs, candidate-state graph, sync
state, outputs, storage, conformance scenarios.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/convergence-reliability-plan.md"><code>convergence-reliability-plan.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Working program tracker for convergence assurance claims, constants, simulator milestones,
verification ownership, and campaign exit gates.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/distributed-convergence.md"><code>distributed-convergence.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Draft convergence model for selecting one MLS branch from unordered multi-relay input.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/relay-delivery-telemetry.md"><code>relay-delivery-telemetry.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Measuring relay delivery behavior to tune convergence quiescence; cross-relay arrival spread,
quiescence regimes, and the backfill/reconciliation backstop.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/relay-observability.md"><code>relay-observability.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Export contract for client-side relay performance telemetry: the opt-in/aggregate/k-anonymous
privacy contract, metric catalogue, collection architecture, and the proposed observability.md amendment.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/telemetry.md"><code>telemetry.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Current implementation inventory for relay telemetry, OTLP export, engine reorg metrics,
tracing/logging guardrails, local surfaces, and exactly what fields are collected or exported.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/usage-diagnostics.md"><code>usage-diagnostics.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Combined consent, stock Aptabase privacy disclosure, finite backend and host observations,
bounded delivery, host adoption, operator queries, and separate deployment acceptance.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/audit-logging.md"><code>audit-logging.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Current implementation inventory for opt-in forensic JSONL logs, file identity, every event
kind and metadata field, upload/tracker behavior, and downstream tooling guidance.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/moderation-reports.md"><code>moderation-reports.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Private NIP-56 reports to the deployment's moderation team, gift-wrapped per NIP-59: event
layers, labels, reader steps, and client durability, idempotency and privacy behavior. Additive to in-group
moderation.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/runtime-state-bounds.md"><code>runtime-state-bounds.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Inventory of long-lived daemon/broker runtime structures (maps, counters, handle sets, temp
artifacts) with their bounds and eviction/reclamation rules, plus the tracked-resource discipline for adding new
ones.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/storage-format-v2.md"><code>storage-format-v2.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> MDK-local storage versioning, normalized protocol-message rows, the explicit stored-message
binary envelope, legacy compatibility, snapshot-v2 decision gate, and upgrade/downgrade operations.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/app-sqlite-storage-boundaries.md"><code>further-context/app-sqlite-storage-boundaries.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Current ownership, durability, reconciliation, legacy-import, and migration contracts for the
session, account-directory, and shared SQLite stores.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/local-daemon-protocol-boundaries.md"><code>further-context/local-daemon-protocol-boundaries.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Detailed comparison of the <code>wnd</code> and <code>marmot.agent-control.v2</code> local socket protocols and the
narrow boundary for any future shared framing helper.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/dial-safety-collector-inventory.md"><code>further-context/dial-safety-collector-inventory.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Per-attempt collector and forensic-audit HTTP inventory behind the dial-safety overview:
structural URL gates, resolve/validate/pin, disabled redirects and proxies, timeout budgets, and privacy-safe
errors.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/audit-delivery-local-slice.md"><code>further-context/audit-delivery-local-slice.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Measured JSONL recorder boundaries and the testable local cursor, prepared range, and gap
behavior before production delivery is activated.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/marmot">marmot-protocol/marmot</a></p>
<ul>
<li><strong>What it covers:</strong> Marmot v2 protocol draft by stable protocol surface and app component.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/quic-broker-deployment.md"><code>../quic-broker-deployment.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Local Compose, GHCR image, and VM deployment notes for the memory-only QUIC broker.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/target-architecture.md"><code>further-context/target-architecture.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Older long-form target architecture with illustrative trait sketches. Current orientation lives
in <code>overview/target-architecture.md</code>.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/cgka-engine-design.md"><code>further-context/cgka-engine-design.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Older long-form <code>CgkaEngine</code> design. Current contract lives in the canonicalization and
convergence docs.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/capability-negotiation.md"><code>further-context/capability-negotiation.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Full capability negotiation design. The three queries, group creation, upgrade, admin action,
MIP checklist.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/nostr-role-in-marmot.md"><code>further-context/nostr-role-in-marmot.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Deep version of Nostr's three roles. What's spec-stable and what's transport-specific.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/custom_extensions.md"><code>further-context/custom_extensions.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Full decision framework + per-MIP review + MLS Extensions Safe framework teaching +
<code>IdentityRemove</code> design space.</li>
</ul>
</li>
</ul>
<h3 id="current-state--facts-and-analysis">Current state — facts and analysis</h3>
<ul>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/account-recovery.md"><code>further-context/account-recovery.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Proposed v2 account history recovery design: scorecard, agreed decisions, durable overflow
tail, one execution path for every cause, deletions, storage, tests and delivery.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-row-contract-audit.md"><code>further-context/chat-row-contract-audit.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Current native chat-row gaps, scoped C3 follow-ups and C9 release validation evidence.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/attachment-acquisition.md"><code>further-context/attachment-acquisition.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C8 attachment audit, revisioned SQLite discovery, acquisition sequence and remaining decisions.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/avatar-cache-storage.md"><code>further-context/avatar-cache-storage.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C7-A protected avatar storage, bounds, local-read costs and later acquisition/native boundaries.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/conversation-live-window-plan.md"><code>further-context/conversation-live-window-plan.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C5 M4 viewport/capture implementation and remaining engine-authority/live-actor requirements.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/conversation-drafts.md"><code>further-context/conversation-drafts.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C5 M2 revision-safe composer metadata, conditional mutation, durable send handoff and wakeups.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/conversation-opening.md"><code>further-context/conversation-opening.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C5 M1 bounded storage opening, canonical anchors, read-state readiness and later screen inputs.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-projections-native.md"><code>further-context/chat-projections-native.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C4 native list-window and account-attention contracts, ownership, validation and client handoff.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-projection-inventory.md"><code>further-context/chat-projection-inventory.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Source-pinned inventory of chat-list, timeline, group, identity, and subscription projections;
durable versus read-time state, update/recovery paths, and inputs to complete chat-screen contracts.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-screen-contract-draft.md"><code>further-context/chat-screen-contract-draft.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> C1 working recommendations for chat-screen field ownership, bounded responses and update
consistency; identifies remaining checks before implementation.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-presentation-first-slice.md"><code>further-context/chat-presentation-first-slice.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Implementation-ready first slice for durable resolved chat-row presentation: API contract,
recovery/upgrade design, merge sequence and native adoption acceptance criteria.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/codebase-survey.md"><code>further-context/codebase-survey.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Raw metrics — LOC counts, dependency graphs, module structures.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/whitenoise-rs-deep-dive.md"><code>further-context/whitenoise-rs-deep-dive.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Detailed analysis of the whitenoise-rs client layer — major subsystems, known complexity
hotspots, refactor plan.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/learnings.md"><code>../learnings.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Historical engineering notes. Useful for archaeology, not a current contract.</li>
</ul>
</li>
</ul>
<h3 id="architecture-review-2026-10">Architecture review (2026-10)</h3>
<ul>
<li><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/review/README.md"><code>review/README.md</code></a>
<ul>
<li><strong>What it covers:</strong> In-progress system-by-system architecture review: scope, platform constraint, lenses,
evidence rules and status. Start with <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/review/00-system-map.md"><code>review/00-system-map.md</code></a> for the Pass 0 map.</li>
</ul>
</li>
</ul>
<h3 id="historical-context">Historical context</h3>
<ul>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/architectural-alternatives.md"><code>further-context/architectural-alternatives.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> The six architectural alternatives considered before landing on the target. Useful for
understanding <em>why</em> the target looks the way it does.</li>
</ul>
</li>
<li>
<p><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/decision-points.md"><code>further-context/decision-points.md</code></a></p>
<ul>
<li><strong>What it covers:</strong> Seven key architectural decisions with explicit recommendations. Several marked ✅ resolved.</li>
</ul>
</li>
</ul>
<h3 id="principles-lives-at-docs-top-level">Principles (lives at <code>docs/</code> top level)</h3>
<ul>
<li><strong>Doc:</strong> <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/required-features.md"><code>../required-features.md</code></a>
<ul>
<li><strong>What it covers:</strong> Full principles statement for what Marmot the protocol defines and what it doesn't. The
long-form version of <code>overview/protocol-boundary.md</code>.</li>
</ul>
</li>
</ul>
<hr>
<h2 id="current-state-vs-target-state-at-a-glance">Current state vs. target state, at a glance</h2>
<ul>
<li>
<p><strong>Layer:</strong> Presentation</p>
<ul>
<li><strong>Today:</strong> Flutter (whitenoise)</li>
<li><strong>Target:</strong> Unchanged</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> FFI bridge</p>
<ul>
<li><strong>Today:</strong> flutter_rust_bridge</li>
<li><strong>Target:</strong> <strong>whitenoise-ffi</strong> — transport-agnostic, Dart + Swift</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> Application</p>
<ul>
<li><strong>Today:</strong> whitenoise-rs singleton</li>
<li><strong>Target:</strong> <strong>whitenoise-core</strong> — thin facade, per-account sessions</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> Transport</p>
<ul>
<li><strong>Today:</strong> Nostr relay control planes, embedded</li>
<li><strong>Target:</strong> <code>TransportAdapter</code> trait plus <code>transport-nostr-adapter</code> core, stale subscription cleanup, diagnostics,
redacted SDK relay health, and optional SDK client; relay auth/policy next</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> CGKA Engine</p>
<ul>
<li><strong>Today:</strong> <code>crates/cgka-engine</code> implements the current OpenMLS-backed engine candidate; <code>crates/marmot-session</code> wraps
it in an encrypted account-device lifecycle</li>
<li><strong>Target:</strong> Spec-level <code>CgkaEngine</code> contract with production persistence, whitenoise-rs integration mapping, chaos
coverage, and portable vectors</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> Crypto</p>
<ul>
<li><strong>Today:</strong> OpenMLS behind <code>CgkaEngine</code></li>
<li><strong>Target:</strong> OpenMLS first, with the trait boundary preserving future CGKA swap room</li>
</ul>
</li>
<li>
<p><strong>Layer:</strong> Storage</p>
<ul>
<li><strong>Today:</strong> <code>storage-sqlite</code> for SQLCipher-backed persistence plus in-memory SQLite test/simulator runs</li>
<li><strong>Target:</strong> MLS app-component policy negotiation, app key-management integration, packaging</li>
</ul>
</li>
</ul>
<hr>
<h2 id="key-decisions-already-made">Key decisions already made</h2>
<ul>
<li><strong>PCS is non-negotiable.</strong> Both FS and PCS required. Sender Keys off the table.</li>
<li><strong>MLS stays.</strong> BeeKEM and other CGKAs interesting but immature; <code>CgkaEngine</code> trait makes them swappable in future.</li>
<li><strong>Transport is pluggable.</strong> FIPS mesh and others are first-class future targets.</li>
<li><strong>Commit convergence is engine-owned.</strong> Transport ordering is advisory; the engine canonicalizes commits before
releasing app-visible output.</li>
<li><strong>whitenoise-ffi, not whitenoise-frb.</strong> FFI bridge outputs Swift bindings too.</li>
<li><strong>Nostr has three distinct roles</strong> — identity (always), app message format (always), transport (pluggable).</li>
<li><strong>One capability per feature.</strong> Flat feature registry, no dependency graph.</li>
<li><strong>Progressive enhancement, not hard breaks.</strong> Create the best group possible, upgrade gracefully, never block
communication.</li>
</ul>
`,p={__name:"architecture.html",setup(g){return(h,o)=>{const r=i("DocumentationPage");return c(),n("div",null,[o[0]||(o[0]=t("h1",{id:"architecture",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#architecture"},[t("span",null,"Architecture")])],-1)),a(r,{document:{repo:e(s),version:e(d),sourceUrl:e(l),html:e(m)}},null,8,["document"])])}}},b=JSON.parse('{"path":"/docs/architecture.html","title":"Architecture","lang":"en-US","frontmatter":{"title":"Architecture","description":"Architecture — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/architecture.md"}');export{p as comp,b as data};
