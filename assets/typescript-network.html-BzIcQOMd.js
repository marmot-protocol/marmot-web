import{c as r,b as t,d as s,u as e,r as i,o as a}from"./app-BI17XJzV.js";const c="marmot-ts",l="0.9.0",d="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/network.md",p=`<div id="network-interface" class="mm-source-title">Network interface</div>
<p>Marmot does not connect to relays itself. You pass a <code>NostrNetworkInterface</code> into <code>MarmotClient</code>; that same object is used by <code>KeyPackageManager</code>, <code>GroupsManager</code>, and each <code>MarmotGroup</code>. Event and filter types are applesauce's <code>NostrEvent</code> and <code>Filter</code>; nostr-tools' <code>Event</code> and <code>Filter</code> are structurally compatible.</p>
<h2 id="contract">Contract</h2>
<pre><code class="language-typescript">import type { NostrEvent } from &quot;applesauce-core/helpers/event&quot;;
import type { Filter } from &quot;applesauce-core/helpers/filter&quot;;
import type {
  PublishResponse,
  Subscribable,
} from &quot;@internet-privacy/marmot-ts/client&quot;;

interface NostrNetworkInterface {
  publish(
    relays: string[],
    event: NostrEvent,
  ): Promise&lt;Record&lt;string, PublishResponse&gt;&gt;;

  request(relays: string[], filters: Filter | Filter[]): Promise&lt;NostrEvent[]&gt;;

  subscription(
    relays: string[],
    filters: Filter | Filter[],
  ): Subscribable&lt;NostrEvent&gt;;

  getUserInboxRelays(pubkey: string): Promise&lt;string[]&gt;;
}
</code></pre>
<p><code>Subscribable</code> is <code>{ subscribe(observer) → { unsubscribe() } }</code>; RxJS observables fit if they expose that shape.</p>
<ul>
<li>
<p><strong><code>publish</code></strong> — Publish signed events to the listed relays. Return per-relay <code>ok</code> / <code>message</code> so failures surface after commits and welcomes. Used by <code>KeyPackageManager</code> (key packages, deletes), each group's <code>GroupRuntime</code> (MLS traffic, app messages), and Welcome delivery (gift wraps).</p>
</li>
<li>
<p><strong><code>request</code></strong> — One-shot REQ until EOSE; dedupe by <code>id</code> if you merge multiple filters. Used by <code>client.groups.connect()</code> / <code>connectAll()</code> to backfill a group's kind 445 history, one relay and one <code>limit</code>-sized page per call. Reject the promise when the relay fails, closes the request, or times out: a resolved empty array means the relay holds nothing more in that window, and the backfill records it as read. The client keeps at most <code>limit</code> events of each response, but the adapter receives every response whole: to bound memory against a relay that ignores <code>limit</code>, stop collecting in the adapter once it has <code>limit</code> events. A backfill can hold up to <code>backfillPageSize * backfillMaxPages</code> events per relay in memory (about 25,000 with the defaults); see <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md#bounded-backfill">Bounded backfill</a> for tuning them on mobile.</p>
</li>
<li>
<p><strong><code>subscription</code></strong> — Live updates; emit one event per <code>next</code>. Used by <code>client.groups.connect()</code> / <code>connectAll()</code> for live kind 445 traffic and by <code>client.invites.listen()</code>.</p>
</li>
<li>
<p><strong><code>getUserInboxRelays</code></strong> — Where <code>pubkey</code> receives gift-wrapped Welcomes (kind 1059), read from their kind 10050 <code>relay</code> tags. Welcome delivery calls it for each invitee. If it <strong>throws</strong>, delivery falls back to the group's relays. If it returns an <strong>empty list</strong>, delivery for that invitee fails and is reported as a failed Welcome outcome. Return <code>[]</code> only when the user really has no inbox list.</p>
</li>
</ul>
<h2 id="wiring-applesauce-v7">Wiring Applesauce v7</h2>
<p>The <a href="https://github.com/marmot-protocol/marmot-ts/blob/master/examples/opentui/src/helpers/relay-pool.ts">OpenTUI adapter</a> implements this contract with <code>applesauce-relay</code> v7. Convert relay publish responses to a record keyed by URL, subscribe to one-shot request observables until completion, and forward live subscription observables directly. Propagate request failures instead of treating them as empty history.</p>
<p>For NIP-42, pass an <code>onAuthRequired</code> handler to each <code>publish</code>, <code>request</code>, and <code>subscription</code> operation that may authenticate. The example handler calls <code>relay.authenticate(signer)</code> and throws if AUTH is rejected. A bare AUTH challenge does not trigger signing; authentication starts after the relay refuses an operation with <code>auth-required</code>. Signing AUTH reveals the account's pubkey to that relay.</p>
<p>Use <code>waitForAuth: false</code> for public lookups that should fail if refused rather than authenticate, such as KeyPackage discovery. Authentication is scoped to the operation in v7, so an unrelated public request can proceed on the same connection. Keep the returned live subscription handles and unsubscribe during teardown; dispose the shared EventStore and close the relay pool when the application shuts down.</p>
<h2 id="wiring-nostr-tools">Wiring <code>nostr-tools</code></h2>
<p>Minimal <code>SimplePool</code> adapter sketch:</p>
<pre><code class="language-typescript">import type { Event } from &quot;nostr-tools&quot;;
import type { Filter } from &quot;nostr-tools/filter&quot;;
import type {
  NostrNetworkInterface,
  PublishResponse,
  Subscribable,
  Unsubscribable,
} from &quot;@internet-privacy/marmot-ts/client&quot;;
import { getInboxRelays } from &quot;@internet-privacy/marmot-ts&quot;;
import { SimplePool } from &quot;nostr-tools/pool&quot;;

const pool = new SimplePool();
const METADATA_RELAYS = [&quot;wss://relay.damus.io&quot;];

function dedupeById(events: Event[]): Event[] {
  const seen = new Set&lt;string&gt;();
  return events.filter((e) =&gt;
    seen.has(e.id) ? false : (seen.add(e.id), true),
  );
}

export function nostrToolsNetwork(): NostrNetworkInterface {
  return {
    async publish(relays, event) {
      const out: Record&lt;string, PublishResponse&gt; = {};
      const pending = pool.publish(relays, event);
      await Promise.all(
        relays.map(async (url, i) =&gt; {
          try {
            const reason = await pending[i];
            const msg = String(reason);
            const softFail = msg.startsWith(&quot;connection failure:&quot;);
            out[url] = {
              from: url,
              ok: !softFail,
              message: softFail ? msg : msg || undefined,
            };
          } catch (err) {
            out[url] = {
              from: url,
              ok: false,
              message: err instanceof Error ? err.message : String(err),
            };
          }
        }),
      );
      return out;
    },

    async request(relays, filters) {
      const list = Array.isArray(filters) ? filters : [filters];
      const all: Event[] = [];
      for (const f of list) {
        all.push(...(await pool.querySync(relays, f)));
      }
      return dedupeById(all);
    },

    subscription(relays, filters): Subscribable&lt;Event&gt; {
      const list = Array.isArray(filters) ? filters : [filters];
      return {
        subscribe(observer): Unsubscribable {
          const subs = list.map((f) =&gt;
            pool.subscribe(relays, f, {
              onevent(ev) {
                observer.next?.(ev);
              },
            }),
          );
          return { unsubscribe: () =&gt; subs.forEach((s) =&gt; void s.close()) };
        },
      };
    },

    async getUserInboxRelays(pubkey) {
      const ev = await pool.get(METADATA_RELAYS, {
        kinds: [10050],
        authors: [pubkey],
        limit: 1,
      });
      if (!ev) return [];
      return getInboxRelays(ev);
    },
  };
}
</code></pre>
<p>KeyPackage discovery uses the account's kind 10002 NIP-65 write relays (<code>getNip65Relays(event, &quot;write&quot;)</code>); Welcome delivery uses kind 10050 inbox relays (<code>getInboxRelays(event)</code>). See <a href="https://github.com/marmot-protocol/marmot/blob/master/transports/nostr.md"><code>transports/nostr.md</code></a>.</p>
<h2 id="connecting-groups">Connecting groups</h2>
<p><code>await client.groups.connect(groupId, options?)</code> backfills kind 445 events, fully drains that batch, then installs a live subscription. It returns an <code>Unsubscribable</code>. <code>client.groups.connectAll(options?)</code> returns its handle immediately and follows the set of loaded groups, starting and stopping their connections as groups are loaded, joined, removed, or unloaded.</p>
<p>Both APIs accept <code>{ signal?: AbortSignal, fallbackRelays?: string[] }</code>, plus the backfill bounds <code>backfillSlackSeconds</code>, <code>backfillPageSize</code> and <code>backfillMaxPages</code> (see <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md#bounded-backfill">Bounded backfill</a>). Group relays take precedence over fallback relays; groups with neither are skipped. Use an <code>AbortSignal</code> to stop a direct connection while its backfill request is still pending:</p>
<pre><code class="language-typescript">const controller = new AbortController();
const pendingConnection = client.groups.connect(group.id, {
  signal: controller.signal,
});

// On application teardown, even before pendingConnection resolves:
controller.abort();
const connection = await pendingConnection;
connection.unsubscribe(); // also safe after abort
</code></pre>
<p>Cancellation stops intake; it does not cancel the network adapter's outstanding <code>request</code> promise. When that request resolves, cancelled backfill is not admitted and no live subscription is installed. <code>connectAll().unsubscribe()</code> also cancels connections whose backfill is pending.</p>
<h3 id="serialization-and-disconnect">Serialization and disconnect</h3>
<p>Backfill and live events enter one queue per group, shared by every connection handle for that group. Each admitted batch's <code>ingest()</code> generator is completely drained before the next starts. A failed batch does not permanently stall the queue, and another group can proceed independently. Signature verification and exact singleton <code>h</code> routing validation precede insertion into the shared bounded dedup cache.</p>
<p><code>unsubscribe()</code> or abort closes intake immediately. Already admitted batches still run and finish reconciliation; their results remain observable while they drain. The result listener is released when no connection or admitted work remains. The unsubscribe handle is synchronous and supplies no promise for drain completion. Keep application result handlers alive while observing that final work.</p>
<p>This queue covers manager-owned connection intake. If you also call <code>group.ingest()</code> directly, serialize those calls with your other operations and consume every yielded result before starting another batch; an abandoned generator has not completed ingestion.</p>
<h3 id="connection-results-and-invalidation">Connection results and invalidation</h3>
<p>Subscribe before connecting:</p>
<pre><code class="language-typescript">client.groups.on(&quot;ingestResult&quot;, (groupId, result) =&gt; {
  if (result.kind === &quot;invalidated&quot;) {
    recordForkRetraction(groupId, {
      rumorId: result.rumorId,
      transportId: result.transportId,
      losingTag: result.tag,
      losingEpoch: result.epoch,
      producingCommit: result.commitDigest,
    });
  }
});
const connections = client.groups.connectAll();
</code></pre>
<p>The manager forwards the facade's reconciled result once per connected group, including live, timer-driven, and explicit convergence results. Consuming ingest yields does not produce a second manager notification. Existing <code>unreadable</code> and trust-boundary <code>rejected</code> events remain available.</p>
<p>For <code>invalidated</code>, <code>rumorId</code> is the strict canonical inner rumor ID; <code>transportId</code> is the signed envelope ID and <code>event</code> retains that envelope. <code>payload</code> contains decrypted application bytes, and <code>message</code> contains the MLS application message. <code>tag</code> and <code>epoch</code> name the losing delivery state. Optional <code>commitDigest: Uint8Array</code> identifies the edge that produced that losing state. It never identifies the commit that triggered reconciliation or the winning branch; root states have no producing commit. The optional fields preserve compatibility, so consumers must handle absent evidence.</p>
<p>Supported history removal completes before the public result when persistence succeeds. Backend errors emit <code>historyError</code> and preserve the invalidation and pending retry evidence. Restart attribution requires persisted ingestion state and rewind history; plaintext history alone is insufficient. See <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/history.md#fork-invalidated-messages">History</a> for custom-store migration and failure handling.</p>
<h2 id="cancellable-group-watches">Cancellable group watches</h2>
<p><code>client.groups.watch({ signal })</code> yields fresh group-list arrays. Abort finishes an idle or loading watch promptly without waiting for an update. Returning the iterator also wakes a pending <code>next()</code> before completion and removes listeners; <code>throw()</code> and async disposal perform the same cleanup. A storage request already in progress may finish later, with its rejection handled. Updates arriving during loading or between pulls remain pending for a later snapshot.</p>
<pre><code class="language-typescript">const controller = new AbortController();
const updates = client.groups.watch({ signal: controller.signal });
const observing = (async () =&gt; {
  for await (const groups of updates) renderGroups(groups);
})();

// On view teardown:
controller.abort();
await observing;
</code></pre>
<h2 id="production-convergence-policy">Production convergence policy</h2>
<p>Keep the existing finite profile-1 default (<code>maxRewindCommits: 5</code>) for production unless you have deliberately chosen another bounded horizon. Configure a policy at the client boundary to pass it to groups. The horizon controls rollback eligibility; it does not promise complete pruning of every full-history tree or plaintext history record.</p>
<p><code>maxRewindCommits: Infinity</code> is an explicit debugging or forensic choice that keeps arbitrarily old forks eligible and can retain unbounded evidence. It is not production guidance. Broader history-tree, delivery-evidence, and memory-retention pruning remains separate work. See <a href="https://github.com/marmot-protocol/marmot/blob/master/protocol-core/convergence.md"><code>protocol-core/convergence.md</code></a> and <a href="https://github.com/marmot-protocol/marmot/blob/master/protocol-core/retained-history.md"><code>protocol-core/retained-history.md</code></a>.</p>
`,g={__name:"typescript-network.html",setup(u){return(h,o)=>{const n=i("DocumentationPage");return a(),r("div",null,[o[0]||(o[0]=t("h1",{id:"typescript-networking",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#typescript-networking"},[t("span",null,"TypeScript networking")])],-1)),s(n,{document:{repo:e(c),version:e(l),sourceUrl:e(d),html:e(p)}},null,8,["document"])])}}},b=JSON.parse('{"path":"/docs/typescript-network.html","title":"TypeScript networking","lang":"en-US","frontmatter":{"title":"TypeScript networking","description":"TypeScript networking — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/typescript-network.md"}');export{g as comp,b as data};
