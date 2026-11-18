---
home: true
title: Marmot Protocol
heroText: Marmot Protocol
description: Marmot is an open protocol for decentralized, end-to-end encrypted group messaging using Messaging Layer Security (MLS) and Nostr identities.
heroImage: /images/marmot.svg
tagline: <p>Decentralized group messaging that protects people by encrypting content and metadata.</p><p><span>Your Keys.</span> <span>Your Identity.</span>  <span>Your Data.</span></p>
taglineHtml: true
actions:
  - text: Get Started
    link: /development-kit.html
    type: primary
---
<!-- markdownlint-disable MD033 MD041 -->
<div class="mm-container">

<section>
<div class="box marine">

### Why use Marmot?

Marmot is a protocol that combines Messaging Layer Security (MLS) for encryption, Nostr for identity and message relay, and Blossom for file transfer, to deliver truly private group messaging without relying on centralized servers or legacy identity systems. Applications built on Marmot like White Noise, offer a greater level of privacy for users with the ability to scale to thousands of group members.

</div>
<div>

**End-to-End Encrypted:** Messages are encrypted on your device and can only be read by intended recipients

**Decentralized:** No central servers to shut down or compromise

**Identity Freedom**: No phone numbers or email addresses required

**Metadata Protection:** Hides who you're talking to, not just what you're saying

**Scalable:** Efficient group messaging for small teams to large communities

**Interoperable:** Works across different clients and implementations

</div>
</section>

<div class="lead">One protocol, many apps. Users own their identity and data, not the platforms.</div>

<section>
<div>

Marmot goes beyond existing messaging systems, which lack the infrastructure to scale with complete security:

**Signal:** Excellent E2EE but centralized infrastructure vulnerable to shutdown

**NIP-04/NIP-17:**  Basic encryption but lacks forward secrecy and group messaging

**Centralized Platforms (WhatsApp, Telegram etc):** Vulnerable to mass surveillance and censorship

</div>
<div class="box blush">

### Sound Infrastructure

By combining MLS's proven cryptography, Nostr's decentralized architecture, and Blossom’s image distribution, Marmot provides the security of Signal with the censorship resistance of Bitcoin.

</div>
</section>

<section>
<div class="box lilac">

### Sovereign Identity

User identities are linked only to cryptographic keys. No phone numbers or email addresses are required. As with Nostr, identities are transferable and interoperable across different clients and implementations.

</div>
</section>

<section>
<div class="box moss">

### Strong Privacy

By combining MLS's proven cryptography, Nostr's decentralized architecture, and Blossom’s image distribution, Marmot provides the security of Signal with the censorship resistance of Bitcoin.

</div>
<div>

End-to-end encryption maintains strong security guarantees through MLS:

**Forward Secrecy:** Past messages remain secure even if current keys are compromised

**Post-Compromise Security:** Key rotation limits impact of future compromises

**Identity Separation:** MLS signing keys are distinct from Nostr identity keys

**Regular Key Rotation:** Automatic key updates enhance security over time

</div>
</section>

<div class="lead">Privacy is guaranteed by cryptography,<br>not policy.</div>

<section>
<div class="box ember">

### Speed and Scale

Groups operate across distributed relays, not a single backend. Transport is federated through simple relay endpoints, and the membership state is anchored in MLS, rather than a central server.

Clients can subscribe to multiple relays, move between them, or replicate messages across several relays.

</div>
</section>

<section>
<div class="box marine">

### Open Network

Marmot is an open source protocol built for developers to enhance. We welcome feedback, security analysis, and contributions to help mature the protocol toward production readiness.

Implementations may choose which optional MIPs (Marmot Improvement Proposals) to implement based on their application's needs.

</div>
</section>

<div class="lead">A protocol should not lock users in.<br>It should let them move.</div>

</div>
