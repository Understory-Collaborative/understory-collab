// A test of hedcut profile portraits made by Google's Gemini image model, before it goes
// into the profile sync. It sends one photo with the house style written out, and
// optionally a style example image, and saves what comes back.
//
// Put the key in .env.local (git ignores it):
//   GEMINI_API_KEY=your-key
// Then run, with Node 20 or later:
//   node --env-file=.env.local scripts/portrait-test.js <photo> <output.png> [style example]
//
// GEMINI_IMAGE_MODEL picks the model; the default is below. A style example helps the look
// but can leak the example person's features into the portrait, so compare runs with and
// without one.

import { readFileSync, writeFileSync } from 'node:fs'
import { extname } from 'node:path'

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// The house style: a hedcut, a stipple-and-hatching portrait engraving. The colors are
// design-system tokens (design-system/tokens/colors.css). webs approved this recipe on
// 2026-10-18 from a test in the Gemini app.
export const STYLE_PROMPT = `Redraw the person in this photo as a hedcut portrait: a stipple-and-hatching engraving in the style of a newspaper portrait drawing.

Likeness comes first. Keep this exact person recognizable: the same face shape, eyes, nose, mouth, eyebrows, hairstyle, glasses, and expression. Do not make them younger, thinner, or more conventionally attractive, and do not change their gender presentation.

Technique:
- One ink color, deep olive (#1c2902), on warm cream paper (#f3e8cc). No other colors, no gray wash, no flat fills.
- Skin is shaded only with stipple dots that follow the curves of the face in rows, small and sparse in the light, larger and denser in shadow. Leave the brightest highlights as bare paper.
- Hair is drawn with fine engraved lines that follow the direction the hair grows.
- Clothing is drawn with parallel or crossed hatching lines that follow the fabric.
- Light comes from one side, with a clear bright side and shadow side on the face.
- Very few outlines; edges come from changes in dot and line density.
- No reflections or glare on glasses. No text, letters, or logos on clothing.

Composition: head and shoulders, facing the viewer, centered, square, plain cream background, with the clothing fading out toward the bottom edge.`

function inlineImage(path) {
  const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[
    extname(path).toLowerCase()
  ]
  if (!type) throw new Error(`unsupported image type: ${path}`)
  return { inline_data: { mime_type: type, data: readFileSync(path).toString('base64') } }
}

export async function generatePortrait(photo, styleExample) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is not set (put it in .env.local)')

  const parts = [{ text: STYLE_PROMPT }, inlineImage(photo)]
  if (styleExample) {
    parts.push({
      text: 'Match the drawing style of this second image: its stippling, line work, and texture. Do not copy anything about this second person; only the style.',
    })
    parts.push(inlineImage(styleExample))
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ contents: [{ parts }] }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(`Gemini returned ${response.status}: ${body.error?.message || 'no message'}`)

  const returned = body.candidates?.[0]?.content?.parts || []
  const image = returned.find((part) => part.inlineData || part.inline_data)
  if (!image) {
    const text = returned.map((part) => part.text).filter(Boolean).join(' ')
    throw new Error(`Gemini sent no image${text ? `: ${text}` : ''}`)
  }
  return Buffer.from((image.inlineData || image.inline_data).data, 'base64')
}

const [photo, output, styleExample] = process.argv.slice(2)
if (!photo || !output) {
  console.error('usage: node --env-file=.env.local scripts/portrait-test.js <photo> <output.png> [style example]')
  process.exit(1)
}
try {
  writeFileSync(output, await generatePortrait(photo, styleExample))
  console.log(`wrote ${output} with ${MODEL}${styleExample ? ', using the style example' : ''}`)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
