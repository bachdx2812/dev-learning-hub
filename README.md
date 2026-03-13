# The Engineer's Handbook

> System Design, Design Patterns & more to come — master engineering, one concept at a time.

**[Read the handbook](https://bachdx-learning-hub.vercel.app)**

## What's Inside

**31 chapters** across 2 sections:

### System Design (25 chapters, ~14 hours)

| Part | Chapters | Topics |
|------|----------|--------|
| Fundamentals | Ch 01-04 | Scalability, CAP & PACELC, back-of-envelope estimation, tail latency |
| Building Blocks | Ch 05-12 | DNS, load balancing, caching, CDN, SQL & NoSQL, message queues, protocols |
| Architecture & Patterns | Ch 13-17 | Microservices, event-driven, data replication, security, monitoring |
| Case Studies | Ch 18-22 | URL shortener, social feed, chat messaging, video streaming, ride-sharing |
| Modern Mastery | Ch 23-25 | Cloud-native, ML systems, interview framework & cheat sheets |

### Design Patterns (6 chapters, ~4 hours)

| Chapter | Patterns |
|---------|----------|
| Foundations & Creational | Factory Method, Abstract Factory, Builder, Singleton, Prototype |
| Structural | Adapter, Decorator, Facade, Proxy, Composite, Bridge |
| Behavioral | Observer, Strategy, Command, Chain of Responsibility, State, Template Method |
| Modern Application | Repository, DI, Middleware/Pipeline, Circuit Breaker, Retry with Backoff |
| Distributed Systems | CQRS, Event Sourcing, Saga, Strangler Fig, Sidecar |
| Anti-Patterns & Guide | God Object, Spaghetti Architecture, Golden Hammer + decision matrix |

All design patterns include **practical Go code** with BEFORE/AFTER examples.

## Features

- 200+ Mermaid diagrams
- Comparison tables for quick decision-making
- Practice questions with difficulty levels and hints
- 27 design patterns with Go BEFORE/AFTER code
- Progress tracking (localStorage-based)
- Dracula dark theme
- Full-text search

## AI Skills

The handbook knowledge is also available as AI coding assistant skills:

**[system-design-advisor](https://github.com/bachdx2812/system-design-advisor)** — 3 skills for Claude Code & Cursor, tested against 100 real interview problems.

## Tech Stack

- [VitePress](https://vitepress.dev/) — Static site generator
- [Dracula](https://draculatheme.com/) — Color theme
- [Vercel](https://vercel.com/) — Deployment
- JetBrains Mono (headings + code) + Inter (body text)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Contributing

Found an error? Have a suggestion? PRs and issues are welcome.

This project is built by one developer learning in public. Some content may contain inaccuracies — contributions help make it better for everyone.

## Acknowledgements

Inspired by Alex Xu's *System Design Interview* series, Martin Kleppmann's *Designing Data-Intensive Applications*, the Google SRE books, and the Gang of Four's *Design Patterns*.

Built with [Claude Code](https://claude.ai/code) and [Perplexity](https://perplexity.ai) for research.

## License

[MIT](./LICENSE)
