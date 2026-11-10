import{c as a,b as t,d as n,u as e,r as i,o as s}from"./app-C1yp260q.js";const l="marmot-ts",c="0.9.0",d="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/storage.md",p=`<div id="storage" class="mm-source-title">Storage</div>
<p>Marmot persists its data through pluggable key/value stores: serialized MLS <strong>group state</strong>, local <strong>key package</strong> material, received <strong>invites</strong>, and the durable records behind ingest replay protection, fork recovery, removal, and disband. All of them share one interface, so any backend that matches its shape works — in-memory for tests, IndexedDB or LocalForage in the browser, the filesystem or SQLite on the server.</p>
<h2 id="the-generickeyvaluestore-interface">The <code>GenericKeyValueStore</code> interface</h2>
<pre><code class="language-typescript">interface GenericKeyValueStore&lt;T&gt; {
  getItem(key: string): Promise&lt;T | null&gt;;
  setItem(key: string, value: T): Promise&lt;T&gt;;
  removeItem(key: string): Promise&lt;void&gt;;
  clear(): Promise&lt;void&gt;;
  keys(): Promise&lt;string[]&gt;;
}
</code></pre>
<p>The interface is exported from both the root and the <code>./utils</code> subpath:</p>
<pre><code class="language-typescript">import type { GenericKeyValueStore } from &quot;@internet-privacy/marmot-ts&quot;;
</code></pre>
<h2 id="all-stores">All stores</h2>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Constructor option</th>
<th scope="col" role="columnheader">Value type</th>
<th scope="col" role="columnheader">Holds</th>
<th scope="col" role="columnheader">If omitted</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Constructor option" role="cell"><code>groupStateStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;SerializedClientState&gt;</code></td>
<td data-label="Holds" role="cell">Serialized MLS group state (one entry per group)</td>
<td data-label="If omitted" role="cell">Required</td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>keyPackageStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;StoredKeyPackage&gt;</code></td>
<td data-label="Holds" role="cell">Local key package public + private material and publish tracking</td>
<td data-label="If omitted" role="cell">Required</td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>inviteStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;StoredInviteEntry&gt;</code></td>
<td data-label="Holds" role="cell">Received gift wraps and decrypted Welcome rumors</td>
<td data-label="If omitted" role="cell">In-memory</td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>ingestStateStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;Uint8Array&gt;</code></td>
<td data-label="Holds" role="cell">Terminal-wrapper and convergence-effect evidence (replay suppression, acknowledged state invalidations)</td>
<td data-label="If omitted" role="cell">In-memory; <code>client.ingestPersistence</code> reports <code>{ kind: &quot;ephemeral&quot; }</code></td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>rewindStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;Uint8Array&gt;</code></td>
<td data-label="Holds" role="cell">The per-group <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/fork-history.md">fork-history tree</a> used for fork recovery</td>
<td data-label="If omitted" role="cell">In-memory; rebuilt from the current tip after a restart</td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>removedMarkerStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;boolean&gt;</code></td>
<td data-label="Holds" role="cell">Consumed removal-notification attempt and removed-membership fence</td>
<td data-label="If omitted" role="cell">Per-instance in-memory realization</td>
</tr>
<tr role="row">
<td data-label="Constructor option" role="cell"><code>lifecycleStore</code></td>
<td data-label="Value type" role="cell"><code>GenericKeyValueStore&lt;Uint8Array&gt;</code></td>
<td data-label="Holds" role="cell">Disband and lifecycle intent and terminal records</td>
<td data-label="If omitted" role="cell">Stored in <code>groupStateStore</code> under scoped keys</td>
</tr>
</tbody>
</table>
<p>The spec requires replay evidence, fork-recovery state, and terminal records to survive a restart (<a href="https://github.com/marmot-protocol/marmot/blob/master/protocol-core/durability.md"><code>protocol-core/durability.md</code></a>). For production, back <code>ingestStateStore</code>, <code>rewindStore</code>, and <code>removedMarkerStore</code> with the same durable (ideally encrypted) storage as <code>groupStateStore</code>, and check <code>client.ingestPersistence.kind === &quot;durable&quot;</code> at startup.</p>
<p><code>ingestPersistence</code> reports ingestion evidence configuration; it does not certify the durability of every adapter. The default <code>lifecycleStore</code> uses the group-state backend. Direct <code>MarmotGroup</code> / <code>GroupSession</code> construction can omit lifecycle storage; internal disband selection still fences that instance, but <code>session.persistSelectedDisband()</code> requires a lifecycle store and throws without one.</p>
<h2 id="durable-adapter-requirements">Durable adapter requirements</h2>
<p>For restart guarantees, each successful <code>setItem</code> must durably replace the complete value at that key, and each successful <code>removeItem</code> must durably remove it. Reads must observe completed writes; <code>keys()</code> must expose the stored keys. Preserve <code>Uint8Array</code> values exactly. Serialize competing read/modify/write operations in your adapter when they share a backing database or file; the minimal file example below does not provide that coordination or atomic file replacement.</p>
<p>An adapter can throw before writing or after forwarding a successful write. Lifecycle and retention repair tolerate both cases by repeating ordered operations; an error alone does not establish whether the write reached storage. These stores do not provide a cross-store transaction, compare-and-swap, or locking primitive. Configure all lifecycle and recovery stores durably, and retain them together across restarts. The library fences admissions within its owned engine/session during retention; applications must coordinate separate instances, processes or adapters that write the same group. Sharing a database does not supply that coordination automatically.</p>
<h3 id="retention-checkpoint-and-restart-repair">Retention checkpoint and restart repair</h3>
<p>Finite retention runs only after convergence genuinely settles. An active pass,
undrained <code>ingest()</code> generator, staged publication, running callback or unresolved
dependency postpones destructive work. Drain each ingestion batch before starting
another. Ordinary persistence may still complete while work is unsettled; a later
settled save can checkpoint. Scheduled convergence gets one automatic retention
followup after callback admission releases. A storage failure is reported through
the existing history-error path and waits for a later retry, rather than looping.</p>
<p>The session captures exact pending publication, recovery, retraction, same-rumor
support, state-effect and receiver dependencies under an engine admission fence.
The durable order is:</p>
<ol>
<li>Flush required history bytes and wait for admitted history adapter writes.</li>
<li>Save the live canonical ratchet projection and complete retained delivery,
wrapper and effect evidence projections.</li>
<li>Publish one complete version-2 tree checkpoint: authoritative node membership,
logical root, original boundary provenance, receiver allowlists, temporary
copied snapshot projections and exact garbage-key inventory.</li>
<li>Materialize those copied projections, delete only inventoried obsolete edge,
state and Commit keys, then durably clear the cleanup inventories.</li>
</ol>
<p>Until step 3 succeeds, the previous tree remains recoverable; earlier canonical
or evidence writes do not authorize deleting its material. After step 3, complete
checkpoint membership is the topology authority. Excluded physical keys cannot
resurrect branches. Copied projections remain in that authority until ordinary
snapshot keys are repaired, so interruption during a later receiver rewrite is
also restartable. A reject-after-forward checkpoint error adopts only the
validated exact authority actually stored and still reports the write failure.</p>
<p>Loading validates membership, connectivity, epochs, snapshot identity, required
Commit bytes/digests, receiver allowlists and boundary provenance. It resumes
materialization, exact-key deletion and acknowledgement before constructing or
activating a group. Failed repair rejects loading; missing/corrupt required
version-2 history or a canonical tip absent from its membership never silently
resets to a tip-only tree. Absent history is optional only when there are no exact
owned history keys. For backward compatibility, a readable <strong>version-1</strong> tree
whose tip no longer matches the saved canonical state retains its legacy
tip-only fallback; this exception does not apply to committed version-2 authority.</p>
<p>Adapters must atomically replace a <strong>single complete value</strong>, preserve bytes, and
settle promises according to actual completion. They need no new transactional
API. Ordered writes and repeated cleanup support failures both before and after
forwarding; they do not make application side effects atomic with storage. See
<a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/fork-history.md">Fork History</a> for inclusive windows, exact pins, temporary
growth and the reviewed MDK transaction difference.</p>
<h3 id="upgrading-existing-stores">Upgrading existing stores</h3>
<p>Use the updated loader for every reader of a group before allowing it to write
new checkpoints. Tree metadata version 1 remains readable; successful retention
checkpointing writes version 2. Once that authority is stored, an older loader
cannot safely resume the group. Keep the saved group state, rewind, ingestion,
lifecycle and removal-marker stores together; no application key rename or
store clearing is required.</p>
<p>Wrapper records now write version 4 and read legacy records; effect records write
version 3 and read version 2. Delivered evidence retains version 1 with stricter
coordinate validation. Legacy terminal wrappers without authenticated source
coordinates get an explicitly local <code>completedAtEpoch</code> once, and retire below the
finite floor on a later checkpoint; migration does not invent an old
authenticated epoch.</p>
<p>Let the updated loader finish any checkpoint materialization and exact-key
cleanup before resuming group operations. Preserve failed-repair data for a later
retry and surface the load error; clearing a store or reopening with an older
loader does not repair the committed authority. The adapter still needs complete
single-value atomic writes and application-coordinated writers, as described
above; this upgrade adds no cross-store transaction or cross-process lock.</p>
<h3 id="duplicate-and-completed-evidence-retention">Duplicate and completed evidence retention</h3>
<p>Sent/seen inner content identities and outer own-echo identities use authenticated
MLS <strong>source epochs</strong>, rather than arrival time. Completed identities strictly
below the finite floor retire after authority publication; equality and exact
pending dependencies remain protected. Consuming an outer echo leaves the inner
identity available to reject a rewrapped echo. Infinity intentionally preserves
historical recovery and age-based duplicate evidence, while application delivery
still obeys its independent window.</p>
<p>Completed delivery/rewind evidence can leave the durable projection when its
producing state is no longer retained. Completed effects retire only when their
producing digest is no longer named by selectable membership. Prepared/applied
wrappers, pending retractions, unacknowledged effects and their required branch
provenance remain unfinished. A pending retraction protects surviving deliveries
of the same inner rumor as well, until durable acknowledgement succeeds. Opaque,
corrupt or unresolved obligations postpone pruning.</p>
<p>Actual outbound publication pins are owned by the current session/runtime and
released by its acknowledgement or conclusive rollback. This retention protocol
does not add a durable outbound publication journal; it does not turn a
process-local pending send into a restart-safe send queue.</p>
<h3 id="removal-recovery-ordering">Removal recovery ordering</h3>
<p>Recovery requires durable <code>groupStateStore</code>, <code>lifecycleStore</code>, <code>rewindStore</code>, and <code>removedMarkerStore</code>. The removal-attribution record identifies the authenticated removal, its exact active parent and the local member. A winning retained branch must replay legally from that parent and restore the same local identity and leaf. A boolean marker alone cannot establish that proof.</p>
<p>The session writes recovery authority first, saves the active snapshot and retained history, reads and validates the saved snapshot, clears the removal marker, then deletes the attribution record last. Until that sequence finishes, public membership remains <code>removed</code> and outbound work stays blocked, even if an active snapshot is already saved or the marker was cleared before an adapter threw. Loading and activation revalidate the durable authority and finish interrupted cleanup. Missing, malformed or mismatched evidence leaves the group fenced; it never authorizes clearing a legacy marker.</p>
<h3 id="terminal-disband-ordering">Terminal disband ordering</h3>
<p>Canonical disband selection fences the running instance before observers or storage calls. Persistence then writes a versioned terminal intent containing authenticated terminal evidence and a scrubbed repair shell, the terminal tombstone, and the registry shell, followed by repeatable cleanup. Intent or tombstone authority takes precedence over a stale live snapshot on restart. Existing terminal tombstones remain readable.</p>
<p>Selection also closes ordinary session history saves. Cleanup waits for already-started history adapter writes to settle before purging plaintext, so an overlapping send cannot recreate history after the purge. Pending retractions still preserve their required history and provenance until acknowledged.</p>
<p><strong>The restart guarantee begins at the first successful recoverable terminal write.</strong> A crash before that write can reload the previous durable active snapshot. With no lifecycle storage, only the in-process fence is available. Later write or cleanup failures leave terminal work available for retry during activation or ingestion; they cannot reopen the send gate once terminal authority is durable.</p>
<h3 id="shared-keys-and-unfinished-work">Shared keys and unfinished work</h3>
<p>Storage roles may share a physical backend, including different adapter objects over the same database. Keep the library's scoped keys intact: terminal cleanup removes only completed work, and tree purge owns only its metadata, edge, state and commit keys. Do not implement group cleanup as <code>clear()</code> or deletion of every group-prefixed key while other roles still own records there.</p>
<p>Prepared wrapper records and unacknowledged convergence effects survive terminal cleanup. Delivered-message evidence, pending history retractions and their branch provenance remain until retraction acknowledgement succeeds. Both durable <code>ingestStateStore</code> and <code>rewindStore</code> are required to validate and retry those retractions after restart. Custom history adapters must make message removal idempotent and resolve only after persistence succeeds. Applications acknowledge applied state effects with <code>session.acknowledgeConvergenceEffect(result)</code>; failed acknowledgement leaves the effect replayable. Finite retention releases obsolete completed protocol evidence, while unfinished work can exceed the nominal horizon. Application rumor history and custom media remain <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/history.md#retention-and-backfill">application-owned</a>.</p>
<h3 id="callback-delivery-boundary">Callback delivery boundary</h3>
<p>Removal markers and a tombstone's <code>notificationState: &quot;delivered&quot;</code> record a <strong>consumed callback attempt</strong>, written before external listeners run. Durable records suppress repeated attempts on restart, but a crash or an error after forwarding the consumed record can lose a callback that never ran. This is an at-most-once callback-attempt boundary, not exactly-once callback execution or an atomic transaction with application side effects. Durable membership and terminal authority are independent of callback success. Use <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-group.md#removal-and-terminal-disband">group status</a> to reconcile application state after loading.</p>
<ul>
<li><strong><code>SerializedClientState</code></strong> is a <code>Uint8Array</code> — the encoded MLS client state.</li>
<li><strong><code>StoredKeyPackage</code></strong> carries a key package's public package plus its private key material and publish tracking. Treat it as <strong>secret</strong>.</li>
</ul>
<p><strong>Key package material is sensitive</strong></p>
<p><code>keyPackageStore</code> holds private keys. Use a store with the same protection you would give any signing key, and never share an instance across user accounts.</p>
<h2 id="in-memory-store">In-memory store</h2>
<p>For tests and short-lived processes, the <code>./extra</code> subpath ships an in-memory implementation:</p>
<pre><code class="language-typescript">import { InMemoryKeyValueStore } from &quot;@internet-privacy/marmot-ts/extra&quot;;

import type { SerializedClientState } from &quot;@internet-privacy/marmot-ts&quot;;
import type {
  StoredInviteEntry,
  StoredKeyPackage,
} from &quot;@internet-privacy/marmot-ts/client&quot;;

const groupStateStore = new InMemoryKeyValueStore&lt;SerializedClientState&gt;();
const keyPackageStore = new InMemoryKeyValueStore&lt;StoredKeyPackage&gt;();
const inviteStore = new InMemoryKeyValueStore&lt;StoredInviteEntry&gt;();
</code></pre>
<h2 id="localforage-browser">LocalForage (browser)</h2>
<p><a href="https://github.com/localForage/localForage">LocalForage</a> instances satisfy <code>GenericKeyValueStore</code> directly (IndexedDB/WebSQL/localStorage under the hood):</p>
<pre><code class="language-typescript">import localforage from &quot;localforage&quot;;

const groupStateStore = localforage.createInstance({ name: &quot;marmot-groups&quot; });
const keyPackageStore = localforage.createInstance({ name: &quot;marmot-keys&quot; });
</code></pre>
<h2 id="custom-backend">Custom backend</h2>
<p>Any object with the five methods works. A minimal adapter over a load/persist pair (for example a file):</p>
<pre><code class="language-typescript">import type { GenericKeyValueStore } from &quot;@internet-privacy/marmot-ts&quot;;

function fileStore&lt;T&gt;(
  load: () =&gt; Promise&lt;Record&lt;string, T&gt;&gt;,
  persist: (all: Record&lt;string, T&gt;) =&gt; Promise&lt;void&gt;,
): GenericKeyValueStore&lt;T&gt; {
  return {
    async getItem(key) {
      return (await load())[key] ?? null;
    },
    async setItem(key, value) {
      const all = await load();
      all[key] = value;
      await persist(all);
      return value;
    },
    async removeItem(key) {
      const all = await load();
      delete all[key];
      await persist(all);
    },
    async clear() {
      await persist({});
    },
    async keys() {
      return Object.keys(await load());
    },
  };
}
</code></pre>
<p>Stored values include <code>Uint8Array</code>s (<code>SerializedClientState</code>, <code>StoredKeyPackage</code>, and the <code>Uint8Array</code> stores above). Use a binary-safe encoding such as structured clone, CBOR, or base64 per field. Plain <code>JSON.stringify</code> silently corrupts them.</p>
<h2 id="per-account-isolation">Per-account isolation</h2>
<p>Each user account <strong>must</strong> use completely isolated stores (all of the stores above) — mixing key package material between accounts would leak private keys. Namespace your stores by the account's public key:</p>
<pre><code class="language-typescript">const store = localforage.createInstance({ name: \`marmot-\${pubkey}\` });
</code></pre>
<p>See <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md#multi-account-support">Multi-Account Support</a> for the full pattern.</p>
<h2 id="encrypted-store-demo-only">Encrypted store (demo only)</h2>
<p>The <code>./extra</code> subpath also exports <code>EncryptedKeyValueStore</code>, a password-encrypting wrapper.</p>
<p><strong>Not for production</strong></p>
<p><code>EncryptedKeyValueStore</code> is a demonstration of the wrapping pattern only. It is <strong>not</strong> a secure at-rest encryption scheme — use platform key storage (Keychain, DPAPI, libsecret, WebCrypto + a hardware-backed key) for real deployments.</p>
<h2 id="next-steps">Next steps</h2>
<ul>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md">MarmotClient</a></strong> — wiring stores into the client</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/history.md">History</a></strong> — message history is a separate, optional backend</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/core/state.md">Client State</a></strong> — what gets serialized into <code>groupStateStore</code></li>
</ul>
`,g={__name:"typescript-storage.html",setup(u){return(m,r)=>{const o=i("DocumentationPage");return s(),a("div",null,[r[0]||(r[0]=t("h1",{id:"typescript-storage",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#typescript-storage"},[t("span",null,"TypeScript storage")])],-1)),n(o,{document:{repo:e(l),version:e(c),sourceUrl:e(d),html:e(p)}},null,8,["document"])])}}},y=JSON.parse('{"path":"/docs/typescript-storage.html","title":"TypeScript storage","lang":"en-US","frontmatter":{"title":"TypeScript storage","description":"TypeScript storage — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/typescript-storage.md"}');export{g as comp,y as data};
