import{c as r,b as t,d as a,u as e,r as s,o as i}from"./app-C1yp260q.js";const c="marmot-ts",l="0.9.0",p="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/getting-started.md",d=`<div id="getting-started" class="mm-source-title">Getting Started</div>
<h2 id="what-is-marmot">What is Marmot?</h2>
<p>Marmot is a privacy-preserving group messaging protocol that combines <strong>MLS (Message Layer Security)</strong> for end-to-end encryption with <strong>Nostr</strong> for decentralized message distribution.</p>
<p><strong>Key Features:</strong></p>
<ul>
<li><strong>End-to-End Encrypted:</strong> Messages are encrypted using MLS, providing forward secrecy and post-compromise security</li>
<li><strong>Decentralized:</strong> Built on Nostr relays, no central server required</li>
<li><strong>Privacy-First:</strong> Ephemeral signing keys and gift-wrapped welcome messages protect metadata</li>
</ul>
<h2 id="core-concepts">Core Concepts</h2>
<h3 id="mls-message-layer-security">MLS (Message Layer Security)</h3>
<p>MLS is an IETF standard (RFC 9420) for group messaging security. It provides:</p>
<ul>
<li><strong>Forward Secrecy:</strong> Past messages remain secure even if current keys are compromised</li>
<li><strong>Post-Compromise Security:</strong> Security is restored after a compromise through key rotation</li>
<li><strong>Efficient Group Operations:</strong> Add/remove members without re-encrypting for everyone</li>
</ul>
<h3 id="nostr">Nostr</h3>
<p>Nostr is a decentralized protocol for distributing signed events over relays. Marmot uses Nostr for:</p>
<ul>
<li><strong>Key Package Distribution:</strong> Publishing cryptographic material for adding members</li>
<li><strong>Message Delivery:</strong> Distributing encrypted group messages</li>
<li><strong>Welcome Messages:</strong> Onboarding new members to groups</li>
</ul>
<h3 id="key-terms">Key Terms</h3>
<ul>
<li><strong>Group:</strong> A collection of members who can exchange encrypted messages</li>
<li><strong>Key Package:</strong> Cryptographic material needed to add someone to a group</li>
<li><strong>Proposal:</strong> A suggested change to the group (add member, remove member, update metadata)</li>
<li><strong>Commit:</strong> A finalized set of proposals that advances the group's encryption state</li>
<li><strong>Welcome:</strong> A message sent to new members containing the group state</li>
<li><strong>Rumor:</strong> An unsigned Nostr event used as application message content</li>
</ul>
<h2 id="installation">Installation</h2>
<pre><code class="language-bash">npm install @internet-privacy/marmot-ts
</code></pre>
<pre><code class="language-bash">pnpm add @internet-privacy/marmot-ts
</code></pre>
<pre><code class="language-bash">yarn add @internet-privacy/marmot-ts
</code></pre>
<p>The examples below also import types from <code>applesauce-core</code>. It is a dependency of marmot-ts, but package managers such as pnpm won't let your app import it unless you add it too (<code>pnpm add applesauce-core@^7</code>). marmot-ts v0.8 uses Applesauce v7; upgrade any Applesauce packages your application uses to v7 together. Nostr-specific gift-wrap helpers and factories live in <code>applesauce-common</code>.</p>
<h2 id="setup-storage">Setup Storage</h2>
<p>Marmot stores serialized MLS state and key package metadata in key/value stores that your app provides. For development, use the in-memory store from the <code>extra</code> subpath:</p>
<pre><code class="language-typescript">import type {
  SerializedClientState,
  StoredKeyPackage,
} from &quot;@internet-privacy/marmot-ts&quot;;
import { InMemoryKeyValueStore } from &quot;@internet-privacy/marmot-ts/extra&quot;;

const groupStateStore = new InMemoryKeyValueStore&lt;SerializedClientState&gt;();
const keyPackageStore = new InMemoryKeyValueStore&lt;StoredKeyPackage&gt;();
</code></pre>
<p><strong>Production storage</strong></p>
<p>Production apps need durable stores: IndexedDB in the browser, the file system in Node.js, or SQLite in React Native. Also pass <code>ingestStateStore</code>, <code>inviteStore</code>, <code>rewindStore</code> and <code>removedMarkerStore</code>, backed by the same durable storage. Any store you leave out falls back to memory and is lost on restart. Without <code>ingestStateStore</code>, <code>client.ingestPersistence.kind</code> is <code>&quot;ephemeral&quot;</code>. See <a href="__MARMOT_BASE__docs/typescript-storage.html">Storage</a>.</p>
<h2 id="setup-network-interface">Setup Network Interface</h2>
<p>Implement the <code>NostrNetworkInterface</code> so the client can talk to relays. It has four methods. In this sketch, <code>myPool</code> represents your adapter: its <code>publish</code> returns a record of relay outcomes and its <code>request</code> returns a promise of events. A raw Applesauce <code>RelayPool</code> needs conversion because its <code>publish</code> returns an array and its <code>request</code> returns an RxJS observable.</p>
<pre><code class="language-typescript">import type {
  NostrNetworkInterface,
  PublishResponse,
  Subscribable,
} from &quot;@internet-privacy/marmot-ts/client&quot;;
import { getInboxRelays } from &quot;@internet-privacy/marmot-ts&quot;;
import type { NostrEvent } from &quot;applesauce-core/helpers/event&quot;;
import type { Filter } from &quot;applesauce-core/helpers/filter&quot;;

// Relays used to look up other users' relay lists (kind 10002 / 10050)
const lookupRelays = [&quot;wss://purplepag.es&quot;, &quot;wss://relay.example.com&quot;];

const network: NostrNetworkInterface = {
  // Publish an event and report the per-relay outcome.
  async publish(
    relays: string[],
    event: NostrEvent,
  ): Promise&lt;Record&lt;string, PublishResponse&gt;&gt; {
    // { [relayUrl]: { from, ok, message? } }
    return await myPool.publish(relays, event);
  },

  // Resolve a one-shot query to an array of events.
  async request(
    relays: string[],
    filters: Filter | Filter[],
  ): Promise&lt;NostrEvent[]&gt; {
    return await myPool.request(relays, filters);
  },

  // Open a live subscription that emits events as they arrive.
  subscription(
    relays: string[],
    filters: Filter | Filter[],
  ): Subscribable&lt;NostrEvent&gt; {
    return myPool.subscription(relays, filters);
  },

  // Resolve a user's kind 10050 inbox relays (where their Welcomes are delivered).
  async getUserInboxRelays(pubkey: string): Promise&lt;string[]&gt; {
    const lists = await myPool.request(lookupRelays, [
      { kinds: [10050], authors: [pubkey] },
    ]);
    const newest = lists.sort((a, b) =&gt; b.created_at - a.created_at)[0];
    return newest ? getInboxRelays(newest) : [];
  },
};
</code></pre>
<p><strong>Reference adapter</strong></p>
<p>The <a href="https://github.com/marmot-protocol/marmot-ts/tree/master/examples/opentui"><code>opentui</code> example</a> wraps <a href="https://applesauce.build/"><code>applesauce-relay</code></a> in a complete <code>NostrNetworkInterface</code>. See <a href="__MARMOT_BASE__docs/typescript-network.html">Network</a> for the full contract and Applesauce v7 authentication guidance.</p>
<h2 id="initialize-the-client">Initialize the Client</h2>
<p>The signer must implement <code>nip44</code> encryption and decryption as well as <code>signEvent</code>. Marmot uses NIP-44 to seal outgoing Welcome gift wraps and to open incoming ones. In applesauce's <code>EventSigner</code> type, <code>nip44</code> is optional, so check that your signer provides it.</p>
<p>Each install also needs a <strong>KeyPackage slot id</strong>. This is the <code>d</code> tag of your kind 30443 key package event. The spec (<a href="https://github.com/marmot-protocol/marmot/blob/master/transports/nostr.md"><code>transports/nostr.md</code></a>) requires 32 random bytes, written as lowercase hex. Generate it once, persist it, and reuse it. Never derive it from a device name or any identity key.</p>
<pre><code class="language-typescript">import { MarmotClient } from &quot;@internet-privacy/marmot-ts&quot;;

const toHex = (bytes: Uint8Array) =&gt;
  Array.from(bytes, (b) =&gt; b.toString(16).padStart(2, &quot;0&quot;)).join(&quot;&quot;);

// Generate once per install, persist, and reuse forever
let clientId = await settings.get(&quot;marmotKeyPackageSlot&quot;);
if (!clientId) {
  clientId = toHex(crypto.getRandomValues(new Uint8Array(32)));
  await settings.set(&quot;marmotKeyPackageSlot&quot;, clientId);
}

const client = new MarmotClient({
  signer: yourNostrSigner, // applesauce EventSigner with nip44 support
  network,
  groupStateStore,
  keyPackageStore,
  clientId, // default kind 30443 \`d\` slot
});

const myPubkey = await client.signer.getPublicKey();
</code></pre>
<p><strong>Spec deviation</strong></p>
<p>The spec requires the slot id to be random 32-byte hex (<code>transports/nostr.md</code>). marmot-ts rejects identifiers unless they are exactly 64 lowercase hex characters. Persist the generated slot; migrate device labels by generating a new conformant slot.</p>
<p><strong>Multi-Account Applications</strong></p>
<p>If your app supports multiple user accounts, give each account its own isolated storage so key material can't leak between accounts. See <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md">MarmotClient</a> for the multi-account pattern.</p>
<h2 id="publish-your-relay-lists">Publish Your Relay Lists</h2>
<p>Peers look for your key packages on your kind 10002 (NIP-65) <strong>write</strong> relays. There is no dedicated key package relay list. They deliver Welcomes to your kind 10050 inbox relays. Publish both lists before you expect invites (<a href="https://github.com/marmot-protocol/marmot/blob/master/transports/nostr.md"><code>transports/nostr.md</code></a>):</p>
<pre><code class="language-typescript">import {
  createInboxRelayListEvent,
  createNip65RelayListEvent,
} from &quot;@internet-privacy/marmot-ts&quot;;

const outboxRelays = [&quot;wss://relay.example.com&quot;]; // your NIP-65 write relays
const inboxRelays = [&quot;wss://inbox.example.com&quot;]; // where you receive Welcomes

const nip65 = await client.signer.signEvent(
  createNip65RelayListEvent({ pubkey: myPubkey, relays: outboxRelays }),
);
const inbox = await client.signer.signEvent(
  createInboxRelayListEvent({ pubkey: myPubkey, relays: inboxRelays }),
);
await client.network.publish([...outboxRelays, ...lookupRelays], nip65);
await client.network.publish([...outboxRelays, ...lookupRelays], inbox);
</code></pre>
<h2 id="publish-a-key-package">Publish a Key Package</h2>
<p>Before others can add you to groups, publish a key package to your NIP-65 write relays:</p>
<pre><code class="language-typescript">const keyPackage = await client.keyPackages.create({
  relays: outboxRelays, // your kind 10002 write relays
  client: &quot;my-chat-app&quot;,
  // \`d\` slot defaults to the client's \`clientId\`
});
</code></pre>
<p>To publish on startup only when you don't already hold an unused key package, call <code>client.keyPackages.ensurePublished({ relays: outboxRelays })</code>.</p>
<p><strong>Spec deviation</strong></p>
<p>The kind 30443 tag set in <code>transports/nostr.md</code> has no <code>relays</code> tag. marmot-ts still adds one, listing the relays you pass.</p>
<h2 id="create-a-group">Create a Group</h2>
<pre><code class="language-typescript">const group = await client.groups.create(&quot;Engineering Team&quot;, {
  description: &quot;Secure team communications&quot;,
  relays: [&quot;wss://relay.example.com&quot;],
  // The creator is always an admin; list *additional* admins in \`adminPubkeys\`
});

console.log(\`Created group (MLS group_id): \${group.idStr}\`);
console.log(\`Routing tag (nostr_group_id): \${group.info.nostr.groupIdHex}\`);
</code></pre>
<p>A solo create only builds local state. Nothing is published until you invite someone or send a message.</p>
<h2 id="invite-a-member">Invite a Member</h2>
<p>Get the invitee's key packages from their kind 10002 write relays. Then choose one that the group can actually add:</p>
<pre><code class="language-typescript">import { getNip65Relays } from &quot;@internet-privacy/marmot-ts&quot;;

const memberPubkey = &quot;&lt;64-char hex pubkey&gt;&quot;;

// 1. Their NIP-65 write relays are where their key packages live
const relayLists = await client.network.request(lookupRelays, [
  { kinds: [10002], authors: [memberPubkey] },
]);
const relayList = relayLists.sort((a, b) =&gt; b.created_at - a.created_at)[0];
const keyPackageRelays = relayList ? getNip65Relays(relayList, &quot;write&quot;) : [];

// 2. Fetch their key packages and keep the newest one this group can add
const candidates = await client.network.request(keyPackageRelays, [
  { kinds: [30443], authors: [memberPubkey] },
]);
const keyPackageEvent = candidates
  .sort((a, b) =&gt; b.created_at - a.created_at)
  .find((event) =&gt; group.evaluateKeyPackage(event).eligible);

// 3. Commit the Add. Once relays ack the commit, the Welcome is gift-wrapped
//    to the invitee's kind 10050 inbox relays (via network.getUserInboxRelays)
if (keyPackageEvent) await client.groups.invite(group.id, keyPackageEvent);
</code></pre>
<p><code>client.groups.invite()</code> builds the commit with <code>createInviteIntent()</code>. The commit verifies the key package event's signature, tags and lifetime before anything is published. To add several people at once, or to add the first members while creating a group, see <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-client.md">MarmotClient</a> and <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/proposals.md">Proposals</a>.</p>
<h2 id="send-a-message">Send a Message</h2>
<p>Build the chat rumor in your app, turn it into an application-message intent, and send it with the manager's <code>send</code> helper:</p>
<pre><code class="language-typescript">import {
  createApplicationMessageIntent,
  createChatRumor,
} from &quot;@internet-privacy/marmot-ts/client&quot;;

const rumor = createChatRumor({
  pubkey: myPubkey,
  content: &quot;Hello team!&quot;,
});

await client.groups.send(group.id, createApplicationMessageIntent(rumor));
</code></pre>
<p>If the group is still resolving concurrent commits, <code>send()</code> queues the message and sends it once the group settles.</p>
<h2 id="receive-messages">Receive Messages</h2>
<p><code>client.groups.connectAll()</code> connects every loaded group to its relays. It fetches past kind 445 events, subscribes for new ones, verifies each event's signature and <code>h</code> tag, drops duplicates, and feeds the rest to the group. Decrypted messages are emitted as <code>applicationMessage</code> events:</p>
<pre><code class="language-typescript">import { deserializeApplicationData } from &quot;@internet-privacy/marmot-ts&quot;;

group.on(&quot;applicationMessage&quot;, (data) =&gt; {
  const message = deserializeApplicationData(data);
  console.log(\`\${message.pubkey}: \${message.content}\`);
});

// Start once at app startup; groups created or joined later connect automatically
const groupSync = client.groups.connectAll();
// On shutdown: groupSync.unsubscribe();
</code></pre>
<p>See <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/marmot-group.md">MarmotGroup</a> for ingest results and other group events.</p>
<h2 id="join-a-group">Join a Group</h2>
<p>Listen for gift-wrapped Welcomes on your kind 10050 inbox relays, then join from the decrypted invite:</p>
<pre><code class="language-typescript">const inviteSync = await client.invites.listen(inboxRelays);

for await (const invites of client.watchInvites()) {
  for (const { invite, joinable } of invites) {
    if (!joinable) continue; // we no longer hold the key package it was sent to

    const preview = await client.previewWelcome(invite);
    console.log(\`Invited to \${preview.group?.name ?? &quot;a group&quot;}\`);

    const { group } = await client.joinGroupFromWelcome({
      welcomeRumor: invite,
    });
    await client.invites.markAsRead(invite.id);

    // Rotate your leaf key for forward secrecy. connectAll() catches the group up;
    // the commit is queued until the group settles.
    await group.selfUpdate();

    // Replace the consumed key package. This also deletes its private material.
    for (const kp of await client.keyPackages.list()) {
      if (kp.used) await client.keyPackages.rotate(kp.keyPackageRef);
    }

    console.log(\`Joined group: \${group.idStr}\`);
  }
}
</code></pre>
<p><code>joinGroupFromWelcome()</code> does not do either post-join step for you. <a href="https://github.com/marmot-protocol/marmot/blob/master/protocol-core/joining.md"><code>protocol-core/joining.md</code></a> asks joiners to self-update as soon as practical, before sending application messages. They should also rotate the consumed key package.</p>
<p><strong>Spec deviation</strong></p>
<p><code>foundation/key-packages.md</code> requires deleting a consumed key package's private material. <code>joinGroupFromWelcome()</code> only marks the key package as <code>used</code>. Call <code>client.keyPackages.rotate()</code> or <code>remove()</code> to delete it, as shown above.</p>
<h2 id="next-steps">Next Steps</h2>
<ul>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/index.md">Client Module</a></strong>: the full client API (groups, key packages, invites, history)</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/ui-frameworks.md">UI Framework Integration</a></strong>: using MarmotClient with React, Svelte, or vanilla JavaScript</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/client/best-practices.md">Best Practices</a></strong>: commits, persistence, and relay selection</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/core/index.md">Core Module</a></strong>: the protocol layer and its building blocks</li>
<li><strong><a href="https://github.com/marmot-protocol/marmot">Protocol Specs</a></strong>: the Marmot protocol specification (start with <code>layout.md</code>)</li>
</ul>
<h2 id="architecture-overview">Architecture Overview</h2>
<pre><code>┌─────────────────────────────────────┐
│      Your Application               │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Client Module                  │
│  (MarmotClient, MarmotGroup)        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Engine Module                  │
│  (convergence &amp; ingest)             │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Core Module                    │
│  (Protocol, Crypto, Messages)       │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      MLS (ts-mls) + Nostr           │
└─────────────────────────────────────┘
</code></pre>
<p>The <strong>Client Module</strong> gives you the high-level APIs and Nostr I/O. The <strong>Engine</strong> is a transport-independent group state machine that handles convergence and ingest. The <strong>Core Module</strong> implements the Marmot protocol on top of MLS and Nostr primitives. See <a href="https://github.com/marmot-protocol/marmot-ts/blob/89eb7a12fda6219d36d7914cee68fd054eef6424/docs/guide/architecture.md">Architecture</a> for details.</p>
`,y={__name:"typescript.html",setup(u){return(m,o)=>{const n=s("DocumentationPage");return i(),r("div",null,[o[0]||(o[0]=t("h1",{id:"typescript-quickstart",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#typescript-quickstart"},[t("span",null,"TypeScript quickstart")])],-1)),a(n,{document:{repo:e(c),version:e(l),sourceUrl:e(p),html:e(d)}},null,8,["document"])])}}},h=JSON.parse('{"path":"/docs/typescript.html","title":"TypeScript quickstart","lang":"en-US","frontmatter":{"title":"TypeScript quickstart","description":"TypeScript quickstart — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/typescript.md"}');export{y as comp,h as data};
