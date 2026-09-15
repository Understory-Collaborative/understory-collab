import './HexRadar.css'

// A small, reusable durable-skills hexagon. Takes a `v` vector (length 6, values 0..1) in
// the fixed AXIS_ORDER, and the short axis labels in that same order. The geometry is the
// same top-start, clockwise layout the self-check radar uses, so the shapes read the same
// across the site. Give every instance a plain-language `title` so the SVG has a text
// alternative (the shape is never the only way to read the data).

const SIZE = 300
const CX = SIZE / 2
const CY = SIZE / 2
const R = 96
const RINGS = [0.25, 0.5, 0.75, 1]

// Point on the hexagon for axis `i` at radius fraction `frac` (0..1 of R).
function point(i, frac, n) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
  return {
    x: CX + frac * R * Math.cos(angle),
    y: CY + frac * R * Math.sin(angle),
    angle,
  }
}

// One ring polygon at a fraction of the radius, so the grid matches the hexagon shape.
function ringPolygon(frac, n) {
  return Array.from({ length: n }, (_, i) => {
    const p = point(i, frac, n)
    return `${p.x},${p.y}`
  }).join(' ')
}

function HexRadar({ v, labels, title }) {
  const n = v.length
  const dots = v.map((value, i) => ({ ...point(i, value, n), value, label: labels[i] }))
  const area = dots.map((d) => `${d.x},${d.y}`).join(' ')

  return (
    <svg
      className="hex-radar"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {RINGS.map((ring) => (
        <polygon key={ring} points={ringPolygon(ring, n)} className="hex-radar-ring" />
      ))}
      {dots.map((d, i) => {
        const axisEnd = point(i, 1, n)
        return <line key={`axis-${i}`} x1={CX} y1={CY} x2={axisEnd.x} y2={axisEnd.y} className="hex-radar-axis" />
      })}
      <polygon points={area} className="hex-radar-area" />
      {dots.map((d, i) => (
        <circle key={`dot-${i}`} cx={d.x} cy={d.y} r={4} className="hex-radar-dot" />
      ))}
      {dots.map((d, i) => {
        const outX = CX + (R + 16) * Math.cos(d.angle)
        const outY = CY + (R + 16) * Math.sin(d.angle)
        const anchor = Math.abs(outX - CX) < 12 ? 'middle' : outX > CX ? 'start' : 'end'
        return (
          <text key={`label-${i}`} x={outX} y={outY} textAnchor={anchor} className="hex-radar-label" dominantBaseline="middle">
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

export default HexRadar
