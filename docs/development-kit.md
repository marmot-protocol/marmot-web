---
title: Development Kit
description: Build with MDK, choose a native or web integration, and explore independent Marmot implementations.
home: true
heroImage: /images/marmot-marine.svg
heroText: Build with Marmot.
tagline: Build private messaging into your app. The Marmot Development Kit brings together the Rust runtime, encrypted storage, networking, and native bindings used to build Marmot clients.
pageClass: devkit mm-editorial
sidebar: false
actions:
  - text: Documentation
    link: /docs/
    type: primary
  - text: View on GitHub
    link: https://github.com/marmot-protocol/mdk
    type: secondary
---

<div class="mm-container">

<section class="mm-section">

## Choose how you want to build

<p class="mm-section-intro">Start with the integration that fits your project. Each guide covers the setup and responsibilities of your application.</p>

<DeveloperPaths />

</section>

<section class="mm-section">

## What MDK handles

<div class="mm-card-grid mm-capabilities">
<article>

### Accounts and identities

Account management, signing integration, public-key discovery, and the lifecycle of the KeyPackages people use to invite one another.

</article>
<article>

### Groups and membership

Group creation, invitations, member and administrator changes, and processing the group’s shared state.

</article>
<article>

### Messages and media

Encrypted messaging, attachment handling, and conversation data your application can present to its users.

</article>
<article>

### Storage and application state

Encrypted local persistence, multiple accounts, and APIs that provide current state and updates to your interface.

</article>
<article>

### Delivery and recovery

Relay connections, reconnect handling, catch-up, and mechanisms for recovering group state.

</article>
<article>

### Integration tools

Native bindings, command-line tools, agent connectors, diagnostics, and versioned upgrade guides.

</article>
</div>

[Explore the application runtime](/docs/rust-runtime.html)

</section>

<section class="mm-section">

## SDKs, tools, and integrations

Explore implementations, libraries, agent integrations, and supporting tools from Awesome Marmot. For applications you can use, [browse Apps](/apps.html).

<CatalogDirectory audience="developers" />

</section>

<section class="mm-section mm-closing">

## Bring your questions. Share what you build.

You don’t need a finished project to join the conversation. Meet other developers, discuss an integration, or help improve the protocol.

[Join the community →](/community.html)

</section>
</div>
