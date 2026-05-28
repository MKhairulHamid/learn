// Generates flat-design app mockup screenshots for PWA manifest
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// ── PNG helpers ────────────────────────────────────────────────────────────

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
  const lenBuf = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length)
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function encodePNG(pixels, w, h) {
  const rows = []
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3)
    row[0] = 0
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      row[1 + x * 3] = pixels[i]; row[1 + x * 3 + 1] = pixels[i+1]; row[1 + x * 3 + 2] = pixels[i+2]
    }
    rows.push(row)
  }
  const compressed = zlib.deflateSync(Buffer.concat(rows), { level: 6 })
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8; ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Drawing primitives ─────────────────────────────────────────────────────

function px(pixels, w, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= w || y < 0) return
  const i = (y * w + x) * 4
  if (a === 255) { pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = 255 }
  else {
    const t = a / 255
    pixels[i] = Math.round(pixels[i] * (1 - t) + r * t)
    pixels[i+1] = Math.round(pixels[i+1] * (1 - t) + g * t)
    pixels[i+2] = Math.round(pixels[i+2] * (1 - t) + b * t)
    pixels[i+3] = 255
  }
}

function fillRect(pixels, w, x1, y1, x2, y2, [r, g, b], a = 255) {
  for (let y = Math.max(0, y1); y < y2; y++)
    for (let x = Math.max(0, x1); x < x2; x++)
      px(pixels, w, x, y, r, g, b, a)
}

function fillRoundedRect(pixels, w, x1, y1, x2, y2, rx, color, a = 255) {
  const [r, g, b] = color
  const rx2 = rx * rx
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      let inside = true
      if (x < x1 + rx && y < y1 + rx) { const dx = x - (x1+rx), dy = y - (y1+rx); inside = dx*dx+dy*dy <= rx2 }
      else if (x >= x2 - rx && y < y1 + rx) { const dx = x - (x2-rx-1), dy = y - (y1+rx); inside = dx*dx+dy*dy <= rx2 }
      else if (x < x1 + rx && y >= y2 - rx) { const dx = x - (x1+rx), dy = y - (y2-rx-1); inside = dx*dx+dy*dy <= rx2 }
      else if (x >= x2 - rx && y >= y2 - rx) { const dx = x - (x2-rx-1), dy = y - (y2-rx-1); inside = dx*dx+dy*dy <= rx2 }
      if (inside) px(pixels, w, x, y, r, g, b, a)
    }
  }
}

// Simple 5×7 pixel font (A-Z 0-9 space)
const GLYPHS = {
  ' ': [0,0,0,0,0], '!': [2,2,2,0,2], '.': [0,0,0,0,2],
  'A': [14,17,31,17,17], 'B': [30,17,30,17,30], 'C': [14,17,16,17,14],
  'D': [30,17,17,17,30], 'E': [31,16,30,16,31], 'F': [31,16,30,16,16],
  'G': [14,17,16,19,14], 'H': [17,17,31,17,17], 'I': [14,4,4,4,14],
  'J': [7,2,2,18,12], 'K': [17,18,28,18,17], 'L': [16,16,16,16,31],
  'M': [17,27,21,17,17], 'N': [17,25,21,19,17], 'O': [14,17,17,17,14],
  'P': [30,17,30,16,16], 'Q': [14,17,17,21,14], 'R': [30,17,30,18,17],
  'S': [15,16,14,1,30], 'T': [31,4,4,4,4], 'U': [17,17,17,17,14],
  'V': [17,17,17,10,4], 'W': [17,17,21,27,17], 'X': [17,10,4,10,17],
  'Y': [17,17,14,4,4], 'Z': [31,2,4,8,31],
  '0': [14,19,21,25,14], '1': [4,12,4,4,14], '2': [14,1,6,8,15],
  '3': [14,1,6,1,14], '4': [17,17,15,1,1], '5': [15,8,14,1,14],
  '6': [6,8,14,17,14], '7': [15,1,2,4,4], '8': [14,17,14,17,14],
  '9': [14,17,15,1,6], '+': [0,4,14,4,0], '-': [0,0,14,0,0],
  '/': [1,2,4,8,16], '%': [17,2,4,8,17],
  'a': [0,14,17,17,15], 'b': [16,16,30,17,30], 'c': [0,14,16,17,14],
  'd': [1,1,15,17,15], 'e': [0,14,17,30,14], 'f': [6,8,14,8,8],
  'g': [0,15,17,15,1], 'h': [16,16,30,17,17], 'i': [4,0,4,4,4],
  'j': [2,0,2,2,12], 'k': [16,18,28,18,17], 'l': [12,4,4,4,14],
  'm': [0,27,21,17,17], 'n': [0,30,17,17,17], 'o': [0,14,17,17,14],
  'p': [0,30,17,30,16], 'q': [0,15,17,15,1], 'r': [0,14,16,16,16],
  's': [0,14,16,14,30], 't': [8,30,8,8,6], 'u': [0,17,17,17,15],
  'v': [0,17,17,10,4], 'w': [0,17,21,27,17], 'x': [0,17,10,10,17],
  'y': [0,17,15,1,14], 'z': [0,31,2,4,31],
}

function drawText(pixels, w, text, x, y, scale, color, alpha = 255) {
  const [r, g, b] = color
  let cx = x
  for (const ch of text) {
    const glyph = GLYPHS[ch] ?? GLYPHS[' ']
    for (let row = 0; row < 5; row++) {
      const bits = glyph[row]
      for (let col = 4; col >= 0; col--) {
        if (bits & (1 << col)) {
          for (let sy = 0; sy < scale; sy++)
            for (let sx = 0; sx < scale; sx++)
              px(pixels, w, cx + (4 - col) * scale + sx, y + row * scale + sy, r, g, b, alpha)
        }
      }
    }
    cx += (5 + 1) * scale
  }
}

// ── Colour palette (matches app) ───────────────────────────────────────────
const C = {
  bg:      [7, 11, 20],      // hero dark bg  #070b14
  bgMid:   [10, 20, 40],     // slightly lighter
  nav:     [255, 255, 255],  // white navbar
  navBdr:  [229, 231, 235],  // gray-200
  cyan:    [8, 145, 178],    // #0891b2  (primary-600)
  cyanLt:  [6, 182, 212],    // #06b6d4  (cyan-500)
  indigo:  [99, 102, 241],   // #6366f1  (indigo-500)
  white:   [255, 255, 255],
  gray50:  [249, 250, 251],
  gray100: [243, 244, 246],
  gray200: [229, 231, 235],
  gray400: [156, 163, 175],
  gray600: [75, 85, 99],
  gray800: [31, 41, 55],
  gray900: [17, 24, 39],
  cardBg:  [15, 23, 42],     // slate-900
  cardBdr: [30, 41, 59],     // slate-800
}

// ── Generate desktop screenshot 1280×720 ──────────────────────────────────
function generateDesktop() {
  const W = 1280, H = 720
  const pixels = new Uint8Array(W * H * 4)

  // ── Background: dark blue gradient ────────────────────────────────────
  for (let y = 0; y < H; y++) {
    const t = y / H
    const r = Math.round(C.bg[0] + (C.bgMid[0] - C.bg[0]) * t)
    const g = Math.round(C.bg[1] + (C.bgMid[1] - C.bg[1]) * t)
    const b = Math.round(C.bg[2] + (C.bgMid[2] - C.bg[2]) * t)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = 255
    }
  }

  // ── Navbar ─────────────────────────────────────────────────────────────
  fillRect(pixels, W, 0, 0, W, 56, C.white, 230) // semi-transparent white
  // bottom border
  fillRect(pixels, W, 0, 55, W, 56, C.gray200)
  // Logo mark
  fillRoundedRect(pixels, W, 16, 12, 46, 42, 6, C.cyan)
  // Logo text
  drawText(pixels, W, 'Learning Platform', 54, 18, 2, C.gray900)
  // Nav links
  drawText(pixels, W, 'Dashboard', 480, 20, 2, C.gray600)
  drawText(pixels, W, 'Curriculum', 600, 20, 2, C.gray600)
  drawText(pixels, W, 'Playground', 726, 20, 2, C.gray600)
  // Auth buttons
  fillRoundedRect(pixels, W, 1088, 12, 1168, 40, 8, C.gray100)
  drawText(pixels, W, 'Login', 1102, 18, 2, C.gray600)
  fillRoundedRect(pixels, W, 1176, 12, 1264, 40, 8, C.cyan)
  drawText(pixels, W, 'Register', 1184, 18, 2, C.white)

  // ── Badge / eyebrow ────────────────────────────────────────────────────
  const badge = 'Learning Platform  Live + Self Learning'
  fillRoundedRect(pixels, W, 395, 100, 885, 126, 12, C.cardBg, 180)
  fillRoundedRect(pixels, W, 395, 100, 885, 126, 12, C.cyanLt, 40)
  drawText(pixels, W, badge, 410, 106, 2, C.cyanLt, 200)

  // ── Hero headline ──────────────────────────────────────────────────────
  // "One platform for"
  drawText(pixels, W, 'One platform for', 270, 150, 4, C.white)
  // "live classes"  (cyan)
  drawText(pixels, W, 'live classes', 270, 200, 4, C.cyanLt)
  // "and"
  drawText(pixels, W, 'and', 270, 250, 4, C.white)
  // "self learning"  (indigo)
  drawText(pixels, W, 'self learning', 390, 250, 4, C.indigo)

  // ── Sub-headline ───────────────────────────────────────────────────────
  drawText(pixels, W, 'Join live sessions with expert mentors, rewatch', 290, 320, 2, C.gray400)
  drawText(pixels, W, 'recordings, practice in interactive playgrounds.', 290, 340, 2, C.gray400)

  // ── CTA buttons ────────────────────────────────────────────────────────
  fillRoundedRect(pixels, W, 290, 380, 490, 420, 12, C.cyan)
  drawText(pixels, W, 'Start Learning Free', 300, 390, 2, C.white)
  fillRoundedRect(pixels, W, 510, 380, 690, 420, 12, C.cardBg, 200)
  fillRoundedRect(pixels, W, 510, 380, 690, 420, 12, C.gray400, 60)
  drawText(pixels, W, 'Explore Programs', 520, 390, 2, C.white)

  // ── Stats row ──────────────────────────────────────────────────────────
  const stats = [['2', 'Active Programs'], ['37+', 'Live Sessions'], ['40+', 'Exercises'], ['BNSP', 'Certified']]
  stats.forEach(([num, label], idx) => {
    const sx = 160 + idx * 240
    fillRoundedRect(pixels, W, sx, 460, sx + 200, 540, 12, C.cardBg, 200)
    fillRoundedRect(pixels, W, sx, 460, sx + 200, 540, 12, C.cardBdr, 80)
    drawText(pixels, W, num, sx + 30, 475, 4, C.white)
    drawText(pixels, W, label, sx + 14, 515, 2, C.gray400)
  })

  // ── Program tabs (bottom) ─────────────────────────────────────────────
  fillRoundedRect(pixels, W, 190, 580, 530, 620, 12, C.white)
  drawText(pixels, W, 'Data Analyst Career Intelligence', 204, 592, 2, C.gray900)
  fillRoundedRect(pixels, W, 550, 580, 870, 620, 12, C.cardBg, 180)
  drawText(pixels, W, 'HR Fast Track Bootcamp', 564, 592, 2, C.white, 200)

  return encodePNG(pixels, W, H)
}

// ── Generate mobile screenshot 390×844 ────────────────────────────────────
function generateMobile() {
  const W = 390, H = 844
  const pixels = new Uint8Array(W * H * 4)

  // Background gradient
  for (let y = 0; y < H; y++) {
    const t = y / H
    const r = Math.round(C.bg[0] + (C.bgMid[0] - C.bg[0]) * t)
    const g = Math.round(C.bg[1] + (C.bgMid[1] - C.bg[1]) * t)
    const b = Math.round(C.bg[2] + (C.bgMid[2] - C.bg[2]) * t)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = 255
    }
  }

  // Navbar
  fillRect(pixels, W, 0, 0, W, 56, C.white, 230)
  fillRect(pixels, W, 0, 55, W, 56, C.gray200)
  fillRoundedRect(pixels, W, 12, 12, 42, 42, 6, C.cyan)
  drawText(pixels, W, 'Learning Platform', 50, 18, 2, C.gray900)
  // Hamburger icon
  fillRect(pixels, W, 354, 18, 378, 21, C.gray600)
  fillRect(pixels, W, 354, 26, 378, 29, C.gray600)
  fillRect(pixels, W, 354, 34, 378, 37, C.gray600)

  // Badge
  fillRoundedRect(pixels, W, 40, 88, 350, 110, 10, C.cardBg, 180)
  drawText(pixels, W, 'Live + Self Learning', 55, 94, 2, C.cyanLt, 200)

  // Hero text
  drawText(pixels, W, 'One platform for', 20, 130, 3, C.white)
  drawText(pixels, W, 'live classes', 20, 165, 3, C.cyanLt)
  drawText(pixels, W, 'and', 20, 200, 3, C.white)
  drawText(pixels, W, 'self learning', 90, 200, 3, C.indigo)

  // Subtext
  drawText(pixels, W, 'Join live sessions with expert mentors,', 20, 248, 2, C.gray400)
  drawText(pixels, W, 'rewatch recordings, practice in playgrounds.', 20, 266, 2, C.gray400)

  // Buttons
  fillRoundedRect(pixels, W, 20, 300, 230, 338, 10, C.cyan)
  drawText(pixels, W, 'Start Learning Free', 28, 311, 2, C.white)
  fillRoundedRect(pixels, W, 240, 300, 370, 338, 10, C.cardBg, 200)
  drawText(pixels, W, 'Explore', 252, 311, 2, C.white, 200)

  // Stats grid 2x2
  const stats = [['2', 'Programs'], ['37+', 'Sessions'], ['40+', 'Exercises'], ['BNSP', 'Certified']]
  stats.forEach(([num, label], idx) => {
    const col = idx % 2, row = Math.floor(idx / 2)
    const sx = 20 + col * 185, sy = 370 + row * 100
    fillRoundedRect(pixels, W, sx, sy, sx + 175, sy + 86, 10, C.cardBg, 200)
    fillRoundedRect(pixels, W, sx, sy, sx + 175, sy + 86, 10, C.cardBdr, 80)
    drawText(pixels, W, num, sx + 16, sy + 14, 4, C.white)
    drawText(pixels, W, label, sx + 10, sy + 58, 2, C.gray400)
  })

  // Program chips
  fillRoundedRect(pixels, W, 20, 590, 370, 628, 10, C.white)
  drawText(pixels, W, 'Data Analyst Career Intelligence', 34, 602, 2, C.gray900)
  fillRoundedRect(pixels, W, 20, 638, 370, 676, 10, C.cardBg, 180)
  drawText(pixels, W, 'HR Fast Track Bootcamp', 34, 650, 2, C.white, 200)

  // Bottom mobile nav bar
  fillRect(pixels, W, 0, H - 60, W, H, C.white)
  fillRect(pixels, W, 0, H - 61, W, H - 60, C.gray200)
  const navItems = ['Home', 'Learn', 'Play', 'Profile']
  navItems.forEach((label, i) => {
    const nx = 24 + i * 86
    fillRoundedRect(pixels, W, nx, H - 50, nx + 62, H - 28, 6, i === 0 ? C.cyan : C.gray100)
    drawText(pixels, W, label, nx + 4, H - 44, 2, i === 0 ? C.white : C.gray400)
  })

  return encodePNG(pixels, W, H)
}

const outDir = path.join(__dirname, '..', 'public', 'screenshots')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'desktop.png'), generateDesktop())
console.log('Generated desktop.png (1280×720)')
fs.writeFileSync(path.join(outDir, 'mobile.png'), generateMobile())
console.log('Generated mobile.png (390×844)')
