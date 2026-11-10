import{c as a,b as t,d as i,u as e,r,o as s}from"./app-DZvVNV9l.js";const d="mdk",c="0.15.0",l="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/README.md",h=`<div id="marmot-uniffi" class="mm-source-title">marmot-uniffi</div>
<p>MarmotKit: UniFFI bindings for the Marmot app runtime (<code>marmot-app</code>), generated as Swift for iOS/macOS and Kotlin for
Android from one Rust API. This README is the entry point for app developers integrating MDK: what MDK owns, which
API to choose, the contracts behind each feature family, and how to build bindings locally. C and other raw-FFI hosts
should also read the <a href="__MARMOT_BASE__docs/c-interface.html">C ABI guide</a>, which adds ownership and blocking-call rules.</p>
<p>Read the documentation at the tag matching your binaries; <code>master</code> can describe unreleased APIs.</p>
<h2 id="contents">Contents</h2>
<ul>
<li><a href="#integration-guide-and-api-reference">Integration guide and API reference</a>: documentation map, ownership, API
selection, lifecycle, snapshots, diagnostics and compatibility</li>
<li>Runtime setup: <a href="#runtime-options-and-client-label">runtime options and client label</a>,
<a href="#experimental-device-group-test-builds">experimental device-group test builds</a>,
<a href="#exclusive-root-ownership">exclusive root ownership</a>, <a href="#threading-model">threading model</a>,
<a href="#service-endpoint-defaults">service endpoint defaults</a></li>
<li>Accounts and identity: <a href="#interactive-account-onboarding">interactive account onboarding</a>,
<a href="#identity-references-and-profiles">identity references and profiles</a>,
<a href="#keypackage-inventory">KeyPackage inventory</a>, <a href="#keypackage-selection">KeyPackage selection</a>,
<a href="#invitation-lookup-outcomes">invitation lookup outcomes</a>,
<a href="#public-nostr-event-verification">public Nostr event verification</a>,
<a href="#public-event-previews">public event previews</a></li>
<li>Screens: <a href="#selected-chat-list-presentation">selected chat-list presentation</a>,
<a href="#bounded-chat-screens">bounded chat screens</a>,
<a href="#chat-list-select-all-and-filtered-queries">chat-list select all and filtered queries</a>,
<a href="#prepared-conversation-windows">prepared conversation windows</a>,
<a href="#advanced-timeline-search">advanced timeline search</a>, <a href="#live-timeline-updates">live timeline updates</a>,
<a href="#durable-avatar-access">durable avatar access</a></li>
<li>Messages and moderation: <a href="#deletion-provenance-and-custom-events">deletion provenance and custom events</a>,
<a href="#group-system-previews">group-system previews</a>,
<a href="#device-local-membership-events">device-local membership events</a>, <a href="#members-are-accounts">members are accounts</a>,
<a href="#undelivered-welcomes">undelivered Welcomes</a>,
<a href="#turning-on-account-devices">turning on account devices</a>,
<a href="#backup-recovery-and-background-conditions">backup recovery and background conditions</a>,
<a href="#group-reporting">group reporting</a>,
<a href="#moderation-reports-to-the-operator">moderation reports to the operator</a>,
<a href="#stickers">stickers</a>, <a href="#emoji-sets">emoji sets</a>,
<a href="#history-may-be-incomplete-notices">history may be incomplete notices</a></li>
<li>Media: <a href="#file-backed-media-upload">file-backed media upload</a>,
<a href="#account-attachment-history">account attachment history</a>,
<a href="#bounded-attachment-history">bounded attachment history</a>, <a href="#local-attachment-access">local attachment access</a></li>
<li>Audit logs: <a href="#audit-v5-recording-and-delivery">audit v5 recording and delivery</a>,
<a href="#legacy-audit-v4-upload">legacy audit v4 upload</a></li>
<li>Building and packaging: <a href="#building-local-bindings">building local bindings</a>, <a href="#build-phases">build phases</a>,
<a href="#kotlin--android">Kotlin / Android</a>, <a href="#release-profile">release profile</a>,
<a href="#apple-privacy-resources">Apple privacy resources</a></li>
</ul>
<h2 id="integration-guide-and-api-reference">Integration guide and API reference</h2>
<p>This is the current integration entry point for Swift/iOS, Swift/macOS and Kotlin/Android.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Document</th>
<th scope="col" role="columnheader">Use it for</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Document" role="cell"><a href="__MARMOT_BASE__docs/native-api.html">Complete method reference</a></td>
<td data-label="Use it for" role="cell">Every exported constructor, runtime method, object method, free function and host callback, with signatures, purpose, source and API-selection guidance.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/integration/README.md">Release integration index</a></td>
<td data-label="Use it for" role="cell">Per-release upgrade guides: required changes, changed defaults, optional adoption, examples and acceptance checks. Read every intervening guide when skipping versions.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/CHANGELOG.md">Changelog</a></td>
<td data-label="Use it for" role="cell">Binding-level changes per release, including unreleased work on <code>master</code>.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="__MARMOT_BASE__docs/distribution.html">Distribution</a></td>
<td data-label="Use it for" role="cell">Exact artifact layout, platform setup, checksums, Apple resources and source/binary pairing.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-projections-native.md">Chat lists</a></td>
<td data-label="Use it for" role="cell">Bounded list windows, account attention, navigation and sequence handling.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/CHAT-LIST-ROWS.md">Chat-list rows</a></td>
<td data-label="Use it for" role="cell">Selected previews, per-message expiry handling, live draft updates and row-action availability.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/CONVERSATION-WINDOW.md">Conversation windows</a></td>
<td data-label="Use it for" role="cell">Initial unread/latest positioning, live snapshots, paging, drafts and cancellation.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/LOCAL-SENDS.md">Durable local sends</a></td>
<td data-label="Use it for" role="cell">Early local acceptance, exact optimistic-bubble correlation, captured-media draft consumption and durable edits of pending local sends.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/POLLS.md">Polls</a></td>
<td data-label="Use it for" role="cell">Encrypted NIP-88 creation, replacement votes, bounded validation and deterministic timeline results.</td>
</tr>
<tr role="row">
<td data-label="Document" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-HISTORY.md">Attachment history</a> / <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md">attachment access</a></td>
<td data-label="Use it for" role="cell">Media discovery, local bytes, atomic interactive promotion, genuine outgoing retention, progress, policy and ownership, including <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#host-managed-automatic-acquisition-0104">host-managed automatic downloads</a> and Android WorkManager migration.</td>
</tr>
</tbody>
</table>
<h3 id="what-mdk-owns-and-what-the-host-owns">What MDK owns and what the host owns</h3>
<p>MDK owns account storage, cryptographic state, relay work, durable chat presentation,
message interpretation, read state, drafts, avatar bytes and retained attachment acquisition.
A screen projection is a coherent local view, not a request to fetch every profile or
message individually. Background work updates those projections as new information arrives.</p>
<p>The host owns navigation, localization, accessibility, layout, visible pixel anchors,
image/audio/video decoding, temporary exports, and OS scheduling/notification delivery.
Keep bounded decoded/display caches; do not assume an MDK byte cache is an image decoder
or that starting a runtime grants indefinite background execution on iOS or Android.
A successful send or publication is not proof that another person received or read it.</p>
<p>One runtime can serve several accounts. Each account-device identity has its own encrypted
database; every account-scoped handle/result must stay with the account that created it.
<code>groupIdHex</code> identifies opaque MLS group bytes (commonly 16 bytes), not a 32-byte Nostr
routing ID. Use canonical member/account references from MDK. Treat opaque cursor, revision,
asset and stream handles as their documented types, never as parseable persistent identifiers.</p>
<h3 id="choose-the-right-level-of-api">Choose the right level of API</h3>
<p>These are recommendations for new chat clients, <strong>not Rust deprecation annotations or
scheduled removals</strong>. Compatibility methods remain callable. Lower-level methods remain
supported for custom clients and non-chat uses; they are not obsolete merely because a
screen API exists. The method reference marks explicit alternatives individually.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Use case</th>
<th scope="col" role="columnheader">Recommended starting point</th>
<th scope="col" role="columnheader">Existing alternative and when to use it</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Use case" role="cell">Runtime construction</td>
<td data-label="Recommended starting point" role="cell"><code>newWithConfiguration</code> with <code>MarmotOptions</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>new</code> with only a deployment; specialized constructors remain compatibility conveniences. Preserve secret store and cursor policy when migrating.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Main Chats/Unread/Archived/Left screens</td>
<td data-label="Recommended starting point" role="cell"><code>openChatListWindow</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>presentedChatList</code> / <code>openPresentedChatList</code> for a full selected list; <code>chatList</code> / <code>subscribeChatList</code> for raw rows and custom filters. Do not filter a loaded page to implement full-account search.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">One chat row</td>
<td data-label="Recommended starting point" role="cell"><code>presentedChatListRow</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>chatListRow</code> when raw fields are specifically required. Avoid account-wide reads for one row.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Account badges</td>
<td data-label="Recommended starting point" role="cell"><code>subscribeAccountAttention</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>accountUnreadSummary</code> remains a one-shot lower-level unread query, not a substitute for the prepared attention contract.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Conversation screen</td>
<td data-label="Recommended starting point" role="cell"><code>openConversationWindow</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>timelineMessages</code> / <code>subscribeTimelineMessages</code> for a custom timeline; <code>messages</code> / <code>subscribeMessages</code> for raw stored messages.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Reaction details</td>
<td data-label="Recommended starting point" role="cell"><code>messageReactions</code> for complete effective participants</td>
<td data-label="Existing alternative and when to use it" role="cell">Window references contain bounded previews only. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/CONVERSATION-WINDOW.md#complete-reaction-details">complete reaction details</a>.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Custom reaction artwork</td>
<td data-label="Recommended starting point" role="cell"><code>reactionAttachment</code> using the reaction's <code>reactionMessageIdHex</code>, then ordinary attachment acquisition/local reads</td>
<td data-label="Existing alternative and when to use it" role="cell">Resolves one reaction's matching encrypted artwork without a group-wide media scan. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-HISTORY.md#reaction-artwork">reaction artwork</a>.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Composer</td>
<td data-label="Recommended starting point" role="cell"><code>selectedMessageDraft</code>, revision-conditional save/clear/attachment reads, <code>sendMessageDraft</code></td>
<td data-label="Existing alternative and when to use it" role="cell">Unconditional <code>messageDraft</code> / <code>saveMessageDraft</code> / <code>deleteMessageDraft</code> for older single-owner flows; new concurrent composers should use revisions. <code>sendText</code> and other direct send methods remain supported.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Visible avatars</td>
<td data-label="Recommended starting point" role="cell"><code>requestAvatarAssets</code> then <code>readAvatarAssets</code> using screen metadata</td>
<td data-label="Existing alternative and when to use it" role="cell"><code>downloadProfileImage</code> / <code>downloadGroupBlossomImage</code> for explicit low-level downloads; new screens should use MDK's durable cache.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Media library</td>
<td data-label="Recommended starting point" role="cell"><code>attachmentHistoryPage</code> / <code>attachmentHistoryVersion</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>listMedia</code> is the older accepted-only listing; it omits rejected source slots and lacks the new cursor/version contract.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Display received media</td>
<td data-label="Recommended starting point" role="cell"><code>attachmentLocalAssets</code> then <code>readAttachmentAsset</code>, plus transfer observation/controls</td>
<td data-label="Existing alternative and when to use it" role="cell"><code>downloadMedia</code> is a supported one-shot network download returning full transient bytes. It is not a retained-cache read.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">KeyPackage settings</td>
<td data-label="Recommended starting point" role="cell"><code>localAccountKeyPackages</code>, then <code>refreshAccountKeyPackages</code></td>
<td data-label="Existing alternative and when to use it" role="cell"><code>accountKeyPackages</code> for the existing network-oriented inventory; <code>accountKeyPackageRelayEvents</code> remains useful for observed publication history.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Interactive imported-account onboarding</td>
<td data-label="Recommended starting point" role="cell"><code>beginOnboarding</code> / <code>beginExternalSignerOnboarding</code>, workflow snapshots and revision/epoch-aware approvals</td>
<td data-label="Existing alternative and when to use it" role="cell"><code>login</code> / <code>loginExternalSigner</code> remain compatible direct flows; they do not implement the interactive repair/notice UI for you.</td>
</tr>
<tr role="row">
<td data-label="Use case" role="cell">Group administration</td>
<td data-label="Recommended starting point" role="cell">Detailed mutation methods where available, plus <code>groupManagementState</code></td>
<td data-label="Existing alternative and when to use it" role="cell">Shorter mutation methods remain supported; use detailed results when the UI needs operation outcomes.</td>
</tr>
</tbody>
</table>
<h3 id="feature-map">Feature map</h3>
<p>All methods, including less common management/diagnostic operations, are listed in the
<a href="__MARMOT_BASE__docs/native-api.html">complete reference</a>. These are the responsibilities of the main API families:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Family</th>
<th scope="col" role="columnheader">Integration boundary</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Family" role="cell">Accounts and onboarding</td>
<td data-label="Integration boundary" role="cell">Identity creation/import, setup readiness, local sign-in/out, wipe/export and external signers. Keep local removal, leaving groups, remote publication and wiping credentials distinct; inspect returned cleanup/send outcomes. Interactive onboarding is a persisted approval workflow, not a series of unconditional setters.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Directory and profiles</td>
<td data-label="Integration boundary" role="cell">Canonical member-reference parsing, safe names, cached identities, profile/relay refresh and user search. Cached reads and explicit network refresh are separate. Use prepared identity references on chat screens instead of per-row lookups.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Groups and administration</td>
<td data-label="Integration boundary" role="cell">Creation, staged/prepared images, invitations, membership/admin changes, retention, archive/leave/disband, recovery, quarantine and maintenance. Use current capabilities; a displayed roster is not authorization. Queued operations and uncertain publication require result-aware UI. &quot;History may be incomplete&quot; notices report parked recovery; see <a href="#history-may-be-incomplete-notices">History may be incomplete notices</a>.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Messages, edits, reactions and polls</td>
<td data-label="Integration boundary" role="cell">Send/reply/edit/custom events, reaction changes, encrypted NIP-88 polls, deletion and edit history. Render effective prepared content and viewer reaction/poll state; use raw history only when the feature needs it. Every client must render and answer polls, because peers can send them.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Moderation and blocking</td>
<td data-label="Integration boundary" role="cell">Typed reports, individual dismissals, deletion-masked report targets and live block lists. Reports are not deletion evidence; the host designs moderation queue UI from the provided records.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Screens, read state and drafts</td>
<td data-label="Integration boundary" role="cell">Prepared bounded lists/conversations, account attention, read markers, manual unread, pins, mutes and revisioned composers. MDK owns persistent projection state; the host owns viewport/layout.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Chat-list selection and filters</td>
<td data-label="Integration boundary" role="cell">Select-all ID lists over a whole view and typed filter queries for windows and ID lists. The host keeps checkbox state and revalidates a selection before a bulk action; see <a href="#chat-list-select-all-and-filtered-queries">chat-list select all and filtered queries</a>.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Stickers and emoji sets</td>
<td data-label="Integration boundary" role="cell">Sonar-compatible sticker packs and NIP-51 emoji sets: discovery, install, validated asset reads and sticker sends. MDK fetches and validates images; the host renders pickers and asks before any fetch that reveals the user's IP address. See <a href="#stickers">stickers</a> and <a href="#emoji-sets">emoji sets</a>.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Media and avatars</td>
<td data-label="Integration boundary" role="cell">Sending/uploading media is separate from discovery, receiving, retained-byte access and decoding. Use original source slots and current opaque references; preserve rejected attachment positions.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Notifications and push</td>
<td data-label="Integration boundary" role="cell">Notification preferences, native registration, bounded wake/catch-up and notification subscriptions. The host owns OS tokens, permission prompts, background budgets and notification presentation.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Relays and maintenance</td>
<td data-label="Integration boundary" role="cell">Relay safety/classification, account/user relay lists, health, connectivity restoration, KeyPackage rotation and periodic group updates. Loopback development policy is explicit; connectivity recovery is not permission to reset user settings.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Agent streams</td>
<td data-label="Integration boundary" role="cell">Start/watch live text previews or use a publisher handle to append then finish a durable transcript. Preview transport and durable message delivery have different outcomes; ephemeral handles do not provide restart persistence.</td>
</tr>
<tr role="row">
<td data-label="Family" role="cell">Diagnostics</td>
<td data-label="Integration boundary" role="cell">Fixed performance milestones/snapshots, consent-gated product events, relay telemetry, audit recording/files/uploads. Keep each configuration and consent boundary explicit; do not dump secrets or DTOs into logs.</td>
</tr>
</tbody>
</table>
<h3 id="runtime-lifecycle-threads-and-errors">Runtime lifecycle, threads and errors</h3>
<ol>
<li>Install matching generated sources, native libraries and platform resources. Android must
initialize <code>MarmotAndroid</code> before construction; Apple wrappers must carry the privacy resource.</li>
<li>Construct with the intended root, relay policy, cursor persistence and secret store. For White
Noise publications, supply <code>clientName: &quot;whitenoise&quot;</code> in every foreground/background runtime.
A frozen notification-extension cursor must remain frozen when adding options.</li>
<li>Use local reads for initial UI where their contracts allow it. Start the runtime for live
account workers, relay synchronization and acquisition. Local data and send readiness are
distinct: render a conversation's available history while honoring its composer capabilities.
If one account worker fails to start, another ready account remains usable. A failed account
is retried on a later trigger after bounded in-memory backoff; repeated commands during the
delay report unavailability without reopening it. The runtime's aggregate start/reconcile
result still reports the partial failure.</li>
<li>Keep synchronous storage reads off the UI thread. Async Swift/Kotlin calls may suspend;
C methods are blocking unless documented otherwise. Host signer/secret-store callbacks may
run concurrently on worker threads and must be thread-safe. See
<a href="#threading-model">threading model</a> for which threads run MDK work.</li>
<li>Bind one receive loop to each subscription. On account/view change discard late results from
the old handle, cancel waiting tasks and release handles. Some handles have explicit <code>cancel</code>;
consult the reference rather than assuming all handles share that method.</li>
<li>Before terminal suspension or transfer of root ownership, await <code>shutdownAndClose()</code>.
It closes storage and releases locks even if host references remain. Reads on the closed
runtime fail; reconstruct a runtime and its handles on foreground. <code>shutdown()</code> only stops
work and does not by itself provide the terminal storage/root-release contract.</li>
</ol>
<p><code>RuntimeBusy</code> is contention for the exclusive root lease, not an empty account set. Handle
storage/closed/stopping/not-ready errors separately from successful empty results. On a timeout
or task cancellation, a durable mutation may already be queued; refresh authoritative state
before retrying. Do not translate every error into an empty list, restart the entire runtime on
every subscription update, or delete lock/database files to recover ownership.</p>
<p><code>EventTooLarge { artifact, sizeClass }</code> reports a size refusal of one serialized event by every requested relay on
the observed attempt. The artifact is Commit, Welcome, ApplicationMessage or Other; size classes are coarse diagnostic
buckets from under 64 KiB through over 4 MiB, not relay limits. Do not infer this error from generic relay text, a
timeout, or one refusal among mixed outcomes. Frozen native fanouts retain their strong proof: no accepted,
outstanding or ambiguously exposed targets in their retained history, and complete matching typed refusals.</p>
<p>A legacy Welcome's first attempt visible to its coarse bookkeeping can also carry this explanation. A crash before
finish bookkeeping, or expiry of an older attempt record, can hide earlier exposure. Thus a Welcome <code>EventTooLarge</code>
does <strong>not</strong> prove that the recipient never received it or that delivery is terminal: keep native retries, pending
work and confirmed state. The error has no frozen-versus-legacy discriminator; hosts must use this limited Welcome
meaning. Once the retained legacy record shows a prior attempt, its cause stays Unknown/generic rather than being
reconstructed. Unknown relay formats and KeyPackage errors carrying only a message remain generic; direct signed
helpers may also remain generic. An explicit retry can return this error; a confirmed create/invite instead exposes
the later Welcome failure through its pending query/notice without undoing the Add. No retirement or retry policy
is added.</p>
<h3 id="screen-snapshots-paging-and-ownership">Screen snapshots, paging and ownership</h3>
<p>Prepared list/conversation updates are complete replacements for their bounded window.
Apply generation/sequence ordering; do not append a replacement as if it were a page delta.
Pass current navigation tokens and preserve the visible row's pixel offset in the host.
The unread/latest anchor chooses content to load; the host still performs scrolling after layout.
Mark messages read when actually visible, not simply because an API returned them.</p>
<p>Legacy <code>nextUpdate</code> methods have different delta semantics; never mix them with <code>next</code> on the
same handle. Attachment-history cursors/versions have their own restart rules. Recreate opaque
runtime-scoped objects after reconstruction. Swift uses ARC; Kotlin hosts close disposable
UniFFI handles after cancelling/joining consumers. C hosts use only the matching deep-free and
never free handles during concurrent use. Returned plaintext and copies made by host decoders
remain the host's responsibility, including removal of downstream copies after local deletion.</p>
<h3 id="localization-privacy-and-diagnostics">Localization, privacy and diagnostics</h3>
<p>Native startup investigation can explicitly call <code>set_startup_diagnostics_enabled(true)</code> before the first account query, then read <code>startup_diagnostics_snapshot()</code> while a call remains unfinished. The snapshot uses independent bounded memory and fixed phases, including key lookup, database-open waiting and migration numbers; it contains no paths, account identifiers or error text. Keep normal builds disabled, bound host serialization separately, and revoke capture with <code>false</code> when it is no longer needed. Neither method changes upload consent or database state. See the <a href="__MARMOT_BASE__docs/native-api.html">API reference</a>.</p>
<p><code>record_host_performance</code> accepts 28 shared host stages for runtime/UI initialization,
accounts, lists, profiles, timelines, sending/search, media and preferences, plus
nine Linux-specific vault/startup and event-loop stages. <code>MessageSend</code> covers host
send task execution, including attachment work. <code>ConversationSearch</code> finds
conversations containing matching messages. <code>MediaApply</code> installs prepared media
in the UI; this is UI resource application, not network publication.</p>
<p>All stages are readable by their <code>host_*</code> operation name in the existing
<code>AppPerformanceSnapshotFfi.runtime_operations</code> array, including the Linux stages.
They use the runtime registry's <code>app_runtime_host_*</code> OTLP series with the same
started/completed counters, five outcomes, histogram and live gauges. Hosts report
the actual outcome; merely leaving a scope does not establish success. These
completed-duration reports have no live observation, so their live gauges are zero.
Hosts should record every stage they can observe, and only those. Nested stages overlap and
must not be summed. See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-observability/src/app_telemetry.rs">operation definitions</a> and
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/telemetry.md#registered-host-stage-metrics">metric catalog</a>.</p>
<p>Use typed presentation, capability, deletion and group-system fields rather than parsing English
strings or guessing from membership counts. Clients localize fallback labels and system wording.
Preserve unknown variants/provenance as neutral presentation rather than inventing an actor.
Configure consent-gated analytics, audit uploads and relay telemetry deliberately; endpoint URLs
are not credentials. Never log message bodies, asset references, keys, account/group identifiers,
raw DTO stringification or relay URLs as performance labels. Use bounded performance operations
and aggregate snapshots; keep secrets out of diagnostics and host callback errors.</p>
<h3 id="markdown-rendering">Markdown rendering</h3>
<p>Render the typed Markdown tokens on message, timeline and reply-preview records.
<code>parseMarkdown</code> returns the same AST for draft previews and custom renderers.
<code>MarkdownInlineFfi.Timestamp</code> carries signed <code>unixSeconds</code> (Swift <code>Int64</code>, Kotlin
<code>Long</code>) and a <code>MarkdownTimestampStyleFfi</code>, with no formatted text. Timestamp syntax
is <code>&lt;t:UNIX_SECONDS&gt;</code> or <code>&lt;t:UNIX_SECONDS:STYLE&gt;</code>; the parser resolves an omitted
style to <code>ShortDateTime</code>. Invalid timestamp syntax remains literal text.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Style token</th>
<th scope="col" role="columnheader">Enum variant</th>
<th scope="col" role="columnheader">Display</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Style token" role="cell"><code>t</code></td>
<td data-label="Enum variant" role="cell"><code>ShortTime</code></td>
<td data-label="Display" role="cell">Time without seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>T</code></td>
<td data-label="Enum variant" role="cell"><code>LongTime</code></td>
<td data-label="Display" role="cell">Time including seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>d</code></td>
<td data-label="Enum variant" role="cell"><code>ShortDate</code></td>
<td data-label="Display" role="cell">Short date</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>D</code></td>
<td data-label="Enum variant" role="cell"><code>LongDate</code></td>
<td data-label="Display" role="cell">Long date</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>f</code> (default)</td>
<td data-label="Enum variant" role="cell"><code>ShortDateTime</code></td>
<td data-label="Display" role="cell">Long date and time without seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>F</code></td>
<td data-label="Enum variant" role="cell"><code>LongDateTime</code></td>
<td data-label="Display" role="cell">Weekday, long date and time without seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>s</code></td>
<td data-label="Enum variant" role="cell"><code>CompactDateTime</code></td>
<td data-label="Display" role="cell">Short date and time without seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>S</code></td>
<td data-label="Enum variant" role="cell"><code>CompactDateTimeSeconds</code></td>
<td data-label="Display" role="cell">Short date and time including seconds</td>
</tr>
<tr role="row">
<td data-label="Style token" role="cell"><code>R</code></td>
<td data-label="Enum variant" role="cell"><code>Relative</code></td>
<td data-label="Display" role="cell">Time relative to the current clock</td>
</tr>
</tbody>
</table>
<p>Use native date/time formatters with the device's current locale and timezone at
render time, including its date order and 12/24-hour preference. The parser and
bindings do not own a clock, timezone, formatter or refresh task. Refresh displayed
timestamps when locale, timezone or system clock changes and when the app resumes;
visible <code>Relative</code> nodes also need time-driven refresh even if the message tokens
are unchanged. A host may provide a localized absolute-time tooltip or accessibility
description. Keep the timestamp and typed style in display caches rather than
persisting formatted strings. The native renderer is supplied by the host app,
not this crate.</p>
<h3 id="compatibility">Compatibility</h3>
<p>Generated source, DTOs, enums, errors, headers and native code form one versioned contract.
An additive Rust method, record field or enum case does not imply that an old generated binding
can call or decode a new library: regenerate Swift/Kotlin bindings from the native library you ship
and update both together. For example, older generated sources cannot render the <code>MarkdownBlockFfi</code>
<code>Details</code> variant (bounded <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code> blocks) or record newer host-performance stages.
C record layouts are especially sensitive; C consumers rebuild against the matching header and library.
Database upgrades are separate from source-level API compatibility, and rolling back only the
library can be unsupported.</p>
<p>The reference's names, signatures and source-line links are checked against source with
<code>just binding-docs-gate</code>; prose and runtime behavior are reviewed by hand. Every release from
0.10.2 has concise release notes and a separate detailed integration guide; see
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#release-documentation">the release checklist</a>.</p>
<h2 id="runtime-options-and-client-label">Runtime options and client label</h2>
<p><code>MarmotOptions</code> combines <code>relayPolicy</code>, <code>cursorPersistence</code>, <code>clientName</code>, <code>devicePlatform</code>, <code>secretStore</code> and
<code>attachmentAcquisitionMode</code> with the required <a href="#deployment"><code>deployment</code></a> in <code>Marmot.newWithConfiguration</code>.
Every other field is optional in generated Swift/Kotlin: omitted policies mean public-only endpoints and an advancing cursor;
an omitted label stays untagged, omitted storage uses the platform keychain, and an omitted
acquisition mode keeps native automatic acquisition (see
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#host-managed-automatic-acquisition-0104">host-managed acquisition</a>).
Existing constructors take the deployment as their last argument and delegate to this
same configuration path. Use the options constructor when combining a label with a
custom relay policy.
C hosts use <code>marmot_client_new_with_configuration</code> and a <code>MarmotClientOptions</code>
struct; zero initialization selects the same defaults. Use the matching header
and library for that struct's layout.</p>
<pre><code class="language-swift">let options = MarmotOptions(clientName: &quot;whitenoise&quot;, deployment: marmotDeploymentWhiteNoise())
let marmot = try Marmot.newWithConfiguration(
    rootPath: rootPath, relayUrls: relayUrls, options: options
)
</code></pre>
<p>Host applications opt into public KeyPackage tagging at construction. Existing constructors
remain untagged. <code>newWithClientName</code> is the older single-purpose constructor:</p>
<pre><code class="language-swift">let marmot = try Marmot.newWithClientName(
    rootPath: rootPath,
    relayUrls: relayUrls,
    clientName: &quot;whitenoise&quot;,
    cursorPersistence: .advance,
    secretStore: nil,
    deployment: marmotDeploymentWhiteNoise()
)
</code></pre>
<p>Kotlin exposes <code>Marmot.newWithClientName</code> with the same arguments; C exposes
<code>marmot_client_new_with_client_name</code>. Rust hosts set
<code>MarmotAppConfig::with_key_package_client_name(Some(&quot;whitenoise&quot;.into()))</code>.
Supply the name on every host runtime construction, including background and
notification-extension entry points (which retain their frozen cursor policy).
Absent, whitespace-only and over-long names (more than 64 bytes of UTF-8 once
trimmed) omit the tag; MDK never truncates one. New initial publications and normal
rotations carry the configured label. Existing events are not republished, and
already-signed pending publications retry with their original tags even if the
configuration changes.</p>
<p>Native construction/default checks: <code>./crates/marmot-uniffi/options-smoke.sh swift</code>
and <code>MDK_KOTLIN_CLASSPATH=&lt;JNA:Android:annotations:coroutines jars&gt; ./crates/marmot-uniffi/options-smoke.sh kotlin</code>.</p>
<h3 id="deployment">Deployment</h3>
<p>Every constructor requires a <code>MarmotDeploymentFfi</code>: <code>MarmotOptions.deployment</code> has no default, and the other
constructors take it as their last argument. It holds the services a deployment's users rely on: the
recovery-operated relays, discovery indexers, new-group media servers, group- and profile-image servers, Open
Ranking, the moderation label namespace, and the keychain service used when no <code>secretStore</code> is given. Start from <code>marmotDeploymentWhiteNoise()</code> or <code>marmotDeploymentNeutral()</code> and change what
differs. White Noise apps pass <code>marmotDeploymentWhiteNoise()</code> in every entry point, including background and
notification-extension runtimes. Never change <code>keychainService</code> for an existing install: secrets stored under the old
name are stranded.</p>
<p>Nothing an unset value configures falls back to White Noise's services. With no <code>newGroupMediaEndpoints</code>, new groups
carry no encrypted-media component and stay text-only. With no group-image server, setting or fetching an encrypted
group image fails; with no profile-image server, <code>uploadProfileImage</code> needs an explicit server. No recovery relays
means every route's history needs all its relays to certify, no discovery indexers means onboarding searches the
discovery relays the host passes plus the account's declared relays, no Open Ranking turns that directory-search tier off, and no moderation label namespace leaves reporting
unconfigured. The neutral keychain service
is <code>org.marmot-protocol.mdk</code>.</p>
<pre><code class="language-swift">let options = MarmotOptions(clientName: &quot;whitenoise&quot;, deployment: marmotDeploymentWhiteNoise())
let marmot = try Marmot.newWithConfiguration(
    rootPath: rootPath, relayUrls: relayUrls, options: options
)
</code></pre>
<h2 id="exclusive-root-ownership">Exclusive root ownership</h2>
<p>Every <code>Marmot</code> constructor acquires a nonblocking exclusive lease on
<code>.marmot-runtime.lock</code> in <code>rootPath</code>. The lease prevents the foreground app and
an independently launched notification service extension from hydrating and
writing the same Marmot state at the same time. The lock is owned by an open
file descriptor, so the kernel releases it if iOS terminates the process; the
lock file itself is stable and must not be deleted.</p>
<p>When another process or runtime owns the root, construction throws the typed
Swift error <code>MarmotKitError.RuntimeBusy</code>. An NSE should take its bounded
fallback path, while a foreground app can retry after the current owner exits.
Calling <code>shutdown()</code> stops runtime work but intentionally does not release the
lease while the <code>Marmot</code> object or one of its runtime handles is still alive.
Await <code>shutdownAndClose()</code> before suspension or root handoff; it terminally closes
storage and releases the lease without waiting for every host reference to disappear.
Reconstruct the runtime and its handles for the next foreground session.</p>
<p>Exclude each account directory under <code>rootPath</code>, including its <code>media/</code> and <code>handoff/</code>
folders, from iCloud and Android auto-backup. Attachment files are encrypted with
device-bound keys, so a restored copy cannot be read, and <code>handoff/</code> holds plaintext
copies lent to OS surfaces.</p>
<h2 id="threading-model">Threading model</h2>
<p>MarmotKit runs MDK on a Tokio runtime it owns, not on the threads that call it.</p>
<ul>
<li><strong>Async methods</strong> run their work as a task on that runtime. The Swift task or Kotlin coroutine
awaiting the call only waits for the task to finish, so awaiting from the main actor or
<code>Dispatchers.Main</code> does not run MDK work on the UI thread. Cancelling a Kotlin coroutine frees
the call, which aborts the task at its next suspension point; <code>shutdownAndClose()</code> and
<code>signOutAndWipe()</code> keep running regardless. Generated Swift waits for the call to finish even when its <code>Task</code> is
cancelled.</li>
<li><strong>Subscription receives</strong> (<code>next()</code>, <code>nextUpdate()</code>) are the exception: they wait on the calling
thread, with the runtime entered, because a receive that ran ahead on the runtime could consume
an update that a cancelled caller never collects. They only wait and convert; the work that
produces updates runs on the runtime.</li>
<li><strong>Synchronous methods and constructors</strong> run on the calling thread. Some are SQLCipher reads;
keep them off the UI thread. Constructors enter MarmotKit's runtime, so background tasks they
start run there too.</li>
<li><strong>One runtime per process</strong>, created by the first constructor and shared by every <code>Marmot</code>
object. If it cannot start, construction throws <code>MarmotKitError.Runtime</code> rather than falling
back. It has half as many worker threads as the device has CPUs, at least 2 and at most 4,
plus Tokio's blocking pool for storage and file work, whose threads start on demand and exit
when idle. All are named <code>marmotkit-rt</code> in crash reports and profilers. <code>shutdownAndClose()</code>
stops MDK's work and releases its files; the idle threads remain for the next <code>Marmot</code>.</li>
<li><strong>What runs in parallel:</strong> account workers, the relay plane, subscription forwarders, timers
and the work behind concurrent host calls are separate tasks spread over the worker threads.
Each account's worker still handles its own commands one at a time, in order, so a slow
operation delays that account's later worker-routed calls but not other accounts.</li>
<li><strong>Host callbacks</strong> (<code>SecretStore</code>, <code>ExternalAccountSignerFfi</code>) can be invoked from runtime
threads or the calling thread, possibly concurrently. Implementations must be thread-safe and
must not wait for the main thread.</li>
</ul>
<p>The C bindings block the calling thread on a runtime owned by each client; see
<a href="__MARMOT_BASE__docs/c-interface.html"><code>marmot-c</code></a>. The <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/marmot-app-runtime.md#threading-model">app runtime threading
model</a> compares
every binding.</p>
<h2 id="service-endpoint-defaults">Service endpoint defaults</h2>
<p><code>marmotkit-endpoints.env</code> sets the public build-time defaults consumed by Marmot's compiled endpoint config:</p>
<ul>
<li><code>MARMOT_AUDIT_LOG_TRACKER_ENDPOINT</code></li>
<li><code>MARMOT_RELAY_TELEMETRY_OTLP_ENDPOINT</code></li>
<li><code>MARMOT_PRODUCT_ANALYTICS_EVENTS_ENDPOINT</code> (optional full Aptabase events URL; no default)</li>
</ul>
<p>These are route URLs only. Host apps still supply audit and telemetry bearer tokens and analytics app keys at
runtime. Set any of these environment variables before invoking a build script to override the default for staging
or local testing.</p>
<p>Public profile-image uploads use the deployment's <code>profileImageEndpoint</code>
(<code>https://blossom.primal.net</code> in White Noise's), or an explicit Blossom server
passed to <code>uploadProfileImage</code>. With neither, the upload fails. Peers' avatars
always load from the URL in their own profile.</p>
<h2 id="interactive-account-onboarding">Interactive account onboarding</h2>
<p>Imported identities can use the durable preflight API instead of <code>login</code>:</p>
<ol>
<li>Call <code>begin_onboarding(nsec, options)</code> or
<code>begin_external_signer_onboarding(public_key, signer, options)</code>. Supply the
same <code>default_relays</code> (and optional <code>inbox_relays</code>) as new-account creation
and a separate set of trusted <code>discovery_relays</code>. These methods return a
persisted account and snapshot before fetching or publishing Nostr records.</li>
<li>Display the snapshot steps in their returned order (profile, follows, general
relays, inbox relays, sign-in chat/history notice (<code>SingleDevice</code>), KeyPackage). Use step identities,
not enum discriminants, as positions. Subscribe with <code>subscribe_onboarding</code>, read its initial
<code>snapshot</code>, and drive <code>next</code> concurrently with <code>run_onboarding</code>.</li>
<li>Localize the typed status, findings, and actions. A healthy account advances
automatically until the notice acknowledgment. <code>NeedsInput</code> offers a repair or, for profile/follows, an
explicit <code>continue_onboarding_without</code>. Empty follow lists are valid.</li>
<li><code>propose_onboarding_relay_repair</code> previews the smallest safe change to a
general or inbox relay declaration, preserving the original ordered tags,
duplicate/custom entries, direction markers, and content. NIP-65 read/write
markers are interpreted case-insensitively; their spelling and trailing
extension fields remain unchanged in the preview and published event. Show its typed
before/after diff and repair mode. <code>ManualReview</code> cannot be approved; prefill
a manual editor from the original tags or offer a separately labeled reset.
No proposal signs or publishes until explicit approval. The older
<code>propose_onboarding_recommended_relays</code>, <code>propose_onboarding_relays</code>,
<code>propose_onboarding_profile</code>, and <code>propose_onboarding_follows</code> only prepare
a proposal. Recommended relays append missing defaults to the observed list,
preserving every original relay tag, including private-network, <code>ws://</code> and <code>wss://</code> onion,
retired, and unparseable entries. Dial policy filters connections, not published
declarations. Both onion schemes require a Tor transport and are excluded from direct dialing.
Defaults are deduplicated against raw tags, including unknown roles.
If every default already has a read-only or unknown role, the general-relay step
offers explicit editing instead of recommending an append that cannot add a write route.
Relay findings are advisory once a usable outbox/inbox route is
confirmed. Proposals require a policy-allowed write route (or inbox route);
reachability is checked after publication. Explicit relay selections edit known
endpoint roles, preserving retained tag occurrences and unrelated fields in a
typed preview, and require every selected endpoint to pass dial policy. Approval
requires every configured discovery source to complete; failures from additional
user-declared sources are tolerated only when the previous record is found.
This bounded check cannot rule out newer records on unreachable or unqueried sources.
A missing discovery result is not global proof of absence: hosts must
not automatically approve publication for imported identities.
Profile fields left unset preserve their current values; an
explicit empty string clears a field. Display the proposed edits, then pass the returned
snapshot revision to <code>approve_onboarding_repair</code>. For an inbox proposal use
<code>read_relays</code> and an empty <code>write_relays</code>. <code>cancel_onboarding_repair</code> dismisses
a proposal until approval has been recorded.</li>
<li><code>retry_onboarding_step</code> requires an offered <code>Retry</code> action; <code>set_onboarding_discovery_relays</code>
retries with explicitly chosen discovery sources without publishing them.
After process restart, read <code>onboarding_snapshot</code>, register the external
signer again if applicable, and run/resume or retry the indicated step.</li>
<li>Enter the normal app only when <code>snapshot.ready</code> is true. Normal worker
commands reject unfinished onboarding; the workflow alone can publish its
initial KeyPackage. <code>account_setup_readiness</code> stays <code>Initializing</code> until the
interactive workflow is complete.</li>
</ol>
<p>Findings carry typed <code>context</code>, <code>purpose</code>, <code>outcome</code>, <code>declared_capability</code>,
<code>actions</code>, and <code>observed_revision</code> alongside <code>issue</code> and <code>endpoint</code>. Render
each finding separately, even when endpoints match. Use its actions as the
authoritative subset applicable to that finding; an empty list offers no
finding-specific action. The step's <code>actions</code> remain the full set, including
single-device consent and KeyPackage setup actions outside relay diagnostics.
<code>InspectionCompleted</code> with <code>DirectoryQuery</code> success records only a successful
directory inspection, not relay write support or event publication. Timeouts,
incomplete discovery, and unreachable queries leave the outcome unknown.
Retained findings keep their original observed revision and step <code>checked_at</code>;
interpret revisions only within the snapshot's account and recovery epoch.
Observations outside relay diagnostics may have unknown context/purpose/outcome
and no finding actions. Legacy checkpoints also have no observed revision;
rechecking supplies a fresh revision without upgrading retained evidence.</p>
<h3 id="explicit-recovery-and-checkpoint-compatibility">Explicit recovery and checkpoint compatibility</h3>
<p>When <code>begin_*_onboarding</code> or cancellation returns <code>OnboardingActionUnavailable</code>,
query <code>onboarding_recovery_required(account_ref)</code>. A true result means an
unreadable/unsupported checkpoint, an exhausted revision counter, or an
interrupted recovery needs attention. Invalidate the old UI attempt and obtain
the user's acknowledgment of latest-only evidence retention, then call
<code>recover_onboarding(account_ref, true)</code>. It supports local and external-signer
accounts and does not wait for the signer or publish any repair.</p>
<p>Recovery durably records the exact opaque active/cancelled bytes in the private
<code>onboarding-recovery.json</code> before replacing their gates. It preserves identity,
credentials, setup journals/context and unrelated account data, signs out,
reaps the worker and establishes a random 256-bit approval epoch. Unknown
counters are never interpreted as zero within their old epoch. A later explicit
begin starts with fresh checks and no inherited proposal, approval, or signed
repair. The new epoch is returned by recovery and included in future snapshots;
use the epoch-aware approval and device-acknowledgment methods described below.</p>
<p>An interrupted recovery remains gated and resumes through retry or reconcile;
dropping its caller cannot detach a removed worker. The latest recovery journal
is readable through <code>AccountHome::account_onboarding_recovery</code>; an unreadable
previous recovery journal is retained as opaque evidence there. A subsequent
explicit recovery may replace older evidence. Keep any evidence needing longer
retention outside this latest-only workflow before acknowledging recovery.</p>
<p>Ordinary checkpoints start at version 3, with supported version 1/2 upgrades.
Version 3 is a semantic barrier: old version 2 code rejects approved cancellation
and cannot safely restart it. Recovery checkpoints use version 4 because a
version 3 reader cannot validate epoch-scoped approvals. Completed recovery
leaves a version 4 cancellation tombstone even before a new begin, so older
readers fail closed. Preparing an additive relay proposal upgrades its checkpoint
to version 5, with or without a recovery epoch. This prevents older readers from
resuming an approved, unsigned proposal as a destructive replacement. Preparing
an exact lossless relay repair upgrades the checkpoint to version 6, preserving
that version through approval, signing and completion. Version 3/4/5 readers
reject it rather than discard the typed preview and publish replacement tags.
Explicit relay edits return the same typed before/after preview. Retained
endpoint roles keep their original tag occurrences, order and extension fields,
even when selected with equivalent URL spelling; unrelated tags and content remain unchanged. An unchanged selection returns
<code>ManualReview</code> without an approval action. These manual previews use checkpoint
version 7 because version 6 readers can only revalidate automatic minimal repairs.
No binding signature changes are required. Downgrading once any of these formats
is used is unsupported; use a build that supports
the checkpoint version. Do not relabel versions or delete checkpoints to
force a downgrade. Restore/upgrade to a supporting build, or explicitly recover
unsupported evidence with this API.</p>
<h3 id="single-device-notice">Single-device notice</h3>
<p>The historical <code>SingleDevice</code> step still pauses before initial KeyPackage publication.
It explains what signing in alone restores, rather than declaring all multi-device
use unsupported. Suggested localized copy:</p>
<p><strong>Chats on this device</strong></p>
<blockquote>
<p>Signing in alone does not restore your existing chats or messages. If you use another
device, keep its app and data until you've checked your chats here.</p>
</blockquote>
<p>The snapshot's <code>single_device_notice</code> adds advisory evidence. For
<code>OtherInstallationPossible</code>, explain: &quot;Other sign-in records were found. They may
belong to another installation or an earlier one.&quot; For <code>Unknown</code>: &quot;Other sign-ins
could not be checked.&quot; <code>NoneFound</code> needs no extra warning and does not prove there
are no other installations. Reinstallation or cleared local state can produce the
same evidence; do not claim to have identified a physical device or a particular app.</p>
<p><code>MultiDeviceUnsupported</code> remains a legacy issue value for checkpoint and binding
compatibility; current checks and resumed projections omit it. Render the notice
from its step, DTO and actions instead of using that historical identifier as a
capability claim. Existing apps need to adopt the updated localization against a
published, immutable binding artifact; the MDK update cannot replace installed UI
strings. Discovery, consent and publication policy stay in MDK.</p>
<p>Device-group linking remains disabled in normal released builds. Do not add a
working Link action to this notice or promise automatic chat/history restoration.
Acknowledging it does not approve a sign-in, link devices, or replace sign-in and
code-comparison prompts.</p>
<p>Offer <strong>Cancel</strong> and <strong>Continue</strong> (the existing <code>ContinueAnyway</code> action). For Cancel, invalidate the current UI
attempt first, then await <code>cancel_onboarding(account_ref)</code> before any new
<code>begin_*_onboarding</code>. Cancellation is legal at every interactive step, including
an approved but unconfirmed repair and a ready checkpoint that the host has not
yet opened with Open Chats. Success signs the identity out, reaps its worker,
delivers a terminal non-ready snapshot, and closes that subscription. It retains
local data, credentials, setup journals, and the latest cancellation checkpoint,
including its signed publication evidence. A subsequent cancellation replaces
<code>onboarding-cancelled.json</code> even if the earlier publication is still uncertain.
This is a latest-only retention limit, not proof of remote reconciliation.
Previously written content-addressed archives are left untouched; new
cancellations do not create them. It does not delete, replace, or prove non-publication of
events that may already be on relays. A later explicit interactive begin starts
a new attempt with the supplied options and no old proposal, approval, or
signed repair; observing a previously published record is not replay permission.
Legacy <code>login</code> remains available and does not consume archived onboarding
choices. Reconcile, runtime start, signer attachment, and connectivity
restoration are not explicit sign-in. If the call returns
<code>AccountWorkerResponseTimedOut</code>, the pending fence remains and the host should
retry the same cancel; dropping the waiter does not abort cleanup. Do not treat
<code>ready</code> as an Open Chats command — the host still owns that transition.</p>
<p>For Continue, call <code>acknowledge_onboarding_single_device(account_ref, snapshot.revision)</code>.
If <code>snapshot.recovery_epoch</code> is present, use
<code>acknowledge_onboarding_single_device_in_epoch(account_ref, snapshot.revision, epoch)</code>
and <code>approve_onboarding_repair_in_epoch(account_ref, snapshot.revision, epoch)</code>
for approvals. Pass the epoch from the same displayed snapshot. The original
revision-only methods reject recovered attempts, even when the number matches.
MDK rejects a stale revision, persists the acknowledgment, and resumes setup.
The acknowledgment survives KeyPackage publication failure, task interruption,
and restart. Rechecking an earlier prerequisite, changing discovery sources,
approving another repair, explicitly retrying <code>SingleDevice</code>, or signing in again
after signing out a completed account invalidates it and requires a fresh notice.
Retries preserve optional steps the user skipped unless that skipped step is the
explicit retry target. Older checkpoints refresh their derived retry hints on
read, and package records without a <code>usable</code> field default to <code>false</code>.</p>
<p>Detection reads verified kind-30443 records through the validated relay routes
without starting an account worker. It compares the newest record per slot with
the local stable slot and durably owned private packages, including retained
rotation material. <code>other_packages</code> retains signed foreign-slot evidence even
when the payload is malformed or expired. <code>usable</code> describes package validity;
the reference and expiration are optional when validation cannot extract them.
The publication timestamp comes from the verified event. No recency cutoff
excludes a foreign slot:
republication retains the original event timestamp, so it is not last-active time.
No public device identifier is introduced, and continuing never deletes another
installation's packages.</p>
<p><code>discovery_complete</code> describes only the bounded queries to the selected sources;
it is false for failed, malformed, future-dated, or potentially truncated results.
Positive evidence can accompany incomplete discovery. <code>Unknown</code> means discovery
was inconclusive; <code>NoneFound</code> means none were found on those sources. Neither is
an assurance that multi-device use is safe. Both still require the general notice.
Completed pre-notice checkpoints remain ready; incomplete checkpoints acquire
the notice before KeyPackage publication when upgraded.</p>
<h3 id="snapshots-discovery-and-relay-checks">Snapshots, discovery and relay checks</h3>
<p>Snapshots are complete states, not deltas. A slow subscriber may miss
intermediate states but receives the latest persisted state. Interrupting an
async check can leave a step <code>Checking</code>; <code>run_onboarding</code> resumes it. Once a repair is approved,
a retry resumes that repair before other checks. It cannot be cancelled as if
nothing had been published: a relay may already have accepted it. Signed bytes
are retained before the first send and replayed unchanged on retry.</p>
<p>Discovery reads require a completed relay query. Failed/partial empty discovery
is distinct from absence and never offers automatic replacement. A valid record
from a partially successful lookup may pass while retaining <code>DiscoveryIncomplete</code>
and source failures in its findings; a passed step is not necessarily warning-free.
Off-filter records are ignored. Single-device discovery remains incomplete if
any selected source fails, even when another source returns an empty result. Fresh signed
records remain available for inspection even when their contents are malformed;
a newer malformed record does not silently fall back to an older valid one.
Repairs re-fetch the source before signing and reject a changed record. Nostr
has no conditional replace operation, so simultaneous edits after this check
remain subject to its normal replaceable-event ordering.</p>
<p>Relay checks include syntax, local safety/retirement policy, read/write roles,
and bounded queries through the relevant routes. Inbox queries filter for the
account's recipient tag and use an isolated account-bound signer. They retain no
inbox payloads. Read permission and KeyPackage publication are checked separately;
these checks do not guarantee future availability or every relay's acceptance of
future third-party inbox messages. Incomplete workflows recheck reachability
older than five minutes. Completed onboarding is retained and reruns when a
signed-out account enters the identity-only flow again.</p>
<h3 id="adoption-and-legacy-accounts">Adoption and legacy accounts</h3>
<p>The existing <code>login</code> and generated-account APIs remain compatible. Apps must
adopt the identity-only APIs and screen to enable this experience. Legacy
accounts without an onboarding checkpoint are not retroactively blocked. Active
legacy accounts and accounts with unfinished legacy setup are not silently
enrolled: finish or resume their existing setup first. Signed-out legacy accounts
without pending setup can explicitly opt in. Completed checkpoints defer to normal
setup/recovery readiness. Corrupt or newer-version checkpoints gate only their own
account; they must be restored or opened with a compatible runtime, not silently
discarded because they may contain approved publication intent. C
consumers have equivalent methods and subscriptions, except the external-signer
entry points, which have no C callback interface yet.</p>
<h2 id="identity-references-and-profiles">Identity references and profiles</h2>
<p>New generated identities publish kind <code>10002</code>, kind <code>10050</code>, and kind <code>0</code> to
their account relays and send separate best-effort copies to the built-in public
directory indexers. Later relay-list and profile edits through MarmotKit do the
same. The indexers are never inserted into the advertised relay lists or used
for KeyPackages, contact lists, or messaging. Acknowledgement from an account
relay establishes setup success; indexer copies are scheduled after bootstrap
confirmation, before initial KeyPackage publication, and an outage is reported
only as an aggregate warning. Shutdown or account removal cancels pending copies.
Existing identities are not automatically republished to the indexers and need a
client-initiated backfill of their current lists and profile.</p>
<p><code>accountIdHex</code> / <code>normalizeMemberRef</code> accept <code>nprofile</code> and
<code>nostr:nprofile</code> mentions and QR scans in addition to hex, <code>npub</code>,
<code>nostr:npub</code>, and <code>marmot://profile/</code> links. Relay hints inside an
nprofile are discarded and never used for routing or directory mutation.
Duplicate type-0 TLV entries keep the first key. After FFI wrapper
normalization, the nprofile fallback rejects encoded tokens longer than
1023 UTF-8 bytes (the locked Bech32/Bech32m ceiling); a valid 1023-byte
token still decodes when wrapped in <code>nostr:</code> or <code>marmot://profile/...</code>.
The app helper strips one lowercase <code>nostr:</code> prefix itself; profile-link
and whitespace normalization belong to FFI. The app helper's legacy NIP-21
parser may still accept a colon-suffixed <code>nostr:&lt;npub&gt;:</code> form before the
fallback runs; FFI normalization rejects that form.</p>
<p>Decode a scanned reference first, then pass the canonical lowercase hex account id to
<code>defaultProfilePseudonym</code> so the shared text-hash seed is preserved. Passing uppercase hex
or an undecoded <code>npub</code> silently produces a different name, not an error. <code>randomProfilePseudonym</code>
replaces client-owned random-roll wordlists; it is cosmetic, may collide, and does not create
an account.</p>
<p><code>userProfile</code> returns the cached kind:0 projection. <code>about</code> from a fetched
profile keeps normalized LF line breaks; <code>name</code>, <code>displayName</code>, <code>picture</code>,
<code>banner</code>, <code>nip05</code>, and <code>lud16</code> stay single-line. Tab and other controls are
removed on ingest. <code>publishUserProfile</code> caches the submitted local value
without reparsing it, so a same-instance publish/read does not show incoming
sanitization. Read another account through <code>refreshProfile</code>, then
<code>userProfile</code> or <code>cachedIdentityProjections</code>. A bio already stored without
line breaks stays until a newer event replaces it.</p>
<h2 id="keypackage-inventory">KeyPackage inventory</h2>
<p><code>accountKeyPackages</code> lists the current KeyPackage winner per addressable slot
plus local-only rows. <code>accountKeyPackageRelayEvents</code> is the additive observed
history for that same fetch window: current and superseded kind-30443 events,
with <code>isCurrent</code> set only among those observed valid events. Hosts can pass a
superseded <code>eventIdHex</code> and its <code>sourceRelays</code> to the existing delete API.
This does not change the Published-list filter (<code>relay == true</code>).</p>
<p><code>localAccountKeyPackages</code> is the local-first inventory: render it immediately.
It is a synchronous SQLCipher read on the calling thread; do not invoke it on a
UI or main thread. <code>refreshAccountKeyPackages</code> is the explicit network merge;
replace the displayed snapshot with its result. On refresh failure or
cancellation, keep the local result. Both return
<code>AccountKeyPackageInventoryEntryFfi</code> (<code>record</code> plus <code>localState</code>). Existing
<code>AccountKeyPackageFfi</code> is unchanged. <code>localState</code> and <code>record.relay</code> are the
authoritative display distinctions; empty event IDs and <code>publishedAt</code> are not
publication proof. A retained package stays <code>RetainedPrivateMaterial</code> even when
that exact event is observed; <code>record.relay</code> becomes true while <code>localState</code>
remains retained. Empty bootstrap relays remain network-enabled. After a
mutation, re-read the local inventory instead of applying an out-of-order
refresh.</p>
<h2 id="keypackage-selection">KeyPackage selection</h2>
<p>Creating a group or inviting adds every device of each recipient account, and the group shows the account as one
member with its <code>deviceCount</code>. MDK reads the account's KeyPackages and KeyPackage deletion requests from relays, then
adds every valid, compatible package published in the last 30 days, at most 20 per account; with none that recent, it
adds the single best valid one. Each publication slot (<code>d</code> tag) contributes at most one package: the slot's newest
publication supersedes older ones even when it is invalid or deleted, so an older package never comes back. A package
a deletion request covers, by slot address or by event id, is skipped. Packages not marked last-resort rank first,
then the most recently published, then the lower KeyPackageRef. Packages sharing a leaf signature key (one device
publishing in several slots) count once. The <code>client</code> tag never affects selection; it is only a publication label
(see <a href="#runtime-options-and-client-label">runtime options</a>).</p>
<p>Directory lookup (including <code>wn-cli key-package</code>) returns the best package of the same selection. Composition prewarm
checks existence from a batched read. Create and invite read each account on its own, because a read bounded across
accounts cannot prove that it saw every slot. If that read fails, valid, compatible packages from the batch remain
usable; previously cached packages are never substituted. Prewarm has no proposed group configuration, so it does not
guarantee capability compatibility; creation and invitation check the actual group's requirements.</p>
<h2 id="invitation-lookup-outcomes">Invitation lookup outcomes</h2>
<p>Creating or inviting looks up each recipient's relay lists and KeyPackage. The
first recipient that cannot be used ends the call, in request order:</p>
<ul>
<li><code>MissingKeyPackage { account, reason }</code>: the lookup completed and found nothing
invitable. <code>reason</code> is <code>NotFound</code>, or <code>ObsoleteOnly</code> when the recipient has only
outdated KeyPackages and must update their app.</li>
<li><code>DirectoryLookupIncomplete { account }</code>: the lookup for <code>account</code> ran out of time
or relay coverage, so nothing is known to be missing. Offer retry.
<code>fetch_latest_key_package_for_account_id</code> and relay-list lookups report the same
outcome.</li>
<li><code>MissingMemberInboxRoute { account }</code>: the recipient has no usable inbox relay.</li>
</ul>
<h2 id="public-nostr-event-verification">Public Nostr event verification</h2>
<p>The stateless <code>verifyPublicNostrEventJson</code> helper verifies public events through
MDK's Nostr/libsecp256k1 stack without constructing an account or supplying a
secret key. It checks both the canonical event ID and signature. A host must
still enforce its own allowed authors, kinds, tags, and input-size limits.
Malformed input and invalid signatures return <code>false</code>; it does not authenticate
an MLS group message or replace MDK's relay ingestion checks.</p>
<h2 id="public-event-previews">Public event previews</h2>
<p>Event cards for <code>nostr:</code> references in message content read from an
account-scoped cache, so a reopened chat renders prior previews in its first
frame, offline included. Call <code>cachedPublicEventPreviews</code> (at most 16
references, network-free) before layout, then <code>resolvePublicEventPreview</code> for
each reference shown; it touches the network only for missing or stale rows.
MDK fetches from safe relay hints and the configured directory relays; when
they miss, it asks once more on the deployment's discovery indexers and the
author's NIP-65 write relays (an <code>naddr</code> author or an <code>nevent</code> author hint). It stores
only verified events that match the reference, keeps the newest <code>naddr</code>
version, and turns an author's NIP-09 deletion into a <code>Deleted</code> row. Event JSON is the signed
event; shape its content for display on the host. Author names and avatars
come from <code>cachedIdentityProjections</code>. See
<a href="__MARMOT_BASE__docs/native-api.html#marmotcached_public_event_previews">the method reference</a>.</p>
<h2 id="selected-chat-list-presentation">Selected chat-list presentation</h2>
<p><code>openPresentedChatList(accountRef, includeArchived)</code> returns an account-bound subscription.
Take <code>snapshot()</code> once (generation plus sequence zero), then consume <code>next()</code> as complete replacement snapshots.
Each row contains the existing chat-list fields and MDK's selected title/avatar; hosts render the typed fallback text
with their own localization and load the selected avatar descriptor without a roster/profile lookup.
<code>presentedChatList</code> and <code>presentedChatListRow</code> provide the same local contract for one-shot and creation/rebind paths.</p>
<p>First use can await bounded local preparation. <code>ChatPresentationNotReady</code> means preparation did not advance and may be
retried after maintenance; it is not an empty list or missing group. Storage errors remain errors. Ready reads do no
network fetching or repair writes. Selected values survive offline reopen; visible avatar bytes should use
<code>requestAvatarAssets</code> / <code>readAvatarAssets</code> as described in <a href="#durable-avatar-access">durable avatar access</a>.</p>
<p>Order updates by the handle's generation and sequence. <code>presentationVersion</code> only versions selected presentation:
an unread, pin, archive or mute update can have the same presentation revision. Drop the old handle when changing
accounts; cancellation preserves a pending refresh, and shutdown ends the stream. Account-store replacement requires
opening a new handle. Do not log rows or avatar material, including generated host-language record stringification.
Existing chat-list APIs remain available.</p>
<h2 id="bounded-chat-screens">Bounded chat screens</h2>
<p><code>openChatListWindow</code> provides live Chats/Unread/Archived/Left windows, and <code>subscribeAccountAttention</code> provides
independent account attention. See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/chat-projections-native.md">native handoff contract</a>
for paging, sequence handling, cancellation, C ownership, and compatibility.</p>
<h2 id="chat-list-select-all-and-filtered-queries">Chat-list select all and filtered queries</h2>
<p><code>chatListIds(accountRef, view)</code> returns every chat ID in a view, in display order, including chats beyond the open
window; use its length for select-all and bulk-action counts. Keep the result as host checkbox state and call
<code>revalidateChatListIds(accountRef, view, groupIds)</code> right before a bulk action: it returns the subset still in the
view, in the caller's order, and never adds chats. Then run the existing per-chat commands (archive, local delete,
leave), which check their own preconditions. While base rows are still being prepared, <code>chatListIds</code> fails with
<code>ChatPresentationNotReady</code> instead of returning a partial list; keep the action disabled and retry.</p>
<p><code>openChatListQueryWindow(accountRef, query, initialRows)</code> is <code>openChatListWindow</code> narrowed by a <code>ChatListViewQueryFfi</code>:
a base <code>view</code> plus <code>filter</code>, a flat <code>ChatListFilterNodeFfi</code> list in which node 0 is the root and every other node is
the child of exactly one node listed before it (an empty list means no filter). <code>All</code>, <code>Any</code> and <code>Not</code> combine
<code>Condition</code> leaves (<code>ChatListConditionFfi</code>: scope, unread, mention, pinned, draft, send state, <code>Direct</code> / <code>Group</code>
kind, <code>Muted</code> and more), <code>GroupIds</code>, <code>Text</code> and <code>MessageText</code>. Folder include/exclude lists are ordinary nodes, for
example <code>All[Not(GroupIds(excluded)), Any[GroupIds(included), rule]]</code>. <code>chatListQueryIds</code> and
<code>revalidateChatListQueryIds</code> are the select-all pair for the same query; pass the same query value to all three so
list, count and selection agree.</p>
<ul>
<li><code>Text</code> matches a chat's title, group name, description or a direct chat's peer profile name; <code>MessageText</code> matches
chats with a visible message containing the text, by the same rule as timeline <code>search</code>. Both trim and lowercase the
text and match a literal substring. Localized fallback titles are not searchable.</li>
<li><code>MessageText</code> scans message history, so only the ID queries accept it; a window fails with <code>InvalidChatListQuery</code>
(<code>MessageTextInWindow</code>).</li>
<li>A query with text fails with <code>ChatPresentationNotReady</code> while presentation, or for <code>MessageText</code> retained edits and
deletions, are still being prepared; retry.</li>
<li>A malformed node list or a query over 8 levels, 64 nodes, 500 group IDs or 1024 bytes of text fails with
<code>InvalidChatListQuery { reason: ChatListQueryErrorFfi }</code> before any read; a malformed group ID fails with
<code>InvalidHex</code>.</li>
</ul>
<p>See <a href="__MARMOT_BASE__docs/native-api.html#marmotopen_chat_list_query_window"><code>API-REFERENCE.md</code></a> for the full matching rules.</p>
<h2 id="prepared-conversation-windows">Prepared conversation windows</h2>
<p><code>openConversationWindow</code> combines history, header/capabilities, visible identities,
read state and revisioned draft descriptors. See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/CONVERSATION-WINDOW.md">native conversation contract</a>
for opening, paging, cancellation, timeout, ownership and draft migration.</p>
<h2 id="advanced-timeline-search">Advanced timeline search</h2>
<p><code>timelineMessages(accountRef, query)</code> reads matching messages from local storage. <code>TimelineMessageQueryFfi</code>
combines <code>search</code>, <code>sender</code>, <code>since</code>, <code>until</code>, and <code>attachmentType</code> with AND before applying <code>limit</code>.
<code>search</code> is trimmed, lowercased by Unicode rules, and matched as a literal substring, not a wildcard expression.
<code>sender</code> accepts the same public-key and member-reference forms as <code>normalizeMemberRef</code> and matches the canonical account key.
<code>since</code> includes its <code>timelineAt</code> boundary, while <code>until</code> excludes its boundary. Both use Unix seconds.</p>
<p><code>attachmentType</code> is an integer: <code>0</code> Any (no attachment restriction), <code>1</code> Image, <code>2</code> Video,
<code>3</code> Audio, <code>4</code> File, or <code>5</code> Attachment (any attachment type). Other values return <code>MarmotKitError::Runtime</code>.
Omitted optional filters, <code>attachmentType = 0</code>, and <code>searchWallClock = false</code> preserve the unfiltered query defaults.</p>
<p>Group queries use canonical conversation order unless <code>searchWallClock</code> is true. With that flag, searches use
<code>(timelineAt, messageIdHex, groupIdHex)</code> order, including account-wide searches with no <code>groupIdHex</code>.
Default account-wide queries keep their timestamp/message-id cursor semantics.
To continue an account-wide search with <code>searchWallClock = true</code>, pass that row's <code>groupIdHex</code> as <code>cursorGroupId</code>
alongside <code>before</code> and <code>beforeMessageId</code>, or <code>after</code> and <code>afterMessageId</code>. Group ids are non-empty opaque MLS
bytes encoded as hex, not fixed-size transport routing ids. Keep filters and ordering unchanged between pages.
<code>subscribeTimelineMessages</code> retains its group-and-limit interface; these filters apply to the one-shot query.</p>
<h2 id="live-timeline-updates">Live timeline updates</h2>
<p><code>TimelineMessagesSubscription::next()</code> returns the complete bounded window on
every update. Its conversion cache avoids reparsing unchanged rows, but those
rows still get cloned and serialized across FFI. <code>next_update()</code> returns raw
projection deltas, or a replacement <code>Page</code> after a refresh. These methods consume
the same stream; use only one per subscription. Delta consumers must maintain
ordering, removals, and window limits themselves; raw projections do not report
which rows the runtime evicted from its bounded window.</p>
<p>Projection <code>messages</code> and upsert <code>changes</code> retain their existing wire format.
When corresponding source records are identical, conversion parses Markdown
and resolves media once, then clones the converted record for the second field.
Different records and removals retain independent conversion.</p>
<p>Run the conversion and wire-serialization benchmark with:</p>
<pre><code class="language-sh">cargo test -p marmot-uniffi --release --lib bench_live_timeline_updates -- --ignored --nocapture
</code></pre>
<p>It compares cached full pages, current deltas, and the original independent
conversion of both delta fields. Each window has 25, 100, or 500 rows and one
edited Markdown message per update. Results include source cloning, conversion,
and UniFFI serialization: p50/p95 over 100 samples after 10 warm-up iterations,
plus serialized byte counts. They exclude storage, runtime window application,
FFI scheduling, and Swift/Kotlin decoding and rendering.</p>
<h2 id="durable-avatar-access">Durable avatar access</h2>
<p>Chat rows and conversation header/identity records include <code>avatarAsset</code> metadata. For visible content, batch its
opaque <code>target</code> values into <code>requestAvatarAssets</code>, then pass returned <code>reference</code> values to <code>readAvatarAssets</code>. Both
accept at most 16 items; byte reads additionally require a 1-byte to 16-MiB aggregate budget. A <code>deferred</code> result means
that complete image did not fit the remaining budget. Ready/stale images can render offline; decode and render on the
host, caching decoded images by reference plus content revision. Screen subscriptions update metadata when acquisition
completes. <code>clearAvatarCache</code> clears durable bytes and demand; later visible requests can acquire again.</p>
<p>Keep host persistent caches until migration and device validation are complete. See
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/further-context/avatar-cache-storage.md">the avatar contract</a>
for source/account fencing, result states and lifecycle rules.</p>
<h2 id="deletion-provenance-and-custom-events">Deletion provenance and custom events</h2>
<p>Timeline records (including conversation windows and <code>reportedMessage</code>), reply previews,
and chat-list previews expose <code>deletionSource: DeletionSourceFfi</code>:</p>
<ul>
<li><code>Author</code>: the selected accepted deletion is an author-authorized kind 5.</li>
<li><code>Admin</code>: the selected accepted deletion is kind 4891, authorized by authenticated
source-state evidence. This includes an admin removing their own message.</li>
<li><code>Unknown</code>: no classified deletion evidence is available, including older projected tombstones
and legacy kind-5 removals of another author's content.</li>
</ul>
<p>Consult this field only when <code>deleted</code> is true. Use the existing ordinary-deletion wording
for <code>Author</code>, “This message was deleted by an admin.” for <code>Admin</code>, and a neutral deleted-message
fallback for <code>Unknown</code>. Clients own localization. The message's <code>kind</code> remains its original
inner event kind, never the deletion kind. Existing deletion IDs and content masking are retained.
<code>invalidationStatus</code> describes convergence separately and does not imply deletion.</p>
<p>See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/overview/content-moderation.md">deletion semantics</a>
for the storage and authorization contract.</p>
<p>When multiple accepted deletions apply, the largest <code>(authenticated event timestamp, event ID)</code>
pair wins, matching <code>deletedByMessageIdHex</code>. Arrival order, reports, and current admin status
play no part. Invalidated deletion evidence is withdrawn; projections update to the remaining
winner (or restore the undeleted state). Provenance-only changes participate in live projection
and conversion-cache updates.</p>
<p>Database migration 0082 adds provenance columns with an <code>unknown</code> default.
It preserves older tombstones, deletion IDs, and cached chat presentation without scanning or
reinterpreting history. No historical backfill is scheduled: existing tombstones can remain <code>Unknown</code> indefinitely.
If a later operation reprojects a target or rebuilds its group, it uses available accepted evidence.
Legacy serialized records with an absent field also default to <code>Unknown</code>. No client database
migration or deletion index is needed. Older MDK binaries reject the upgraded database schema;
do not roll back only the library. This is a binding layout change, not an MLS/wire-format change.</p>
<p>Custom events retain their numeric <code>kind</code> and verbatim <code>plaintext</code> content. Conversation windows
also carry their ordered <code>tags</code>, so clients can render app-defined event types without fetching
raw events. Deleted rows expose no raw tags in timeline reads, moderation reads, or conversation windows.
MDK-owned kinds continue to use prepared fields and references there. Custom-event tag changes invalidate
the conversion cache. Custom events do not change chat-list activity or notification policy.
<code>sendCustomEvent</code> refuses every kind MDK owns, the device-group kinds 457, 458, 459, 460, 461, 473, 475 and 476 included. Those
are read only in the account's own device group, so a chat never shows one, as a row, a message or a notification.</p>
<h2 id="device-local-membership-events">Device-local membership events</h2>
<p>The group-event firehose distinguishes account-level timeline activity from
<code>LocalGroupCopyTerminated</code>, <code>LocalGroupCopyRestored</code>, and
<code>GroupMemberLeavesRemoved</code>. MDK applies their membership, pending-send and
notification effects before host delivery; these events create no system row.
Use them to refresh presentation, and handle the new variants when regenerating
Swift/Kotlin bindings. Retained-history engine rollback does not automatically
recover a local copy that has applied its own removal.</p>
<h2 id="queued-sends-the-group-refuses">Queued sends the group refuses</h2>
<p>A send made while the group settles reports <code>AcceptedPending</code>, and MDK sends it
once the group settles. If the settled group refuses it (the user stopped being
an admin meanwhile, or the change no longer applies), MDK drops it and emits
<code>GroupEventKindFfi::QueuedIntentRefused { intent_id_hex, intent_kind, reason }</code>
for that group. Nothing retries it: tell the user, who may try again. <code>reason</code>
is a stable tag such as <code>not_group_admin</code>.</p>
<h2 id="undelivered-welcomes">Undelivered Welcomes</h2>
<p>An Add can already be confirmed while its Welcome remains unacknowledged. Subscribe before creating or
inviting, then use <code>pending_welcome_deliveries(account_ref)</code> to read the current repair handles. The
<code>WelcomeDeliveryPending</code> event and each handle carry optional <code>size_class</code>: a coarse serialized-event size explaining
the observed all-target refusal. It does not estimate any relay's configured limit or prove non-delivery; earlier
legacy exposure can be hidden by a crash or expired bookkeeping. The same <a href="#runtime-lifecycle-threads-and-errors">limited Welcome meaning</a>
applies to a typed retry error. <code>None</code> means Unknown, including old records, lost diagnostic writes and unrecognized
future annotations; it is evidence of neither delivery nor non-delivery.</p>
<p>The event remains once per process/Welcome. Later cause changes are obtained from the query, not another event.
A later coarse legacy retry may replace a specific displayed cause with Unknown while the same debt persists.
MDK continues its existing retry behavior; this diagnosis neither removes the member nor adds another leaf,
rolls back the confirmed Add, or declares the obligation terminal. Hosts can distinguish a known size refusal
from an unexplained delivery problem without receiving relay details or another account's device information.</p>
<p>The event gains a field and the pending query returns a new record. The account database adds one nullable
annotation to each existing repair row;
older native builds supporting only schema 0176 cannot reopen the migrated database. There is no wire change or
additional diagnostic network traffic.</p>
<h2 id="members-are-accounts">Members are accounts</h2>
<p>An account can have several devices in one group, each its own MLS leaf. Member
rows, rosters, member-id pages and conversation snapshots list each account once,
and <code>member_count</code>, admin counts, last-admin checks and direct-chat detection count
accounts: a 1:1 chat stays a 1:1 whatever devices either person uses. A member row's
<code>device_count</code> is how many of that account's devices are in the group; nothing else
about another account's devices reaches the bindings. A group-system row marks only
an account's first device joining or its last device leaving.</p>
<h2 id="turning-on-account-devices">Turning on account devices</h2>
<p>A group can require <code>marmot.group.account-devices.v1</code>, after which a member's own devices
may add and remove each other there without an admin. A new group requires it on its
own when every founding device supports it. An existing group gets it only through
<code>enable_account_devices(account_ref, group_id_hex)</code>: one admin Commit, sent only when
the user asks, which no member can ever undo. MDK never turns it on by itself.</p>
<p>Before offering the action, call <code>account_devices_activation(account_ref, group_id_hex)</code>.
Offer it only on <code>Eligible</code>. Otherwise say why: <code>NotAdmin</code>, <code>AlreadyEnabled</code>,
<code>LegacyGroup</code>, <code>MembersNeedUpdate</code> (some device in the group runs a client without
support; it becomes eligible as those clients update and refresh their leaves),
<code>DevicesNeedReplacement</code> (some device's leaf carries data under the component's id
that another client wrote; an update does not clear it, so that device has to replace
its leaf or leave and be added again) or <code>DeviceLimitExceeded</code>. The answer is about the
whole group and never names which members or devices hold it back; a non-admin only
ever learns <code>NotAdmin</code>. It is advisory: <code>enable_account_devices</code> checks again and fails
with <code>MarmotKitError::AccountDevicesActivationRefused</code> and the same reason. When the
group is still settling incoming changes, the call checks the current state, then
waits for the group to settle and checks once more before committing. If that second
check refuses, the activation is dropped rather than retried, so read
<code>account_devices_activation</code> again to show the outcome.</p>
<h2 id="group-system-previews">Group-system previews</h2>
<p><code>ChatListMessagePreviewFfi.groupSystem</code> and timeline <code>groupSystem</code> carry
<code>GroupSystemEventProvenanceFfi</code>. MDK verifies local synthesis against the exact
stored row and payload. The optional commit link is for rollback invalidation;
self-removal and reorg-derived rows remain authenticated without it.
Render authenticated membership/admin changes
only for <code>AuthenticatedGroupState</code>; <code>MemberAuthored</code> is an assertion and carries
no trusted actor/subject IDs on projected records. Malformed, oversized and deleted
payloads have no typed event. Provenance records origin; timeline invalidation
status still applies. Raw plaintext remains available to narrow consumers.</p>
<p>Chat previews include separate actor/subject IDs and MDK-prepared display names
from local caches, with the same safe-name/pseudonym fallback used by conversation
identities. Subject profile updates refresh live chat lists without changing message
identity or activity order. Clients own localized wording and the viewer's “you” label.
Conversation windows continue to supply their bounded identity dictionary.</p>
<h3 id="reactions-on-group-activity">Reactions on group activity</h3>
<p>Use the existing reaction commands with the activity row's <code>messageIdHex</code>.
Authenticated system rows retain that deterministic ID across reaction changes,
replay and restart; the same timeline record exposes both <code>groupSystem</code> and
<code>reactions</code>. Retraction uses the existing unreact command, and subscriptions
update the target row without adding a second activity row. Do not synthesize or
send a kind-1210 event to react to local group activity.</p>
<p>Reaction notifications use the supported system payload's text fallback, never
its JSON envelope. Only the stored target sender receives an alert; activity
without an attributable actor does not invent a recipient. Deleted or invalidated
targets and malformed or unsupported payloads expose no target preview.
For synthesized system rows, <code>reactedToPreview</code> is an English fallback. The
notification DTO has neither the target ID nor a structured system event, so this
field cannot support client localization; hosts can omit it and use their generic
localized reaction notification. Conversation rows still expose <code>groupSystem</code> for
client-localized rendering and layout. No client-owned reaction map is required.</p>
<h2 id="group-reporting">Group reporting</h2>
<p>Swift/Kotlin expose <code>report_message</code>, <code>dismiss_reports</code>, <code>content_reports</code>,
<code>report_dismissals</code>, and <code>reported_message</code>; the C ABI mirrors these operations.
<code>ReportReasonFfi</code> supplies the NIP-56 categories. Timeline records carry
<code>has_reports</code>. Individual report records carry reporter, target author, category,
explanation and <code>dismissed</code>; each admin label carries its own event ID, admin,
explanation and timestamp. No aggregate queue, count, status, revision argument,
or winning review decision is imposed on hosts.</p>
<p>Pages are capped at 100 and cursors are exclusive. <code>reported_message</code> uses the ordinary
timeline record. Use existing projection subscriptions to refresh client review views.</p>
<h2 id="moderation-reports-to-the-operator">Moderation reports to the operator</h2>
<p><code>submit_moderation_report</code> privately reports an account to the deployment's
moderation team, in addition to in-group reporting. Group reporting is unchanged
and remains the primary path. The report is a NIP-56 kind-1984 rumor, sealed by
the account key and gift-wrapped per NIP-59 to the configured reports key. It
carries only the reported key, the report type from <code>ReportReasonFfi</code>, the
<code>ModerationReportOriginFfi</code> label and the trimmed explanation (at most 1,000
characters). It never carries message or group identifiers. &quot;Block and Report&quot;
sends <code>BlockAndReport</code> with <code>Other</code> unless the user chose a reason, and still calls
<code>block_user</code> separately.</p>
<p>Set <code>MarmotOptions.moderation_report_config</code> per build flavor, or call
<code>configure_moderation_reporting</code> to see why a destination was rejected. Show the
report-to-operator action only when <code>moderation_reporting_available()</code> is true;
otherwise the call fails with <code>ModerationReportingNotConfigured</code>.
<code>ModerationReportOutcomeFfi.accept_disposition</code> uses the send-summary
vocabulary. Treat <code>AcceptedPending</code> and <code>CompletionUnknown</code> as submitted, because
<code>catch_up_accounts</code> retries them, and never resubmit them. A repeat within 10
minutes returns the same <code>report_id</code>. Each account may send 20 reports per hour
(<code>ModerationReportRateLimited</code>). Sign-out and wipe delete the account's queued
reports. The C ABI mirrors these calls. See the
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/moderation-reports.md">wire format</a>.</p>
<h2 id="stickers">Stickers</h2>
<p>Stickers follow Sonar's pack format. <code>syncStickerPacks</code> refreshes recent public packs and the account's installed
packs; <code>stickerPacks</code> and <code>stickerPack</code> read the local projection without network I/O. <code>fetchStickerPack</code> fetches one
pack by coordinate or Sonar link when the user opens a shared pack. <code>installStickerPack</code> and <code>uninstallStickerPack</code>
change the account's published installed list after a complete read of it; without one, the change stays pending for
a later sync.</p>
<p>A sticker message is kind 9 and carries one exact <code>(coordinate, shortcode, plaintext hash)</code> reference, exposed as
<code>sticker: StickerRefFfi?</code> on message, preview and timeline records (<code>nil</code> for a deleted row). Hosts pass that typed
reference to <code>fetchStickerAsset</code> to get validated bytes and never parse tags or fetch a sticker URL themselves; a
reference the account has no mapping for fails with <code>StickerNotFound</code>. <code>sendSticker</code> sends only a reference the
account already holds. <code>importSignalStickerPack</code> validates a Signal pack link and then refuses before any network call.</p>
<h2 id="emoji-sets">Emoji sets</h2>
<p>Emoji sets are NIP-51 kind-30030 sets. <code>syncEmojiSets</code> and <code>fetchEmojiSet</code> fetch set text only, never images;
<code>emojiSets</code>, <code>emojiSet</code> and <code>userEmojiList</code> read without fetching images. Any call that downloads images reveals the
user's IP address to the image hosts the set's author chose, so call it only after the user acts:</p>
<ul>
<li><code>fetchEmojiSetAsset</code> and <code>fetchEmojiSetCover</code> download and validate one image for a preview after the user opens a
set. Nothing is stored.</li>
<li><code>installEmojiSet(accountRef, coordinate, expectedEventIdHex, control)</code> downloads, validates and stores every emoji
of the version the user was shown after the user taps Install. Another stored version fails with <code>EmojiSetChanged</code>
before any download. <code>EmojiSetInstallControlFfi</code> reports progress and cancels; a cancelled install fails with
<code>EmojiSetInstallCancelled</code> and stores nothing. Skipped entries are reported, not fatal. Caps: 50 installed sets,
500 emoji and 32 MiB per set, 128 MiB in all (<code>EmojiSetLimit</code>).</li>
</ul>
<p><code>installedCustomEmoji</code> lists installed emoji for a picker and flags shortcode collisions without resolving them;
<code>readInstalledCustomEmoji</code> returns stored bytes checked against the hash recorded at install. To use one in a chat,
upload those bytes as an encrypted attachment; never put the set's image URL in a message. <code>uninstallEmojiSet</code> removes
the stored snapshot.</p>
<h2 id="experimental-device-group-test-builds">Experimental device-group test builds</h2>
<p>Ordinary constructors keep device groups disabled, including when the native library has the capability compiled in.
For a controlled host test build, compile <code>dev-device-groups</code> and open with
<code>Marmot.newWithExperimentalDeviceGroups(rootPath:relayUrls:options:)</code> (Swift) or
<code>Marmot.newWithExperimentalDeviceGroups(rootPath, relayUrls, options)</code> (Kotlin). This uses the same <code>MarmotOptions</code>
and required deployment as <code>newWithConfiguration</code>; relay policy, secret storage, attachment mode, cursor behavior,
client name and platform retain their usual meanings. A library without this feature returns
<code>experimental_device_groups_unavailable</code> before opening the root or acquiring a secret store. Use this constructor in
<strong>every</strong> foreground/background opener of the experimental root, a notification service extension or background
worker included. An ordinary constructor does not open an account that holds or is joining a device group: its
session fails with <code>MarmotKitError.Runtime</code> <code>experimental_device_groups_required</code> (and <code>start</code> reports it) before
anything of that account is read, sent or subscribed, so its device-group messages and unfinished device-group commits
wait for an experimental opener. Other accounts open as usual. This is an opt-in test build, not a release default.
Production settlement, retry and recovery timing remains unchanged; never enable <code>test-policy-overrides</code> in a host
artifact.</p>
<p>Build matching native libraries and generated bindings from the same source with the explicit flag:</p>
<pre><code class="language-sh">./crates/marmot-uniffi/xcframework.sh --dev-device-groups
./crates/marmot-uniffi/xcframework-macos.sh --dev-device-groups
./crates/marmot-uniffi/kotlin-bindings.sh --dev-device-groups
</code></pre>
<p>Outputs go to <code>crates/marmot-uniffi/output-dev-device-groups/</code> (iOS at the root, macOS in <code>macos/</code>, Android
in <code>android/</code>). Cargo outputs use an <code>dev-device-groups/</code> child of the selected target directory; Apple
scratch uses <code>build/dev-device-groups/&lt;platform&gt;/</code>. The flag precedes any phase, for example
<code>xcframework.sh --dev-device-groups generate</code>; use it for every phase and transfer only matching inputs.
Ordinary invocations keep their usual outputs and remain incapable. These commands do not publish artifacts or
change release automation. Copy the matching native library, generated source and platform resources together;
source support alone does not establish a platform artifact or device test result.</p>
<p>For a native generated-language constructor check, <code>options-smoke.sh swift</code> (or <code>kotlin</code>) checks the unavailable
ordinary build; pass <code>--dev-device-groups</code> after the language to check an explicitly capable native library.
These local host checks do not package or validate iOS/Android device artifacts.</p>
<h2 id="linked-devices">Linked devices</h2>
<p>Experimental updated clients also share invitation decisions through MDK for one authenticated admission generation
and its inherited sibling Adds. Older unidentified invitations remain local-only; a separate external Add batch or
fork can prompt again. Accept never joins/rejoins or resets explicit archive intent. Decline requests each matching
local leaf's existing Leave; later acceptance cannot cancel already-requested Leave. A decline does not reach a copy
this device already deleted locally. Private KeyPackage requests follow the ordinary stock rules. A zero-publication
<code>CompletionUnknown</code> is pending work, not proof every device departed. Keep rendering the returned invitation and
membership state. Explicit user Leave, including declining an invitation, records the same current-generation Decline
before departure publication when this device trusts a device group; archive, local deletion, sign-out and removal do
not create that choice. Unknown admissions or absent trust keep departure leaf-only. A held maximum version skips the new choice, allowing ordinary
Leave without replacing the retained winner. Invitation decisions use the existing host APIs. Ordinary constructors keep device groups disabled;
controlled host test builds use the explicit constructor described above. Custom experimental peers must update together before using
V2 sibling Welcomes; there is no capability negotiation or mixed-old-receiver guarantee.</p>
<p>An admin account's Leave, and its Decline of an invitation that made it an admin, return <code>AdminCannotSelfRemove</code> before
anything is written or sent: when <code>requires_self_demote_before_leave</code> is true, call <code>self_demote_admin</code> first and then
Leave or Decline; a last admin first makes another member an admin. With experimental device groups on, User Leave
instead demotes a nonlast active admin account itself before SelfRemove, <code>can_leave</code> includes that Leave and
<code>requires_self_demote_before_leave</code> is false; the last active admin account is refused on all its devices before any new
choice or departure publication. The coarse chat-list Leave action opens the authoritative command and need not imply
last-admin eligibility. Sign-out records no Decline; in a chat the account administers with another account it steps the
account down first (mdk#2818). A recorded Decline remains if a later eligibility check refuses departure; a committed
demotion remains if the following Leave fails. Already admitted native work retains its ordinary retry owner. A
SelfRemove applied without readable sibling attribution establishes no new automatic-Add hold, and later repair does not
promise to recover that attribution retroactively.</p>
<p>A leave can become blocked after it was accepted: if the selected branch makes the account the group's last active
admin (two admins left at once and the other's step-down won, say), no Commit can finish the leave. The chat keeps
reading as leaving (<code>leave_request_pending</code>), and <code>leave_blocked</code> is set on the group record, the chat-list row and
management state. MDK does not retry, rejoin or reverse a Decline on its own. Show &quot;Can't leave: you're the only
admin&quot; with a Cancel action while <code>can_cancel_leave</code> holds; <code>cancel_leave</code> clears the leave on this device and the chat
reads as joined again. To leave after that, make another member an admin, demote, and Leave again.</p>
<p>A local chat copy that has applied its own removal stays terminal: later branch changes do not resume convergence
on that copy. Rejoining requires a fresh valid Welcome that replaces its cryptographic state; an invitation alone is
not a guarantee of recovery. The remaining members do not promise to recommit every removal forever. An admin's
account-removal intent has at most two reissues, targeting members still in the selected membership. The rebuilt
commit must pass the author's current admin-authority check when it is sent; otherwise the queued send is refused
and retired. Device-removal cleanup has its own current-roster and remembered-key conditions. An eligible chat admin
can remove a stale member account with <code>remove_members</code>, which removes every leaf of that account, including its
active devices; it is not a per-device cleanup control. Removing a linked device is a separate device-group action.
Automatic inactivity removal is not available yet. Keep showing the selected membership and removal outcome rather
than assuming every branch has permanently removed a leaf.</p>
<p>At the maximum decision version, an opposite invitation choice is refused and the held winner remains; ordinary User
Leave still proceeds without writing another version. Retained invitation generations have no expiry or count cap:
a malicious currently linked device can inflate stored decisions and broadcast pages.</p>
<p><code>linked_devices(account_ref)</code> returns this account's own devices as <code>LinkedDeviceFfi</code> records, read from the roster of
the device group this device trusts, for a Devices screen:</p>
<ul>
<li>This device comes first (<code>is_this_device</code>), then the rest by <code>linked_at</code>. Every entry is this account's own device.</li>
<li><code>slot_id_hex</code> is the device's KeyPackage slot, the handle later device actions take. <code>label</code>, <code>client</code> and
<code>platform</code> are empty until set; <code>linked_by_slot_id_hex</code> is <code>None</code> for the device that founded the group.</li>
<li>Each device writes its own <code>client</code> and <code>platform</code>: its <code>clientName</code> and <code>devicePlatform</code> options (a short name
such as <code>iOS</code>), trimmed, and empty when blank or over 64 bytes. It writes them with its next KeyPackage
announcement in the device group, so they appear after its next maintenance pass.</li>
<li><code>last_active_at</code> is when a heartbeat last showed a sibling running, in Unix seconds. Each running device sends one
in the device group at most once an hour; each is dated when it was created or, if earlier, when this device read
it. It is <code>None</code> for this device and for a sibling none of whose heartbeats has counted yet.</li>
<li><code>inactive</code> is this device's own judgement, for showing the user: 30 days have passed since a sibling's last activity
or since this device first found it in the roster, whichever is later. It is never set for this device. <code>status</code>
<code>Inactive</code> is the roster's own mark.</li>
<li>The account's devices mark and remove inactive devices themselves. A device counts time only while it is caught up
with its device group, and restarts every count after more than 24 hours without being caught up. About 30 days
after a sibling was last heard from, a caught-up device marks it <code>Inactive</code>: show &quot;Remove&quot; and &quot;Keep&quot; for a device
whose <code>status</code> is <code>Inactive</code> and whose <code>keep_while_inactive</code> is off. About 90 days after, a device still marked
<code>Inactive</code> without <strong>Keep while inactive</strong> is removed as by <code>remove_linked_device</code>, except that its KeyPackage slot
is left on the relays. A marked device that is running clears its own mark once it has caught up. One whose recovery
gave up on a missed Commit, or whose copy is unrecoverable with no automatic rejoin underway, can't catch up, see or
clear its mark, and is removed at 90 days like one that never came back: offer the reset on <code>device_group_stalled</code>
(below).</li>
<li>The list is empty until this device trusts a device group (a single-device account has none), and in ordinary opens
without explicit experimental device-group intent.</li>
<li>The device group's own events never reach hosts. Re-read on <code>MarmotEventFfi::LinkedDevicesChanged</code>, which carries no
device or group identities. With device groups on, it also fires once each time the account's worker opens or reconnects, so it may fire
with no visible change.</li>
</ul>
<p>Chat history from another device: each imported <code>TimelineMessageRecordFfi</code> names its source in <code>imported_from</code>, and
<code>chat_history_imports(account_ref)</code> lists each held chat's history as <code>Receiving</code> (<code>retrying</code> once an attempt to get its
bundle failed) or <code>Imported</code>. The list is empty and the event silent in ordinary opens without explicit experimental
device-group intent. Draw &quot;Imported from &lt;device&gt;&quot; where rows change from imported to live, and say &quot;another device&quot; for an empty
<code>device_label</code>. Re-read the list on <code>MarmotEventFfi::ChatHistoryImportsChanged</code>, which fires whenever its answer
changes, a source device's rename or removal included; re-read rows on <code>LinkedDevicesChanged</code> for their new names.</p>
<p><code>rename_linked_device(account_ref, slot_id_hex, label)</code> renames any of the account's devices, this one included, with
one roster commit in the device group:</p>
<ul>
<li>Only the label changes. It is at most 64 bytes of UTF-8; an empty label clears it.</li>
<li>It is refused with nothing sent (<code>MarmotKitError.Runtime</code> with details <code>device group refused: &lt;reason&gt;</code>) in ordinary
opens, for a label that is too long, without a device group, for a slot the roster doesn't list, and while the device group has an earlier change of this device's
in flight (<code>device_group_busy</code>). Retry that last one later; a commit then could build on a roster that is about to
change.</li>
<li>A rename whose commit loses a fork is made again on a later maintenance pass, unless another rename or settings edit of that device
won; that one stands. Show the label <code>linked_devices</code> returns after <code>LinkedDevicesChanged</code>, not the one the user typed.</li>
</ul>
<p><code>update_linked_device_settings(account_ref, slot_id_hex, add_to_all_chats, bring_history, keep_while_inactive)</code>
changes any linked device's supplied settings, this device included. Each setting is optional: omitted values come
from the current roster on the account worker, so changing one toggle does not restore another from a stale screen.
A patch that still matches after earlier-edit recovery sends no new edit. Enabling <strong>Add to all my chats</strong> permits
eligible direct post-link Adds while that flow is still adding, and gap filling under its conditions; turning it off
does not leave joined chats. The approving device's direct post-link pass sends no gap-fill claim (kind 458). With
three or more devices, it can race another sibling's gap filling and cause extra Add attempts, private-KeyPackage
consumption, or Commits and convergence passes; selected-parent presence checks and ordinary branch selection still
apply. <strong>Bring chat history</strong> applies to future sibling Adds and transfers still owed; enabling
it does not backfill chats already joined or recreate a transfer discarded while it was off. <strong>Keep while inactive</strong>
stops automatic removal of an <code>Inactive</code> device; it does not stop the mark, explicit removal or sign-out.</p>
<p>Automatic chat Adds can wait for compatible private KeyPackages. Held packages that satisfy stock time checks
but lack a capability a waiting chat requires do not cover that chat's need: while the issuing device's leaf in the
device group advertises what the chat requires, this device asks it for more, and the compatible packages it hands
over complete the Add. The older packages stay for chats they fit. A device whose leaf does not advertise the
requirement is not asked on that chat's behalf; its own upkeep still stops counting packages that no longer
advertise its current capabilities and hands over compatible replacements. An issuer holding as many issued
packages as it keeps answers with packages it already handed over, so the chat can wait for older stock to expire.
Repeat requests for an unchanged unmet need keep their hourly throttle; an increased need can make a request due
at the next upkeep. Progress depends on the issuer and device group being available, with no fast or guaranteed
discovery deadline for this wait.</p>
<p>On the editing device, new automatic Adds and history transfers wait for a differing local setting intention to
settle. Existing history debt keeps its original expiry; once ready, a history setting that is off discards that debt.
This does not recall deliveries already handed off or change what another device sends before it learns the edit.</p>
<p>A linked device added to a chat with a private KeyPackage that expired before it opened the Welcome can never join
that copy. Once that device has been heard from for an hour after the expiry, a sibling removes its unused leaf
and gap filling adds it again, so the chat shows a removal and an Add of the same account's device. <strong>Bring chat
history</strong> applies to that Add as to any other. A device that joined but never updated its leaf in the chat is
treated the same way. A device not heard from since the expiry keeps its leaf, and a restart of the sibling that
would remove it starts that hour again.</p>
<p>A rename and a settings change share one recovery record. Before accepting another edit of that device, the runtime
tries the existing recovery of an earlier lost edit and re-reads the roster. Retry <code>device_group_busy</code> only while it
remains unsettled. A successful no-op never leaves an opposite lost intention to apply later. A competing user edit
of that device wins as a whole, even if it changed a different toggle. Once an edit is retired because another edit
stands or the device leaves the roster, a later branch that removes that rival does not restore the retired local
choice. To apply it again, edit the device once it is listed in the selected roster. Refresh the displayed label and flags on
<code>LinkedDevicesChanged</code>. These commands remain behind the device-group development gate.</p>
<h3 id="explicit-local-device-group-reset-before-fresh-pairing">Explicit local device-group reset before fresh pairing</h3>
<p><code>DeviceLinkSnapshotFfi.device_group_stalled</code> says this device can no longer catch up with its device group: automatic
recovery gave up on a change it missed, or its copy is unrecoverable and automatic rejoin is not underway. It cannot
see or clear an <code>Inactive</code> mark, and its siblings remove it about 90 days after they last heard from it. Offer the reset
below, then fresh pairing. Re-read on <code>DeviceLinkChanged</code>, which fires when it changes.</p>
<p>In an experimental device-group build, offer <code>reset_device_group_for_repair(account_ref)</code> only after the user chooses
to discard this device's local hidden device-group copy. It keeps account credentials, the stable device slot and
ordinary chats, history, drafts and settings. It abandons old link-bound preparations; retained shared values and
security decisions can synchronize again under ordinary rules. It sends no removal and repairs no ordinary-chat
membership. It is separate from sign-out, account removal and a Move. An already unlinked
device cannot use it to bypass removal.</p>
<p>Reset acts on this device, not the other slot named by a sign-in row. Check both devices before choosing which local
copy to discard. If the approver still lists this slot, fresh admission can remain refused; removing that slot writes
removal evidence and is not a universal shortcut back in. If no other device retains the old group, a later first
link can create a different group: its discarded roster continuity is not restored. Independently retained local
backup/security records are kept.</p>
<p>The returned link snapshot has no trusted old copy to restore. Reset does not publish a new KeyPackage. Use the normal
<code>rotate_key_package(account_ref)</code> publication action, then start a fresh code-comparison flow and confirm on both
devices; the fresh Welcome can join the same group id under the existing exact sender/group/KeyPackage checks. Reset
alone does not guarantee admission: the approver may still list the slot or its old leaf, reject it, or be full.
Existing duplicate, removal, capacity and authentication rules still apply. Cancellation or failure after reset can
leave needs-link; a restart before confirmation can require a new exchange. A fresh link already confirmed retains
its existing durable Welcome-wait/restart rules. Retained chat data guarantees neither current membership nor missing
history backfill, and admitted work is not recalled.</p>
<p>Active pairing, an unfinished Move or unsettled native device-group work refuses with <code>device_group_busy</code>. Ordinary
settlement may unblock it, but no deadline is promised. No trusted copy returns <code>no_device_group</code>; the command never
creates a link or a new device slot. Rebuild matching native/generated bindings for the additive action and sign-in
field. Actual app display adoption is separate.</p>
<h3 id="moving-this-device-to-another-device-group">Moving this device to another device group</h3>
<p>In an experimental device-group build, start the same compared-code linking flow on a device that already trusts a
device group to move only that device. Keep showing the existing group while <code>DeviceLinkSnapshotFfi.moves</code> is
<code>WaitingForWelcome</code> or <code>Joining</code>. Joining the destination alone does not switch trust: <code>Made</code> requires this device's
first selected authenticated change there. Its trust then switches once, with ordinary full small-state synchronization
at unchanged versions. Chats and chat membership stay in place; the move does not promise delivery between the two
device groups. Released binding builds still provide no working linking entry.</p>
<p>At most one confirmed move link is kept, with its Welcome expectation while that Welcome is pending. After restart
another code comparison can begin, but if the earlier move is still pending at confirmation the new exchange ends
before this device sends its Confirm (<code>LinkFailed</code> locally, <code>CannotLink</code> on the answering device). The earlier link
and any still-live expectation stay unchanged; no second link approval or Add is made.</p>
<p>If this device moves while another device's link it approved is still pending, its old local prompt can end as failed
and its automatic chat additions can be skipped even if the other device joined. Finish that link before moving when
its completion and chat additions matter. Moving does not undo the other device's admitted membership.</p>
<p>Each move has an opaque <code>move_id</code>. <code>old_siblings</code> names recognized devices left in the old group; while
<code>question_suppressed</code> is true, offer to link that device here rather than treating its sign-in as unknown.
<code>dismiss_device_group_move_sibling(account_ref, move_id, slot_id_hex)</code> ends only that local recognition hint; it does
not remove or link a device. A later confirmed link or selected departure ends the hint too. Slots in
<code>overridden_rejection_slots</code> were already devices in the destination, so that destination entry took precedence over
an old rejection. Moves carry rejected slots with their original ages, never rejected KeyPackages.</p>
<p><code>LinkedDeviceStatusFfi::Moved</code> is the old group's own status for a moving device; its cleanup leaves the device's
ordinary chats alone. Already admitted old-group traffic may finish through normal delivery rules before local old-group
storage is forgotten; there is no immediate-quiet deadline or cancellation promise. Several old siblings can race
cleanup, costing extra Commits and convergence passes under normal branch selection. A known failed link before Made
forgets only the destination and keeps old trust. An unrecoverable destination keeps that trust while ordinary repair
applies; it may stay pending indefinitely and need manual local recovery. While pending, this device cannot confirm
another move or answer new pairing Requests. Corrupt or unreadable local move facts can
fail progress/status reads and need manual local recovery or reset followed by a fresh compared-code link. Do not
infer an unlinked state or expect an unlink notification for those errors, and never reconstruct old trust.
Recognition hints suppress questions only on the mover. Old siblings can ask “Was this you?” after cleanup; the user
can dismiss that prompt. An old in-flight chat Add can leave a membership leaf whose Welcome no longer reaches this
device. Automatic gap filling may not replace that leaf; manual chat membership repair can be needed. Moving adds no
duplicate-leaf cleanup or recall of admitted Adds.</p>
<h3 id="this-device-unlinked">This device unlinked</h3>
<p>When another of the account's devices removes this one with <code>remove_linked_device</code>, the account stops on this device
once it reads the removal, and nothing more is sent from it (mdk#2628):</p>
<ul>
<li><code>MarmotEventFfi::DeviceUnlinked { account_id_hex, account_label }</code> fires once, after the account is signed out. From
then on the account's <code>AccountSummaryFfi</code> has <code>unlinked</code> and <code>signed_out</code> set, and both stay set.</li>
<li>Show that this device was unlinked from the account, and stop showing its local history.</li>
<li>Signing in to it, logging in to it or importing its key fails with <code>MarmotKitError::AccountUnlinked</code>. Offer <code>sign_out_and_wipe</code>, which skips leaving the
account's chats and deleting its KeyPackage slot, since the other devices did both. Signing in again is then a new
sign-in that links this device anew.</li>
</ul>
<h3 id="signing-out-with-linked-devices">Signing out with linked devices</h3>
<p><code>sign_out_and_wipe</code> signs out through the account's other devices when this device has a linked device that is not
signing out too (mdk#2628):</p>
<ul>
<li>It first records in the device group that it is leaving and waits for that to settle, which can take about 30
seconds; show progress. It then leaves only the chats no other device can take it out of, deletes its KeyPackage
slot and wipes. The other devices remove it from the device group and from the rest.</li>
<li><code>WipeOutcomeFfi.groups_left_to_siblings</code> counts the chats it left to the other devices; <code>groups_left</code> counts those it
left itself.</li>
<li>When it can't ask them in time, it tries to leave every chat itself, reporting any it can't in
<code>group_leave_failures</code>, and sets <code>siblings_not_reached</code>. Tell the user their other devices couldn't be asked, and
that those devices may still list this one until the user removes it from one of them.</li>
<li>The other devices list it with <code>LinkedDeviceStatusFfi::Leaving</code> until they remove it, then drop it.</li>
</ul>
<p>Signing out is device-only and does not submit an account-wide Leave decision. An active admin cannot self-remove, so in
a chat the account administers with another account, where none of its other devices has a leaf, signing out steps the
account down first and then leaves (mdk#2818), with or without linked devices. One wait of about 30 seconds covers all
such chats; show progress. Each counts in <code>groups_left</code> only once this device sees its removal; otherwise
<code>group_leave_failures</code> says why: the step-down was not accepted in time, the account is off the admin list but its
removal was not seen in time (it stays a member), or the account became the chat's last admin. A blocked leave ends that
chat's wait. A chat this device was already leaving gets nothing new and joins the same wait. This device keeps its
leaf, and the sign-out reports the chat, where the account is the last admin, where another of the account's devices
stays in the chat, and once its device group removed it during the sign-out. An eligible sibling can still remove this
device while the account remains an admin.</p>
<p>Sibling assistance requires a trusted device group with another Active or Inactive device and this device's own
roster entry already carrying its tag signature key. Removal also needs a chat that supports same-account device
removal and the required tagged leaves;
<code>groups_left_to_siblings</code> is a handoff, not a completed-removal receipt. Outside admin chats, <code>groups_left</code> counts
successful local leave calls, not confirmed membership removal. The call still attempts local account deletion after remote leave
failures. Show the chats in <code>group_leave_failures</code> and check <code>local_cleanup.completed</code> independently; local cleanup
completion does not establish that this device left every chat.</p>
<h3 id="overdue-keypackage-refresh">Overdue KeyPackage refresh</h3>
<p>While this device trusts a device group, it announces each KeyPackage in its own roster entry before publishing it, so
a device group that can't take that Commit holds the refresh back. <code>key_package_refresh_overdue(account_ref)</code> is true
once the KeyPackage this device would publish is still unannounced and its slot's newest publication is a week old.
Inviters stop treating the device as fresh at 30 days, so tell the user. A routine refresh never shows, and neither
does one that is announced but failing at the relays. Re-read on <code>MarmotEventFfi::KeyPackageRefreshOverdueChanged</code>,
which carries no device or group identities and, with device groups on, also fires once each time the account's worker opens or reconnects.
It is false in ordinary opens without explicit experimental device-group intent.</p>
<h2 id="unrecognized-sign-ins">Unrecognized sign-ins</h2>
<p><code>unrecognized_sign_ins(account_ref)</code> returns sign-ins of this account that this device does not recognize as
<code>UnrecognizedSignInFfi</code> records, for a &quot;Was this you?&quot; prompt:</p>
<ul>
<li>Each is a fresh, valid KeyPackage of the account in a slot that neither this device nor its device group's roster
knows. The earliest to appear comes first.</li>
<li><code>before_this_device</code> means this device's first check found it, so it was signed in before this device: ask whether
the user still has it, with <code>last_seen_at</code>. For any other, ask whether it was them, with <code>client</code> and
<code>appeared_at</code>. <code>client</code> is display only.</li>
<li><code>state</code> is <code>Prompt</code>, <code>NotNow</code>, or <code>LinkedElsewhere</code>/<code>RejectedElsewhere</code> when another device answered while the
prompt waited here. <code>linked_by_slot_id_hex</code> names the linking device for <code>LinkedElsewhere</code>.</li>
<li><code>previously_linked_here</code> adds context only when this device retains a made approval for that slot in its current
trusted group but its settled selected roster no longer lists it. Offer “A slot previously linked here is missing
from this device's current device list. Open both devices to check the link.” It does not authenticate the current
publication or prove permanent loss. Known local removal/rejection or matching retained departure evidence suppresses
the context, conservatively including older departures of the same slot/key. Incomplete records, expired evidence,
slot reuse and discovery also bound it. False means no affirmative local context, not “never linked.” Keep existing Not now/dismiss behavior; silence/decryption failure is not a reset
signal. The user can explicitly choose <a href="#explicit-local-device-group-reset-before-fresh-pairing">local reset</a>.</li>
<li><code>answer_sign_in(account_ref, slot_id_hex, response)</code> takes <code>NotNow</code>, <code>Reject</code> or <code>Dismiss</code>. <code>Reject</code> drops the sign-in
from this device's list and records its slot as rejected in the device group's roster; with no device group yet, it
waits on this device. On another device, a new sign-in whose prompt still waits there turns <code>RejectedElsewhere</code> and
stays until <code>Dismiss</code>; one put off with <code>NotNow</code>, or found before that device, leaves its list. <code>Dismiss</code> only ends a
prompt another device answered. Linking one is device pairing's.</li>
<li>The account checks at open, every six hours, and soon after one of its KeyPackages arrives live.
<code>check_sign_ins(account_ref)</code> checks now and returns the list after the check.</li>
<li>Re-read on <code>MarmotEventFfi::UnrecognizedSignInsChanged</code>, which carries no slots. With device groups on, it also fires once each time the
account's worker opens or reconnects, so it may fire with no visible change.</li>
<li>The list is empty in ordinary opens without explicit experimental device-group intent.</li>
<li><code>start_fresh(account_ref)</code> is &quot;No, start fresh&quot; when the user no longer has the devices the first check found: every
sign-in from before this device is answered <code>NotNow</code>, now and when one is listed later. It rejects nothing and
raises no compromise warning, so one of those devices can still link this one. It is refused before the first check
(<code>sign_ins_unchecked</code>) and once this device trusts a device group (<code>device_group_exists</code>). <code>started_fresh</code> says
whether the device did so and still has no device group: say that only chats it is invited to from now on are here.
Re-read it after <code>start_fresh</code> and on <code>LinkedDevicesChanged</code>.</li>
</ul>
<h2 id="compromise-warning">Compromise warning</h2>
<p><code>compromise_warning(account_ref)</code> returns the account's open compromise warning on this device as
<code>CompromiseWarningItemFfi</code> records, the earliest gathered first. An empty list means no warning is open:</p>
<ul>
<li>Each item means someone holding the account's signing key, or a session with its remote signer, published where the
account's devices did not. <code>RejectedSignIn</code> is a sign-in answered This wasn't me, on this device or another;
<code>ForeignOwnSlotKeyPackage</code> is a KeyPackage this device found in its own slot that it did not make, with its
<code>key_package_ref_hex</code>. Only the device that found it warns of it, and it has replaced it. <code>slot_id_hex</code> and
<code>occurred_at</code> say where and when.</li>
<li>Later releases add reasons. Show one the app does not know as a generic one.</li>
<li>The warning gathers this device's rejections and those in its device group's roster, so a rejection made on another
device warns here too. Rejections already in the first roster this device trusts count as seen: the user saw them on
the devices that were there. A rejected sign-in leaves the warning once its slot is linked as a device.</li>
<li><code>dismiss_compromise_warning(account_ref)</code> marks everything the warning gathers as seen, on this device only. It stays
closed until a new rejection arrives, and a rejection that branch selection drops and brings back stays seen.</li>
<li>The app writes the wording, and never says the account's devices stopped them.</li>
<li>Re-read on <code>MarmotEventFfi::CompromiseWarningChanged</code>, which carries no slots. With device groups on, it also fires once each
time the account's worker opens, so it may fire with no visible change.</li>
<li>The list is empty in ordinary opens without explicit experimental device-group intent.</li>
</ul>
<h2 id="linking-a-new-device">Linking a new device</h2>
<p>Linking a new device of the account shows the same seven emoji on both devices, and each user confirms. Every call
returns a <code>DeviceLinkSnapshotFfi</code>, and every call requires the explicit experimental build and constructor described above:</p>
<ul>
<li>The new device calls <code>start_device_link(account_ref)</code> and shows <code>new_device</code>: <code>WaitingForAnswer</code> (ask the user to
open the app on a device already signed in), then <code>Comparing</code> with the code. Offer &quot;They match&quot;
(<code>confirm_device_link_match</code>) and cancel (<code>cancel_device_link</code>). It then shows <code>WaitingForOtherDevice</code>, <code>Joining</code>,
and <code>Linked</code>, or <code>Ended</code> with a reason.</li>
<li>A device already signed in shows each entry in <code>prompts</code>. <code>Comparing</code> shows the code; offer a label field, &quot;Add to
all my chats&quot; and &quot;Bring chat history&quot; (both on by default), Link device (<code>link_device</code>) and Not now
(<code>decline_device_link</code>). After Link device it shows <code>Linking</code> until the new device's first change in the device group
arrives, then <code>Linked</code>; with none within an hour, the device is removed again and both sides show <code>LinkFailed</code>.
Other states say why Link isn't offered, or <code>AddedElsewhere</code>: &quot;&lt;device_label&gt; was added by &lt;added_by_label&gt;&quot;.</li>
<li>Each emoji carries an English <code>description</code> for screen readers. Users compare the pictures, not the descriptions.</li>
<li><code>device_link_snapshot(account_ref)</code> reads linking without changing it. Re-read on <code>MarmotEventFfi::DeviceLinkChanged</code>,
which carries no device, session or group identities. With device groups on, it also fires once each time the
account's worker opens or reconnects. Live comparison sessions are lost then; admitted moves resume from durable progress. Inspect <code>moves</code>
rather than assuming an interrupted comparison undid an admitted move.</li>
</ul>
<h2 id="backup-recovery-and-background-conditions">Backup recovery and background conditions</h2>
<p>Backup setup and manual restore require a <code>dev-device-groups</code> build opened with <code>newWithExperimentalDeviceGroups</code>
(see <a href="#experimental-device-group-test-builds">experimental device-group test builds</a>); both are off by default.
Otherwise every backup call is refused with <code>roster_unsupported</code>, and ordinary hosts have nothing to do. MDK owns backup selection, due work, download limits, import validation and membership checks;
the host supplies platform facts, renders status and obtains recovery words from the user.</p>
<p>Use <code>beginRecoveryWords(accountRef)</code> to generate 12 new words for backup setup. Display them once, then ask for the
words at the two returned <strong>1-based</strong> <code>confirmPositions</code>, in order, and pass those answers to <code>confirmRecoveryWords</code>.
<code>cancelRecoveryWords</code> forgets the pending setup; <code>backupSettings</code> reads selected account settings.
<code>turnOffBackups</code> disables future account backups without deleting existing archives. A busy or failed confirmation
keeps the core setup available for another try. Read settings again rather than treating a submitted choice as settled.</p>
<p>Report <code>setRuntimeBackupBackgroundConditions(wifi, charging)</code> once per runtime, before workers exist and on
changes. Background writer work requires <strong>both Wi-Fi and charging</strong>. Reports survive account-worker restarts; a new
runtime starts closed. An admitted pass settles after false, while later passes wait. The account-shaped
<code>setBackupBackgroundConditions</code> remains a compatibility wrapper that validates the active account before reporting
the same runtime-wide facts and never starts its worker. Manual restore is independent.</p>
<p>An OS background task can await <code>runDueBackupPass(accountRef)</code>: it joins the current pass or tries ordinary due
admission once. The admission wait includes other queued work and startup catch-up. <code>NotStarted</code> admits nothing;
<code>FinishedAttempt</code> means the pass's serialized settlement attempt and
credit release ended. It is not a publication-success receipt, forced backup, future-due wait or whole-runtime idle
barrier. Cancelling this caller detaches its wait; worker stop/replacement returns <code>TransportClosed</code>. The host
bounds its OS execution opportunity, since a queued caller's wait has no additional timeout, and supplies fresh facts
to each new runtime. Disabled device-group support returns
<code>NotStarted</code> without starting a worker; the fact-report method itself is local and available.</p>
<p><code>beginBackupRestore(accountRef, words)</code> starts one manual history-only operation per account and returns its status.
Old words remain usable independently of the current backup key; restore never enables backups or changes that key.
Only chats whose current selected MLS tree contains this device's own leaf can receive history. Unknown chats retain
private availability metadata, without creating or joining a chat. After a real join, <code>backupHistoryAvailability</code>
returns words-again hints for that current chat. Archived preferences and invitation decisions are not applied.</p>
<p>Use <code>backupRestoreStatus</code> or <code>watchBackupRestore</code> for aggregate progress. A watch offers its initial snapshot once and
then <code>next</code> updates; closing it does <strong>not</strong> cancel work. <code>Complete</code> means eligible work settled, not that all history
was found or that a backup pointer existed. <code>Partial</code> retains committed history; <code>Unavailable</code> can require a later
manual retry. Availability revisions wake the same watch; read the current chat's hints again. Operation tokens are
opaque, ephemeral, account-scoped strings: return the exact token to <code>cancelBackupRestore</code>. A stale valid token returns
false and cannot cancel a newer operation; malformed tokens are rejected. Cancellation and shutdown release owned
secrets and leave committed history intact. Retry explicitly with the words again; there is no durable secret-backed resume.</p>
<p>Timeline pages and prepared conversation rows expose <code>historyImportProvenance</code>: <code>Device</code> carries a device slot,
<code>Backup</code> carries an archive identity. Render backup rows as restored from backup, never as an unnamed device. The
archive identity does not prove original writer, historical authorship or historical membership. The legacy
<code>importedFrom</code> field remains sibling-only; its absence alone does not identify live rows.</p>
<p>Never persist, log or include recovery words in diagnostics. Clear host-owned input and displayed copies promptly.
MDK guards its owned queued phrases and confirmation answers and zeroizes managed secret buffers on release; generated
Swift/Kotlin strings, caller copies and upstream parser/hash/compiler scratch are outside that guarantee. Dropping a
managed string does not promise erasure. Do not log whole DTOs even when a particular Rust Debug implementation redacts them.</p>
<h2 id="history-may-be-incomplete-notices">History may be incomplete notices</h2>
<p>Automatic recovery stops retrying an obligation after a fixed budget of attempts that
recover and certify nothing. Each such parked occurrence is a notice the user should see
as &quot;history may be incomplete&quot;:</p>
<ul>
<li><code>history_notices(account_ref)</code> returns <code>HistoryNoticeFfi</code> records, oldest first: an
opaque <code>notice_id</code>, a <code>HistoryNoticeCauseFfi</code> for the host's wording, <code>group_id_hex</code>
for a group-scoped occurrence (an epoch gap) or <code>None</code> when the account as a whole is
affected (delivery or notification loss, incremental or explicit history), and an
optional <code>parked_at_ms</code>. It reads local durable state and never touches the network.</li>
<li><code>group_recovery_status</code> sets <code>history_may_be_incomplete</code> and lists the group's own
<code>history_notice_ids</code>. Show a banner in that conversation; account-wide notices belong
in an account-level surface instead.</li>
<li><code>MarmotEventFfi::HistoryNoticesChanged</code> fires when a notice appears (recovery parked),
disappears (new evidence re-armed recovery, or it was dismissed), or is replaced. Re-read
the list; a group whose own notices changed also receives <code>GroupStateUpdated</code>.</li>
<li><code>dismiss_history_notice(account_ref, notice_id)</code> records the user's decision durably,
as its own outcome and never as recovered history. It returns <code>false</code> for a stale id;
re-read and show the current notices. After a delivery-loss dismissal the transport
cursor can advance again once no loss recovery remains pending.</li>
</ul>
<p>Do not dismiss on the user's behalf, and do not persist <code>notice_id</code> as a group or
account identity: it changes whenever recovery re-arms. A dismissed occurrence never
comes back, but genuinely new evidence can raise a new notice: new loss, a higher missing
epoch, a later startup's incremental comparison, or a new explicit repair. Explicit
full-history repair remains available and can still complete parked history that its
comparison of the retained window certifies. Notices carry no relay, message or key identities; keep them out of
analytics. C callers: see the <a href="__MARMOT_BASE__docs/c-interface.html#history-may-be-incomplete-notices">C guide</a>.</p>
<p><code>account_recovery_status(account_ref)</code> returns <code>AccountRecoveryStatusFfi</code>: the groups whose
history is still being fetched (<code>catching_up_group_ids_hex</code>), whether the inbox's is
(<code>inbox_catching_up</code>), and every notice as <code>history_notices</code> lists them. Show the first two
as &quot;catching up&quot; and re-read on <code>MarmotEventFfi::RecoveryStatusChanged</code>. The recovery
runner supplies those fields. Current epoch-gap exhaustion emits <code>EpochGap</code>; coverage-ledger
parks emit <code>HistoryNoticeCauseFfi::UnprovenHistory</code> without attributing the original reason
history was owed. Other cause labels preserve compatibility; keep exhaustive switches.</p>
<p>When a Welcome installs a new copy of a group in place of this device's old one (an automatic
rejoin after the old copy could not be repaired, a reentry after a trusted removal, or a fork
discarded with the user's consent, whose old copy may still have worked), the group gets one <code>HistoryNoticeCauseFfi::BeforeRejoin</code> notice: messages from before the
rejoin that the device had not received are unavailable, and recovery stopped fetching
them. A restart raises no second one, dismissing it retires nothing further, and a later
rejoin raises a new one.</p>
<p>Durably and natively <code>Unrecoverable</code> copies start authenticated automatic rejoin in the existing account workers.
Hosts use the existing Repair action to rearm an eligible parked episode; restarting alone does not reset its budget.
A reachable eligible admin and eventual delivery are required. Usable forks still need explicit replacement
consent, and pruned epoch secrets are not restored. See the
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/docs/marmot-architecture/invitation-recovery.md#automatic-rejoin-of-an-unrecoverable-copy">automatic rejoin contract</a>.</p>
<p>While unresolved epoch-gap recovery covers a group's current local epoch, the group may
have moved past this device. Group changes (invite, remove, admin changes, profile, image,
retention, disbanding and app components) then fail with <code>MarmotKitError::GroupCatchingUp</code>:
a change committed from a stale epoch can split the group for everyone. Messages and
leaving are not affected.</p>
<p>The check is advisory, because the evidence behind it cannot be authenticated. Ask the
user, for example: &quot;This chat may be out of date on this device. Changing the group now
could split it for everyone. Wait for it to sync, or continue anyway?&quot; To continue, call
<code>acknowledge_group_catching_up(account_ref, group_id_hex)</code> and retry the change. The
acknowledgement admits one change attempt at the device's current epoch, is consumed even
if that attempt fails, and is not persisted. Use the
strongest wording for invites: a member invited onto a branch that later loses is left
with a Welcome that no longer works. Without an acknowledgement, the check lifts once
recovery catches the group up or the device moves past that epoch. Dismissing the group's
history notice does not lift it. Scheduled self-updates wait up to a day for the group to
catch up, then proceed.</p>
<p>A group change counts as published once one group relay accepts it, and MDK keeps
retrying the other group relays with the same event. Until they accept it, members who
read only those relays cannot follow the group. Once a change has been owed to a relay for
two minutes (a healthy slower relay is retried after 30 seconds), group changes fail with
<code>MarmotKitError::GroupCommitUndelivered</code> (mdk#2255). <code>group_commit_delivery(account_ref, group_id_hex)</code> returns the oldest change still owed to a relay, with the relays owing it and
<code>since</code> (when the first relay accepted it), or <code>None</code>. It is reported immediately, so a host
can show &quot;not delivered to every relay yet&quot; before the user tries a change; a <code>Some</code> result
alone does not mean the next change fails. No event announces delivery completing, so poll
while showing it. This check is advisory too, because groups
often list a relay that is gone for good: once the user accepts that members on those
relays may not follow, call <code>acknowledge_group_commit_undelivered(account_ref, group_id_hex)</code> and retry. Like the catching-up acknowledgement, it admits one change
attempt and is not persisted. A change can need both acknowledgements; each survives the
other check refusing the attempt. Scheduled self-updates wait up to an hour for delivery,
then proceed.</p>
<h2 id="file-backed-media-upload">File-backed media upload</h2>
<p>Use <code>uploadMediaFiles</code> for private regular-file inputs instead of sending a
whole-file byte array across the binding. <code>uploadMediaFilesWithClientToken</code>
preserves durable local-send admission; probe <code>localSendStatus</code> after an unknown
outcome before another upload. Keep the host source valid until return, use one
<code>MediaFileTransferControlFfi</code> per operation, and explicitly cancel it rather than
only dropping the host's wait. Every source is copied into the account's
encrypted media store before PUT, and the ciphertext streams from that copy
without being written to disk. A source the disk cannot hold beyond the
attachment policy's disk reserve fails with <code>StorageFull</code> before anything is
uploaded; ask the user to free space. The counter is monotonic processed bytes
(copy, digest pass, then transfer), not a percentage.</p>
<p>Uploads return <code>MediaAttachmentReferenceFfi.sourceEpochIdentity</code>, a local branch
identity that must be preserved unchanged when saving a reference or passing it
to <code>sendMediaAttachments</code>, <code>sendTaggedMedia</code>, or <code>reactWithMedia</code>. A send requires
both the upload epoch and that exact branch to remain current. A branch change
can invalidate an upload even when the epoch number stays the same. References
received from peers or saved before this field existed have no upload identity:
re-upload their retained bytes before sending them. Downloads of those references
remain supported. This identity is local metadata and is never included in
<code>imeta</code> or shared with peers.</p>
<p>Cancellation observed before message admission starts prevents publication.
Admission is not interruptible once started, including while durable acceptance
is pending. File-backed uploads have no fixed worker-response timeout;
per-endpoint network deadlines still apply.</p>
<p><code>maxFileMediaCiphertextBytes</code> includes a 16-byte AEAD tag for each attachment in
the batch. This is a finite implementation bound, not a claimed server maximum.
Uploads try policy endpoints in order; ordinary rejection or invalid descriptors
fall through, while signer denial and cancellation stop the operation. An
explicit endpoint override intentionally selects only that endpoint. Receiver
acquisition streams large bodies into private files, resumes protected ciphertext
where valid, and authenticates before publishing bounded readable local assets.
The stored copy becomes the sender's local attachment once the message is
confirmed, with no retention budget. Preview limits and the legacy byte-array
API bounds are not increased.</p>
<p>See <a href="__MARMOT_BASE__docs/native-api.html#marmotupload_media_files">the upload reference</a> and
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/LOCAL-SENDS.md">local-send ownership</a>. C hosts use the
<a href="__MARMOT_BASE__docs/c-interface.html#file-backed-media-upload">file-backed C inputs and control</a>.</p>
<h2 id="bounded-attachment-history">Bounded attachment history</h2>
<p>Use the asynchronous attachment history page/version methods for canonical media-library
discovery. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-HISTORY.md">the native handoff</a> for filtering, refresh,
removal and cursor ownership. <code>list_media</code> remains a compatibility API.
Custom reaction artwork uses the bounded <code>reactionAttachment</code> lookup with the
reaction event ID, followed by the same acquisition and local-read path as chat
attachments; see <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-HISTORY.md#reaction-artwork">reaction artwork</a>.</p>
<h2 id="local-attachment-access">Local attachment access</h2>
<p>Use <code>attachmentLocalAssets</code> to locate verified retained bytes for visible source
slots, then <code>readAttachmentAsset</code> for bounded local chunks without network work.
See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md">the native attachment handoff</a> for unavailable/EOF semantics,
source revalidation, host buffer ownership and integration guidance. For an OS surface
that needs a real file (package installer, share sheet, &quot;open with&quot;, Quick Look), use
<code>openAttachmentHandoff</code> and release its lease when done; see
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#handoff-leases">handoff leases</a>. A Manage storage screen reads
usage and largest-first listings, removes attachments in bulk and sets the opt-in
&quot;Keep media&quot; window; see
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#manage-storage">Manage storage</a>. Acquisition
defaults on with bounded per-account policy. Native progress snapshots/subscriptions
and durable cancellation, retry, remove and download-again controls use the same source slots.</p>
<h2 id="audit-v5-recording-and-delivery">Audit v5 recording and delivery</h2>
<p>v5 replaces v4 as the audit format. <code>AuditLogSettingsFfi.enabled</code> remains the recording opt-in.
Account sessions and the live runtime write only <code>marmot-forensics-audit/v5</code> to
<code>audit-&lt;engine_id&gt;-v5.jsonl</code>; no new v4 files are written, and existing v4 files remain on disk.
Hosts that record audit logs must configure v5 delivery, or new evidence never leaves the
device. Deploy a receiver that accepts every v5 event kind first.</p>
<p>To deliver v5, supply a dedicated OTLP <code>/v1/logs</code> destination and bearer token
with <code>set_audit_otlp_config_v5(AuditOtlpConfigV5Ffi)</code>. The configuration is held in memory, so
apply it on every launch; the returned record omits the token. Set <code>enabled: false</code> to remove delivery configuration.
An exact loopback endpoint requires <code>allow_loopback_dev: true</code>; public endpoints require HTTPS.
The host then calls <code>post_audit_log_tracker_update_v5()</code>, in place of
<code>post_audit_log_tracker_update()</code>, for an immediate pass; the existing
audit tracker also uses this configuration on its activity triggers with the usual batching,
retry, and shutdown behavior. The v5 result reports accepted batches, pending accounts, blocked
accounts, and idle accounts separately from legacy v4 uploads. No host should infer receiver
acceptance from an empty v4 <code>uploaded</code> list. The v4 whole-file Goggles endpoint never receives
v5 records.</p>
<h2 id="legacy-audit-v4-upload">Legacy audit v4 upload</h2>
<p>The v4 whole-file route only drains v4 files written before 0.11.0; keep its configuration until
they are gone, and do not build new v4 infrastructure. Whole-file uploads accept only
<code>marmot-forensics-audit/v4</code>; older local files are never migrated or sent.
App construction automatically removes recognized v1-v3 forensic files and rotated segments after acquiring the
root lease, including files in failed account-wipe remnants, even with recording disabled. V4 files and the separate
key-reveal log are preserved; failures are nonfatal and retried on the next open. No additional Swift/Kotlin cleanup
call is needed.</p>
<p>Use <code>AuditLogTrackerConfigV4Ffi</code> with <code>AuditLogUploadSourceV4Ffi.hardwareModel</code> in place of the old source record
and its <code>deviceLabel</code>. The versioned config type changes the setter ABI checksum so old generated bindings cannot
silently reinterpret a device label as a hardware model.
Populate this field from system model information (e.g. <code>iPhone17,3</code> or <code>Pixel 9a</code>), never from a device name,
hostname or serial number. Omit it if unavailable. Platform and app version are unchanged.
Uploads of leftover v4 files still need a v4-compatible Goggles endpoint; new evidence goes to v5.</p>
<p>Native metadata lift/lower checks: <code>./crates/marmot-uniffi/audit-v4-smoke.sh swift</code> and
<code>MDK_KOTLIN_CLASSPATH=&lt;JNA:Android:annotations:coroutines jars&gt; ./crates/marmot-uniffi/audit-v4-smoke.sh kotlin</code>.
These regenerate host bindings and execute DTO round trips; platform package builds remain separate.</p>
<h2 id="building-local-bindings">Building local bindings</h2>
<p>The Rust API in <code>src/</code> is the source of truth for both generated Swift and generated Kotlin. Platform scripts only
package that shared surface:</p>
<ul>
<li><code>./crates/marmot-uniffi/xcframework.sh</code> builds <code>output/MarmotKit.xcframework</code> plus <code>output/MarmotKit.swift</code> and
<code>output/PrivacyInfo.xcprivacy</code> for iOS.</li>
<li><code>./crates/marmot-uniffi/xcframework-macos.sh</code> builds <code>output/macos/MarmotKit.xcframework</code> plus
<code>output/macos/MarmotKit.swift</code> and <code>output/macos/PrivacyInfo.xcprivacy</code> for macOS on Apple Silicon
(<code>aarch64-apple-darwin</code>). Its output directory is separate from the iOS one so building both in one workspace
cannot clobber either artifact.</li>
<li><code>./crates/marmot-uniffi/kotlin-bindings.sh</code> builds <code>output/android/kotlin/dev/ipf/marmotkit/marmot_uniffi.kt</code> plus
Android <code>jniLibs</code> shared libraries.</li>
</ul>
<p>Building from source also requires Odin <code>dev-2026-10</code> at the pinned revision, because Markdown parsing is compiled from
Odin. Install it with <code>bash scripts/install-odin.sh &lt;dir&gt;</code> and set <code>ODIN</code> to the compiler, as the
<a href="__MARMOT_BASE__docs/#development">workspace README</a> shows. Published artifacts already contain the compiled parser.</p>
<p>The generated Swift file is platform-independent: <code>output/MarmotKit.swift</code> and <code>output/macos/MarmotKit.swift</code> are the
same UniFFI surface, and releases publish it once. The Kotlin binding is generated from the same host library metadata,
so it exposes the same <code>Marmot</code> object, subscription objects, records, enums, and error variants.</p>
<p>No generated Swift or Kotlin files are committed here; the output directories are ignored because generated bindings
and packaged native libraries are derived artifacts. Regenerate them from this crate before vendoring into an app
repository. For published artifacts, exact release and snapshot URLs, checksums, provenance and generated-source
synchronization rules, see <a href="__MARMOT_BASE__docs/distribution.html"><code>DISTRIBUTION.md</code></a>.</p>
<h2 id="build-phases">Build phases</h2>
<p>The no-argument build scripts still build complete local bundles. Release CI
uses separate phases to parallelize compilation across runners:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Script</th>
<th scope="col" role="columnheader">Phase</th>
<th scope="col" role="columnheader">Work</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Script" role="cell"><code>xcframework.sh</code></td>
<td data-label="Phase" role="cell"><code>generate</code></td>
<td data-label="Work" role="cell">Host library and generated Swift/headers in <code>build/ios/swift</code>; no device builds</td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>xcframework.sh</code></td>
<td data-label="Phase" role="cell"><code>native &lt;target&gt;</code></td>
<td data-label="Work" role="cell">One <code>aarch64-apple-ios</code> or <code>aarch64-apple-ios-sim</code> native build</td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>xcframework.sh</code></td>
<td data-label="Phase" role="cell"><code>assemble</code></td>
<td data-label="Work" role="cell">Assemble existing native slices and <code>build/ios/swift</code> into the usual iOS output</td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>xcframework-macos.sh</code></td>
<td data-label="Phase" role="cell"><code>native</code></td>
<td data-label="Work" role="cell">One <code>aarch64-apple-darwin</code> build with the macOS deployment flags</td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>xcframework-macos.sh</code></td>
<td data-label="Phase" role="cell"><code>assemble</code></td>
<td data-label="Work" role="cell">Assemble the native slice with shared Swift/headers placed in <code>build/macos/swift</code></td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>kotlin-bindings.sh</code></td>
<td data-label="Phase" role="cell"><code>generate</code></td>
<td data-label="Work" role="cell">Host library, generated Kotlin and Android support files; no NDK required</td>
</tr>
<tr role="row">
<td data-label="Script" role="cell"><code>kotlin-bindings.sh</code></td>
<td data-label="Phase" role="cell"><code>native</code></td>
<td data-label="Work" role="cell">JNI libraries for <code>ANDROID_ABIS</code>; no host library or binding generation</td>
</tr>
</tbody>
</table>
<p>Run independent phases in separate checkouts/runners. Multiple Cargo processes
sharing one target directory contend on its lock; separate phases do not make
concurrent invocations in one checkout safe. All inputs must have matching source,
builder, toolchain, profile and features. CI transfers inputs only within the same
workflow run. Apple assembly checks required files before replacing an existing
bundle and never compiles Rust. Both Apple scripts honor <code>CARGO_TARGET_DIR</code>.
See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#parallel-builds-and-build-only-rehearsals">release guide</a>
for the build-only benchmark workflow.</p>
<h2 id="kotlin--android">Kotlin / Android</h2>
<p>Prerequisites:</p>
<pre><code class="language-sh">rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
# macOS Android Studio default:
export ANDROID_NDK_HOME=&quot;$HOME/Library/Android/sdk/ndk/&lt;version&gt;&quot;
# Linux / common CI default:
# export ANDROID_NDK_HOME=&quot;$HOME/Android/Sdk/ndk/&lt;version&gt;&quot;
</code></pre>
<p>CI jobs can also set <code>ANDROID_SDK_ROOT</code> or <code>ANDROID_HOME</code>; the build script will discover the newest NDK under
<code>$ANDROID_SDK_ROOT/ndk</code> or <code>$ANDROID_HOME/ndk</code> when <code>ANDROID_NDK_HOME</code> is not set.</p>
<p>Build all Android ABIs, or a subset:</p>
<pre><code class="language-sh">./crates/marmot-uniffi/kotlin-bindings.sh
ANDROID_ABIS=&quot;arm64-v8a x86_64&quot; ./crates/marmot-uniffi/kotlin-bindings.sh
</code></pre>
<p>Generated Kotlin uses package <code>dev.ipf.marmotkit</code>, loads <code>libmarmot_uniffi.so</code>, and requires the normal
UniFFI Kotlin runtime dependencies used by the generated file: JNA, Kotlin coroutines, and AndroidX annotations.</p>
<p>The script keeps the host library's UniFFI metadata intact while stripping debug and static symbol sections from each
packaged Android JNI library. The two 64-bit ABIs (<code>arm64-v8a</code>, <code>x86_64</code>) are linked with 16 KB ELF <code>PT_LOAD</code>
alignment for Google Play's 16 KB page-size check; the 32-bit ABIs stay on the NDK's default page size. Aligning the
app bundle ZIP does not change those segments. Each published Android archive includes an <code>android-elf.json</code> report of
the packaged libraries' hashes and observed load alignments; see <a href="__MARMOT_BASE__docs/distribution.html#android">DISTRIBUTION.md</a>. That
report does not by itself prove an app's Play Console result.</p>
<h3 id="android-initialization-required-before-the-first-marmot">Android initialization (required before the first <code>Marmot(...)</code>)</h3>
<p><code>Marmot(...)</code> constructs the Android-native keyring store, which talks to the Android Keystore over JNI and needs the
<code>ndk-context</code> initialized with the application <code>Context</code> first. The build copies two hand-written helpers
(<code>kotlin-support/</code>) next to the generated binding:</p>
<ul>
<li><code>dev.ipf.marmotkit.MarmotAndroid</code> — the call consumers use.</li>
<li><code>io.crates.keyring.Keyring</code> — the JNI shim the <code>android-native-keyring-store</code> crate requires (statically linked into
<code>libmarmot_uniffi.so</code>, so its symbol is exported from that library).</li>
</ul>
<p>Android consumers MUST call <code>MarmotAndroid.initialize(this)</code> from <code>Application.onCreate</code> before constructing <code>Marmot</code>,
otherwise the first constructor crashes with <code>android context was not initialized</code>:</p>
<pre><code class="language-kotlin">class MarmotApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        MarmotAndroid.initialize(this)
    }
}
</code></pre>
<p>iOS does not need this — <code>apple-native-keyring-store</code> uses Keychain APIs that do not require a <code>JavaVM</code>. If the host
framework already initialized <code>ndk-context</code>, do not call <code>initialize</code> again.</p>
<h2 id="release-profile">Release profile</h2>
<p>Standard MarmotKit release builds use the workspace <code>[profile.release]</code> together with
<code>marmotkit-release-profile.env</code>: <code>lto=thin</code>, <code>codegen-units=1</code>, <code>opt-level=3</code>,
<code>debug=0</code>, <code>panic=unwind</code>, and <code>strip=none</code>. Android target invocations override only
<code>CARGO_PROFILE_RELEASE_STRIP=symbols</code>. Apple target invocations add
<code>-C embed-bitcode=no</code> and sanitize leftover <code>__LLVM</code> / <code>__bitcode</code> sections
before packaging so shipped archives stay native; that is not a symbol strip.
Sanitization requires the active Rust toolchain's <code>llvm-tools-preview</code> component
(included by <code>rust-toolchain.toml</code>) and Xcode's <code>libtool</code>. It rebuilds symbol indexes
and validates a temporary output before replacing the original archive.
Those builder-owned settings are not a user-facing escape hatch; measurement
scripts may override LTO and codegen units on direct Cargo commands for a
controlled baseline comparison.</p>
<p>These are configured profile values, not proof that Cargo applies LTO to every
output: the mixed <code>rlib</code>/<code>cdylib</code>/<code>staticlib</code> binding target can suppress LTO.
The measured reduction belongs to the combined profile, not to thin LTO alone.
Apple measurement rows record pre-sanitization Cargo archive bytes and hashes,
not final packaged-archive or linked application sizes. Native-only archive
validation and consumer linking are separate packaging checks.
Changing crate types to enable effective LTO also requires revisiting the
incompatible <code>embed-bitcode=no</code> flag and revalidating native Apple artifacts.
The latest recorded comparison is in <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/release-profile-measurements.md">release-profile-measurements.md</a>.</p>
<p>The automatic <code>MarmotKit Release Profile</code> workflow (<code>bindings-profile.yml</code>) is an exact-head packaging
check, not a comparison benchmark. It builds Kotlin/Swift generation and every
Android or Apple native target once in parallel, transfers those inputs only
within the current workflow run, verifies their source, builder, toolchain,
profile, feature and run provenance, then assembles and validates the Android,
iOS and macOS candidate packages. Full packaging is opt-in on pull requests:
<code>ci:android</code> selects Kotlin generation and all four Android ABIs, <code>ci:apple</code>
selects the Apple inputs and packages, and <code>ci:full</code> selects both platforms.
After adding a packaging label, re-run all candidate-workflow jobs or push a
new commit; the workflow reads the current labels. Ordinary PRs retain Rust compilation/API and
packaging-contract checks without building complete candidate bundles.
Android target compilation, NDK checks and native linking are deferred unless
explicitly selected, including for changes to the UniFFI crate.
Matching <code>master</code> pushes always build the complete matrix and open an issue
when it fails; later pushes do not cancel running or queued candidate builds.
Candidate builds use no Cargo cache, so
every run compiles from a clean target directory.
The workflow has no schedule of its own. The
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#nightly-builds">nightly release</a> builds and validates the
same Android and Apple packages from <code>master</code>, but only on nights it does not
skip: it skips when master has no new green commit or is not on an
<code>X.Y.Z-dev</code> version, and when releases or snapshots keep the macOS runners busy
for three hours. It does not run <code>test-native-archive.py</code>; matching <code>master</code>
pushes do.</p>
<p>Baseline-versus-candidate measurements are intentionally manual. Run the
<code>MarmotKit Release Profile Measurements</code> workflow from <code>master</code> with the full
lowercase SHA that needs fresh evidence (it must already be fetchable from GitHub):</p>
<pre><code class="language-sh">gh workflow run bindings-profile-measurement.yml \\
  --ref master \\
  -f source_sha=&quot;$(git rev-parse HEAD)&quot;
</code></pre>
<p>The non-publishing run fails closed unless checkout matches the SHA exactly, and uploads separate
Linux/Android/CPU and Apple reports, hashes, raw Criterion output and build logs. A failed or incomplete
surface keeps the final comparison check red. Local equivalents:</p>
<pre><code class="language-sh"># Inexpensive regressions, including provenance JSON and archive bitcode checks:
python3 crates/marmot-uniffi/test-release-profile.py

# On macOS: real archive reconstruction, embedded-bitcode removal and linking:
python3 crates/marmot-uniffi/test-native-archive.py

# Controlled host/Android/Apple/CPU comparison. Missing platforms are recorded as
# unavailable, never as zero. Isolated target directories keep the two variants
# from overwriting each other. \`--cpu\` fails if a benchmark invocation fails or
# only stale Criterion estimates remain:
python3 crates/marmot-uniffi/measure-release-profile.py \\
  --source-sha &quot;$(git rev-parse HEAD)&quot; \\
  --builder-sha &quot;$(git rev-parse HEAD)&quot; \\
  --host --cpu \\
  --output release-profile-measurements.json \\
  --markdown release-profile-measurements.md
</code></pre>
<h2 id="apple-privacy-resources">Apple privacy resources</h2>
<p>Apple exporters use raw static-library slices and publish a matching privacy manifest for the consuming Swift target.
See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/apple-privacy/README.md">privacy audit and adoption guide</a> for declarations, archive validation, host
integration changes, and unresolved release questions.</p>
<h2 id="account-attachment-history">Account attachment history</h2>
<p><code>account_attachment_history_page</code> reads bounded indexed attachment candidates across one local account. Original album slots retain source identity and shared-parser metadata; group/sender selections and inclusive dates bind the cursor. Empty filtered pages may still continue, and destructive source changes require replacing loaded rows; additions offer a separate head refresh. Reads perform no acquisition or decryption. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/ACCOUNT-ATTACHMENT-HISTORY.md">Account attachment history</a> for integration and bounds.</p>
`,g={__name:"native-apps.html",setup(p){return(u,n)=>{const o=r("DocumentationPage");return s(),a("div",null,[n[0]||(n[0]=t("h1",{id:"native-apps-·-marmotkit",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#native-apps-·-marmotkit"},[t("span",null,"Native apps · MarmotKit")])],-1)),i(o,{document:{repo:e(d),version:e(c),sourceUrl:e(l),html:e(h)}},null,8,["document"])])}}},f=JSON.parse('{"path":"/docs/native-apps.html","title":"Native apps · MarmotKit","lang":"en-US","frontmatter":{"title":"Native apps · MarmotKit","description":"Native apps · MarmotKit — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/native-apps.md"}');export{g as comp,f as data};
