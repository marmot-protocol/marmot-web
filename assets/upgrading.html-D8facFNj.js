import{c as a,b as o,d as i,u as e,r,o as d}from"./app-DgITpRfK.js";const s="mdk",c="0.18.0",l="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/integration/0.18.0.md",h=`<div id="upgrading-mdk-0170--0180" class="mm-source-title">Upgrading MDK 0.17.0 → 0.18.0</div>
<h2 id="scope-and-provenance">Scope and provenance</h2>
<p>This guide compares <code>v0.17.0</code> / <code>marmotkit-v0.17.0</code> / <code>marmotc-v0.17.0</code> /
<code>wn-agent-v0.17.0</code>, which all peel to
<code>4df811aea99269b437a6023be9446a5141e93cbe</code>, with the source to be shipped as
<code>v0.18.0</code>. All four 0.18.0 cohort tags must peel to the release PR's merged
commit, and packaged manifests must record that exact SHA. The comparison was
prepared against <code>origin/master</code> at
<code>470d4b4d53e5b29b59b7df75595fbcacc52a9725</code> (76 commits after <code>v0.17.0</code>, the
last being <a href="https://github.com/marmot-protocol/mdk/pull/3568">#3568</a>); the
release commit is this documentation update's merge on top of it. Use the full release SHA from the tags for artifact
verification. This guide ships in the release commit, not a later supplement.
See the <a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/release/0.18.0.md">release notes</a>, <a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/integration/0.17.0.md">previous upgrade guide</a>,
and <a href="__MARMOT_BASE__docs/native-apps.html">current binding reference</a>.</p>
<p>Readers: native app hosts (Swift/Kotlin through MarmotKit), C hosts, Rust hosts
that embed <code>marmot-app</code> or lower crates, and WN Agent operators.</p>
<p>The largest client change is that multi-device is built into every artifact
and on in every constructor. Until 0.17.0 it existed only in
<code>dev-device-groups</code> test builds. <code>MarmotKitError</code> gains three cases
(<code>GroupCommitPending</code>, <code>NoUsableRelay</code>, <code>ReactionNotFound</code>), C gains three
statuses (<code>131</code>–<code>133</code>), <code>GroupEventKindFfi</code> gains <code>GroupChangeNotDelivered</code>,
and no <code>MarmotEventFfi</code> case is added. Account databases migrate from schema
207 to 216, the shared database from 4 to 5, and each account's directory
cache from 2 to 3. Conformance vectors are
unchanged apart from their version stamp; the sibling Welcome gains a
version 3 (see <a href="#device-groups-on-by-default">Device groups on by default</a>).</p>
<h2 id="upgrade-decisions">Upgrade decisions</h2>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Category</th>
<th scope="col" role="columnheader">Required action or effect</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Category" role="cell">Required</td>
<td data-label="Required action or effect" role="cell">Replace generated Swift/Kotlin, native libraries and C headers together, in the app and in every extension that opens the root. Plan for device groups being on (linking, backups, admin step-down on Leave). Handle <code>MarmotKitError.GroupCommitPending</code>, <code>.NoUsableRelay</code> and <code>.ReactionNotFound</code>, <code>GroupEventKindFfi.GroupChangeNotDelivered</code> and <code>OnboardingActionFfi.RemoveUnusableRelays</code> in exhaustive switches. Pass the new fields where you construct changed records.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Required for C hosts</td>
<td data-label="Required action or effect" role="cell">Recompile. Seven structs change layout, three statuses and two enum values are appended, and the <code>dev-device-groups</code> build flags are gone. See <a href="#c-host-changes">C host changes</a>.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Required storage</td>
<td data-label="Required action or effect" role="cell">Allow account migrations 0208 to 0216 (schema 207 → 216), shared migration 0005 (schema 4 → 5) and directory-cache migration 0003 (2 → 3) on first open. Downgrade is unsupported.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Required for Rust hosts</td>
<td data-label="Required action or effect" role="cell"><code>MarmotAppConfig::dev_device_groups</code> is renamed <code>device_groups</code> and defaults to true; the device-group Cargo features are gone; <code>OutboundIntentStorage</code> gains three methods; several engine, traits and <code>storage-sqlite</code> signatures change. See <a href="#rust-host-changes">Rust host changes</a>.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Required for agent-control clients</td>
<td data-label="Required action or effect" role="cell">None. The protocol is unchanged. The connector's accounts now run with device groups on.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">New defaults</td>
<td data-label="Required action or effect" role="cell">Device groups on; idle accounts no longer wake every 15 s; group changes fail with <code>GroupCommitPending</code> while the group's own commit is pending; a pending commit is confirmed by echo or read-back and given up when it reached no relay; queued messages are prepared once across retries and restarts; a send with no usable relay fails as <code>NoUsableRelay</code>; sticker and emoji reads also use the configured relays; onboarding relay checks wait up to 8 s (not 3 s) for a relay's answer after connecting and authenticate on a wrapped <code>auth-required</code>; usage-diagnostics consent asks again for the expanded scope.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Optional adoption</td>
<td data-label="Required action or effect" role="cell"><code>groupPendingCommit</code>, <code>groupChangesNotDelivered</code> / <code>acknowledgeChangeNotDelivered</code>, direct-follow availability, file-backed draft attachments, <code>unreactFromMessageMatching</code>, <code>startDirectConversationWithOptions</code>, <code>attachmentRemovals</code>, link <code>chatProgress</code>, onboarding <code>RemoveUnusableRelays</code> and inconclusive-check repair, <code>OnboardingDevicePackageFfi.client</code>.</td>
</tr>
<tr role="row">
<td data-label="Category" role="cell">Automatic fixes</td>
<td data-label="Required action or effect" role="cell">Linked devices get chats as the adding device holds them; the approver adds a new device without racing siblings; invitation answers sync between linked devices within seconds; removed devices stay out of sign-ins; history recovery across partial epoch advances and on newly linked devices; NIP-22 comment projection and media keys; emoji-set reinstalls keep images; sticker packs found on configured relays; idle ticks take no writer.</td>
</tr>
</tbody>
</table>
<h2 id="required-upgrade-steps">Required upgrade steps</h2>
<ol>
<li>
<p>Pin all MDK, MarmotKit, Marmot C and WN Agent inputs to 0.18.0. Verify the
source SHA in each manifest and every sibling checksum. Do not combine new
generated records or headers with 0.17.0 native libraries. See the
<a href="__MARMOT_BASE__docs/distribution.html">distribution guide</a>.</p>
</li>
<li>
<p>Ship the 0.18.0 library in <strong>every</strong> process that opens the root, including
a notification service extension or background worker. Once 0.18.0 has
opened an account, a 0.17.0 process cannot open its database at all: it
refuses the newer schema (<code>UnsupportedSchemaVersion</code>), even for an account
with a single device. Separately, a runtime with device groups off fails a
compatible account that holds or is joining a device group with
<code>MarmotKitError.Runtime</code> <code>experimental_device_groups_required</code>. See
<a href="#storage-upgrade">Storage upgrade</a> and
<a href="#device-groups-on-by-default">Device groups on by default</a>.</p>
</li>
<li>
<p>Add the new error cases to exhaustive error handling:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Case</th>
<th scope="col" role="columnheader">Meaning</th>
<th scope="col" role="columnheader">Host action</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Case" role="cell"><code>GroupCommitPending(groupIdHex:)</code></td>
<td data-label="Meaning" role="cell">The group's own last commit has not confirmed. Group changes, a member's leave and an invite decline fail with it; disbanding and an admin's leave are accepted. Messages are accepted but wait in the queue until the commit resolves, and a send of media encrypted before the commit can fail with <code>MediaReferenceEpochUnsettled</code> or, once the epoch moves, <code>MediaReferenceStaleEpoch</code>.</td>
<td data-label="Host action" role="cell">Say the previous change is still being sent; retry once it confirms. Show queued messages as pending, not sent, and upload media again after <code>MediaReferenceStaleEpoch</code>. Read <code>groupPendingCommit</code> to show it.</td>
</tr>
<tr role="row">
<td data-label="Case" role="cell"><code>NoUsableRelay</code></td>
<td data-label="Meaning" role="cell">MDK may send to none of the group's relays (for example, all at private-network addresses). Nothing was sent and a commit rolled back. It was <code>Publish</code> before.</td>
<td data-label="Host action" role="cell">Do not offer a retry: it fails the same way while the group's relays stay the same.</td>
</tr>
<tr role="row">
<td data-label="Case" role="cell"><code>ReactionNotFound</code></td>
<td data-label="Meaning" role="cell">A reaction removal found no matching active reaction locally; nothing was published.</td>
<td data-label="Host action" role="cell">Refresh state; do not treat it as proof other devices converged.</td>
</tr>
</tbody>
</table>
<p><code>GroupCommitPending</code> is checked before <code>GroupCatchingUp</code> and
<code>GroupCommitUndelivered</code>, and no acknowledgement releases it, so those
acknowledgements stay unspent.</p>
</li>
<li>
<p>Handle <code>GroupEventKindFfi.GroupChangeNotDelivered { commitIdHex, intentKind, reason }</code> and <code>OnboardingActionFfi.RemoveUnusableRelays</code> in exhaustive
<code>switch</code>/<code>when</code>. See <a href="#group-changes-that-confirm-stick-or-are-given-up">Group changes that confirm, stick or are given
up</a> and
<a href="#onboarding">Onboarding</a>.</p>
</li>
<li>
<p>Pass the new fields where you construct these records yourself (tests and
previews, typically). Fields with a default compile without change in
Swift and Kotlin; the others must be passed:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Record</th>
<th scope="col" role="columnheader">New field</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Record" role="cell"><code>AppMessageRecordFfi</code></td>
<td data-label="New field" role="cell"><code>invalidated: Bool</code> (no default; true for a raw row kept only as an invalidated tombstone)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>DeviceLinkSnapshotFfi</code></td>
<td data-label="New field" role="cell"><code>chatProgress: [LinkChatProgressFfi]</code> (default empty)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>OnboardingDevicePackageFfi</code></td>
<td data-label="New field" role="cell"><code>client: String?</code> (no default)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>OnboardingRelayTagChangeFfi</code></td>
<td data-label="New field" role="cell"><code>removalReason: OnboardingRelayRemovalReasonFfi</code> (no default; <code>.none</code> for an entry not removed)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>OnboardingRepairProposalFfi</code></td>
<td data-label="New field" role="cell"><code>inconclusive: Bool</code> (default <code>false</code>)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>SelectedMessageDraftAttachmentFfi</code></td>
<td data-label="New field" role="cell"><code>fileBacked: Bool</code> (default <code>false</code>)</td>
</tr>
<tr role="row">
<td data-label="Record" role="cell"><code>AttachmentStorageUsageFfi</code></td>
<td data-label="New field" role="cell"><code>draftBytes: UInt64</code> (default <code>0</code>)</td>
</tr>
</tbody>
</table>
</li>
<li>
<p>Remove any <code>--dev-device-groups</code> flag from local build scripts and any
reference to <code>output-dev-device-groups/</code>. <code>xcframework.sh</code>,
<code>xcframework-macos.sh</code>, <code>kotlin-bindings.sh</code>, <code>options-smoke.sh</code> and
<code>c-bindings.sh</code> build the one library every constructor uses.</p>
</li>
<li>
<p>Expect usage-diagnostics consent to need acceptance again. The registry
adds the <code>mdk_onboarding_summary</code> aggregate, so its revision changes and a
granted receipt from 0.17.0 no longer covers it. Hosts need no new calls.
See <a href="#usage-diagnostics-onboarding-pauses">Usage diagnostics: onboarding pauses</a>.</p>
</li>
<li>
<p>If you export v5 audit records, repin and deploy the White Noise audit
receiver before shipping, so it accepts the new kinds
(<code>welcome_event_size</code>, <code>welcome_withdrawn</code>, <code>pending_commit_changed</code>). An
older receiver rejects a whole batch that contains an unknown kind; MDK
then splits and retries the batch and skips the rejected rows, so other
rows can arrive late. See the
<a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/marmot-architecture/audit-logging.md#downstream-whitenoise-data">receiver contract</a>.</p>
</li>
</ol>
<h2 id="storage-upgrade">Storage upgrade</h2>
<p>Account databases run nine migrations on first open, moving from schema 207
to 216:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Migration</th>
<th scope="col" role="columnheader">Change</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Migration" role="cell">0208</td>
<td data-label="Change" role="cell">Repairs retained NIP-22 comment parents, media and accepted author edits, and backfills attachment slots, encrypted-media source-epoch references and cached-secret retention for them. Raw events, deleted tombstones and unrelated custom rows are kept.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0209</td>
<td data-label="Change" role="cell">Lets a draft attachment own a staged media file instead of holding bytes.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0210</td>
<td data-label="Change" role="cell">Adds <code>cgka_changes_not_delivered</code>, the group changes given up after their call returned, kept until acknowledged.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0211</td>
<td data-label="Change" role="cell">Adds <code>account_sign_in_removals</code>, the slots the trusted device roster recorded as removed.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0212</td>
<td data-label="Change" role="cell">Adds the bounded attachment body-removal journal.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0213</td>
<td data-label="Change" role="cell">Persists the end of each epoch-gap visit.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0214</td>
<td data-label="Change" role="cell">Persists link chat progress across restarts.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0215</td>
<td data-label="Change" role="cell">Adds <code>stall_evidence</code> to released transport receipts.</td>
</tr>
<tr role="row">
<td data-label="Migration" role="cell">0216</td>
<td data-label="Change" role="cell">Changes no table; gates the new stored Welcome payload tags 14 and 15 so an older binary refuses the database.</td>
</tr>
</tbody>
</table>
<p>The shared database (<code>shared.sqlite3</code>) runs migration 0005, moving from schema
4 to 5: per-slot publication journals and barrier state for direct-follow
availability, bounded to 500 slots per account and 1,000 rows in all, holding
event ids and timestamps, never KeyPackage bytes.</p>
<p>Each account's directory cache runs its migration 0003, moving from 2 to 3: a
table for the direct-follow availability projection. A new account database
also records, in an unnumbered <code>cgka_database_origin</code> row, that it was created
empty, so an early read no longer makes a fresh account look upgraded.</p>
<p>None of these rewrites message history; 0208 repairs only NIP-22 comment
projections. A 0.17.0 binary refuses either upgraded database before reading
or writing its tables.</p>
<p>Downgrade to 0.17.0 is unsupported. If you may need to roll back, keep a
device-local copy of the MDK data directory taken before upgrading while the
app and every extension (such as a notification extension) are stopped, so no
database or its WAL file is open while it is copied. Leave out
<code>accounts/*/handoff/</code>: it holds plaintext attachment copies lent to the OS,
which the backup would keep after their leases end, and a rollback does not
need them. Never remove migration rows by hand. See the
<a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/marmot-architecture/storage-format-v2.md">storage-format contract</a>.</p>
<h2 id="device-groups-on-by-default">Device groups on by default</h2>
<p>Every MarmotKit, Marmot C, <code>wn</code> and WN Agent build now includes multi-device,
and every constructor opens with device groups on:</p>
<ul>
<li><code>newWithConfiguration</code> (C <code>marmot_client_new_with_configuration</code>) links
devices, lists linked devices, reviews sign-ins, transfers history, runs
backups, and steps a nonlast admin down on Leave.
<code>requiresSelfDemoteBeforeLeave</code> is false for a nonlast admin, and
<code>canLeave</code> includes that Leave. The last active admin is still refused.</li>
<li><code>newWithExperimentalDeviceGroups</code> (C
<code>marmot_client_new_with_experimental_device_groups</code>) is now the same open,
kept so existing hosts compile, and no longer fails with
<code>experimental_device_groups_unavailable</code>. New code can use
<code>newWithConfiguration</code>.</li>
<li>There is no binding switch to turn device groups off. Rust hosts can set
<code>MarmotAppConfig::with_device_groups(false)</code> in every opener of a root; the
CLI honors <code>WN_DEVICE_GROUPS=0</code> for both <code>wn</code> and <code>wnd</code>.</li>
</ul>
<p>What a host should do:</p>
<ul>
<li>Offer device linking and the linked-device screens described in
<a href="__MARMOT_BASE__docs/native-apps.html#linking-a-new-device">Linking a new device</a>,
<a href="__MARMOT_BASE__docs/native-apps.html#linked-devices">Linked devices</a> and
<a href="__MARMOT_BASE__docs/native-apps.html#unrecognized-sign-ins">Unrecognized sign-ins</a>,
or at least handle their events (<code>DeviceLinkChanged</code> and the sign-in
notices) without crashing.</li>
<li>Re-read <code>groupManagement</code> for Leave instead of assuming an admin must
demote first.</li>
<li>During linking, read <code>DeviceLinkSnapshotFfi.chatProgress</code>. Each
<code>LinkChatProgressFfi { slotIdHex, onNewDevice, total, remaining }</code> names the
new device by slot. On the approver <code>remaining</code> counts chats still owed an
Add; on the new device it counts expected chats not yet joined. Show a
joining banner while it is positive. An absent entry means progress is
unavailable (before a complete report, with older peers, after opt-out, or
once the direct-add window expires).</li>
</ul>
<p>Mixed versions: a sibling Welcome that forwards how the adding device holds a
chat (its inviter, and whether a copy with no invitation generation is
confirmed) is encoded as version 3, which devices older than 0.18.0 refuse.
0.17.0 production artifacts had no device groups, so this matters only for
devices that ran <code>dev-device-groups</code> builds: update every device of an
account together before linking. Every build supports the device-roster
component (<code>marmot.account.device-roster.v1</code>), and a runtime with device
groups on, the default, advertises it in its capabilities.</p>
<p>How linked devices now behave:</p>
<ul>
<li>A newly linked device gets each chat as the device that adds it holds it. A
chat confirmed there from before invitation generations arrives confirmed
instead of as an invitation from the account itself. One with an
invitation generation settles through its shared decision and can show as
pending until that decision arrives, and a chat whose inviter this device
blocks stays pending
(<a href="https://github.com/marmot-protocol/mdk/issues/3556">#3556</a>). An
unanswered invitation arrives pending with the original inviter as
<code>welcomerAccountIdHex</code>.</li>
<li>When a device is linked to an account that already has two or more devices,
the approver adds it to the chats the approver is in while the approver is
active (heard from within two hours) and the link is under a week old. The
other devices gap-fill only once the approver goes quiet, so they no longer
both add it and fork chats. A sibling running an older version still
gap-fills at once.</li>
<li>An invitation answered on one linked device shows as answered on the other
within seconds. The answer is sent on the worker's next turn, a sibling's
winning answer is applied when it arrives, and the chat then reports
<code>GroupStateUpdated</code>, as a host accept does.</li>
<li>A device the user linked and then removed no longer comes back as a new
sign-in once its <code>removed</code> roster record expires. A later publication in
that slot is still a new sign-in.</li>
<li>History recovery no longer stalls a newly linked device on traffic that may
predate its Welcome.</li>
</ul>
<h2 id="group-changes-that-confirm-stick-or-are-given-up">Group changes that confirm, stick or are given up</h2>
<p>0.17.0 retried a group change whose relay answer was unclear until it either
confirmed or exhausted its retries, and a change could stay pending
indefinitely. 0.18.0 resolves it
(<a href="https://github.com/marmot-protocol/mdk/issues/2332">#2332</a>):</p>
<ul>
<li><strong>Confirmed by echo.</strong> When the account's own group subscription receives
that exact change from one of the group's relays, it confirms. A copy under
another event id, or from a relay outside the group's list, confirms
nothing.</li>
<li><strong>Confirmed by read-back.</strong> Ten minutes after the first send, each retry of
a relay that may hold the change first reads that exact change back. The
read never signs in as the account, sends one request per relay, at most
eight per account per relay an hour, and feeds nothing into message handling.</li>
<li><strong>Given up.</strong> A change no relay accepted and none may hold, with relays still
unreached, rolls back ten minutes after its first send once the device shows
it is online. A change any relay may hold never rolls back, and an offline
device keeps the change pending.</li>
<li><strong>Prepared once.</strong> A queued message or change names its stored send, so a
retry or restart no longer prepares it a second time as a new message with
a new identity. The same event can still be republished to relays while its
send resolves; that is one logical delivery. A send stored by 0.17.0 can
still be prepared once more after a restart.</li>
</ul>
<p>While the group's own commit is pending, group changes fail with
<code>GroupCommitPending</code>. To show the user what is happening:</p>
<ul>
<li><code>groupPendingCommit(accountRef, groupIdHex)</code> returns <code>GroupPendingCommitFfi?</code>
with <code>state</code> <code>Sending</code> (its first ten minutes, and while no relay may hold
it) or <code>Stuck</code> (ten minutes on, some relay may hold it, none acknowledged).
It names the change by <code>intentKind</code>, plus <code>queuedIntentIdHex</code> for a queued
one, gives <code>firstAttemptAt</code>, and lists <code>unconfirmedRelayUrls</code>,
<code>owedRelayUrls</code> and <code>refusedRelays</code>. MDK never gives up a stuck commit. No
event announces a confirmation, so poll while showing it. It is a local
read with no network I/O.</li>
<li><code>groupChangesNotDelivered(accountRef, groupIdHex)</code> returns
<code>GroupChangeNotDeliveredFfi</code> records, oldest first, for changes given up
after their call returned: a direct change that answered
<code>CompletionUnknown</code>, or a queued one that answered <code>AcceptedPending</code>.
<code>reason</code> is <code>not_delivered</code>, <code>event_too_large</code> or <code>refused</code>. A direct change
is also announced by <code>GroupEventKindFfi.GroupChangeNotDelivered</code>; a queued
one by <code>QueuedIntentRefused</code>, as before. Read the records on start: the
events only notify. Clear one with
<code>acknowledgeChangeNotDelivered(accountRef, groupIdHex, commitIdHex)</code>. A
change staged by 0.17.0 and given up after the upgrade is not recorded.</li>
</ul>
<pre><code class="language-swift">// Illustrative.
if let pending = try await kit.groupPendingCommit(accountRef: account, groupIdHex: group),
   pending.state == .stuck {
    showStuckChange(kind: pending.intentKind, relays: pending.unconfirmedRelayUrls)
}
for record in try await kit.groupChangesNotDelivered(accountRef: account, groupIdHex: group) {
    showChangeNotApplied(kind: record.intentKind, reason: record.reason, at: record.at)
}
</code></pre>
<pre><code class="language-kotlin">// Illustrative.
marmot.groupPendingCommit(account, group)?.takeIf { it.state == GroupPendingCommitStateFfi.STUCK }
    ?.let { showStuckChange(it.intentKind, it.unconfirmedRelayUrls) }
marmot.groupChangesNotDelivered(account, group).forEach {
    showChangeNotApplied(it.intentKind, it.reason, it.at)
}
</code></pre>
<p>See <a href="__MARMOT_BASE__docs/native-apps.html#a-group-change-still-being-sent">A group change still being sent</a>
and <a href="__MARMOT_BASE__docs/native-apps.html#group-changes-that-were-not-applied">Group changes that were not applied</a>.</p>
<h2 id="changed-defaults">Changed defaults</h2>
<h3 id="maintenance-timing">Maintenance timing</h3>
<p>The 15-second maintenance tick no longer drives an idle account. Session
maintenance runs at the earliest time its data gives (rotation, leaf refresh,
self-update phase, KeyPackage refresh, expiry or relay backoff, a fanout's
backoff, a private KeyPackage expiry, a reinvite retry, or the 10-minute
component recheck). Device-group passes run at their own times: the sign-in
check, and once linked the hourly heartbeat, the small-state broadcast,
private KeyPackage request pacing, a leaving sibling's decision, gap filling
and inventory pages. Device pairing runs only while linking is under way.
Recovery, post-join work, attachments, avatars, presentation, local-submission
retries, push windows, history dispatch and the compaction batch each run when
an event wakes them and at their own deadlines. Work with no stored time
retries 15 s after the last run while it lasts.</p>
<p>Effects a host can see: an idle device uses less CPU and no longer writes the
database on each tick; a push token change goes out at once as a plain
<code>PushTokenUpdate</code>, followed by the announce it owes once the push fetch clock
settles (two group messages per group instead of one); KeyPackage publication
retries follow their stored backoff (30 s doubling to 1 h). Times a week or
more out (history expiry, inactivity, takeover) ride the run the hourly
heartbeat brings, so they can be up to an hour late. Nothing changes in the
API.</p>
<h3 id="relays-mdk-may-not-send-to">Relays MDK may not send to</h3>
<p>A group send none of whose relays MDK may send to fails as <code>NoUsableRelay</code>
instead of <code>Publish</code>. A relay the host-safety rule refuses no longer counts as
one a send may have reached: a Welcome whose inbox relays it refuses no longer
counts toward maintenance's ambiguous-exposure total, and a commit or message
every other group relay refused for size fails as <code>EventTooLarge</code>.</p>
<h3 id="sticker-and-emoji-relays">Sticker and emoji relays</h3>
<p>Sticker pack reads (<code>syncStickerPacks</code>, <code>fetchStickerPack</code>,
<code>installStickerPack</code>, resolving a received sticker) and emoji set reads
(<code>syncEmojiSets</code>, <code>fetchEmojiSet</code>, the sets <code>userEmojiList</code> points to) query
the runtime's configured relays as well as the account's NIP-65 relays. The
newest version among the relays that answered wins. The installed lists
(kinds 10031 and 10030) are still read from and published to the account's
relays only. A pack's share link names only relays that served the version MDK
kept.</p>
<h3 id="onboarding">Onboarding</h3>
<ul>
<li>A relay that closes a query with <code>ERROR: auth-required: ...</code> is reported as
needing authentication, and an account that can sign authenticates and asks
again. After connecting (up to 5 s), a check waits up to 8 s for a relay to
finish answering, not 3 s, so one relay's inspection can take 13 s; the
step cancels a relay's check at 15 s. Relays are checked concurrently. Do
not put a shorter watchdog or &quot;timed out&quot; copy in front of that window.</li>
<li>A <code>RetryableFailure</code> relay or inbox step whose check was inconclusive also
offers <code>EditRelays</code> and, where defaults can change the list,
<code>UseRecommendedRelays</code>. <code>OnboardingRepairProposalFfi.inconclusive</code> marks a
proposal built on such a check; show an explicit at-your-own-risk
confirmation before approving it.</li>
<li>A step offers <code>RemoveUnusableRelays</code> when
<code>proposeOnboardingRelayRepair</code> would return an approvable preview that
removes a declared relay: a retired relay, or one that refused the
declared-route check with <code>auth-required</code> or <code>payment-required</code> while the
client held the account's local key. Each <code>Removed</code>
<code>OnboardingRelayTagChangeFfi</code> carries <code>removalReason</code> (<code>Retired</code>,
<code>AuthenticationRequired</code>, <code>PaymentRequired</code>) for a localized explanation;
every other entry carries <code>None</code>, which exhaustive switches must handle. C
uses the non-pointer enum <code>MarmotOnboardingRelayRemovalReason</code>.
It is advice: readiness never depends on it.</li>
<li><code>OnboardingDevicePackageFfi.client</code> names the app another installation's
package reports. See
<a href="#onboarding-other-installation-client-labels">Onboarding: other-installation client labels</a>.</li>
<li>A single-device acknowledgment survives a pause of more than five minutes
before Continue; the notice returns only when discovery finds something new.</li>
</ul>
<p>See <a href="__MARMOT_BASE__docs/native-apps.html#interactive-account-onboarding">Interactive account onboarding</a>.</p>
<h3 id="usage-diagnostics-onboarding-pauses">Usage diagnostics: onboarding pauses</h3>
<p>Hosts make no new calls. MDK now records the <code>mdk_onboarding_summary</code> usage
diagnostics aggregate itself (#3440). It shows which interactive onboarding
step (profile, follows, relays, inbox relays, single device, KeyPackage) an
attempt stopped at and why. Each row has the blocking status, the primary and
per-source issue classes, the finding context and a bucketed count of failing
sources. It has no relay URL, account, event id or free text. Each attempt
counts a distinct step, status and issue once, across retries and restarts,
and only while usage-and-diagnostics consent is granted.</p>
<p>The product catalogue gains this family, so the registry revision changes.
After the upgrade, a user who had granted usage and diagnostics reads as
<code>AcceptanceRequired</code> until they accept again. Show the scope-change explanation
you already use when registered schemas change (see
<a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/docs/marmot-architecture/usage-diagnostics.md#consent-and-host-integration">Usage and diagnostics</a>),
not the one-time legacy explanation. Keep recording <code>mdk_onboarding_step</code> as
before: the new rows explain a pause, and the host's step events still mark
start and completion.</p>
<h3 id="onboarding-other-installation-client-labels">Onboarding: other-installation client labels</h3>
<p>Someone importing an existing key almost always has KeyPackages that their previous
app published, so the <code>SingleDevice</code> notice reports <code>OtherInstallationPossible</code> for
nearly everyone moving between apps. The generic &quot;Other sign-in records were found&quot;
copy can read as a reason to stop. Each <code>single_device_notice.other_packages</code> entry
now carries an optional <code>client</code> string (#3438): <code>OnboardingDevicePackage::client</code> in
Rust, <code>OnboardingDevicePackageFfi.client</code> in Swift/Kotlin and
<code>MarmotOnboardingDevicePackage.client</code> in C. It comes from the record's NIP-89
<code>client</code> tag. Hosts can use it to name the likely source, for example &quot;We found
messaging keys from Example Chat&quot;.</p>
<ul>
<li><strong>Required.</strong> Replace generated Swift/Kotlin, native libraries and C headers
together. Code that constructs <code>OnboardingDevicePackageFfi</code> directly (previews,
fakes) must pass <code>client</code>. C hosts must recompile: <code>MarmotOnboardingDevicePackage</code>
gains a trailing <code>client</code> pointer, which <code>marmot_onboarding_snapshot_free</code> releases
with the rest of the snapshot.</li>
<li><strong>Untrusted.</strong> The label is whatever the record's signer wrote. Present it as what
the records report, render it as plain text (never markup or a link), and never base
trust, identity, deduplication or security decisions on it. Keep it out of logs,
telemetry and analytics.</li>
<li><strong>Sanitized by MDK.</strong> Only the first value of the first <code>client</code> tag is read, never
the handler address or relay hint after it. Control, bidirectional and invisible
formatting characters are removed, whitespace runs collapse to one space, and the
label keeps at most 64 whole grapheme clusters and 1024 bytes. A missing tag or a
label with nothing visible left is <code>None</code> (C: <code>NULL</code>). C strings never contain an
embedded NUL.</li>
<li><strong>Optional and backward compatible.</strong> Several entries can share a label, and entries
without one still need the existing generic wording. Checkpoints saved by 0.17.0
load unchanged and report <code>None</code> until <code>SingleDevice</code> is checked again. Discovery,
consent and the step's actions are unchanged; no network work is added.</li>
</ul>
<pre><code class="language-swift">// Illustrative.
let names = Set(notice.otherPackages.compactMap(\\.client)).sorted()
let source = names.isEmpty
    ? &quot;another app&quot;
    : ListFormatter.localizedString(byJoining: names)
</code></pre>
<p>The <a href="__MARMOT_BASE__docs/native-apps.html#single-device-notice">binding reference</a> has the
notice copy and discovery limits.</p>
<h2 id="feature-adoption">Feature adoption</h2>
<h3 id="direct-follow-availability-optional">Direct-follow availability (optional)</h3>
<p><code>followAvailabilityPage(accountRef, after, limit)</code> reads the selected
account's direct follows from its encrypted cache without networking; pass
<code>nextCursor</code> as <code>after</code>, and <code>limit</code> clamps to 1–100. Each row is <code>ready</code> (MDK
selected a current compatible KeyPackage), <code>unknown</code>, or <code>notFound</code> (for 15
minutes after a completed miss), with check time, expiry and provenance. It
never says which client an account installed. <code>refreshFollowAvailability</code>
checks at most 100 follows (four at a time, 10 s per target, five minutes in
all), committing per target so pages show partial progress; concurrent calls
share one refresh, and completed refreshes have a 60-second cadence. Poll
<code>followAvailabilityStatus</code> and cancel with
<code>cancelFollowAvailability(accountRef, operationId)</code>, using the same account;
a stale id returns false. Keep the synchronous page read off the UI thread.
See <a href="__MARMOT_BASE__docs/native-apps.html#direct-follow-availability">Direct-follow availability</a>.</p>
<h3 id="file-backed-draft-attachments-optional">File-backed draft attachments (optional)</h3>
<p><code>stageMessageDraftAttachmentFile(accountRef, revision, request, control)</code>
copies a host file, up to the encrypted-media blob limit, into the account's
encrypted media store and adds it to the draft, so no full-size buffer crosses
the binding. The draft owns the copy across text-only saves and restarts;
clearing or sending the draft releases it. Staging returns the selected
draft: use its revision from then on, because the revision you staged with
is stale once the copy lands. Then:</p>
<ul>
<li>Keep such attachments through edits with
<code>saveMessageDraftInputsIfRevision</code>, passing
<code>MessageDraftAttachmentInputFfi.retained(id:)</code> for each one to keep and
<code>.inline(attachment:)</code> for in-memory ones. A save deletes every attachment
its inputs omit, including its staged file.</li>
<li>Read previews with <code>readMessageDraftAttachment</code> (1 MiB chunks; <code>nil</code> means
no such attachment, an empty chunk the end) or hand a file to the OS with
<code>openMessageDraftAttachmentHandoff</code>. The handoff is a plaintext copy under a
lease that outlives draft edits, clears and sends: call
<code>releaseAttachmentHandoff</code> once the OS consumer has finished with it.</li>
<li>Upload with <code>uploadMessageDraftAttachments</code>, then pass its references, in
the draft's attachment order and with that same revision, to
<code>sendMessageDraft</code>.</li>
<li><code>SelectedMessageDraftAttachmentFfi.fileBacked</code> marks them, and storage usage
reports staged bytes as <code>draftBytes</code>. <code>messageDraftAttachmentIfRevision</code>
refuses a file-backed attachment (it still reads inline ones), and the
legacy whole-draft read refuses a draft that holds one.</li>
</ul>
<p><code>sendMessageDraft</code> and captured-media admission now match prepared media to
the draft after an upload's normalization (a V1 upload trims the file name;
both versions canonicalize the media type), so <code>&quot; clip.mp4 &quot;</code> or <code>Video/MP4</code>
no longer fail to match. See
<a href="https://github.com/marmot-protocol/mdk/blob/34646a577807f2b112ee031f3c164ec58aa18b64/crates/marmot-uniffi/CONVERSATION-WINDOW.md#file-backed-attachments">Conversation windows</a>.</p>
<h3 id="emoji-scoped-reaction-removal-optional">Emoji-scoped reaction removal (optional)</h3>
<p><code>unreactFromMessageMatching(accountRef, groupIdHex, targetMessageId, emoji)</code>
removes the account's active reactions with that exact emoji and keeps its
others. Both removal calls return <code>ReactionNotFound</code> for a local no-match.
Target-wide <code>unreactFromMessage</code> is unchanged.</p>
<h3 id="direct-chats-with-a-disappearing-message-duration-optional">Direct chats with a disappearing-message duration (optional)</h3>
<p><code>startDirectConversationWithOptions(accountRef, peerAccountId, DirectConversationOptionsFfi(disappearingMessageSecs:))</code> founds a new direct
chat with that duration in its founding MLS state and Welcome; zero disables
it. A nonzero duration requires the peer to support message retention, as
<code>createGroupWithOptions</code> does; otherwise the call fails and creates no chat,
so explain that the peer cannot keep disappearing messages and create the
chat with <code>startDirectConversation</code> only after the user agrees to go without
them. Reuse and retry
keep the existing chat's duration and roles.
<code>startDirectConversation</code> is unchanged.</p>
<h3 id="attachment-removal-cursors-optional">Attachment removal cursors (optional)</h3>
<p><code>attachmentRemovals(accountRef, cursor, limit)</code> returns
<code>AttachmentBodyRemovalPageFfi</code>: ordered, durable removal identities for host
derivative caches (thumbnails, decoded copies). Persist the returned cursor
after evicting. A first-use, reset or trimmed cursor asks for a full cache
reconciliation against the captured high-water mark. Pages hold up to 256
records and the journal 4,096. A removal never authorizes a byte read.</p>
<h3 id="raw-messages-invalidated-tombstones">Raw messages: invalidated tombstones</h3>
<p><code>messages</code> returns raw rows retained after invalidation, including kind-7
reactions and kind-1111 comments. Those rows now carry <code>invalidated</code> in
<code>AppMessageRecordFfi</code> and <code>MarmotAppMessageRecord</code> (#3411). The flag is true
for a row kept only as a tombstone and false for a live row.</p>
<ul>
<li><strong>Required.</strong> Replace generated Swift/Kotlin bindings, native libraries and
<code>marmot.h</code> together. Code that constructs <code>AppMessageRecordFfi</code> directly must
pass <code>invalidated</code>.</li>
<li><strong>Required for C.</strong> Recompile against the matching header and library.
<code>MarmotAppMessageRecord</code> gains a trailing <code>bool</code>, which changes the record
size and the item stride in <code>MarmotAppMessageRecordList</code>.</li>
<li><strong>Required for raw reactions and comments.</strong> Check <code>invalidated</code> before
treating a row as live. Hide the tombstone or render its invalidated state;
do not render its reaction emoji or comment as live content.</li>
</ul>
<p>Validate the binding with one live row and one invalidated row in the same
<code>messages</code> result. Their flags must be false and true respectively.</p>
<h2 id="c-host-changes">C host changes</h2>
<p>Recompile every consumer against the 0.18.0 header and library.</p>
<ul>
<li>Layout changes (trailing fields unless noted):
<ul>
<li><code>MarmotAppMessageRecord</code> gains <code>invalidated</code>.</li>
<li><code>MarmotDeviceLinkSnapshot</code> gains <code>chat_progress</code> / <code>chat_progress_len</code>.</li>
<li><code>MarmotOnboardingDevicePackage</code> gains a nullable <code>client</code> string, freed by
<code>marmot_onboarding_snapshot_free</code>; the <code>other_packages</code> stride changes.</li>
<li><code>MarmotOnboardingRelayTagChange</code> gains <code>removal_reason</code>
(<code>MarmotOnboardingRelayRemovalReason</code>); the <code>changes</code> stride changes.</li>
<li><code>MarmotOnboardingRepairProposal</code> gains <code>inconclusive</code>.</li>
<li><code>MarmotSelectedMessageDraftAttachment</code> gains <code>file_backed</code>, and draft
attachments are read as an array; <code>MarmotAttachmentStorageUsage</code> gains
<code>draft_bytes</code>.</li>
</ul>
</li>
<li>New statuses: <code>MARMOT_STATUS_GROUP_COMMIT_PENDING</code> (<code>131</code>),
<code>MARMOT_STATUS_REACTION_NOT_FOUND</code> (<code>132</code>), <code>MARMOT_STATUS_NO_USABLE_RELAY</code>
(<code>133</code>; it was <code>MARMOT_STATUS_PUBLISH</code>).</li>
<li>Appended enum values: <code>MARMOT_GROUP_EVENT_KIND_GROUP_CHANGE_NOT_DELIVERED</code>
and <code>MARMOT_ONBOARDING_ACTION_REMOVE_UNUSABLE_RELAYS</code>. Existing values keep
their numbers.</li>
<li>New functions: <code>marmot_group_pending_commit</code> (free with
<code>marmot_group_pending_commit_free</code>); <code>marmot_group_changes_not_delivered</code>
(free with <code>marmot_group_change_not_delivered_list_free</code>) and
<code>marmot_acknowledge_change_not_delivered</code>; <code>marmot_follow_availability_page</code>,
<code>marmot_refresh_follow_availability</code>, <code>marmot_follow_availability_status</code>
and <code>marmot_cancel_follow_availability</code> with their deep-free functions;
<code>marmot_stage_message_draft_attachment_file</code>,
<code>marmot_read_message_draft_attachment</code>,
<code>marmot_open_message_draft_attachment_handoff</code>,
<code>marmot_upload_message_draft_attachments</code> and
<code>marmot_save_message_draft_inputs_if_revision</code> with
<code>MarmotMessageDraftAttachmentSaveInput</code>; <code>marmot_unreact_matching</code>;
<code>marmot_start_direct_chat_with_options</code> with the borrowed
<code>MarmotDirectConversationOptions</code>; <code>marmot_attachment_removals</code> (copy the
cursor before freeing the page with <code>marmot_body_removal_page_free</code>).</li>
<li><code>marmot_client_new_with_configuration</code> opens with device groups on, and
<code>marmot_client_new_with_experimental_device_groups</code> is the same open; it no
longer returns <code>MARMOT_STATUS_RUNTIME</code> for an unavailable build. The
<code>dev-device-groups</code> feature, <code>c-bindings.sh --dev-device-groups</code> and
<code>output-dev-device-groups/</code> are gone.</li>
</ul>
<p>See the <a href="__MARMOT_BASE__docs/c-interface.html">C guide</a> and
<a href="__MARMOT_BASE__docs/c-api.html">symbol inventory</a>.</p>
<h2 id="rust-host-changes">Rust host changes</h2>
<ul>
<li><code>marmot-app</code>: <code>MarmotAppConfig::dev_device_groups</code> /
<code>with_dev_device_groups</code> are renamed <code>device_groups</code> / <code>with_device_groups</code>,
default to true and take effect in every build. The <code>dev-device-groups</code> and
<code>unreleased-device-pairing</code> features are gone; <code>marmot-pairing</code> is always
linked. A host that must stay off sets <code>with_device_groups(false)</code> in every
opener of a root.</li>
<li><code>marmot-app</code>: <code>DeviceLinkSnapshot</code> gains <code>chat_progress</code>;
<code>RelayTelemetryRollup</code> gains <code>relay_read_back_requests</code> and
<code>relay_read_back_found</code>; <code>AppError</code> gains <code>GroupCommitPending</code> and
<code>NoUsableRelay</code> (<code>ReactionNotFound</code> already existed and is now a typed
binding error); <code>marmot_session::PublishFailure</code>
gains <code>no_usable_relay</code>. New runtime methods mirror the binding additions
(<code>group_pending_commit</code>, <code>group_changes_not_delivered</code>,
<code>acknowledge_change_not_delivered</code>, the follow-availability calls, the
file-backed draft calls, <code>start_direct_conversation_with_options</code>).</li>
<li><code>cgka_traits</code>: <code>OutboundIntentStorage</code> gains <code>put_change_not_delivered</code>,
<code>changes_not_delivered</code> and <code>delete_change_not_delivered</code>; custom storage
must implement them. <code>SendIntent::AddOwnAccountDevices</code> and
<code>GroupEvent::GroupJoined</code> gain <code>forwarded: ForwardedInvitation</code>, and
<code>GroupEvent</code> gains <code>GroupChangeNotDelivered</code>. <code>EngineError</code> gains
<code>SiblingAddUnsettled</code>. <code>TransportAdapter</code> adds <code>read_back</code> and
<code>event_size_class</code>, <code>MessageStorage</code> adds
<code>release_message_for_replay_without_stall_evidence</code>, and
<code>TransportEndpointFailure</code> adds <code>is_endpoint_prohibited</code>, each with a
default. <code>OutboundFanout</code> gains acknowledgement, abandonment, stuck and
queued-intent state; <code>FanoutTargetStatus</code> gains <code>Abandoned</code>.
<code>StoredMessagePayload::OutboundWelcome</code> and <code>StagedInviteWelcome</code> gain
<code>key_package_event_id</code>, so explicit constructors and exhaustive field
patterns need it.</li>
<li><code>marmot-app</code> onboarding: <code>OnboardingRepairProposal</code> gains <code>inconclusive</code>
and a private field, so it can no longer be built with a struct literal.
Use the proposal onboarding returns, and update fixtures that construct it.</li>
<li><code>marmot-uniffi</code>: the Rust helper <code>require_experimental_device_groups</code> is
removed; every runtime has device groups.</li>
<li><code>cgka-engine</code>: <code>SiblingWelcome</code> gains <code>forwarded</code> (version 3 when anything
is forwarded); <code>OutboundWelcomeStatus::Settled</code> carries a
<code>WelcomeSettlement</code>; <code>publish_failed_fanout</code>, <code>publish_not_delivered</code> and
<code>publish_refused_as_too_large</code> take a <code>RollbackPass</code>;
<code>Identity::load_or_generate</code> and
<code>openmls_projection::apply_openmls_canonicalization_result</code> take the
wall-clock time as a <code>Timestamp</code>. <code>EngineBuilder::monotonic_clock</code> installs
a test clock; <code>SystemMonotonicClock</code>, <code>SystemWallClock</code> and
<code>OsMaintenanceRandom</code> are public.</li>
<li><code>storage-sqlite</code>: <code>save_message_draft_if_revision</code> takes
<code>&amp;[StoredMessageDraftAttachmentInput]</code> (wrap bodies in <code>Inline</code>, keep held
ones with <code>Retained(id)</code>); <code>message_draft</code> returns
<code>Result&lt;_, MessageDraftRevisionError&gt;</code>; <code>RecoveryEpochGapRetry</code> needs
<code>visit_until_seconds</code>; <code>merge_invitation_decisions</code> returns whether any
decision won; <code>device_pairing_state_exists</code> counts only linking still under
way.</li>
</ul>
<p>See the crate changelogs for <code>marmot-app</code>, <code>cgka-engine</code>, <code>cgka-traits</code> and
<code>storage-sqlite</code>.</p>
<h2 id="wn-agent-and-integrations">WN Agent and integrations</h2>
<p>The agent-control protocol is unchanged. The connector opens its accounts with
the runtime's default configuration, so they now run with device groups on:
the agent's account advertises the device roster and runs the sign-in check.
It has no switch to turn them off. Hermes and the terminal harnesses need no
change; upgrade them with the connector as usual. The OpenClaw plugin now
declares its <code>marmot_history</code> and <code>marmot_group_profile</code> tools and ships an
empty Doctor contract, so it installs, and updates with a pending
Doctor-inspection record, on OpenClaw 2026.10.10 and later.</p>
<p><code>wn</code> CLI and <code>wnd</code>: every build includes multi-device, on by default; export
<code>WN_DEVICE_GROUPS=0</code> for both to turn it off, and <code>wn daemon status</code> JSON adds
<code>device_groups</code>. <code>wn devices</code> linking, the device
roster and admin step-down on Leave work without setup, so <code>groups management</code>
reports <code>requires_self_demote_before_leave</code> false for a nonlast admin.
Device-link status shows remaining chats per device (JSON <code>chat_progress</code>).
New: <code>wn groups pending-commit</code>, <code>wn groups changes-not-delivered</code> and
<code>wn groups acknowledge-change-not-delivered</code>. JSON error codes add
<code>group_commit_pending</code> (ahead of <code>group_catching_up</code> and
<code>group_commit_undelivered</code>) and <code>no_usable_relay</code> (in place of
<code>publish_failed</code> for that case).</p>
<h2 id="changes-requiring-no-new-calls">Changes requiring no new calls</h2>
<ul>
<li>History recovery continues across partial MLS epoch advances: retained
unreadable messages can arm the next recovery request after local replay
settles, without reopening the account or waiting for fresh traffic.</li>
<li>Queued detached Welcomes no longer start relay publication after their
native origin loses.</li>
<li>Retrying an emoji-set install no longer deletes emoji the user already has;
<code>skipped</code> names only entries left without an image. Emoji discovery applies
its 60-set limit after deduplicating.</li>
<li>NIP-22 comments (kind 1111 with a numeric lowercase <code>k</code> tag) project their
parent, media and author-only edits, and their media keys are cached and
carried in history bundles, so comment media stays decryptable after the
epoch advances and on devices that import history
(<a href="https://github.com/marmot-protocol/mdk/issues/3410">#3410</a>).</li>
<li>The compaction batch retries 15 s after the account's storage fails to open.</li>
<li>Runtime shutdown gives Welcome waves still publishing up to 2 s before it
cancels them, so a Welcome a create or invite just started usually goes out
before exit. A relay can outlast that bound, and <code>shutdownAndClose</code> closes
storage first, so a send can finish without being recorded; a Welcome still
owed is sent on the next start, possibly again.</li>
<li>Destructive sign-out reports a member Leave it could only queue in its leave
failures instead of counting the group as left.</li>
<li>A fresh account no longer fails KeyPackage rotation (&quot;legacy key package
replacement is pending&quot;) or reports <code>RecoveryRequired</code> because an early read
created its database.</li>
<li>A newly linked device no longer reads pre-join history as an epoch gap,
which offered a needless Reset Device List and held its chats back.</li>
<li>A refused Welcome delivery no longer drops a later delivery of the same
Welcome as a duplicate.</li>
<li>Background history drains without a live tail end instead of polling slow
relays continuously, and <code>RecoveryStatusChanged</code> fires per route, not per
relay.</li>
<li>History notices, recovery status and the prepared-image, fresh-start and
history-import reads answer from the published read state, and no read
answers earlier than the worker would.</li>
<li>With device groups on, an idle maintenance tick takes no writer
transaction.</li>
</ul>
<h2 id="acceptance-and-remaining-work">Acceptance and remaining work</h2>
<p>Before shipping an app on 0.18.0:</p>
<ul>
<li>Compile against the matched artifacts with every exhaustive <code>switch</code>/<code>when</code>
updated; for C, rebuild every consumer and check the new free paths.</li>
<li>Ship the same library in the app and every extension; confirm an extension
delivers notifications for an account that has linked a device.</li>
<li>Upgrade a 0.17.0 install in place and confirm both databases migrate once
and the second open changes nothing. Confirm 0.17.0 refuses to reopen them,
and that restoring the pre-upgrade copy works.</li>
<li>Link a second and a third device: confirm emoji comparison, chat progress,
with an inviter neither device blocks, that a confirmed chat without an
invitation generation arrives confirmed at
once and one with a generation turns confirmed when its shared decision
arrives, that an invitation answered on one
device shows on the other within seconds, and that removing a device keeps
it out of sign-ins.</li>
<li>As a nonlast admin, leave a group and confirm the step-down happens without
a separate demote.</li>
<li>Give up: make a group change with one group relay unreachable throughout
and another refusing it. After ten minutes, once the reachable relay has
refused a later send or answered the read-back without the event, confirm
a <code>groupChangesNotDelivered</code> record and <code>GroupCommitPending</code> until then. A
device whose relays are all unreachable keeps the change pending.</li>
<li>Stuck: make a group change that a relay accepts without answering <code>OK</code>,
with the account's subscription echo of it suppressed and the relay's
read-back answering without it. Confirm <code>groupPendingCommit</code> reaches
<code>Stuck</code> after ten minutes and the change is never given up.</li>
<li>Leave an account idle and confirm it no longer wakes every 15 s (CPU and
database writes).</li>
<li>If adopted: page and refresh follow availability and cancel a refresh;
stage a large video in a draft, restart, and send it; remove one emoji
reaction of several; start a direct chat with a disappearing-message
duration, and confirm a peer without message-retention support makes the
call fail with no chat created.</li>
<li>Report evidence by stage: source, host smoke, packaged artifact, consuming
app, real device.</li>
</ul>
<p>What was validated: every change in this comparison landed through the merge
queue's CI matrix, and the binding-docs gate passes for the MarmotKit method and
C symbol inventories at this source. Not validated here: upgrade of a real
0.17.0 installation, device linking between production iOS and Android
builds, and app-level adoption on iOS or Android.</p>
<p>Known limitations:</p>
<ul>
<li>A linked device can show an accepted chat as an invitation until its
decision arrives (<a href="https://github.com/marmot-protocol/mdk/issues/3556">#3556</a>),
and a sibling Add whose Welcome goes out late can still forward &quot;pending&quot;
for an invitation the user accepted on this device in between
(<a href="https://github.com/marmot-protocol/mdk/issues/3559">#3559</a>). An Add that
would forward invitation facts is no longer queued.</li>
<li>A message sent while a new device is joining a chat can be lost on that
device (<a href="https://github.com/marmot-protocol/mdk/issues/3537">#3537</a>), and
the approver hold's hand-off edges remain
(<a href="https://github.com/marmot-protocol/mdk/issues/3561">#3561</a>).</li>
<li>A sibling decline this device cannot apply as the chat's last admin waits
for the next maintenance run, up to an hour.</li>
<li>Startup hydration re-drives every outstanding fanout after each batch of
four groups, delaying live transport on accounts with many groups
(<a href="https://github.com/marmot-protocol/mdk/issues/3367">#3367</a>).</li>
<li>Pending Welcomes and some other reads still go through the worker queue
(<a href="https://github.com/marmot-protocol/mdk/issues/3273">#3273</a>).</li>
<li>Still open from earlier releases: right after a reconnect a new send can
still go out ahead of older unsent ones; the automatic-rejoin handshake's
inner event kind is under discussion
(<a href="https://github.com/marmot-protocol/marmot/issues/451">marmot#451</a>);
<a href="https://github.com/marmot-protocol/mdk/issues/2237">#2237</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2277">#2277</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2283">#2283</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2389">#2389</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2286">#2286</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2253">#2253</a>,
<a href="https://github.com/marmot-protocol/mdk/issues/2158">#2158</a> and
<a href="https://github.com/marmot-protocol/mdk/issues/1445">#1445</a>.</li>
</ul>
`,m={__name:"upgrading.html",setup(p){return(g,n)=>{const t=r("DocumentationPage");return d(),a("div",null,[n[0]||(n[0]=o("h1",{id:"upgrade-guide",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#upgrade-guide"},[o("span",null,"Upgrade guide")])],-1)),i(t,{document:{repo:e(s),version:e(c),sourceUrl:e(l),html:e(h)}},null,8,["document"])])}}},f=JSON.parse('{"path":"/docs/upgrading.html","title":"Upgrade guide","lang":"en-US","frontmatter":{"title":"Upgrade guide","description":"Review version-specific breaking changes and migration steps before upgrading an application to the latest stable MDK release.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0,"head":[["link",{"rel":"canonical","href":"https://marmot.build/docs/upgrading.html"}],["link",{"rel":"describedby","href":"https://marmot.build/llms.txt"}],["meta",{"property":"og:type","content":"website"}],["meta",{"property":"og:site_name","content":"Marmot"}],["meta",{"property":"og:title","content":"Upgrade guide | Marmot"}],["meta",{"property":"og:description","content":"Review version-specific breaking changes and migration steps before upgrading an application to the latest stable MDK release."}],["meta",{"property":"og:url","content":"https://marmot.build/docs/upgrading.html"}],["meta",{"property":"og:image","content":"https://marmot.build/images/share.png"}],["meta",{"property":"og:image:width","content":"1200"}],["meta",{"property":"og:image:height","content":"630"}],["meta",{"property":"og:image:alt","content":"Marmot wordmark and illustration"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["link",{"rel":"alternate","type":"text/markdown","href":"https://marmot.build/docs/upgrading.md"}]]},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1},{"name":"erskingardner","username":"erskingardner","email":"202880+erskingardner@users.noreply.github.com","commits":1,"url":"https://github.com/erskingardner"}],"changelog":[{"hash":"0330b27fbdf24e99917ca75283be54594a9152e3","time":1794986838000,"email":"202880+erskingardner@users.noreply.github.com","author":"Jeff Gardner","message":"Add Marmot analytics and search discovery metadata"},{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/upgrading.md"}');export{m as comp,f as data};
