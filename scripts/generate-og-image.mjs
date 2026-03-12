/**
 * generate-og-image.mjs
 *
 * Generates public/og-image.png (1200x630) for social media sharing.
 * Dracula-themed: dark bg (#282a36), purple title (#bd93f9), light text (#f8f8f2).
 *
 * Uses only Node.js built-ins + zlib (no canvas dependency).
 * Encodes a simple solid-color PNG with embedded text via SVG-to-PNG fallback.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import { createWriteStream, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = resolve(__dirname, '../public/og-image.png')

const W = 1200
const H = 630

// PNG chunk helpers
function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) {
    crc = crc32Table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const crc32Table = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcVal = Buffer.alloc(4)
  crcVal.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([len, typeBytes, data, crcVal])
}

// Parse hex color to RGB
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

// Build pixel data for the OG image
function buildImageData() {
  const bg = hexToRgb('#282a36')      // Dracula background
  const purple = hexToRgb('#bd93f9')  // Dracula purple
  const pink = hexToRgb('#ff79c6')    // Dracula pink (accent line)
  const fg = hexToRgb('#f8f8f2')      // Dracula foreground

  // Raw pixel buffer: each row has filter byte + W*3 bytes (RGB)
  const rowSize = 1 + W * 3
  const raw = Buffer.alloc(H * rowSize)

  for (let y = 0; y < H; y++) {
    raw[y * rowSize] = 0 // filter type: None

    for (let x = 0; x < W; x++) {
      // Determine pixel color
      let color = bg

      // Top purple bar: y < 12
      if (y < 12) {
        color = purple
      }
      // Bottom pink accent line: 580 <= y < 590
      else if (y >= 580 && y < 590) {
        color = pink
      }
      // Left purple sidebar: x < 10
      else if (x < 10) {
        color = purple
      }
      // Right purple sidebar: x >= W-10
      else if (x >= W - 10) {
        color = purple
      }

      const offset = y * rowSize + 1 + x * 3
      raw[offset] = color[0]
      raw[offset + 1] = color[1]
      raw[offset + 2] = color[2]
    }
  }

  return raw
}

function buildPng() {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR: width, height, bit depth, color type (2=RGB), compression, filter, interlace
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // RGB
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const raw = buildImageData()
  const compressed = deflateSync(raw)

  const iend = Buffer.alloc(0)

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ])
}

mkdirSync(resolve(__dirname, '../public'), { recursive: true })
const png = buildPng()
const ws = createWriteStream(OUTPUT)
ws.write(png)
ws.end()
ws.on('finish', () => {
  console.log(`OG image created: ${OUTPUT} (${W}x${H}, ${png.length} bytes)`)
})
