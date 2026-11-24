import{c as o,b as t,d as r,u as e,r as s,o as d}from"./app-VMG2iPpl.js";const i="mdk",c="0.19.0",l="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/docs/integration/0.19.0.md",m=`<div id="upgrading-mdk-0180--0190" class="mm-source-title">Upgrading MDK 0.18.0 → 0.19.0</div>
<p>The four 0.18.0 tags peel to <code>34646a577807f2b112ee031f3c164ec58aa18b64</code>. This guide compares that release with
master at <code>8acf460ef2f1d461db7b36e89ec5efb39374f08d</code>, including the URL dependency fix. For the packaged source
SHA, resolve the final <code>v0.19.0</code> tag and match it to the WN Agent, MarmotKit and Marmot C tags and manifests.
See the <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/docs/release/0.19.0.md">release notes</a> and <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/docs/integration/0.18.0.md">previous upgrade guide</a>.</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Upgrade decision</th>
<th scope="col" role="columnheader">Who needs to act</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Upgrade decision" role="cell">Required</td>
<td data-label="Who needs to act" role="cell">Ship matched bindings and libraries in every process opening an account. Replace stream callers, rebuild C clients and change draft deletion by omission to explicit removal.</td>
</tr>
<tr role="row">
<td data-label="Upgrade decision" role="cell">Changed defaults</td>
<td data-label="Who needs to act" role="cell">A fresh thread message counts as chat and can restore a locally deleted chat. Agent replies arrive as durable messages. New groups omit the retired stream component.</td>
</tr>
<tr role="row">
<td data-label="Upgrade decision" role="cell">Optional</td>
<td data-label="Who needs to act" role="cell">Add a dedicated thread view or adopt token-based tagged sends in Rust. Inline reply clients keep their existing send path.</td>
</tr>
<tr role="row">
<td data-label="Upgrade decision" role="cell">Automatic</td>
<td data-label="Who needs to act" role="cell">Stored legacy thread messages are repaired. Draft attachments survive partial input saves. Linked devices redeliver invitation decisions after losing a fork.</td>
</tr>
</tbody>
</table>
<h2 id="install-and-reopen">Install and reopen</h2>
<p>Use <code>v0.19.0</code> for Rust sources, <code>wn-agent-v0.19.0</code> for the connector and adapters, <code>marmotkit-v0.19.0</code> for
Swift/Kotlin and native libraries, and <code>marmotc-v0.19.0</code> for C headers and libraries. Verify checksums, including
SwiftPM's binary checksum. Stage the matching Swift file and platform privacy resource in each Apple wrapper,
or the matching Kotlin sources and four JNI ABIs on Android. Update background workers and extensions in the
same rollout. See <a href="__MARMOT_BASE__docs/distribution.html">distribution</a>.</p>
<p>First open upgrades each account from schema 216 to 218. Migration 0217 repairs older Linux kind-1111 rows with a
lowercase <code>e</code> and no numeric <code>k</code>, including parent, media, author edits and media-key references. Migration 0218
removes both stream tables, the stream timeline column and kind-1200 timeline rows. Retained source events and
durable kind-9 final messages survive. Chat-list projection version 5 rebuilds list rows once. Allow time for the
first open of a large account. Schema 218 requires the upgraded library. A rollback to 0.18.0 requires a separate
pre-upgrade copy of the data. The shared and directory databases retain their 0.18.0 schemas (5 and 3).</p>
<h2 id="replace-live-preview-consumers">Replace live preview consumers</h2>
<p>Use ordinary durable messages for agent output. Remove <code>startAgentTextStream</code>, <code>watchAgentTextStream</code>,
<code>openAgentPublisher</code>, their handles, callbacks and stream DTOs. Remove the stream activity/start cases in
<code>MarmotEventFfi</code> and <code>MessageUpdateFfi</code>, both stream triggers in <code>TimelineUpdateTriggerFfi</code> and
<code>agentTextStreamJson</code> on timeline messages and reply previews. A received kind-1200 start has no visible row or
message notification. A kind-9 final renders as a normal message. The engine refuses new outgoing starts, including
a pre-upgrade queued start when it drains. The latter raises <code>GroupEvent::QueuedIntentRefused</code>.</p>
<p>New groups omit component <code>0x8006</code>. KeyPackages refresh once to drop the send and fanout roles. MDK continues to
advertise support and the receive role for existing groups. Rust exposes the component in <code>AppGroupRecord::unknown_components</code>.
In the group's MLS state, MarmotKit lists its ID in <code>requiredAppComponents</code> and C lists it in
<code>required_app_components</code>. Create and invite still enforce the group's required roles. Rust embedders must remove the
stream runtime APIs, QUIC exporter and dependencies on <code>transport-quic-stream</code>, <code>transport-quic-broker</code> and
<code>agent-stream-compose</code>. See the <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/marmot-app/CHANGELOG.md">runtime</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/cgka-engine/CHANGELOG.md">engine</a> and <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/traits/CHANGELOG.md">shared types</a> inventories.</p>
<p>For connector clients, the wire label is still v2. Replace all seven <code>stream_*</code> requests with a single
<code>send_final</code> for the completed reply and remove stream responses and <code>stream_update</code> handlers. An obsolete request
closes the connection without a response. Upgrade the gateway plugin and connector together. Drop
<code>--enable-streaming</code> and <code>--quic-candidate</code> from Hermes/OpenClaw installer invocations and remove broker/candidate
flags from bootstrap. Older <code>--no-quic</code> invocations are accepted as a no-op. Older OpenClaw configuration keys
<code>quicCandidates</code>, <code>streaming</code> and <code>blockStreaming</code> are ignored. The Hermes configure helper drops <code>--streaming</code>,
<code>--transport</code> and <code>--configure-global-streaming</code>. See the <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/agent-control/README.md">agent-control contract</a>.</p>
<p>Remove <code>wn stream</code>, TUI <code>/stream</code> commands, stream subscription updates and stream-specific JSON errors from CLI
automation. The daemon drops <code>stream_watches</code> from status, and message, group and timeline JSON drop
<code>agent_text_stream</code>. See the <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/cli/CHANGELOG.md">CLI changelog</a>.</p>
<h2 id="read-and-send-threads">Read and send threads</h2>
<p>Inline clients render <code>replyToMessageIdHex</code> as a one-level quote and use <code>replyToMessage</code> to answer any row,
including a thread message. This creates a kind-9 inline reply. A thread view groups by <code>thread.rootMessageIdHex</code>
and nests by <code>thread.parentMessageIdHex</code>. Both timeline records and reply previews gain nullable <code>thread</code>; previews
also gain their own nullable <code>replyToMessageIdHex</code>. Update host-created fixtures and retain placement when rendering
a deleted placeholder. Kind-1111 thread messages expose Markdown content tokens and arrive as <code>NewMessage</code>.</p>
<p>From a thread view, send text, already-uploaded attachment references or both. Pass the immediate parent's ID.
MDK resolves its row locally and builds the root and parent tags. It refuses a missing or deleted parent, or a
missing root whose kind and author cannot be recovered from a stored ancestor. Supply additional application tags
only (up to 64 and 16 KiB total). MDK owns <code>E/K/P/e/k</code> and builds <code>imeta</code> from typed attachments. Mentions follow
chat rules. Inspect the send summary's acceptance disposition to distinguish publication, queuing and unknown
completion. The following illustrative calls run inside an async Swift task or Kotlin coroutine.</p>
<pre><code class="language-swift">let summary = try await client.sendThreadMessage(
    accountRef: account, groupIdHex: group, parentMessageId: parent,
    text: &quot;I can pick that up.&quot;, attachments: [], tags: [])
</code></pre>
<pre><code class="language-kotlin">val summary = client.sendThreadMessage(
    accountRef = account, groupIdHex = group, parentMessageId = parent,
    text = &quot;I can pick that up.&quot;, attachments = emptyList(), tags = emptyList())
</code></pre>
<p>Thread messages with a parent move the chat up, count toward unread and mentions, notify in the foreground and on
wake, and reach WN Agent live and on replay. A fresh thread message can bring a locally deleted chat back into
the list under the same rules as a fresh kind-9 message. Deleted content caught before connector output is suppressed. A
deletion after output arrives as a later event. An author can edit and delete thread messages. Admin removal of
another member's message still applies only to kind 9. The release provides placement on existing rows. Paged
descendants, thread summaries and per-thread read state are planned separately in
<a href="https://github.com/marmot-protocol/mdk/issues/2787">#2787</a>. See the
<a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/docs/marmot-architecture/overview/thread-messages.md">wire forms, display rules and fixtures</a>.</p>
<h2 id="save-draft-attachment-edits">Save draft attachment edits</h2>
<p><code>saveMessageDraftInputsIfRevision</code> is a local, revision-checked edit. Supply <code>Retained</code> IDs in the desired order,
<code>Inline</code> to add or replace data, and the new <code>Removed</code> case for a user deletion. Named surviving attachments come
first, then unnamed attachments in their stored order. Removing a missing ID is harmless. Retaining a missing ID
raises <code>InvalidMessageDraft</code>. Removing or replacing a file-backed attachment releases the file. Pass the latest
revision and use the returned selection for the next edit. On <code>MessageDraftRevisionConflict</code>, reload and reapply
the user's edit. Update exhaustive Swift/Kotlin switches. The whole-list <code>saveMessageDraftIfRevision</code> API still
replaces the list. See the <a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/marmot-uniffi/CONVERSATION-WINDOW.md">draft and staging contract</a>.</p>
<h2 id="c-hosts">C hosts</h2>
<p>Recompile every caller against the matching header and library. <code>MarmotTimelineMessageRecord</code> and
<code>MarmotTimelineReplyPreview</code> lose <code>agent_text_stream_json</code> and gain a nullable <code>MarmotTimelineThreadRef *thread</code>.
The preview gains <code>reply_to_message_id_hex</code>. Read these nested pointers within the owning result's lifetime and
release the containing result with its matching free function. For <code>marmot_send_thread_message</code>, pass attachment
and tag arrays with their lengths, check the returned status and free the resulting summary with
<code>marmot_send_summary_free</code>. Run blocking C calls off the UI thread.</p>
<p>Zero-initialize <code>MarmotMessageDraftAttachmentSaveInput</code>. To delete, set its new <code>removed_id</code> and leave
<code>retained_id</code> null. Both set returns <code>MARMOT_STATUS_INVALID_ARGUMENT</code>. Remove publisher/stream calls, handle
types, callbacks and free functions. The stream variants disappear from <code>MarmotMessageUpdate</code>, <code>MarmotEvent</code>
and <code>MarmotTimelineUpdateTrigger</code>. Discriminants after the removed variants shift. Recompile switches and
translate any host-persisted numeric values using the header that produced them. See the
<a href="__MARMOT_BASE__docs/c-api.html">C symbol inventory</a>.</p>
<h2 id="rust-submissions-and-storage">Rust submissions and storage</h2>
<p>The workspace lockfile includes <code>url</code> 2.5.9 for RUSTSEC-2026-0592. Rust hosts building MDK with their own
lockfile should check that it resolves <code>url</code> to a patched version (2.5.9 or later) and update it if necessary.</p>
<p>Rust hosts can use <code>MarmotAppRuntime::submit_tagged_text</code>, <code>submit_tagged_reply</code>, <code>submit_tagged_edit_for_local_send</code>
and <code>submit_custom_event</code>. Persist a client token before submission. For an edit, pass the original send's token
and a distinct edit token. Local acceptance gives a token and message ID. Query <code>local_send_status</code> for progress.
A token is local to one account on one device and to one group. After restart, an identical retry there returns
the original message ID while the device retains the token association, unless the stored status is <code>Rejected</code>.
Another device can admit the same request as a new message. Deleting the group or expiring the source message also
removes the association, so a later retry can create a new message. The token binds the whole request, including
text, reply target, attachment
references, ordered tags, custom kind and, for an edit, the original send's token. Reusing the token for changed
inputs or a rejected submission raises <code>InvalidAppMessagePayload</code>. Use a new token for the corrected or rejected request.
Untagged requests keep their prior hashes. App tags travel inside the encrypted event.
For chat, use typed media instead of an <code>imeta</code> tag. The reply owns its <code>e</code> and <code>q</code>, the edit its <code>e</code>; custom events
follow the existing <code>send_custom_event</code> rules for reserved kinds. These token-based additions are Rust runtime APIs.</p>
<p>Storage consumers constructing timeline records must supply the new thread fields, and <code>TimelineMessageTarget</code>
gains <code>thread_message</code>. Match the new <code>StoredMessageDraftAttachmentInput::Removed</code> variant. To preserve omitted
attachments in direct SQLite calls, use <code>update_message_draft_if_revision</code>. See the
<a href="https://github.com/marmot-protocol/mdk/blob/3fce95465cdea1edc8456dbd1c6691d1c8dc1f2e/crates/storage-sqlite/CHANGELOG.md">storage changelog</a>.</p>
<h2 id="acceptance-checks-for-consuming-apps">Acceptance checks for consuming apps</h2>
<ul>
<li>Verify artifact provenance, build the actual app and extensions, and reopen a populated 0.18.0 account offline.
Check a legacy Linux thread, its media and edits, and a durable agent final after migration.</li>
<li>Send a nested thread message from a thread client and answer it from an inline client. Check quotes, placement,
unread/mention counts and notifications across foreground, background and reconnect. Exercise parent deletion.</li>
<li>Stage a file, save text before the composer loads the attachment, then reopen. Verify the file survives. Explicitly
remove it and reopen again. Race a stale save against staging and handle the revision conflict.</li>
<li>Run a connector and its matching gateway. Verify a completed reply arrives once and replay suppresses content
deleted before delivery to the agent. For Rust token-based sends, restart between admission and recording the
result, then retry with the original token and verify the same ID.</li>
<li>With two linked devices, accept or decline an invite across a device-group fork. Verify both converge after
reconnect. Measure first-open time and foreground responsiveness on a representative device with a large history.</li>
</ul>
<p>The source comparison establishes the contracts above. Packaged binaries, consuming-app builds and real-device
upgrade results require verification against the published cohort.</p>
`,u={__name:"upgrading.html",setup(p){return(h,a)=>{const n=s("DocumentationPage");return d(),o("div",null,[a[0]||(a[0]=t("h1",{id:"upgrade-guide",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#upgrade-guide"},[t("span",null,"Upgrade guide")])],-1)),r(n,{document:{repo:e(i),version:e(c),sourceUrl:e(l),html:e(m)}},null,8,["document"])])}}},f=JSON.parse('{"path":"/docs/upgrading.html","title":"Upgrade guide","lang":"en-US","frontmatter":{"title":"Upgrade guide","description":"Review version-specific breaking changes and migration steps before upgrading an application to the latest stable MDK release.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0,"head":[["link",{"rel":"canonical","href":"https://marmot.build/docs/upgrading.html"}],["link",{"rel":"describedby","href":"https://marmot.build/llms.txt"}],["meta",{"property":"og:type","content":"website"}],["meta",{"property":"og:site_name","content":"Marmot"}],["meta",{"property":"og:title","content":"Upgrade guide | Marmot"}],["meta",{"property":"og:description","content":"Review version-specific breaking changes and migration steps before upgrading an application to the latest stable MDK release."}],["meta",{"property":"og:url","content":"https://marmot.build/docs/upgrading.html"}],["meta",{"property":"og:image","content":"https://marmot.build/images/share.png"}],["meta",{"property":"og:image:width","content":"1200"}],["meta",{"property":"og:image:height","content":"630"}],["meta",{"property":"og:image:alt","content":"Marmot wordmark and illustration"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["link",{"rel":"alternate","type":"text/markdown","href":"https://marmot.build/docs/upgrading.md"}]]},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1},{"name":"erskingardner","username":"erskingardner","email":"202880+erskingardner@users.noreply.github.com","commits":1,"url":"https://github.com/erskingardner"}],"changelog":[{"hash":"0330b27fbdf24e99917ca75283be54594a9152e3","time":1794986838000,"email":"202880+erskingardner@users.noreply.github.com","author":"Jeff Gardner","message":"Add Marmot analytics and search discovery metadata"},{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/upgrading.md"}');export{u as comp,f as data};
