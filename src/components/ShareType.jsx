import { useEffect, useRef, useState } from 'react'
import ucLogo from '../assets/UC_Logo.png'
import { AXES } from '../data/tpmSelfCheckData'
import './ShareType.css'

// A reusable "share your type" block: a downloadable 1080x1080 card plus share buttons.
// Used on the self-check result (with the person's own profile vector when available) and on
// each type page (with the type's prototype `v`). The card is drawn on a Canvas so it uses the
// loaded Overpass web font reliably, then exported as a PNG. Nothing is sent to a server.
//
// Sharing note: neither LinkedIn nor a copied link can pre-attach the PNG we generate. The
// flow is "download the image, then post it," while the buttons share the type-page link
// (LinkedIn pulls that page's Open Graph). That split is expected, not a bug.

const AXIS_LABELS = AXES.map((a) => a.short)

// Canvas is authored in a 1080-unit square, then scaled up for a crisp export.
const CARD = 1080
const EXPORT_SCALE = 2

// Resolve a CSS custom property to a concrete color by letting the browser compute it. Reading
// the token name directly returns the unresolved `var(...)`; painting it onto a probe element
// resolves the whole chain to an rgb()/rgba() string canvas can use, and follows the theme.
function resolveVar(name, fallback) {
  try {
    const probe = document.createElement('span')
    probe.style.color = `var(${name})`
    probe.style.display = 'none'
    document.body.appendChild(probe)
    const value = getComputedStyle(probe).color
    probe.remove()
    return value || fallback
  } catch {
    return fallback
  }
}

function brandColors() {
  return {
    canvas: resolveVar('--surface-canvas', '#1c2902'),
    card: resolveVar('--surface-card', '#26380b'),
    textPrimary: resolveVar('--text-primary', '#eeeee1'),
    textSecondary: resolveVar('--text-secondary', '#cdd6bb'),
    textMuted: resolveVar('--text-muted', '#a7b58c'),
    action: resolveVar('--action', '#8ed14f'),
    brand: resolveVar('--brand-primary', '#b7de7c'),
    border: resolveVar('--border-subtle', 'rgba(255,255,255,0.14)'),
  }
}

function roundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Letter-spaced text (canvas has no tracking), left-anchored. Returns the end x.
function drawTracked(ctx, text, x, y, tracking) {
  let cursor = x
  for (const ch of text) {
    ctx.fillText(ch, cursor, y)
    cursor += ctx.measureText(ch).width + tracking
  }
  return cursor
}

// Greedy word wrap; never breaks mid-word.
function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

// One hexagon axis point at radius fraction `frac` (0..1 of R), top-start and clockwise —
// the same geometry as HexRadar so the shape reads identically to the on-page radar.
function hexPoint(i, frac, n, cx, cy, R) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
  return {
    x: cx + frac * R * Math.cos(angle),
    y: cy + frac * R * Math.sin(angle),
    angle,
  }
}

function drawRadar(ctx, vector, cx, cy, R, colors) {
  const n = vector.length
  const rings = [0.25, 0.5, 0.75, 1]

  // Rings that match the hexagon shape.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1.5
  rings.forEach((frac) => {
    ctx.beginPath()
    for (let i = 0; i < n; i += 1) {
      const p = hexPoint(i, frac, n, cx, cy, R)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.closePath()
    ctx.stroke()
  })

  // Spokes.
  for (let i = 0; i < n; i += 1) {
    const end = hexPoint(i, 1, n, cx, cy, R)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  // Filled shape.
  ctx.beginPath()
  vector.forEach((value, i) => {
    const p = hexPoint(i, value, n, cx, cy, R)
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.closePath()
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.fillStyle = colors.action
  ctx.fill()
  ctx.restore()
  ctx.lineJoin = 'round'
  ctx.lineWidth = 3
  ctx.strokeStyle = colors.action
  ctx.stroke()

  // Vertex dots.
  ctx.fillStyle = colors.action
  vector.forEach((value, i) => {
    const p = hexPoint(i, value, n, cx, cy, R)
    ctx.beginPath()
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Axis labels, placed just outside the outer ring.
  ctx.fillStyle = colors.textSecondary
  ctx.font = '600 22px Overpass, sans-serif'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < n; i += 1) {
    const p = hexPoint(i, 1, n, cx, cy, R)
    const lx = cx + (R + 30) * Math.cos(p.angle)
    const ly = cy + (R + 30) * Math.sin(p.angle)
    ctx.textAlign = Math.abs(lx - cx) < 16 ? 'center' : lx > cx ? 'left' : 'right'
    ctx.fillText(AXIS_LABELS[i], lx, ly)
  }
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

function renderCard(canvas, { headline, eyebrow, spikes, read, vector, logo }) {
  const colors = brandColors()
  const ctx = canvas.getContext('2d')
  canvas.width = CARD * EXPORT_SCALE
  canvas.height = CARD * EXPORT_SCALE
  ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0)
  ctx.clearRect(0, 0, CARD, CARD)

  // Canvas background, then a lifted card panel with a subtle border.
  ctx.fillStyle = colors.canvas
  ctx.fillRect(0, 0, CARD, CARD)
  const inset = 32
  roundRect(ctx, inset, inset, CARD - 2 * inset, CARD - 2 * inset, 40)
  ctx.fillStyle = colors.card
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = colors.border
  ctx.stroke()

  const P = 96
  const maxW = CARD - 2 * P
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Header: logo mark plus wordmark.
  const logoSize = 66
  const headerTop = 88
  let wordmarkX = P
  if (logo) {
    ctx.drawImage(logo, P, headerTop, logoSize, logoSize)
    wordmarkX = P + logoSize + 20
  }
  ctx.fillStyle = colors.textPrimary
  ctx.font = '700 30px Overpass, sans-serif'
  ctx.fillText('Understory Collaborative', wordmarkX, headerTop + logoSize / 2 + 11)

  // Eyebrow.
  ctx.fillStyle = colors.textMuted
  ctx.font = '700 24px Overpass, sans-serif'
  drawTracked(ctx, eyebrow.toUpperCase(), P, 232, 3)

  // Title, shrunk to fit on one line.
  let titleSize = 88
  ctx.font = `800 ${titleSize}px Overpass, sans-serif`
  while (ctx.measureText(headline).width > maxW && titleSize > 48) {
    titleSize -= 2
    ctx.font = `800 ${titleSize}px Overpass, sans-serif`
  }
  ctx.fillStyle = colors.textPrimary
  ctx.fillText(headline, P, 320)

  // Accent rule (also carried in text, never color alone).
  ctx.fillStyle = colors.action
  ctx.fillRect(P, 346, 112, 7)

  // Spikes.
  ctx.fillStyle = colors.textMuted
  ctx.font = '700 22px Overpass, sans-serif'
  drawTracked(ctx, 'SKILLS IT SPIKES', P, 402, 2)
  let spikesSize = 42
  ctx.font = `700 ${spikesSize}px Overpass, sans-serif`
  while (ctx.measureText(spikes).width > maxW && spikesSize > 26) {
    spikesSize -= 2
    ctx.font = `700 ${spikesSize}px Overpass, sans-serif`
  }
  ctx.fillStyle = colors.brand
  ctx.fillText(spikes, P, 448)

  // Read (wrapped, never truncated).
  ctx.fillStyle = colors.textSecondary
  ctx.font = '400 33px Overpass, sans-serif'
  const readLines = wrapLines(ctx, read, maxW)
  const readTop = 512
  const readLH = 45
  readLines.forEach((line, i) => ctx.fillText(line, P, readTop + i * readLH))
  const readEnd = readTop + (readLines.length - 1) * readLH

  // Radar, centered below the copy.
  const R = 150
  const labelRoom = R + 30
  const cx = CARD / 2
  const cy = readEnd + 52 + labelRoom
  drawRadar(ctx, vector, cx, cy, R, colors)

  // Footer.
  ctx.fillStyle = colors.textMuted
  ctx.font = '600 26px Overpass, sans-serif'
  ctx.fillText('Find your type at understorycollab.com/tpm-types', P, CARD - 62)
}

function ShareType({ type, profile = null, lead = false, headingLevel = 2 }) {
  const canvasRef = useRef(null)
  const [dataUrl, setDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const typeUrl = `${window.location.origin}/tpm-types/${type.id}`
  // The person's own six-skill shape is the special part of the result; fall back to the
  // type's prototype when it is not passed (e.g. on a type page).
  const vector = Array.isArray(profile) && profile.length === 6 ? profile : type.v
  const headline = lead ? `You're ${type.name.replace(/^The /, 'the ')}` : type.name
  const eyebrow = lead ? 'Your TPM type' : 'The TPM types'
  const vectorKey = vector.join(',')

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const loadLogo = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = ucLogo
    })
    // Draw only once the brand fonts are ready so the canvas uses Overpass, not a fallback.
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()

    Promise.all([fontsReady, loadLogo]).then(([, logo]) => {
      if (cancelled) return
      renderCard(canvas, { headline, eyebrow, spikes: type.spikes, read: type.read, vector, logo })
      try {
        setDataUrl(canvas.toDataURL('image/png'))
      } catch {
        // toDataURL can throw in rare sandboxed contexts; the on-page result still stands.
      }
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headline, eyebrow, type.id, type.spikes, type.read, vectorKey])

  function handleDownload() {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `understory-${type.id}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function handleLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(typeUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard can be blocked; leave the button in its resting state.
    }
  }

  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const headingId = `sharetype-heading-${type.id}`
  const altText = `Shareable card. ${headline}. Skills it spikes: ${type.spikes}. ${type.read}`

  return (
    <section className="sharetype" aria-labelledby={headingId}>
      <Heading id={headingId} className="sharetype-heading">Share your type</Heading>
      <div className="sharetype-body">
        <div className="sharetype-preview">
          {/* Canvas stays in the DOM (visually hidden) so it can render and export; the visible
              preview is an <img> of the export, which carries a meaningful alt. */}
          <canvas ref={canvasRef} className="sharetype-canvas" aria-hidden="true" />
          {dataUrl ? (
            <img className="sharetype-image" src={dataUrl} alt={altText} width={CARD} height={CARD} />
          ) : (
            <p className="sharetype-loading">Building your card&hellip;</p>
          )}
        </div>

        <div className="sharetype-actions">
          <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={!dataUrl}>
            Download image
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleLinkedIn}>
            Share on LinkedIn
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          {/* State is announced in text, never by color alone (WCAG 1.4.1). */}
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
          <p className="sharetype-note">
            Download the image to post it. The share buttons link to your type page.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ShareType
