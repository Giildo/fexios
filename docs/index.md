---
layout: home

hero:
  name: Fexios
  text: Type-safe AJAX client
  tagline: A tiny wrapper around the native fetch API with typed responses and first-class error handling.
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction
    - theme: alt
      text: API reference
      link: /api/fexios

features:
  - icon: ⚡
    title: Native fetch
    details: No XHR, no polyfills. Runs in modern browsers and Node ≥ 22 with zero runtime dependencies.
  - icon: 🧩
    title: Type-safe responses
    details: FexiosResponse<D, E> unions the success and error shapes, so TypeScript knows exactly what you get.
  - icon: 🛡️
    title: No throw on error
    details: HTTP errors are returned, not thrown. Check ok and stay in control of your flow.
  - icon: 🔗
    title: Fluent modifiers
    details: Chain .credentials and .text to tweak a single request without extra options.
---
