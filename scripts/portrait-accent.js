// Keeps one color accent in a portrait and turns every other color olive. The portrait
// prompt allows one signature item in color, like red glasses, but the image model
// doesn't always stop at one; it often keeps lipstick colored too. This makes the rule
// hold every time.
//
// The accent is the hue with the most strongly colored pixels, and within that hue only
// the largest connected patch, which is the signature item: glasses frames cover far more
// of a portrait than lips do, and red lipstick can share the frames' hue, so hue alone
// can't separate them. Every other strongly colored pixel is repainted in olive at the
// same lightness, so its dots and lines stay.
//
// Try it on one portrait:
//   node scripts/portrait-accent.js <portrait.png> <output.png>

import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Design-system colors (design-system/tokens/colors.css), the same as the prompt's.
const INK = [0x1c, 0x29, 0x02]
const PAPER = [0xf3, 0xe8, 0xcc]

// A pixel counts as colored when it sits at least this far (in RGB) from the range of
// colors between olive ink and cream paper. Olive itself is a strong color, so measuring
// saturation alone would mistake the ink for an accent.
const COLORED = 30
// Near a repainted patch, a pixel this far from the ink range still counts as a tint.
const FAINT = 10
// How far from the accent's hue, in degrees, a pixel can be and still count as the accent.
const ACCENT_RANGE = 18
// The accent needs at least this share of the image, or there's no accent at all.
const MIN_ACCENT_SHARE = 0.002

function hueAndSaturation(red, green, blue) {
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const saturation = max === 0 ? 0 : (max - min) / max
  if (max === min) return { hue: 0, saturation }
  let hue
  if (max === red) hue = ((green - blue) / (max - min)) % 6
  else if (max === green) hue = (blue - red) / (max - min) + 2
  else hue = (red - green) / (max - min) + 4
  return { hue: (hue * 60 + 360) % 360, saturation }
}

// Distance from the line between ink and paper, in RGB.
function offInkRange(red, green, blue) {
  const line = PAPER.map((value, channel) => value - INK[channel])
  const point = [red - INK[0], green - INK[1], blue - INK[2]]
  const length = line.reduce((sum, value) => sum + value * value, 0)
  const along = Math.min(1, Math.max(0, point.reduce((sum, value, channel) => sum + value * line[channel], 0) / length))
  return Math.hypot(...point.map((value, channel) => value - along * line[channel]))
}

// Joins accent pixels within this many pixels of each other into one patch, so a stippled
// frame counts as one piece rather than a scatter of dots.
const JOIN = 4

// The largest connected patch of a mask (1 = in), after joining nearby pixels. Returns a
// mask of just that patch, in the joined form.
async function largestPatch(mask, width, height) {
  const { data: spread } = await sharp(Buffer.from(mask.map((value) => value * 255)), {
    raw: { width, height, channels: 1 },
  })
    .blur(JOIN)
    .extractChannel(0) // sharp would otherwise hand back three channels
    .raw()
    .toBuffer({ resolveWithObject: true })
  const joined = spread.map((value) => (value > 8 ? 1 : 0))
  const label = new Int32Array(width * height)
  let best = 0
  let bestSize = 0
  let next = 0
  for (let start = 0; start < joined.length; start++) {
    if (!joined[start] || label[start]) continue
    next++
    let size = 0
    const stack = [start]
    label[start] = next
    while (stack.length) {
      const index = stack.pop()
      size++
      const x = index % width
      const neighbors = [index - width, index + width, x > 0 ? index - 1 : -1, x < width - 1 ? index + 1 : -1]
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < joined.length && joined[neighbor] && !label[neighbor]) {
          label[neighbor] = next
          stack.push(neighbor)
        }
      }
    }
    if (size > bestSize) {
      bestSize = size
      best = next
    }
  }
  return label.map((value) => (value === best && best ? 1 : 0))
}

const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))
const lightness = (red, green, blue) => 0.3 * red + 0.59 * green + 0.11 * blue

export async function keepOneAccent(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const pixelCount = info.width * info.height

  // Find the hue that most colored pixels share, in 10-degree bins.
  const bins = new Array(36).fill(0)
  for (let at = 0; at < data.length; at += 3) {
    if (offInkRange(data[at], data[at + 1], data[at + 2]) <= COLORED) continue
    const { hue } = hueAndSaturation(data[at], data[at + 1], data[at + 2])
    bins[Math.floor(hue / 10) % 36]++
  }
  const top = bins.indexOf(Math.max(...bins))
  const accentHue = top * 10 + 5
  const hasAccent = bins[top] / pixelCount > MIN_ACCENT_SHARE

  // The accent is only the biggest patch of that hue.
  const accentMask = new Uint8Array(pixelCount)
  if (hasAccent) {
    for (let at = 0, index = 0; at < data.length; at += 3, index++) {
      if (offInkRange(data[at], data[at + 1], data[at + 2]) <= COLORED) continue
      const { hue } = hueAndSaturation(data[at], data[at + 1], data[at + 2])
      if (hueGap(hue, accentHue) <= ACCENT_RANGE) accentMask[index] = 1
    }
  }
  const keep = hasAccent ? await largestPatch(accentMask, info.width, info.height) : accentMask

  // Repaint everything else that's colored in olive, matched by lightness.
  const inkLight = lightness(...INK)
  const paperLight = lightness(...PAPER)
  const repaint = (at) => {
    const share = Math.min(1, Math.max(0, (lightness(data[at], data[at + 1], data[at + 2]) - inkLight) / (paperLight - inkLight)))
    for (let channel = 0; channel < 3; channel++) {
      data[at + channel] = Math.round(INK[channel] + (PAPER[channel] - INK[channel]) * share)
    }
  }
  const repaintedMask = new Uint8Array(pixelCount)
  let repainted = 0
  for (let at = 0, index = 0; at < data.length; at += 3, index++) {
    if (offInkRange(data[at], data[at + 1], data[at + 2]) <= COLORED) continue
    if (accentMask[index] && keep[index]) continue
    repaint(at)
    repaintedMask[index] = 1
    repainted++
  }

  // A repainted patch, like lips, can keep pale tints in its highlights that are too
  // faint to count as colored. Right around what was repainted, repaint faint tints too.
  const { data: near } = await sharp(Buffer.from(repaintedMask.map((value) => value * 255)), {
    raw: { width: info.width, height: info.height, channels: 1 },
  })
    .blur(JOIN)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let at = 0, index = 0; at < data.length; at += 3, index++) {
    if (near[index] <= 8 || keep[index]) continue
    if (offInkRange(data[at], data[at + 1], data[at + 2]) <= FAINT) continue
    repaint(at)
    repainted++
  }

  const image = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer()
  return { image, accentHue: hasAccent ? accentHue : null, repainted }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [input, output] = process.argv.slice(2)
  if (!input || !output) {
    console.error('usage: node scripts/portrait-accent.js <portrait.png> <output.png>')
    process.exit(1)
  }
  const { image, accentHue, repainted } = await keepOneAccent(input)
  writeFileSync(output, image)
  console.log(`wrote ${output}: kept hue ${accentHue ?? 'none'}, repainted ${repainted} pixels olive`)
}
