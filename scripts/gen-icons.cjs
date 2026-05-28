// Generates pwa-192x192.png and pwa-512x512.png in public/
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// CRC32 for PNG chunks
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function drawCircle(pixels, size, cx, cy, r, color) {
  const r2 = r * r
  for (let y = Math.max(0, cy - r); y <= Math.min(size - 1, cy + r); y++) {
    for (let x = Math.max(0, cx - r); x <= Math.min(size - 1, cx + r); x++) {
      const dx = x - cx, dy = y - cy
      if (dx * dx + dy * dy <= r2) {
        const i = (y * size + x) * 4
        pixels[i] = color[0]; pixels[i+1] = color[1]; pixels[i+2] = color[2]; pixels[i+3] = 255
      }
    }
  }
}

function drawRect(pixels, size, x1, y1, x2, y2, color) {
  for (let y = Math.max(0, y1); y < Math.min(size, y2); y++) {
    for (let x = Math.max(0, x1); x < Math.min(size, x2); x++) {
      const i = (y * size + x) * 4
      pixels[i] = color[0]; pixels[i+1] = color[1]; pixels[i+2] = color[2]; pixels[i+3] = 255
    }
  }
}

function drawRoundedRect(pixels, size, x1, y1, x2, y2, rx, color) {
  // fill interior (minus corners)
  drawRect(pixels, size, x1 + rx, y1, x2 - rx, y2, color)
  drawRect(pixels, size, x1, y1 + rx, x2, y2 - rx, color)
  // four corner circles
  drawCircle(pixels, size, x1 + rx, y1 + rx, rx, color)
  drawCircle(pixels, size, x2 - rx - 1, y1 + rx, rx, color)
  drawCircle(pixels, size, x1 + rx, y2 - rx - 1, rx, color)
  drawCircle(pixels, size, x2 - rx - 1, y2 - rx - 1, rx, color)
}

function drawLine(pixels, size, x1, y1, x2, y2, thick, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2 + 1
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const x = Math.round(x1 + (x2 - x1) * t)
    const y = Math.round(y1 + (y2 - y1) * t)
    for (let dy = -thick; dy <= thick; dy++) {
      for (let dx = -thick; dx <= thick; dx++) {
        if (dx*dx + dy*dy <= thick*thick) {
          const px = x + dx, py = y + dy
          if (px >= 0 && px < size && py >= 0 && py < size) {
            const i = (py * size + px) * 4
            pixels[i] = color[0]; pixels[i+1] = color[1]; pixels[i+2] = color[2]; pixels[i+3] = 255
          }
        }
      }
    }
  }
}

function generateIcon(size) {
  const cyan  = [8, 145, 178]   // #0891b2
  const white = [255, 255, 255]

  // RGBA pixels, initially transparent
  const pixels = new Uint8Array(size * size * 4)

  // Full-bleed cyan background (good for maskable)
  drawRect(pixels, size, 0, 0, size, size, cyan)

  // White rounded card representing an open book
  const pad   = Math.round(size * 0.18)
  const rx    = Math.round(size * 0.07)
  const midX  = Math.round(size / 2)
  const top   = pad
  const bot   = size - pad
  const half  = Math.round(size * 0.04)  // spine half-width

  // Left page
  drawRoundedRect(pixels, size, pad, top, midX - half, bot, rx, white)
  // Right page
  drawRoundedRect(pixels, size, midX + half, top, size - pad, bot, rx, white)

  // Spine lines (cyan, drawn over the join)
  drawLine(pixels, size, midX - half, top + rx, midX - half, bot - rx, half, cyan)
  drawLine(pixels, size, midX + half, top + rx, midX + half, bot - rx, half, cyan)

  // Horizontal lines on left page (ruled lines)
  const lineColor = cyan
  const lineCount = 4
  const lineArea = bot - top - rx * 2
  const lx1 = pad + rx + Math.round(size * 0.04)
  const lx2 = midX - half - Math.round(size * 0.04)
  const lthick = Math.max(0, Math.round(size * 0.015) - 1)
  for (let li = 1; li <= lineCount; li++) {
    const ly = top + rx + Math.round(lineArea * li / (lineCount + 1))
    drawLine(pixels, size, lx1, ly, lx2, ly, lthick, lineColor)
  }

  // Encode as PNG (RGBA → RGB since PNG color type 2)
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0
    for (let x = 0; x < size; x++) {
      const si = (y * size + x) * 4
      row[1 + x * 3]     = pixels[si]
      row[1 + x * 3 + 1] = pixels[si + 1]
      row[1 + x * 3 + 2] = pixels[si + 2]
    }
    rows.push(row)
  }

  const raw = Buffer.concat(rows)
  const compressed = zlib.deflateSync(raw, { level: 9 })

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2  // 8-bit RGB

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const out = path.join(__dirname, '..', 'public')
fs.writeFileSync(path.join(out, 'pwa-192x192.png'), generateIcon(192))
fs.writeFileSync(path.join(out, 'pwa-512x512.png'), generateIcon(512))
console.log('Generated pwa-192x192.png and pwa-512x512.png')
