/**
 * generate-chapter-images.ts
 *
 * Phase 9 — Gemini Imagen-4 image generation.
 * Generates chapter header banners for each of the 25 system design chapters.
 *
 * Usage:
 *   npx tsx scripts/generate-chapter-images.ts             # all chapters
 *   npx tsx scripts/generate-chapter-images.ts --chapter 1  # single chapter
 *   npx tsx scripts/generate-chapter-images.ts --dry-run    # show prompts only
 *
 * Requires GEMINI_API_KEY environment variable (or GOOGLE_AI_API_KEY).
 */

import { GoogleGenAI } from '@google/genai'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChapterConfig {
  id: string
  title: string
  prompt: string
}

// ---------------------------------------------------------------------------
// Style prefix for consistent aesthetic
// ---------------------------------------------------------------------------

const STYLE_PREFIX =
  'Clean, modern infographic-style technical illustration. Dark navy blue background (#1a1b2e). ' +
  'Minimalist flat design with glowing purple (#bd93f9) and cyan (#8be9fd) accent lines. ' +
  'Professional, educational, suitable for a programming textbook header. ' +
  'No text, no labels, no words, no letters, no numbers overlaid on the image. ' +
  'Wide 16:9 aspect ratio composition. '

// ---------------------------------------------------------------------------
// Chapter prompt map
// ---------------------------------------------------------------------------

const CHAPTERS: ChapterConfig[] = [
  {
    id: 'ch01',
    title: 'Introduction to System Design',
    prompt: STYLE_PREFIX + 'Abstract visualization of interconnected system components: servers, databases, and network nodes connected by glowing lines forming a constellation pattern. A magnifying glass hovering over the network suggests analysis and design thinking.',
  },
  {
    id: 'ch02',
    title: 'Scalability',
    prompt: STYLE_PREFIX + 'Visual metaphor for scalability: a single small server cube on the left growing into a massive grid of identical cubes on the right, with arrows indicating both vertical (upward) and horizontal (sideways) growth. Gradient from small to large.',
  },
  {
    id: 'ch03',
    title: 'Core Trade-offs',
    prompt: STYLE_PREFIX + 'A balanced scale/seesaw with abstract geometric shapes on each side representing trade-offs. One side has a shield (consistency/safety), the other has a speedometer (performance/availability). The fulcrum glows, showing the tension point.',
  },
  {
    id: 'ch04',
    title: 'Back-of-Envelope Estimation',
    prompt: STYLE_PREFIX + 'A futuristic calculator or abacus floating in space, surrounded by floating numbers (powers of 2), data size units, and mathematical symbols. Binary digits cascade in the background like digital rain.',
  },
  {
    id: 'ch05',
    title: 'DNS',
    prompt: STYLE_PREFIX + 'A hierarchical tree structure representing DNS resolution: root servers at top, TLD servers in middle, authoritative servers at bottom. Glowing queries travel down the tree branches. Globe icon at top suggests worldwide resolution.',
  },
  {
    id: 'ch06',
    title: 'Load Balancing',
    prompt: STYLE_PREFIX + 'A central hub distributing incoming arrows (requests) evenly across multiple server nodes arranged in a fan pattern. Health check pulses emanate from each server. Traffic flows smoothly like water being distributed through channels.',
  },
  {
    id: 'ch07',
    title: 'Caching',
    prompt: STYLE_PREFIX + 'Multi-layer caching visualization: concentric rings representing cache hierarchy — browser cache (innermost, fastest), CDN, application cache, database cache (outermost). Lightning bolt icons show speed at inner layers. Data objects float between layers.',
  },
  {
    id: 'ch08',
    title: 'CDN & Content Delivery',
    prompt: STYLE_PREFIX + 'A globe with multiple edge server nodes positioned around its surface, connected by glowing network lines to a central origin server. Content packets radiate outward from edge nodes to nearby users. Geographic distribution pattern.',
  },
  {
    id: 'ch09',
    title: 'Databases — SQL',
    prompt: STYLE_PREFIX + 'Structured relational database visualization: neatly organized table grids with rows and columns, connected by relationship lines (foreign keys). Master-slave replication shown as one large table mirrored to smaller copies. ACID properties represented as a locked vault.',
  },
  {
    id: 'ch10',
    title: 'Databases — NoSQL',
    prompt: STYLE_PREFIX + 'Four distinct NoSQL data model shapes: a key-value pair (simple box), a document (JSON-like nested structure), a wide-column table (sparse grid), and a graph (interconnected nodes). Each in its own quadrant with distinct glow colors.',
  },
  {
    id: 'ch11',
    title: 'Message Queues',
    prompt: STYLE_PREFIX + 'A conveyor belt system with messages (envelope icons) flowing from producers on the left through a queue buffer in the center to consumers on the right. Some messages branch into multiple paths (pub/sub fan-out). Dead letter queue shown as a side channel.',
  },
  {
    id: 'ch12',
    title: 'Communication Protocols',
    prompt: STYLE_PREFIX + 'Layered protocol stack visualization: bottom layer shows raw TCP/UDP packets, middle shows HTTP request/response, top shows REST/gRPC/GraphQL/WebSocket icons. Data transforms as it passes through each layer. Bidirectional arrows for WebSocket.',
  },
  {
    id: 'ch13',
    title: 'Microservices',
    prompt: STYLE_PREFIX + 'Contrast between a monolith (single large hexagon) on the left and microservices (many small connected hexagons) on the right, with an arrow showing the transformation. API gateway sits at the top routing traffic. Service mesh lines connect the small hexagons.',
  },
  {
    id: 'ch14',
    title: 'Event-Driven Architecture',
    prompt: STYLE_PREFIX + 'Event stream visualization: a central event bus (horizontal pipeline) with events (glowing particles) flowing through it. Multiple services subscribe to different event types, shown as branching channels. Event sourcing shown as a timeline/log below.',
  },
  {
    id: 'ch15',
    title: 'Data Replication & Consistency',
    prompt: STYLE_PREFIX + 'Three database replicas connected in a triangle, with data synchronization waves flowing between them. A leader node at top sends replication streams to followers. Consistency spectrum shown as a gradient bar from strong to eventual.',
  },
  {
    id: 'ch16',
    title: 'Security & Reliability',
    prompt: STYLE_PREFIX + 'A fortress/shield protecting a system architecture. Multiple defense layers: firewall wall, authentication lock, rate limiting gate (with a funnel), and circuit breaker switch. Threat arrows bounce off the shield layers.',
  },
  {
    id: 'ch17',
    title: 'Monitoring & Observability',
    prompt: STYLE_PREFIX + 'A mission control dashboard with three pillars: metrics (line charts), logs (scrolling text streams), and traces (connected dots forming request paths). Central eye/lens icon suggests observability. Alert bells at threshold lines.',
  },
  {
    id: 'ch18',
    title: 'URL Shortener & Pastebin',
    prompt: STYLE_PREFIX + 'A long URL string being compressed/shortened into a tiny code through a funnel. Hash function gears process the input. Cache layer (Redis icon) serves redirects at lightning speed. Analytics graphs show click tracking below.',
  },
  {
    id: 'ch19',
    title: 'Social Media Feed',
    prompt: STYLE_PREFIX + 'Fan-out visualization: a single post radiating outward to hundreds of user feed caches. Celebrity node with massive fan-out contrasts with normal user with small fan-out. Timeline feed shown as a scrolling card stack.',
  },
  {
    id: 'ch20',
    title: 'Chat & Messaging System',
    prompt: STYLE_PREFIX + 'Real-time chat architecture: two user avatars connected by bidirectional WebSocket lines through a message server hub. Message bubbles float between them. Group chat shown as multiple connections to a single channel. Delivery status checkmarks (sent, delivered, read).',
  },
  {
    id: 'ch21',
    title: 'Video Streaming Platform',
    prompt: STYLE_PREFIX + 'Video pipeline visualization: raw video file enters a transcoding farm (gear icons), outputs multiple resolution streams (240p to 4K), distributed via CDN nodes to devices (phone, TV, laptop). Adaptive bitrate shown as dynamic quality switching.',
  },
  {
    id: 'ch22',
    title: 'Ride-Sharing & Geospatial',
    prompt: STYLE_PREFIX + 'Map grid with geohash cells highlighted. Driver icons moving on the grid. Matching algorithm connecting a rider pin to the nearest available driver with a glowing path line. Surge pricing heat zones shown as colored overlays.',
  },
  {
    id: 'ch23',
    title: 'Cloud-Native & Serverless',
    prompt: STYLE_PREFIX + 'Container orchestration: Kubernetes pods (small cubes) arranged in nodes (larger cubes) managed by a control plane. Serverless functions shown as ephemeral sparkles that appear and disappear. Docker whale icon subtly integrated.',
  },
  {
    id: 'ch24',
    title: 'ML Systems & AI Infrastructure',
    prompt: STYLE_PREFIX + 'ML pipeline flow: data lake → feature store → training cluster (GPU icons) → model registry → inference servers → user. Neural network layers visible inside the training step. RAG architecture shown with vector database connecting to LLM.',
  },
  {
    id: 'ch25',
    title: 'Interview Framework & Cheat Sheets',
    prompt: STYLE_PREFIX + 'A structured 4-step framework shown as ascending steps/stairs: Requirements → Estimation → Design → Deep Dive. A clock/timer overlay shows time allocation. Cheat sheet cards float around with quick-reference patterns. Trophy at the top step.',
  },
]

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const OUTPUT_BASE = path.resolve(__dirname, '../public/images')
const RATE_LIMIT_MS = 3000
const MAX_RETRIES = 3

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

function createClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable is required')
  }
  return new GoogleGenAI({ apiKey })
}

async function generateImage(
  client: GoogleGenAI,
  prompt: string,
  retries = MAX_RETRIES
): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: [{ role: 'user', parts: [{ text: `Generate an image: ${prompt}` }] }],
        config: {
          responseModalities: ['image', 'text'],
        },
      })

      // Extract image from response parts
      const parts = response.candidates?.[0]?.content?.parts
      if (!parts) throw new Error('No response parts')

      const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'))
      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in response')
      }

      return Buffer.from(imagePart.inlineData.data, 'base64')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`  Attempt ${attempt}/${retries} failed: ${errorMsg}`)
      if (attempt < retries) {
        const backoff = RATE_LIMIT_MS * attempt
        console.log(`  Retrying in ${backoff}ms...`)
        await sleep(backoff)
      } else {
        throw err
      }
    }
  }
  throw new Error('Should not reach here')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function saveImage(buffer: Buffer, outputPath: string): void {
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(outputPath, buffer)
  console.log(`  Saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`)
}

async function processChapter(
  client: GoogleGenAI,
  chapter: ChapterConfig,
  dryRun: boolean
): Promise<boolean> {
  console.log(`\n[${chapter.id}] ${chapter.title}`)

  const bannerPath = path.join(OUTPUT_BASE, chapter.id, 'banner.png')

  if (fs.existsSync(bannerPath)) {
    console.log('  Already exists, skipping.')
    return true
  }

  if (dryRun) {
    console.log(`  Prompt: ${chapter.prompt.substring(0, 120)}...`)
    return true
  }

  try {
    const buffer = await generateImage(client, chapter.prompt)
    saveImage(buffer, bannerPath)
    await sleep(RATE_LIMIT_MS)
    return true
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`  FAILED: ${errorMsg}`)
    return false
  }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const chapterFlag = args.indexOf('--chapter')
  const targetChapter = chapterFlag !== -1 ? args[chapterFlag + 1] : null

  if (!dryRun) {
    const client = createClient()
    console.log('Gemini client initialized.')
  }

  const chaptersToProcess = targetChapter
    ? CHAPTERS.filter(c => c.id === `ch${targetChapter.padStart(2, '0')}`)
    : CHAPTERS

  if (chaptersToProcess.length === 0) {
    console.error(`No chapter found for: ${targetChapter}`)
    process.exit(1)
  }

  console.log(`Processing ${chaptersToProcess.length} chapter(s)${dryRun ? ' (DRY RUN)' : ''}...`)

  const client = dryRun ? null : createClient()
  let success = 0
  let failed = 0

  for (const chapter of chaptersToProcess) {
    const ok = await processChapter(client!, chapter, dryRun)
    if (ok) success++
    else failed++
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`)
  if (failed > 0) process.exit(1)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
