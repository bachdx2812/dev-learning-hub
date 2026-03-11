import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// Full sidebar with all 5 parts and 25 chapters
const systemDesignSidebar = [
  {
    text: '📚 System Design',
    link: '/system-design/',
    items: [
      {
        text: 'Part 1: Fundamentals',
        link: '/system-design/part-1-fundamentals/',
        collapsed: false,
        items: [
          { text: 'Ch 01 — Introduction to System Design', link: '/system-design/part-1-fundamentals/ch01-introduction-to-system-design' },
          { text: 'Ch 02 — Scalability', link: '/system-design/part-1-fundamentals/ch02-scalability' },
          { text: 'Ch 03 — Core Trade-offs', link: '/system-design/part-1-fundamentals/ch03-core-tradeoffs' },
          { text: 'Ch 04 — Back-of-Envelope Estimation', link: '/system-design/part-1-fundamentals/ch04-estimation' },
        ]
      },
      {
        text: 'Part 2: Building Blocks',
        link: '/system-design/part-2-building-blocks/',
        collapsed: true,
        items: [
          { text: 'Ch 05 — DNS', link: '/system-design/part-2-building-blocks/ch05-dns' },
          { text: 'Ch 06 — Load Balancing', link: '/system-design/part-2-building-blocks/ch06-load-balancing' },
          { text: 'Ch 07 — Caching', link: '/system-design/part-2-building-blocks/ch07-caching' },
          { text: 'Ch 08 — Content Delivery Networks', link: '/system-design/part-2-building-blocks/ch08-cdn' },
          { text: 'Ch 09 — Databases: SQL', link: '/system-design/part-2-building-blocks/ch09-databases-sql' },
          { text: 'Ch 10 — Databases: NoSQL', link: '/system-design/part-2-building-blocks/ch10-databases-nosql' },
          { text: 'Ch 11 — Message Queues', link: '/system-design/part-2-building-blocks/ch11-message-queues' },
          { text: 'Ch 12 — Communication Protocols', link: '/system-design/part-2-building-blocks/ch12-communication-protocols' },
        ]
      },
      {
        text: 'Part 3: Architecture & Patterns',
        link: '/system-design/part-3-architecture-patterns/',
        collapsed: true,
        items: [
          { text: 'Ch 13 — Microservices', link: '/system-design/part-3-architecture-patterns/ch13-microservices' },
          { text: 'Ch 14 — Event-Driven Architecture', link: '/system-design/part-3-architecture-patterns/ch14-event-driven-architecture' },
          { text: 'Ch 15 — Data Replication & Consistency', link: '/system-design/part-3-architecture-patterns/ch15-data-replication-consistency' },
          { text: 'Ch 16 — Security & Reliability', link: '/system-design/part-3-architecture-patterns/ch16-security-reliability' },
          { text: 'Ch 17 — Monitoring & Observability', link: '/system-design/part-3-architecture-patterns/ch17-monitoring-observability' },
        ]
      },
      {
        text: 'Part 4: Case Studies',
        link: '/system-design/part-4-case-studies/',
        collapsed: true,
        items: [
          { text: 'Ch 18 — URL Shortener & Pastebin', link: '/system-design/part-4-case-studies/ch18-url-shortener-pastebin' },
          { text: 'Ch 19 — Social Media Feed', link: '/system-design/part-4-case-studies/ch19-social-media-feed' },
          { text: 'Ch 20 — Chat & Messaging System', link: '/system-design/part-4-case-studies/ch20-chat-messaging-system' },
          { text: 'Ch 21 — Video Streaming Platform', link: '/system-design/part-4-case-studies/ch21-video-streaming-platform' },
          { text: 'Ch 22 — Ride-Sharing & Geospatial', link: '/system-design/part-4-case-studies/ch22-ride-sharing-geospatial' },
        ]
      },
      {
        text: 'Part 5: Modern & Mastery',
        link: '/system-design/part-5-modern-mastery/',
        collapsed: true,
        items: [
          { text: 'Ch 23 — Cloud-Native & Serverless', link: '/system-design/part-5-modern-mastery/ch23-cloud-native-serverless' },
          { text: 'Ch 24 — ML Systems & AI Infrastructure', link: '/system-design/part-5-modern-mastery/ch24-ml-systems-ai-infrastructure' },
          { text: 'Ch 25 — Interview Framework & Cheat Sheets', link: '/system-design/part-5-modern-mastery/ch25-interview-framework-cheat-sheets' },
        ]
      },
    ]
  }
]

export default withMermaid(
  defineConfig({
    title: "The Engineer's Handbook",
    description: "A comprehensive guide for software engineers — master system design, one concept at a time.",

    // Force dark mode only, no toggle
    appearance: 'dark',

    // Clean URLs without .html extension
    cleanUrls: true,

    // Ignore localhost links in plan reports
    ignoreDeadLinks: [/^http:\/\/localhost/],

    // Head metadata
    head: [
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap'
      }],
      ['meta', { name: 'theme-color', content: '#282a36' }],
    ],

    // Shiki dracula theme for code blocks
    markdown: {
      theme: {
        dark: 'dracula',
        light: 'dracula',
      },
      lineNumbers: true,
    },

    themeConfig: {
      // Site title in nav
      siteTitle: "The Engineer's Handbook",

      // Top navigation
      nav: [
        { text: 'System Design', link: '/system-design/' },
      ],

      // Sidebar navigation
      sidebar: {
        '/system-design/': systemDesignSidebar,
      },

      // Outline depth in right sidebar
      outline: {
        level: [2, 3],
        label: 'On This Page',
      },

      // Footer
      footer: {
        message: 'Built with VitePress + Dracula Theme',
        copyright: 'The Engineer\'s Handbook — Learn. Build. Master.',
      },

      // Search
      search: {
        provider: 'local',
      },

      // Social links (placeholder for GitHub)
      socialLinks: [],

      // Doc metadata
      lastUpdated: true,
    },

    // Mermaid config — themed to Dracula
    mermaid: {
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#282a36',
        mainBkg: '#44475a',
        nodeBorder: '#bd93f9',
        clusterBkg: '#282a36',
        titleColor: '#f8f8f2',
        edgeLabelBackground: '#44475a',
        lineColor: '#6272a4',
        primaryColor: '#44475a',
        primaryTextColor: '#f8f8f2',
        primaryBorderColor: '#bd93f9',
        secondaryColor: '#282a36',
        tertiaryColor: '#282a36',
        fontFamily: 'JetBrains Mono, monospace',
      },
    },

    mermaidPlugin: {
      class: 'mermaid',
    },
  })
)
