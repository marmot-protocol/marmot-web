import{c as a,b as o,d as r,u as e,r as i,o as c}from"./app-BI17XJzV.js";const d="mdk",s="0.16.0",l="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-c/README.md",h=`<div id="marmot-c" class="mm-source-title">marmot-c</div>
<p>C ABI over the Marmot app runtime (<code>marmot-uniffi</code>), for C/C++ and any raw-FFI consumer (Zig, Nim, Go, Odin, Lua,
PHP, …). Runtime concepts, screen contracts and API selection are shared with Swift/Kotlin and live in the
<a href="__MARMOT_BASE__docs/native-apps.html#integration-guide-and-api-reference">binding integration guide</a>; this README covers what is
specific to C: building and linking, binary compatibility, memory ownership, blocking calls, and C-only differences
per feature.</p>
<h2 id="contents">Contents</h2>
<ul>
<li><a href="#what-you-get">What you get</a></li>
<li><a href="#binary-compatibility">Binary compatibility</a></li>
<li><a href="#rules-of-the-road">Rules of the road</a></li>
<li><a href="#using-the-abi">Using the ABI</a></li>
<li><a href="#integration-documentation">Integration documentation</a></li>
<li><a href="#lifecycle-and-teardown">Lifecycle and teardown</a></li>
<li><a href="#onboarding-relay-repair">Onboarding relay repair</a></li>
<li><a href="#relay-liveness">Relay liveness</a></li>
<li><a href="#nip-46-accounts">NIP-46 accounts</a></li>
<li>Feature notes: <a href="#runtime-construction">runtime construction</a>,
<a href="#experimental-device-group-test-builds">experimental device-group test builds</a>, <a href="#local-sends">local sends</a>,
<a href="#attachment-handoff-leases">attachment handoff leases</a>, <a href="#attachment-storage">attachment storage</a>,
<a href="#custom-reaction-artwork">custom reaction artwork</a>, <a href="#emoji-set-installs">emoji set installs</a>,
<a href="#file-backed-media-upload">file-backed media upload</a>,
<a href="#account-attachment-history">account attachment history</a>,
<a href="#public-event-verification">public event verification</a>, <a href="#host-performance-stages">host performance stages</a>,
<a href="#markdown-rendering">Markdown rendering</a>, <a href="#identity-references-and-pseudonyms">identity references and pseudonyms</a>,
<a href="#keypackage-inventory">KeyPackage inventory</a>, <a href="#invitation-lookup-outcomes">invitation lookup outcomes</a>, <a href="#selected-chat-list-presentation">selected chat-list presentation</a>,
<a href="#chat-screens-and-avatars">chat screens and avatars</a>, <a href="#advanced-timeline-search">advanced timeline search</a>,
<a href="#history-may-be-incomplete-notices">history may be incomplete notices</a>, <a href="#blocked-leaves">blocked leaves</a>,
<a href="#group-reporting">group reporting</a>,
<a href="#turning-on-account-devices">turning on account devices</a>,
<a href="#undelivered-welcomes">undelivered Welcomes</a>,
<a href="#backup-recovery">backup recovery</a>,
<a href="#host-driven-agent-publishing">host-driven agent publishing</a>,
<a href="#audit-v5-recording-and-delivery">audit v5 recording and delivery</a>, <a href="#legacy-audit-v4-upload">legacy audit v4 upload</a></li>
<li><a href="#smoke-test-and-example">Smoke test and example</a></li>
<li><a href="#regenerating-the-header">Regenerating the header</a></li>
</ul>
<h2 id="relay-liveness">Relay liveness</h2>
<p>Connection states and privacy follow the <a href="__MARMOT_BASE__docs/native-apps.html#relay-liveness">shared relay contract</a>.</p>
<p><code>marmot_account_relay_liveness</code> returns an owned <code>MarmotRelayLivenessList</code>;
<code>marmot_reconnect_relay</code> returns an owned <code>MarmotRelayLiveness</code>. Release them with
<code>marmot_relay_liveness_list_free</code> and <code>marmot_relay_liveness_free</code>, respectively.
The list owns every URL and optional error string. <code>has_last_attempt_unix</code> distinguishes
an absent attempt timestamp from zero; a NULL <code>last_error</code> means no error is recorded.</p>
<p><code>marmot_subscribe_relay_liveness</code> creates a <code>MarmotRelayLivenessSubscription</code>.
Its <code>snapshot</code> and blocking <code>next</code> return owned lists; callback lists are borrowed
only until the callback returns. Updates carry the latest complete snapshot and may
coalesce. <code>snapshot</code> takes the initial snapshot once; later calls return an empty
list. The relay callback additionally receives a <code>MarmotStatus</code>: OK accompanies a
list, CLOSED accompanies terminal NULL, and a mapped error status accompanies
terminal NULL on failure. Blocking <code>next</code> returns the same error status directly.
<code>cancel</code> wakes pending reads without
freeing the handle; release it with <code>marmot_relay_liveness_subscription_free</code> before
freeing its client. Callback cancellation and context lifetime follow the generic
subscription rules below.</p>
<h2 id="what-you-get">What you get</h2>
<ul>
<li><code>libmarmot_c.so</code> / <code>libmarmot_c.a</code> (cdylib + staticlib).</li>
<li><code>include/marmot.h</code>, generated by cbindgen and checked in.</li>
<li>A pkg-config file (<code>marmot-c.pc</code>) in the staged <code>output/</code> bundle.</li>
</ul>
<p>Build the bundle locally:</p>
<pre><code class="language-sh">./crates/marmot-c/c-bindings.sh   # stages output/ (libs, header, pkg-config)
</code></pre>
<p>Tagged releases (<code>marmotc-v*</code>) publish a Linux x86_64 zip (<code>marmot-c-linux-x86_64-&lt;version&gt;.zip</code>) with the same
contents plus this README.</p>
<h2 id="binary-compatibility">Binary compatibility</h2>
<p>Build clients against the header shipped with the exact native library they load.
Output records have concrete C layouts; this API has no tail-extension or
cross-release layout-compatibility guarantee, and a shared major/minor number does not imply layout compatibility.
Do not swap in a new library under an application compiled against older record layouts. Any additive record field,
union tag or function requires regenerating <code>marmot.h</code>, recompiling consumers and shipping the matching library.</p>
<p>See <a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-c/CHANGELOG.md">the changelog</a> for record-layout changes and upgrade requirements
for each release.</p>
<p><code>MARMOT_STATUS_EVENT_TOO_LARGE</code> (119) reports the shared <a href="__MARMOT_BASE__docs/native-apps.html#runtime-lifecycle-threads-and-errors">size-refusal error</a>.
The last-error string contains only the coarse artifact and size class; C has no structured size-error payload.
For a Welcome, status119 explains the observed attempt, not terminal delivery or proof of no earlier receipt.
Keep native retry work and confirmed state, including when a crash or expired bookkeeping hides earlier exposure.</p>
<h2 id="rules-of-the-road">Rules of the road</h2>
<ul>
<li>Every fallible function returns <code>MarmotStatus</code> (<code>MARMOT_STATUS_OK</code> is
0); detail text for the calling thread's most recent failure comes from
<code>marmot_last_error_message()</code> (free with <code>marmot_string_free</code>).</li>
<li>Structs returned by pointer are freed ONLY with their matching
<code>marmot_*_free</code>, which deep-frees every field. Never free fields
individually, never free twice; NULL is always a no-op.</li>
<li>Input structs and strings are borrowed: the library never frees or
retains caller memory.</li>
<li>Values you supply are fixed-width integers, never C enums or <code>_Bool</code>:
booleans are <code>uint8_t</code> (nonzero is true) and enums are <code>uint32_t</code>
discriminants — use the generated <code>MARMOT_*</code> constants. Out-of-range
values are rejected with <code>MARMOT_STATUS_INVALID_ARGUMENT</code>.</li>
<li>Required out-pointers are checked and zeroed before the call does any
work, so an invalid required output pointer cannot cause the operation
to run. Other failures/timeouts can follow durable intent or external side
effects; inspect authoritative state before retrying a mutation.</li>
<li>Calls block unless documented otherwise. Blocking functions may be called from a subscription callback.</li>
<li>Subscriptions offer blocking <code>*_next</code> (<code>0</code> timeout = wait forever;
<code>MARMOT_STATUS_TIMEOUT</code> / <code>MARMOT_STATUS_CLOSED</code> otherwise) or callback
registration. Callback item pointers are borrowed and valid only for
the duration of the call; <code>user_data</code> must outlive every possible
callback invocation (clear/free do not wait for a running callback).</li>
<li>Free every subscription handle before the client that created it, and never free an object while another call uses
it.</li>
</ul>
<h2 id="using-the-abi">Using the ABI</h2>
<pre><code class="language-c">#include &lt;stdio.h&gt;

#include &lt;marmot.h&gt;

static void report(const char *what) {
    char *msg = marmot_last_error_message();
    fprintf(stderr, &quot;marmot: %s: %s\\n&quot;, what, msg ? msg : &quot;(no detail)&quot;);
    marmot_string_free(msg);
}

int main(void) {
    MarmotClient *client = NULL;
    MarmotDeployment *deployment = NULL;
    const char *relays[] = {&quot;wss://relay.example.org&quot;};
    if (marmot_deployment_white_noise(&amp;deployment) != MARMOT_STATUS_OK) {
        report(&quot;deployment_white_noise&quot;);
        return 1;
    }
    MarmotStatus status = marmot_client_new(&quot;/path/to/home&quot;, relays, 1, deployment, &amp;client);
    marmot_deployment_free(deployment); /* the client keeps its own copy */
    if (status != MARMOT_STATUS_OK) {
        report(&quot;client_new&quot;);
        return 1;
    }
    if (marmot_client_start(client) != MARMOT_STATUS_OK) {
        report(&quot;client_start&quot;);
        marmot_client_free(client);
        return 1;
    }
    /* ... */
    if (marmot_client_shutdown_and_close(client) != MARMOT_STATUS_OK) {
        report(&quot;client_shutdown_and_close&quot;);
        marmot_client_free(client);
        return 1;
    }
    marmot_client_free(client);
    return 0;
}
</code></pre>
<h2 id="integration-documentation">Integration documentation</h2>
<ul>
<li><a href="__MARMOT_BASE__docs/native-apps.html#integration-guide-and-api-reference">Shared binding integration guide</a>: runtime
lifecycle, screen contracts, API selection, localization and upgrade policy.</li>
<li><a href="__MARMOT_BASE__docs/c-api.html">Complete C symbol reference</a>: every function declaration, including ownership helpers and
C-only compatibility shims.</li>
<li><a href="__MARMOT_BASE__docs/native-api.html">Shared method reference</a>: runtime purposes and recommended alternatives to
older screen paths.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/docs/integration/README.md">Integration index</a>: a per-release upgrade guide for every release from 0.10.2,
including C record, enum, error and schema changes.</li>
</ul>
<p>Read the exact version's header and docs. The <code>marmot_nip46_*</code> adapter supports remote
signer login and registration. Arbitrary host signer callbacks and external-signer
onboarding remain UniFFI-only. The host secret-store vtable is a separate interface.
The catalog includes C-only compatibility shims; prefer the
versioned audit configuration setters and the composable runtime options constructor for new integrations.</p>
<h2 id="lifecycle-and-teardown">Lifecycle and teardown</h2>
<p>Before OS suspension/root handoff, use <code>marmot_client_shutdown_and_close</code> and observe
its status; <code>marmot_client_shutdown</code> alone does not close shared database handles.
Release subscriptions before clients, and never free an object while another call uses it.
<code>marmot_client_free</code> waits for runtime worker cleanup on an ordinary host thread, preventing pending database
destructors from racing process exit (since 0.10.3). Run final free off the UI thread. Calls from a Tokio runtime
context retain nonblocking cleanup to avoid deadlock and are not a process-teardown barrier.</p>
<h2 id="onboarding-relay-repair">Onboarding relay repair</h2>
<p><code>MarmotOnboardingFinding</code> includes typed context, check purpose and outcome,
declared capability, an owned <code>actions</code>/<code>actions_len</code> array, and optional
<code>has_observed_revision</code>/<code>observed_revision</code>. Free all nested findings and actions
through <code>marmot_onboarding_snapshot_free</code>; do not free the arrays separately.
See the shared <a href="__MARMOT_BASE__docs/native-apps.html#interactive-account-onboarding">diagnostic evidence limits</a>
before interpreting query success as relay capability or publication evidence.</p>
<p>The historical <code>SingleDevice</code> onboarding step is a sign-in chat/history notice,
not a blanket claim that multi-device use is unsupported. Its notice, actions,
acknowledgment calls and publication gate are unchanged; <code>MultiDeviceUnsupported</code>
is retained for compatibility and omitted from current findings. Adopt the shared
<a href="__MARMOT_BASE__docs/native-apps.html#single-device-notice">notice copy and evidence limits</a>
in host localization with a published binding artifact. Continue is still an
explicit acknowledgment, not permission to link devices or dismiss sign-in prompts.</p>
<p>For a general or inbox onboarding relay failure, call
<code>marmot_propose_onboarding_relay_repair</code> and inspect the optional
<code>proposal-&gt;relay_repair</code> in the returned snapshot. Its ordered before/after
tags and occurrence changes preserve duplicate entries, direction markers,
unrelated fields, and content. <code>ManualReview</code> has no approval action; do not
publish it or treat it as a full reset. Free the snapshot with
<code>marmot_onboarding_snapshot_free</code> after presenting the exact diff. Approval
remains a separate revision- and recovery-epoch-bound call.</p>
<p>Explicit <code>marmot_propose_onboarding_relays</code> selections also return the typed
preview. See the shared <a href="__MARMOT_BASE__docs/native-apps.html#explicit-recovery-and-checkpoint-compatibility">manual-edit preservation and checkpoint compatibility
contract</a>.
The C signatures and snapshot ownership rules are unchanged.</p>
<p>C relay-repair previews encode <code>original_content</code>, <code>proposed_content</code>, every
<code>fields</code> element in tags and changes, and each non-NULL <code>endpoint</code> as a JSON
string literal. Decode exactly once with a parser that preserves embedded zero
bytes and decoded UTF-8 lengths before displaying or prefilling an editor.
For example, <code>&quot;a\\u0000b&quot;</code> represents three bytes: <code>61 00 62</code>; <code>&quot;&quot;</code> is an empty
string, distinct from a NULL optional endpoint. Do not use <code>strlen</code> on decoded
content or discard control bytes. The encoded C strings contain no embedded
NULs; their snapshot ownership and deep-free rules are unchanged. Swift/Kotlin
records retain ordinary strings and do not use this C-only encoding.</p>
<h2 id="runtime-construction">Runtime construction</h2>
<p><code>marmot_client_new_with_configuration</code> takes a <code>MarmotClientOptions</code> struct combining relay policy, cursor
persistence, client label, secret store, attachment acquisition mode and device platform; NULL options or zero initialization selects
the same defaults as the Swift/Kotlin <code>MarmotOptions</code> (see the
<a href="__MARMOT_BASE__docs/native-apps.html#runtime-options-and-client-label">shared contract</a>). Use the matching header and library
for that struct's layout. <code>marmot_client_new_with_client_name</code> is the older label-only constructor.</p>
<p>Every <code>marmot_client_new*</code> constructor takes a required <code>MarmotDeployment</code> just before <code>out_client</code>: the
deployment's recovery relays, discovery indexers, media and image servers, Open Ranking, moderation label namespace,
keychain service and relay event limits. Create one with <code>marmot_deployment_white_noise</code> or
<code>marmot_deployment_neutral</code>, adjust it with the <code>marmot_deployment_set_*</code> functions, construct, then free it with
<code>marmot_deployment_free</code>; the client keeps its own copy. For an available constructor, a NULL deployment returns <code>MARMOT_STATUS_NULL_POINTER</code>
before anything opens. The unavailable experimental constructor checks its capability immediately after
required output preflight, before reading the remaining arguments. White Noise hosts pass <code>marmot_deployment_white_noise()</code>. The
<a href="__MARMOT_BASE__docs/native-apps.html#deployment">shared contract</a> covers what neutral means, the keychain caveat and how
<code>marmot_deployment_set_relay_event_limits</code> limits apply.</p>
<p>For private integration fixtures, <code>marmot_client_new_with_options</code> accepts
an explicit loopback relay policy and an optional host secret-store vtable.
Existing constructors keep their public-only policy. Loopback broker access
requires a separate publisher trust opt-in; neither permits private or
link-local endpoints. Local insecure trust is intended only for tests.</p>
<h2 id="experimental-device-group-test-builds">Experimental device-group test builds</h2>
<p>Follow the <a href="__MARMOT_BASE__docs/native-apps.html#experimental-device-group-test-builds">shared build and constructor guidance</a>.
<code>marmot_client_new_with_experimental_device_groups</code> takes the same arguments and unchanged <code>MarmotClientOptions</code>
layout as <code>marmot_client_new_with_configuration</code>. Required output validation and clearing happen first. An incapable
library returns <code>MARMOT_STATUS_RUNTIME</code> with <code>experimental_device_groups_unavailable</code> before opening the root or
taking secret-store callback ownership; ownership transfers only on successful construction. A push extension or
background worker on an experimental root needs this constructor too: under <code>marmot_client_new_with_configuration</code>, an
account that holds or is joining a device group does not open, and its calls return <code>MARMOT_STATUS_RUNTIME</code> with
<code>experimental_device_groups_required</code>.</p>
<p>Build the C library/header with <code>./crates/marmot-c/c-bindings.sh --dev-device-groups</code>. It stages
<code>crates/marmot-c/output-dev-device-groups/</code> using a <code>dev-device-groups/</code> child of the selected Cargo target directory.
Ordinary output cleaning preserves this sibling directory.</p>
<h2 id="attachment-handoff-leases">Attachment handoff leases</h2>
<p><code>marmot_open_attachment_handoff</code> writes a private plaintext copy of a retained
attachment for an OS surface that needs a real file and returns its path under a
lease (NULL with <code>MARMOT_STATUS_OK</code> when the attachment is not held locally).
A copy the disk cannot hold beyond the reserve returns
<code>MARMOT_STATUS_STORAGE_FULL</code>. Call <code>marmot_release_attachment_handoff</code> when the
surface is done: it returns <code>MARMOT_STATUS_OK</code> for an unknown or already released
lease, <code>MARMOT_STATUS_INVALID_MEDIA_REFERENCE</code> for a malformed one, and
<code>MARMOT_STATUS_IO</code> when the copy could not be deleted (the lease is kept; retry).
Freeing the record with <code>marmot_attachment_handoff_free</code> does not release the
lease. Both calls block, and the open holds the calling thread for the whole copy:
run them off the UI thread. See the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#handoff-leases">shared contract</a>.</p>
<h2 id="attachment-storage">Attachment storage</h2>
<p><code>marmot_attachment_storage_usage</code>, <code>marmot_attachment_storage_by_chat</code> and
<code>marmot_largest_retained_attachments</code> read a Manage storage screen's usage and
largest-first pages; <code>marmot_remove_chat_attachments</code> and
<code>marmot_remove_attachments_older_than</code> remove in bulk, each removal being an
ordinary Remove. <code>marmot_attachment_keep_media</code> and
<code>marmot_set_attachment_keep_media</code> read and set the account's &quot;Keep media&quot;
window as <code>MarmotAttachmentKeepMedia</code> discriminants; attachments it removes read
<code>CleanedBySetting</code>. Page cursors are borrowed from their page: keep the page alive
while passing its <code>next_cursor</code>, then free the page. Calls block. See the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/ATTACHMENT-ACCESS.md#manage-storage">shared contract</a>.</p>
<h2 id="custom-reaction-artwork">Custom reaction artwork</h2>
<p><code>marmot_reaction_attachment</code> performs a bounded local lookup using the exact
reaction event ID. It blocks off the UI thread and writes a standalone owned
<code>MarmotAttachmentEntry</code>, or NULL with <code>MARMOT_STATUS_OK</code> when unavailable. Free
the standalone result with <code>marmot_attachment_entry_free</code>; never use that free
for an entry borrowed from a page. Use its original source target with ordinary
attachment acquisition and local reads. See the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/ATTACHMENT-HISTORY.md#reaction-artwork">shared reaction contract</a>.</p>
<h2 id="emoji-set-installs">Emoji set installs</h2>
<p><code>marmot_install_emoji_set</code> blocks for the whole install and borrows a host-owned <code>MarmotEmojiSetInstallControl</code>.
Create it with <code>marmot_emoji_set_install_control_new</code>, pass it to one install, and free it with
<code>marmot_emoji_set_install_control_free</code> only after the install has returned and every other call on the handle has
finished. From another thread, <code>marmot_emoji_set_install_control_cancel</code> makes the install return
<code>MARMOT_STATUS_EMOJI_SET_INSTALL_CANCELLED</code> (too late once the final write has started),
<code>marmot_emoji_set_install_control_is_cancelled</code> writes a <code>uint8_t</code>, and <code>marmot_emoji_set_install_control_progress</code>
fills a caller-provided <code>MarmotEmojiSetInstallProgress</code> with plain values that need no free. A NULL control returns
<code>MARMOT_STATUS_NULL_POINTER</code>. Pass the <code>expected_event_id_hex</code> the user was shown; a different stored version returns
<code>MARMOT_STATUS_EMOJI_SET_CHANGED</code>.</p>
<h2 id="file-backed-media-upload">File-backed media upload</h2>
<p><code>marmot_upload_media_files</code> and its token-aware twin take borrowed
<code>MarmotMediaFileUploadRequest</code> inputs with private regular-file paths instead of
plaintext arrays. See the <a href="__MARMOT_BASE__docs/native-apps.html#file-backed-media-upload">shared contract</a>.
<code>MarmotMediaAttachmentReference.source_epoch_identity</code> is a nullable local upload
identity. Preserve the returned string when saving and sending a reference;
NULL references remain readable but require a fresh upload before sending. See
the <a href="__MARMOT_BASE__docs/native-apps.html#file-backed-media-upload">shared upload provenance contract</a>.
The field changes the reference layout, including records embedding it.
Calls block; run them off the UI thread. Strings and request arrays must remain
valid until return. Create one <code>MarmotMediaFileTransferControl</code> per call, query or
cancel it from another thread, and free it only after all calls on the handle
have returned. Results use the existing upload/submission deep-free functions.
No host path is included in published attachment metadata. A source the disk
cannot hold returns <code>MARMOT_STATUS_STORAGE_FULL</code> before any upload.
File-backed calls have no fixed worker-response timeout; per-endpoint network
deadlines still apply. Cancellation observed before message admission starts
prevents publication; admission is not interruptible once started.</p>
<h2 id="account-attachment-history">Account attachment history</h2>
<p><code>marmot_account_attachment_history_page</code> blocks off the UI thread and borrows its query arrays and cursor. Deep-free the result with <code>marmot_account_attachment_page_read_free</code>; its cursor and version are borrowed fields and must not be freed separately. Clone a version baseline with <code>marmot_account_attachment_version_clone</code> when it must outlive a page. Query flags use <code>uint8_t</code>, and arrays are capped at 100 before decoding. See the <a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/ACCOUNT-ATTACHMENT-HISTORY.md">shared contract</a>.</p>
<h2 id="local-sends">Local sends</h2>
<p>The <a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/LOCAL-SENDS.md">local-send contract</a> (0.10.4) adds token-aware
send/reply/draft/upload calls. C calls block until local acceptance (or upload then
acceptance), rather than relay completion. Free their results with
<code>marmot_local_send_acceptance_free</code>, <code>marmot_media_upload_submission_free</code>, or
<code>marmot_local_send_status_free</code>. The nullable timeline <code>client_token</code> is owned by
its row and released by the row's existing deep-free.
Since 0.11.0, <code>marmot_edit_local_message_with_client_token</code> provides
durable revisions of pending text or replies. Each revision needs a new edit token;
the C call returns local acceptance and uses the same status and free functions.</p>
<h2 id="public-event-verification">Public event verification</h2>
<p><code>marmot_verify_public_nostr_event_json</code> is a stateless public-event check: it requires no client, returns a <code>uint8_t</code>
result through a required out-pointer, and returns <code>MARMOT_STATUS_OK</code> with zero
for malformed or invalid cryptographic input. Null/invalid UTF-8 pointers are
argument errors. Callers still enforce their author, kind, tag, and JSON-size
policy. See the <a href="__MARMOT_BASE__docs/native-apps.html#public-nostr-event-verification">shared contract</a>.</p>
<h2 id="host-performance-stages">Host performance stages</h2>
<p><code>marmot_record_host_performance</code> accepts 28 shared and nine Linux-specific host
stages in addition to the existing readiness and visibility milestones. Read these
37 stages by their <code>host_*</code> operation name in
<code>MarmotAppPerformanceSnapshot.runtime_operations</code>. Splash readiness, foreground
readiness and outbound/inbound message visibility remain in <code>host_splash_ready</code>,
<code>host_foreground_local_ready</code>, <code>host_outbound_message_visible</code> and
<code>host_inbound_message_visible</code>, respectively. Free snapshots with <code>marmot_app_performance_snapshot_free</code>. Stage
boundaries are defined in the <a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/docs/marmot-architecture/runtime-latency-telemetry.md#boundaries">runtime telemetry catalog</a>.
See the <a href="__MARMOT_BASE__docs/native-apps.html#localization-privacy-and-diagnostics">diagnostics contract</a>.</p>
<h2 id="markdown-rendering">Markdown rendering</h2>
<p><code>MarmotMarkdownInline::Timestamp</code> carries signed <code>int64_t</code> Unix seconds and a
<code>MarmotMarkdownTimestampStyle</code>, with no allocated display string. The tag follows
<code>NostrUri</code>, preserving existing inline tag values. Style values are <code>ShortTime</code>
(<code>t</code>), <code>LongTime</code> (<code>T</code>), <code>ShortDate</code> (<code>d</code>), <code>LongDate</code> (<code>D</code>), <code>ShortDateTime</code>
(<code>f</code>, the parser default), <code>LongDateTime</code> (<code>F</code>), <code>CompactDateTime</code> (<code>s</code>),
<code>CompactDateTimeSeconds</code> (<code>S</code>), and <code>Relative</code> (<code>R</code>).</p>
<p>Format timestamps at render time using the device locale and time zone. Refresh
labels after locale, time-zone or clock changes and when the app resumes; visible
<code>Relative</code> nodes also need updates as time passes. An absolute-time tooltip or
accessibility label is optional. Timestamp payloads require no separate free;
<code>marmot_markdown_document_free</code> releases the containing tree. See the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-markdown/README.md">shared Markdown contract</a> for host
rendering guidance and <a href="#binary-compatibility">Binary compatibility</a> for adopting
the new union tag.</p>
<p><code>MarmotMarkdownBlock</code> includes a <code>Details</code> tag (bounded <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code> blocks) whose fields live behind
<code>MarmotMarkdownDetails</code>. It was appended without changing existing discriminants or union stride; clients built
against an older header cannot render it.</p>
<h2 id="identity-references-and-pseudonyms">Identity references and pseudonyms</h2>
<p><code>marmot_account_id_hex</code> and <code>marmot_normalize_member_ref</code> accept
<code>nprofile</code> and <code>nostr:nprofile</code> references (plus hex/<code>npub</code>/<code>marmot://profile/</code> forms) and discard relay hints.
Duplicate type-0 TLV entries keep the first key. After wrapper
normalization, encoded tokens longer than 1023 UTF-8 bytes are
rejected; a valid 1023-byte token still decodes when wrapped. The app
helper's legacy NIP-21 parser may still accept a colon-suffixed
<code>nostr:&lt;npub&gt;:</code> form, but C/UniFFI wrapper normalization rejects it.</p>
<p><code>marmot_default_profile_pseudonym</code> hashes the supplied canonical hex account-id text; decode a scanned
reference first. Passing uppercase hex or an undecoded <code>npub</code> silently
produces a different name, not an error. <code>marmot_random_profile_pseudonym</code> is a cosmetic
random roll from the same wordlists. Free those strings with
<code>marmot_string_free</code> and normalized records with <code>marmot_member_ref_free</code>.</p>
<h2 id="keypackage-inventory">KeyPackage inventory</h2>
<p><code>marmot_account_key_packages</code> returns the current KeyPackage winner per
addressable slot plus local-only rows. <code>marmot_account_key_package_relay_events</code>
returns observed relay history from the same validated fetch window, including
superseded events. Free that list with
<code>marmot_account_key_package_relay_event_list_free</code> and the existing list with
<code>marmot_account_key_package_list_free</code>.</p>
<p><code>marmot_local_account_key_packages</code> is the local-first inventory. Call it
immediately, then independently await <code>marmot_refresh_account_key_packages</code> and
replace the displayed snapshot. The local read is synchronous SQLCipher I/O on
the calling thread; do not invoke it on a UI or main thread. A retained package
stays <code>MARMOT_ACCOUNT_KEY_PACKAGE_LOCAL_STATE_RETAINED_PRIVATE_MATERIAL</code> even
when that exact event is observed; <code>relay</code> becomes true while <code>local_state</code>
remains retained. On refresh failure, keep the local result.
Free either list with <code>marmot_account_key_package_inventory_entry_list_free</code>.
Each entry embeds the existing <code>MarmotAccountKeyPackage</code> record plus <code>MarmotAccountKeyPackageLocalState</code>.</p>
<h2 id="invitation-lookup-outcomes">Invitation lookup outcomes</h2>
<p>Creating or inviting reports the first unusable recipient, in request order.
<code>MARMOT_STATUS_MISSING_KEY_PACKAGE</code> means the lookup completed and found nothing
invitable; the detail ends in <code>[obsolete_only]</code> when the recipient must update their
app. <code>MARMOT_STATUS_DIRECTORY_LOOKUP_INCOMPLETE</code> means the lookup ran out of time or
relay coverage and nothing is known to be missing; offer retry. Directory KeyPackage
and relay-list lookups report the same status.</p>
<h2 id="undelivered-welcomes">Undelivered Welcomes</h2>
<p>Use <code>marmot_pending_welcome_deliveries</code> for the <a href="__MARMOT_BASE__docs/native-apps.html#undelivered-welcomes">shared Welcome delivery contract</a>.
It returns an owned <code>MarmotPendingWelcomeDeliveryList</code>; release the whole result with
<code>marmot_pending_welcome_delivery_list_free</code>. In records and the <code>MARMOT_EVENT_WELCOME_DELIVERY_PENDING</code> payload, read
<code>size_class</code> only when <code>has_size_class</code> is true; false means Unknown. The event payload layout changes, so
rebuild against the matching header and library. Each list owns its strings; do not free individual fields.</p>
<h2 id="selected-chat-list-presentation">Selected chat-list presentation</h2>
<p><code>marmot_presented_chat_list</code> and <code>marmot_presented_chat_list_row</code> return complete existing row fields
plus MDK-selected title/avatar descriptors. <code>MarmotPresentedChatRow</code> also embeds <code>preview</code> and <code>actions</code>
(0.10.3; this changed its binary layout). The Draft preview owns its text; the parent row/snapshot free releases it.
Message selection refers to the same row's <code>last_message</code>. See the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/CHAT-LIST-ROWS.md">shared chat-list row contract</a>.</p>
<p><code>marmot_open_presented_chat_list</code> returns an attached handle; take its <code>*_snapshot</code> once, then use <code>*_next</code> for
whole-list replacements. The initial item has sequence zero. A repeated snapshot call returns CLOSED with NULL.
This fallible subscription offers blocking next with timeout and typed storage/preparation errors. It has no callback
pump: hosts drive next on their own worker and decide how to retry errors. Timeouts preserve the refresh obligation.
Free each result with <code>marmot_presented_chat_list_update_free</code> and the handle with
<code>marmot_presented_chat_list_subscription_free</code>. See the <a href="__MARMOT_BASE__docs/native-apps.html#selected-chat-list-presentation">shared native contract</a>
for version ordering, localization, readiness, and account-switch behavior.</p>
<h2 id="chat-screens-and-avatars">Chat screens and avatars</h2>
<p>Live Chats/Unread/Archived/Left windows and independent account attention follow the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/docs/marmot-architecture/further-context/chat-projections-native.md">native handoff contract</a>
for paging, sequence handling, cancellation, C ownership, and compatibility. Prepared conversation windows (history,
header/capabilities, visible identities, read state and revisioned draft descriptors) follow the
<a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/crates/marmot-uniffi/CONVERSATION-WINDOW.md">native conversation contract</a> for opening, paging, cancellation, timeout,
ownership and draft migration.</p>
<p>Avatar screen metadata is mirrored as <code>MarmotAvatarAsset</code>; resolved chat/conversation records carry an optional
avatar metadata pointer. Use <code>marmot_request_avatar_assets</code> for up to 16 visible
opaque targets, <code>marmot_read_avatar_assets</code> for bounded local bytes (at most 16 references / 16 MiB), and
<code>marmot_clear_avatar_cache</code> for explicit local removal. Free returned lists with their matching
<code>marmot_avatar_asset_list_free</code> / <code>marmot_avatar_bytes_list_free</code> functions.</p>
<h2 id="advanced-timeline-search">Advanced timeline search</h2>
<p><code>marmot_timeline_messages</code> takes a borrowed <code>MarmotTimelineMessageQuery</code>. See the
<a href="__MARMOT_BASE__docs/native-apps.html#advanced-timeline-search">shared search contract</a> for filters, ordering, and cursors.
Initialize the entire struct with <code>{0}</code> before setting fields. The search fields have these C types and defaults:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Field</th>
<th scope="col" role="columnheader">C type</th>
<th scope="col" role="columnheader">Unset or default</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Field" role="cell"><code>sender</code></td>
<td data-label="C type" role="cell"><code>const char *</code></td>
<td data-label="Unset or default" role="cell"><code>NULL</code></td>
</tr>
<tr role="row">
<td data-label="Field" role="cell"><code>has_since</code>, <code>since</code></td>
<td data-label="C type" role="cell"><code>uint8_t</code>, <code>uint64_t</code></td>
<td data-label="Unset or default" role="cell"><code>has_since = 0</code></td>
</tr>
<tr role="row">
<td data-label="Field" role="cell"><code>has_until</code>, <code>until</code></td>
<td data-label="C type" role="cell"><code>uint8_t</code>, <code>uint64_t</code></td>
<td data-label="Unset or default" role="cell"><code>has_until = 0</code></td>
</tr>
<tr role="row">
<td data-label="Field" role="cell"><code>attachment_type</code></td>
<td data-label="C type" role="cell"><code>uint32_t</code></td>
<td data-label="Unset or default" role="cell"><code>0</code> (Any)</td>
</tr>
<tr role="row">
<td data-label="Field" role="cell"><code>search_wall_clock</code></td>
<td data-label="C type" role="cell"><code>uint8_t</code></td>
<td data-label="Unset or default" role="cell"><code>0</code> (canonical group order)</td>
</tr>
<tr role="row">
<td data-label="Field" role="cell"><code>cursor_group_id</code></td>
<td data-label="C type" role="cell"><code>const char *</code></td>
<td data-label="Unset or default" role="cell"><code>NULL</code></td>
</tr>
</tbody>
</table>
<p>These fields are appended after <code>limit</code> in the input layout. <code>sender</code> and <code>cursor_group_id</code>
strings are borrowed for the call, like the other query strings. Nonzero flags are true, including
<code>has_since</code> and <code>has_until</code> when their corresponding timestamp is zero. Invalid <code>attachment_type</code> values
outside <code>0..=5</code> return <code>MARMOT_STATUS_INVALID_ARGUMENT</code> before querying the runtime.
Free the returned page with <code>marmot_timeline_page_free</code>; the library does not free query inputs.</p>
<h2 id="nip-46-accounts">NIP-46 accounts</h2>
<p>Keep one <code>MarmotNip46Session</code> per remote-signer account. Local-key accounts use
their normal login path in the same client. C handles wrap the same MDK-owned
session used by Swift and Kotlin, without retained host signer callbacks. See the
<a href="__MARMOT_BASE__docs/native-apps.html#nip-46-accounts">shared session contract</a> for identity,
permission, status, and credential ownership.</p>
<p>NIP-46 sessions use the shared <a href="__MARMOT_BASE__docs/rust-runtime.html#socks5-routing">SOCKS5 routing policy</a>.
Invalid <code>WN_SOCKS5_*</code> configuration makes <code>marmot_nip46_new</code> fail with
<code>MARMOT_STATUS_INVALID_ARGUMENT</code>, without connecting directly. The process policy is frozen at first use;
clearing or correcting the environment afterward does not unblock it.</p>
<ol>
<li>Create an offline handle with <code>marmot_nip46_new</code>. Configuration accepts a bunker
link in <code>uri</code>, or a <code>relays</code> array with an optional <code>name</code> for client pairing.</li>
<li>Call <code>marmot_nip46_review_grants</code>; display its JSON <code>version</code> and <code>grants</code>.
After user consent, pass the exact version and borrowed grant array to
<code>marmot_nip46_approve_grants</code>. Imports, including unversioned descriptors,
need explicit approval too. Review does not approve. For client-initiated
pairing, await <code>marmot_nip46_pairing_offer</code> on a background worker before
displaying its credential-bearing URI. It waits for relay subscription
acknowledgements; <code>marmot_nip46_uri</code> alone does not install the listener.</li>
<li>Run <code>marmot_nip46_connect</code> on a background worker while the pairing UI is
visible. Bunker links can connect directly. It verifies <code>get_public_key</code>
and adopts policy-checked <code>switch_relays</code> results for this signer transport
only. Messaging relays are unchanged. An unsupported-method error leaves the
previous signer relays in place; other errors fail connection.</li>
<li>After <code>marmot_nip46_connect</code> succeeds, call <code>marmot_nip46_login</code> off the UI
thread to create or reopen the external account. Login requires an already-verified
<code>Ready</code> session; otherwise it rejects without connecting, discovering relays, or
creating an account. It signs real MLS identity proofs and KeyPackages through the signer.
Supply default messaging relays for lists the account has not published. Set
<code>inbox_relays</code> separately, or pass <code>NULL, 0</code> to use the defaults for both lists. Login
publishes those defaults only for lists that discovery confirms absent. An
incomplete directory read fails login with a retryable error instead of
overwriting lists it could not see. Signed lists, including explicit-empty
declarations, are kept.</li>
<li>MDK persists verified signer credentials through the configured secret store.
On restart, call <code>marmot_client_start</code>, then <code>marmot_nip46_resume</code> to obtain an
account handle. Local startup restores credentials before activating workers;
a missing account-identity proof can require bounded remote signing.
No descriptor or host callback is needed.
<code>marmot_nip46_export</code> remains an optional encrypted-vault backup. To import one,
use new/review/approve/connect/register. Remove an existing owned session with
<code>marmot_nip46_remove</code> before attaching a different one to the same account.</li>
</ol>
<p>Poll <code>marmot_nip46_state</code> for compatibility JSON fields <code>state</code>, <code>detail</code>, and
<code>auth_url</code>, plus typed <code>last_error</code>, <code>request_id</code>, and <code>generation</code>. Existing state
strings remain; <code>permission_approval</code>, <code>listening</code>, <code>disconnected</code>, and <code>reconnecting</code> describe
additional lifecycle states.
<code>marmot_nip46_status</code> returns a typed <code>MarmotNip46Status</code> with the full
<code>MarmotNip46State</code>/<code>MarmotNip46Error</code> vocabulary. Only read <code>last_error</code> when
<code>has_last_error</code> is true; auth URL and request ID strings are nullable. Release the
whole record with <code>marmot_nip46_status_free</code>, never its embedded strings separately.
An approval URL is an intermediate response, not failure or completion. Show
pending work until the final response; let the user review the URL before opening
it. Pass its matching request ID to <code>marmot_nip46_complete_auth</code>; this acknowledges
the challenge but does not complete the RPC. <code>marmot_nip46_cancel_request</code> cancels
only the named pending request. Stale IDs return <code>MARMOT_STATUS_INVALID_ARGUMENT</code>.
RPC requests have a 90-second budget; MDK account setup can time out sooner.</p>
<p>Login/register adoption follows the shared runtime-owned contract: once admitted,
loss of the waiter does not cancel adoption. Pairing is a separate bounded,
caller-cancellable connect call and makes no account changes while unbound. Cancel
and discard abandoned pairing UI; call adoption explicitly only after verification
succeeds. Account signout does not cancel unrelated unbound sessions. Use explicit session cancellation, disconnect, or logout
to interrupt; client shutdown interrupts and settles owned adoption before returning.
An explicit reconnect cannot resume adoption retired by an earlier disconnect.
Rollback does not reset newer-generation transport state or cancel its pending requests.
This does not permit freeing a handle during an active C call.</p>
<p><code>marmot_nip46_ping</code> checks the remote signer; <code>marmot_nip46_disconnect</code> interrupts
transport work but permits explicit reconnection. <code>marmot_nip46_cancel</code> permanently
interrupts the shared session, including its account signer and other handles,
without removing its persisted credentials or saved export.
<code>marmot_nip46_free</code> releases only the C handle. Attached sessions remain owned by
MDK, so freeing a login or resumed handle does not stop account signing or other
handles. An unbound session stops when its final owner drops. Join every borrower
before freeing a handle, and free all handles before their creating client.
MDK account signout removes its owned signer credentials and leaves attached
handles logged out; remove any optional host vault export too.
<code>marmot_nip46_logout</code> is direct session revocation, not account signout. Its
five-second courtesy request clears local client keys even without acknowledgement.
If vault deletion fails, signing remains stopped and cleanup can be retried with
logout or <code>marmot_nip46_remove</code> after the vault recovers.
After account signout it reports an already logged-out session rather than sending
another remote request. Do not free a handle while calls are in flight. Returned
strings use <code>marmot_string_free</code>.</p>
<p>New-account publication retries retain pairing credentials across restart;
a post-commit journal cleanup error does not revoke the ready account.
Completed-account rebinds do not reopen setup, including when adoption fails.
An unavailable signer can still stop the account's worker.</p>
<p>The loopback example exercises the C ABI with real NIP-44 websocket traffic,
distinct user/bunker/client keys, mixed accounts, approvals and logout:</p>
<pre><code class="language-sh">cargo run --release -p marmot-c --example nip46_smoke
</code></pre>
<h2 id="linked-devices">Linked devices</h2>
<p>See the <a href="__MARMOT_BASE__docs/native-apps.html#linked-devices">shared linked-device guidance</a> for invitation decisions,
compatibility and retained-state limits.</p>
<p><code>marmot_linked_devices</code> blocks on the account worker, reads local group state only, and writes an owned
<code>MarmotLinkedDeviceList</code>; free it with <code>marmot_linked_device_list_free</code>. Each <code>MarmotLinkedDevice</code> has its
<code>slot_id_hex</code> handle, <code>is_this_device</code>, <code>label</code>, <code>client</code> and <code>platform</code> (empty until set), <code>linked_at</code>, a
<code>linked_by_slot_id_hex</code> that is NULL for the founder, a <code>MarmotLinkedDeviceStatus</code> and three setting flags. The list
is empty in ordinary opens without explicit experimental device-group intent, and until this device trusts a device group. Re-read it on <code>MARMOT_EVENT_LINKED_DEVICES_CHANGED</code>.
<code>marmot_rename_linked_device</code> blocks on the account worker and renames one device by its <code>slot_id_hex</code> with one roster
commit; an empty label clears it.</p>
<p><code>marmot_update_linked_device_settings</code> blocks on the account worker and patches any linked device's settings.
Each <code>has_&lt;setting&gt;</code>/<code>&lt;setting&gt;</code> pair uses <code>uint8_t</code>: zero presence leaves the setting unchanged; nonzero presence
supplies a value, with zero false and nonzero true. No structs or returned allocations are involved. Re-read the
list on <code>MARMOT_EVENT_LINKED_DEVICES_CHANGED</code>; see the <a href="__MARMOT_BASE__docs/native-apps.html#linked-devices">shared settings and recovery contract</a>.</p>
<p><code>MarmotDeviceLinkSnapshot.moves</code> owns its move views, sibling labels and overridden-slot strings; its existing
<code>marmot_device_link_snapshot_free</code> releases them all. <code>marmot_dismiss_device_group_move_sibling</code> blocks on the account
worker and returns another owned snapshot. Treat <code>move_id</code> as opaque. The status enum appends <code>MARMOT_LINKED_DEVICE_STATUS_MOVED</code>.
See the <a href="__MARMOT_BASE__docs/native-apps.html#moving-this-device-to-another-device-group">shared move guidance</a>.
<code>marmot_reset_device_group_for_repair</code> is the explicit local reset action; free its returned snapshot with
<code>marmot_device_link_snapshot_free</code>. Offer it when <code>MarmotDeviceLinkSnapshot.device_group_stalled</code> is set (rebuild
against the matching header/library: the field is appended). Follow the <a href="__MARMOT_BASE__docs/native-apps.html#explicit-local-device-group-reset-before-fresh-pairing">shared reset and admission limits</a>.
The additive <code>MarmotUnrecognizedSignIn.previously_linked_here</code> is qualified local context; rebuild against the matching
header/library. See <a href="__MARMOT_BASE__docs/native-apps.html#unrecognized-sign-ins">shared sign-in guidance</a>.</p>
<p><code>marmot_chat_history_imports</code> blocks on the account worker and writes an owned <code>MarmotChatHistoryImportList</code>; free it
with <code>marmot_chat_history_import_list_free</code>. Each entry's tagged <code>state</code> is <code>Receiving</code> or <code>Imported</code>. Imported
<code>MarmotTimelineMessageRecord</code>s name their source in the nullable <code>imported_from</code>. Re-read on
<code>MARMOT_EVENT_CHAT_HISTORY_IMPORTS_CHANGED</code>.</p>
<p>When another of the account's devices removes this one, <code>MARMOT_EVENT_DEVICE_UNLINKED</code> fires once and the account
stops on this device: <code>MarmotAccountSummary.unlinked</code> and <code>signed_out</code> stay set, and <code>marmot_sign_in_account</code> returns
<code>MARMOT_STATUS_ACCOUNT_UNLINKED</code>. <code>marmot_sign_out_and_wipe</code> skips leaving its chats and deleting its slot. See the
<a href="__MARMOT_BASE__docs/native-apps.html#this-device-unlinked">shared contract</a>.</p>
<p>With a linked device that is not signing out too, <code>marmot_sign_out_and_wipe</code> first asks the account's other devices
to take this one out, which can block for about 30 seconds, and leaves them the chats they can.
<code>MarmotWipeOutcome.groups_left_to_siblings</code> counts those chats, and <code>siblings_not_reached</code> says it could not ask
them in time, so it tried to leave every chat itself, reporting any it could not in <code>group_leave_failures</code>; tell the
user. In a chat the account administers with another account, it steps the account down first and can block about
30 seconds more for its removal. See the
<a href="__MARMOT_BASE__docs/native-apps.html#signing-out-with-linked-devices">shared contract</a>.</p>
<p><code>marmot_key_package_refresh_overdue</code> blocks on the account worker, reads local state only, and writes whether this
device's device group has held its KeyPackage refresh back for a week. Re-read it on
<code>MARMOT_EVENT_KEY_PACKAGE_REFRESH_OVERDUE_CHANGED</code>. See the
<a href="__MARMOT_BASE__docs/native-apps.html#overdue-keypackage-refresh">shared contract</a>.</p>
<h2 id="unrecognized-sign-ins">Unrecognized sign-ins</h2>
<p><code>marmot_unrecognized_sign_ins</code> blocks on the account worker, reads local state only, and writes an owned
<code>MarmotUnrecognizedSignInList</code>; free it with <code>marmot_unrecognized_sign_in_list_free</code>. <code>marmot_check_sign_ins</code> checks
the account's slots now, over the network, and writes the list after the check. Each <code>MarmotUnrecognizedSignIn</code> has
its <code>slot_id_hex</code> handle, <code>client</code> (empty when none), <code>appeared_at</code>, <code>last_seen_at</code>, <code>before_this_device</code>,
<code>signed_in</code>, a <code>MarmotUnrecognizedSignInState</code>, and a <code>linked_by_slot_id_hex</code> set only for <code>LinkedElsewhere</code>.
<code>marmot_answer_sign_in</code> takes a <code>MarmotSignInResponse</code> discriminant as <code>uint32_t</code>; an out-of-range value is
<code>MARMOT_STATUS_INVALID_ARGUMENT</code>. The list is empty in ordinary opens without explicit experimental intent. Re-read it on
<code>MARMOT_EVENT_UNRECOGNIZED_SIGN_INS_CHANGED</code>. See the <a href="__MARMOT_BASE__docs/native-apps.html#unrecognized-sign-ins">shared contract</a>.</p>
<p><code>marmot_start_fresh</code> answers every sign-in from before this device Not now, now and when one is listed later, without
rejecting any, and <code>marmot_started_fresh</code> writes whether the device did so and still has no device group; re-read it
on <code>MARMOT_EVENT_LINKED_DEVICES_CHANGED</code>.</p>
<h2 id="compromise-warning">Compromise warning</h2>
<p><code>marmot_compromise_warning</code> blocks on the account worker, reads local state only, and writes the account's open
compromise warning on this device as an owned <code>MarmotCompromiseWarningItemList</code>; free it with
<code>marmot_compromise_warning_item_list_free</code>. An empty list means no warning is open. Each <code>MarmotCompromiseWarningItem</code>
has its <code>reason</code>, the <code>slot_id_hex</code> the item names, a <code>key_package_ref_hex</code> set only for
<code>MARMOT_COMPROMISE_WARNING_REASON_FOREIGN_OWN_SLOT_KEY_PACKAGE</code>, and <code>occurred_at</code>. <code>reason</code> is a
<code>MarmotCompromiseWarningReason</code> discriminant carried as <code>uint32_t</code>: later releases add values, so show one the host
does not know as a generic reason. <code>marmot_dismiss_compromise_warning</code> closes the warning on this device only. Re-read
it on <code>MARMOT_EVENT_COMPROMISE_WARNING_CHANGED</code>. It is empty in ordinary opens without explicit experimental intent. See
the <a href="__MARMOT_BASE__docs/native-apps.html#compromise-warning">shared contract</a>.</p>
<h2 id="linking-a-new-device">Linking a new device</h2>
<p><code>marmot_start_device_link</code>, <code>marmot_confirm_device_link_match</code> and <code>marmot_cancel_device_link</code> (on the new device),
<code>marmot_link_device</code> and <code>marmot_decline_device_link</code> (on a device already signed in) and
<code>marmot_device_link_snapshot</code> each block on the account worker and write an owned <code>MarmotDeviceLinkSnapshot</code>; free it
with <code>marmot_device_link_snapshot_free</code>. <code>new_device</code> is NULL unless this device asked to be linked. Both
<code>MarmotNewDeviceLinkState</code> and each prompt's <code>MarmotDeviceLinkPromptState</code> are tagged unions: <code>Comparing</code> carries
<code>code</code>/<code>code_len</code> emoji with screen-reader descriptions, <code>CannotLink</code> carries <code>missing</code>/<code>missing_len</code>, and
<code>AddedElsewhere</code> carries both labels. <code>marmot_link_device</code> takes the label and two <code>uint8_t</code> setting flags. Every call
requires the explicit experimental build and constructor described above. Re-read on
<code>MARMOT_EVENT_DEVICE_LINK_CHANGED</code>. See the <a href="__MARMOT_BASE__docs/native-apps.html#linking-a-new-device">shared contract</a>.</p>
<h2 id="history-may-be-incomplete-notices">History may be incomplete notices</h2>
<p><code>marmot_history_notices</code> blocks on the account worker, reads local durable state only, and writes an owned
<code>MarmotHistoryNoticeList</code>; free it with <code>marmot_history_notice_list_free</code>. Each <code>MarmotHistoryNotice</code> has an
opaque <code>notice_id</code>, a <code>MarmotHistoryNoticeCause</code>, a <code>group_id_hex</code> that is NULL for an account-wide occurrence,
and <code>has_parked_at_ms</code>/<code>parked_at_ms</code>. <code>marmot_dismiss_history_notice</code> writes <code>true</code> when it durably retired
that occurrence and <code>false</code> for a stale id; a malformed id returns <code>MARMOT_STATUS_INVALID_HEX</code>. Re-read the list
on <code>MARMOT_EVENT_HISTORY_NOTICES_CHANGED</code>; a group's own occurrences also set
<code>MarmotGroupRecoveryStatus.history_may_be_incomplete</code> and fill its <code>history_notice_ids</code> array, released by
<code>marmot_group_recovery_status_free</code>. See the
<a href="__MARMOT_BASE__docs/native-apps.html#history-may-be-incomplete-notices">shared contract</a> for when notices appear,
disappear and return.
<code>marmot_account_recovery_status</code> writes an owned <code>MarmotAccountRecoveryStatus</code>: the groups still catching up
(<code>catching_up_group_ids_hex</code>/<code>catching_up_group_ids_hex_len</code>), <code>inbox_catching_up</code>, and every notice
(<code>notices</code>/<code>notices_len</code>); free it with <code>marmot_account_recovery_status_free</code> and re-read it on
<code>MARMOT_EVENT_RECOVERY_STATUS_CHANGED</code>. The recovery runner supplies the catching-up fields.
Current epoch-gap exhaustion emits <code>MARMOT_HISTORY_NOTICE_CAUSE_EPOCH_GAP</code>; coverage-ledger parks emit
<code>MARMOT_HISTORY_NOTICE_CAUSE_UNPROVEN_HISTORY</code>; a rejoin emits one <code>MARMOT_HISTORY_NOTICE_CAUSE_BEFORE_REJOIN</code> per
new copy of the group. Other cause labels preserve compatibility.
Group changes for a group whose unresolved epoch-gap recovery covers its current local epoch
return <code>MARMOT_STATUS_GROUP_CATCHING_UP</code>. Retry after it syncs, or, once the user accepts that
the change may split the group, call <code>marmot_acknowledge_group_catching_up</code> and retry. See the
<a href="__MARMOT_BASE__docs/native-apps.html#history-may-be-incomplete-notices">shared contract</a>.
Group changes can return <code>MARMOT_STATUS_GROUP_COMMIT_UNDELIVERED</code> when the group's last change
has not reached every group relay; <code>marmot_group_commit_delivery</code> reports the owed relays
immediately (free with <code>marmot_group_commit_delivery_free</code>), and
<code>marmot_acknowledge_group_commit_undelivered</code> lets one change through. See the
<a href="__MARMOT_BASE__docs/native-apps.html#history-may-be-incomplete-notices">shared contract</a> for when the
status is returned.</p>
<p>Automatic Unrecoverable rejoin runs inside the account workers; C hosts keep their existing group-state
subscriptions. See the <a href="https://github.com/marmot-protocol/mdk/blob/a2e0558a634bbd20607cdd5afb93abc6220ee58d/docs/marmot-architecture/invitation-recovery.md#automatic-rejoin-of-an-unrecoverable-copy">shared automatic rejoin contract</a>
for authorization, history retention and availability requirements.</p>
<h2 id="blocked-leaves">Blocked leaves</h2>
<p>When <code>leave_blocked</code> is set on <code>MarmotAppGroupRecord</code>, <code>MarmotChatListRow</code> or <code>MarmotGroupManagementState</code>, the
account is the chat's last active admin and the leave cannot finish. While <code>can_cancel_leave</code> is true, offer Cancel
and call <code>marmot_cancel_leave</code>; it allocates nothing, applies to this device only, and returns
<code>MARMOT_STATUS_LEAVE_NOT_BLOCKED</code> in any other state. See the
<a href="__MARMOT_BASE__docs/native-apps.html#linked-devices">shared leave contract</a>.</p>
<h2 id="group-reporting">Group reporting</h2>
<p>The C ABI mirrors the <a href="__MARMOT_BASE__docs/native-apps.html#group-reporting">shared reporting operations</a>. Pages are capped at
100 and cursors are exclusive. Deep-free returned pages with <code>marmot_content_report_page_free</code> or
<code>marmot_report_dismissal_page_free</code>; the reported message uses the ordinary timeline record and its free function.</p>
<h2 id="turning-on-account-devices">Turning on account devices</h2>
<p>The C ABI mirrors the <a href="__MARMOT_BASE__docs/native-apps.html#turning-on-account-devices">shared flow</a>. Call
<code>marmot_account_devices_activation</code> and offer <code>marmot_enable_account_devices</code> only on
<code>MARMOT_ACCOUNT_DEVICES_ACTIVATION_ELIGIBLE</code>. A refused activation returns
<code>MARMOT_STATUS_ACCOUNT_DEVICES_ACTIVATION_REFUSED</code>; the last-error detail names the aggregate reason.</p>
<h2 id="host-driven-agent-publishing">Host-driven agent publishing</h2>
<p><code>marmot_agent_publisher_new</code> anchors a stream and returns an opaque handle.
Pass a QUIC candidate and broker trust options; cryptographic keys and
transcript framing stay inside MDK. Append text, status, or progress using
<code>marmot_agent_publisher_append</code>. Its receipt reports accepted record count
and any preview transport failure; transport loss preserves the transcript.</p>
<p><code>marmot_agent_publisher_finish</code> seals the transcript and sends the durable
final message. Inspect the returned send disposition for delivery state.
If sending fails, call finish again on the same handle; the sealed request
is retained. After success, repeated finish returns the original receipt.
Appends after sealing fail. These guarantees last for the handle's lifetime;
publisher state is not restored after a process restart.</p>
<p>Cancel or free a handle to stop its preview. A finish already in progress
wins over cancellation. Free every publisher before its client, and never
free a handle concurrently with another call using it. Free info, append
receipts, and send receipts with their matching generated free functions.</p>
<h2 id="audit-v5-recording-and-delivery">Audit v5 recording and delivery</h2>
<p>v5 replaces v4 as the audit format. Recording remains opt-in through <code>MarmotAuditLogSettings</code>,
and new recordings write only v5 JSONL files. Hosts that record audit logs must configure v5
delivery, or new evidence never leaves the device. Call <code>marmot_set_audit_otlp_config_v5</code> with a
dedicated OTLP <code>/v1/logs</code> destination and bearer token on every launch, because it is held in
memory only. Then call <code>marmot_post_audit_log_tracker_update_v5</code>, in place of the v4 tracker
update, for a manual pass. The returned config redacts the token; free it with
<code>marmot_audit_otlp_config_v5_free</code>.
Free the versioned result with <code>marmot_audit_log_tracker_update_result_v5_free</code>. It reports v5
accepted, pending, blocked, and idle counts independently of v4 whole-file uploads. The existing
tracker activity triggers use the same in-memory v5 config with their batching and retry policy.
Set <code>enabled</code> to false to clear the destination. Loopback requires the explicit
<code>allow_loopback_dev</code> flag, while public destinations require HTTPS. v4 files written before
0.11.0 remain available to drain through the legacy endpoint; v5 bytes never go there.</p>
<p><code>marmot_audit_delivery_status_v5</code> returns a <code>MarmotAuditDeliveryStatusV5List</code> with one row per
account; free it with <code>marmot_audit_delivery_status_v5_list_free</code>, which also frees each row's
nullable <code>last_failure</code> and <code>backlog</code>. <code>has_http_status</code> tells whether the receiver answered. The
fields and the pause/retry semantics match the
<a href="__MARMOT_BASE__docs/native-apps.html#audit-v5-recording-and-delivery">shared description</a>.</p>
<p>Local audit retention (maximum age and per-account size budget, shared with the Swift and Kotlin
bindings in <a href="__MARMOT_BASE__docs/native-apps.html#audit-v5-recording-and-delivery"><code>marmot-uniffi/README.md</code></a>)
is read with <code>marmot_audit_log_retention</code> and replaced with <code>marmot_set_audit_log_retention</code>,
which takes a borrowed <code>MarmotAuditLogRetention</code> and returns the clamped stored value. Free both
results with <code>marmot_audit_log_retention_free</code>.</p>
<h2 id="legacy-audit-v4-upload">Legacy audit v4 upload</h2>
<p>Use <code>MarmotAuditLogTrackerConfigV4</code> and <code>marmot_set_audit_log_tracker_config_v4</code> to supply optional
system <code>hardware_model</code>, platform and app version. Free its returned config with
<code>marmot_audit_log_tracker_config_v4_free</code>. Never pass a device name, hostname or serial number as the model.
The legacy config/setter retains its binary layout, ignores <code>device_label</code>, and returns that field as NULL;
it never reinterprets an old device name as a hardware model. Both setters use the same v4-only upload gate.</p>
<h2 id="backup-recovery">Backup recovery</h2>
<p>See <a href="__MARMOT_BASE__docs/native-apps.html#backup-recovery-and-background-conditions">backup recovery and background conditions</a>
for the shared setup, current-membership restore, background eligibility and secret-handling contract. The C functions
use the same names with the <code>marmot_</code> prefix and snake case; Wi-Fi and charging inputs are <code>uint8_t</code> booleans.
All operations block according to the usual ABI rules.</p>
<p><code>marmot_set_runtime_backup_background_conditions</code> reports once for the runtime and starts no worker. The
account-shaped function remains a validating compatibility wrapper. <code>marmot_run_due_backup_pass</code> blocks through one
current/newly admitted due pass and writes <code>MarmotBackgroundBackupOutcome</code> by value; no allocation or free is needed.
<code>FinishedAttempt</code> is settlement-attempt completion, not publication success. Use the call off the host UI thread;
if the OS opportunity ends, stopping the worker/runtime from another thread ends the wait with
<code>MARMOT_STATUS_TRANSPORT_CLOSED</code>. New exports need the matching generated header/library; existing parameter layouts
are unchanged.</p>
<p>Free recovery-word output with <code>marmot_recovery_words_free</code> after clearing displayed and caller-owned copies.
The free erases MDK's returned word buffers before releasing their C allocations. It does not erase host copies
or earlier managed/FFI copies.
Confirmation answers and restore phrases are borrowed inputs. Keep them valid for the call, then clear the host's
buffers; MDK never retains the caller's pointer. Do not print words or entire recovery output records.</p>
<p><code>marmot_watch_backup_restore</code> returns an observer handle. Its snapshot is available once; subsequent <code>next</code> calls use
the standard timeout/closed statuses or callback interface. Freeing or clearing this observer never cancels the
operation: call <code>marmot_cancel_backup_restore</code> with its exact account-scoped operation token. Snapshot and <code>next</code>
outputs are owned and must be freed; callback output is borrowed for the callback's duration. Free status and
availability-list outputs with their matching generated free functions.</p>
<p><code>MarmotTimelineMessageRecord.history_import_provenance</code> is a nullable tagged union. Device and Backup payloads are
embedded allocations released by the timeline record's deep-free; do not free them separately. Preserve the legacy
sibling-only <code>imported_from</code> field when supporting older rendering paths. The additional timeline field changes its
layout, including records that embed it.</p>
<h2 id="smoke-test-and-example">Smoke test and example</h2>
<p><code>examples/smoke.c</code> is a worked example covering lifecycle, Markdown
tagged-union walking, offline reads, the error taxonomy, and best-effort
identity creation. <code>./crates/marmot-c/c-smoke.sh</code> (or <code>just c-smoke</code>) builds and runs it
against both linkage models (valgrind when available). Pass <code>--debug</code> first
to reuse debug/test-profile dependencies for a faster local or PR smoke run;
release and scheduled validation use the default release build.</p>
<p>On macOS both build scripts pin release <code>strip=none</code>, matching MarmotKit's Apple policy: Rust's
debug-stripping path can emit a misaligned Mach-O string table that Xcode 27
rejects. Optimization remains enabled; Linux packaging is unchanged. Revisit the
pin after a Rust toolchain upgrade incorporating
<a href="https://github.com/rust-lang/rust/pull/158410">rust-lang/rust#158410</a>, and remove it
only after the default optimized shared/static smoke passes without the override.
The C CI workflows run on Linux; the Darwin branch has local smoke
evidence only. Changing <code>strip</code> changes Cargo's release-profile fingerprint, so
alternating these scripts with an unpinned <code>cargo build --release</code> can rebuild
release dependencies.</p>
<p>On OpenBSD <code>c-bindings.sh</code> builds SQLCipher with <code>OMIT_MEMLOCK</code> and routes its
<code>malloc</code>/<code>calloc</code> to <code>malloc_conceal</code>/<code>calloc_conceal</code>, so a host can run under
<code>pledge(2)</code>, which forbids <code>mlock</code>. Concealed pages stay out of core dumps and
are wiped on free, but are not pinned in RAM: swap protection follows the
host's swap encryption. Flags already in <code>LIBSQLITE3_FLAGS</code> are kept.</p>
<h2 id="regenerating-the-header">Regenerating the header</h2>
<pre><code class="language-sh">just c-header
</code></pre>
<p>The mirror surface is macro-generated, so header generation runs cbindgen
with macro expansion (<code>RUSTC_BOOTSTRAP=1</code> on the stable toolchain). CI
diff-gates the checked-in header.</p>
`,u={__name:"c-interface.html",setup(p){return(m,t)=>{const n=i("DocumentationPage");return c(),a("div",null,[t[0]||(t[0]=o("h1",{id:"c-and-native-hosts",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#c-and-native-hosts"},[o("span",null,"C and native hosts")])],-1)),r(n,{document:{repo:e(d),version:e(s),sourceUrl:e(l),html:e(h)}},null,8,["document"])])}}},g=JSON.parse('{"path":"/docs/c-interface.html","title":"C and native hosts","lang":"en-US","frontmatter":{"title":"C and native hosts","description":"C and native hosts — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/c-interface.md"}');export{u as comp,g as data};
