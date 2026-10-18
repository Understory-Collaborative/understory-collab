// A test of hedcut profile portraits made by Google's Gemini image model on Vertex AI,
// before it goes into the profile sync. It sends one photo with the house style written
// out, and optionally a style example image, and saves what comes back.
//
// It signs in as a Google service account, not with an API key, the way Google
// recommends. That's the same service account the blog sync uses, with the Vertex AI
// User role added. It looks for credentials in this order:
//   GOOGLE_SERVICE_ACCOUNT_KEY      the service account JSON, as a string (what GitHub
//                                   Actions has)
//   GOOGLE_APPLICATION_CREDENTIALS  a path to the service account's JSON key file
//   gcloud's application default credentials, from `gcloud auth application-default login`
//
// Run, with Node 20 or later (the .env.local flag is only needed if you keep settings there):
//   node --env-file=.env.local scripts/portrait-test.js <photo> <output.png> [style example]
//
// Optional settings: GOOGLE_CLOUD_PROJECT (defaults to the credentials' project),
// GOOGLE_CLOUD_LOCATION (defaults to global), and GEMINI_IMAGE_MODEL (default below). A
// style example helps the look but can leak the example person's features into the
// portrait, so compare runs with and without one.

import { readFileSync, writeFileSync } from 'node:fs'
import { extname } from 'node:path'
import { GoogleAuth } from 'google-auth-library'

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global'

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
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    ...(process.env.GOOGLE_SERVICE_ACCOUNT_KEY && {
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    }),
  })
  const project = process.env.GOOGLE_CLOUD_PROJECT || (await auth.getProjectId())
  const host = LOCATION === 'global' ? 'aiplatform.googleapis.com' : `${LOCATION}-aiplatform.googleapis.com`
  const endpoint = `https://${host}/v1/projects/${project}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`
  const { token } = await (await auth.getClient()).getAccessToken()

  const parts = [{ text: STYLE_PROMPT }, inlineImage(photo)]
  if (styleExample) {
    parts.push({
      text: 'Match the drawing style of this second image: its stippling, line work, and texture. Do not copy anything about this second person; only the style.',
    })
    parts.push(inlineImage(styleExample))
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(`Vertex AI returned ${response.status}: ${body.error?.message || 'no message'}`)

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
  console.error('usage: node scripts/portrait-test.js <photo> <output.png> [style example]')
  process.exit(1)
}
try {
  writeFileSync(output, await generatePortrait(photo, styleExample))
  console.log(`wrote ${output} with ${MODEL}${styleExample ? ', using the style example' : ''}`)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
