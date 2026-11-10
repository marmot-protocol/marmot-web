---
title: Documentation
description: Documentation — guides synced from the latest published Marmot releases.
pageClass: mm-docs
editLink: false
sidebarDepth: 0
---

<script setup>
import { repo, version, sourceUrl, html } from '@documentation/overview.json'
</script>

# Documentation

<DocumentationPage :document="{ repo, version, sourceUrl, html }" />
